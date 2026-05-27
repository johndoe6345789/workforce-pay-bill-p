import { useTimesheetsCrud } from '@/hooks/use-timesheets-crud'
import { useExpensesCrud } from '@/hooks/use-expenses-crud'
import { useWorkersCrud } from '@/hooks/use-workers-crud'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'
import { parseCsv, transformValue } from './useBatchImport.utils'
import type { FieldMapping, ImportProgress, ValidationResult } from './useBatchImport.types'
import type { ImportType } from '@/data/batchImportConfig'

interface ExecutorDeps {
  activeTab: ImportType
  csvData: string
  fieldMappings: FieldMapping[]
  validationResult: ValidationResult | null
  setIsImporting: (v: boolean) => void
  setImportProgress: (p: ImportProgress) => void
  onImportComplete?: (data: Record<string, string>[]) => void
}

export function useBatchImportExecutor({
  activeTab, csvData, fieldMappings, validationResult,
  setIsImporting, setImportProgress, onImportComplete,
}: ExecutorDeps) {
  const { t } = useTranslation()
  const { createTimesheet } = useTimesheetsCrud()
  const { createExpense } = useExpensesCrud()
  const { createWorker } = useWorkersCrud()

  const handleImport = async () => {
    if (!validationResult?.valid) { toast.error('Cannot import data with validation errors'); return }
    setIsImporting(true)
    const { headers, rows } = parseCsv(csvData)
    const progress: ImportProgress = { total: rows.length, processed: 0, succeeded: 0, failed: 0, errors: [] }
    setImportProgress({ ...progress })

    for (let i = 0; i < rows.length; i += 10) {
      const batch = rows.slice(i, Math.min(i + 10, rows.length))
      await Promise.all(batch.map(async (row, batchIndex) => {
        try {
          const rowData: Record<string, unknown> = {}
          fieldMappings.forEach(mapping => {
            const sourceIndex = headers.indexOf(mapping.sourceField)
            if (sourceIndex >= 0) rowData[mapping.targetField] = transformValue(row[sourceIndex], mapping.transform || 'none')
          })
          if (activeTab === 'timesheets') {
            const hours = rowData.hours as number
            const rate = rowData.rate as number
            await createTimesheet({ workerId: `worker-${Date.now()}`, workerName: rowData.workerName as string, clientName: rowData.clientName as string, hours, rate, amount: hours * rate, weekEnding: rowData.weekEnding as string, status: (rowData.status as string) || 'pending', submittedDate: new Date().toISOString(), submissionMethod: 'bulk-import' })
          } else if (activeTab === 'expenses') {
            await createExpense({ workerId: `worker-${Date.now()}`, workerName: rowData.workerName as string, clientName: rowData.clientName as string, amount: rowData.amount as number, category: rowData.category as string, date: rowData.date as string, description: (rowData.description as string) || '', status: 'pending', currency: 'GBP', submittedDate: new Date().toISOString(), billable: true })
          } else {
            await createWorker({ name: rowData.name as string, email: rowData.email as string, type: (rowData.type as string) || 'contractor', status: (rowData.status as string) || 'active', complianceStatus: 'valid' })
          }
          progress.succeeded++
        } catch (error) {
          progress.failed++
          progress.errors.push({ row: i + batchIndex + 1, error: error instanceof Error ? error.message : 'Unknown error' })
        } finally {
          progress.processed++
          setImportProgress({ ...progress })
        }
      }))
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    setIsImporting(false)
    if (progress.succeeded > 0) {
      toast.success(t('batchImport.messages.importSuccess', { count: progress.succeeded, total: progress.total }))
      const { headers: h, rows: r } = parseCsv(csvData)
      onImportComplete?.(r.map(row => Object.fromEntries(h.map((header, idx) => [header, row[idx]]))))
    }
    if (progress.failed > 0) toast.error(t('batchImport.messages.importError', { count: progress.failed }))
  }

  return { handleImport }
}
