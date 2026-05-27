import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { useTimesheetsCrud } from '@/hooks/use-timesheets-crud'
import { useExpensesCrud } from '@/hooks/use-expenses-crud'
import { useWorkersCrud } from '@/hooks/use-workers-crud'
import { useTranslation } from '@/hooks/use-translation'
import { FIELD_DEFINITIONS, SAMPLE_CSV } from '@/data/batchImportConfig'
import type { ImportType } from '@/data/batchImportConfig'

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
  rowCount: number
  preview: Record<string, string>[]
  headers: string[]
}

export interface FieldMapping {
  sourceField: string
  targetField: string
  transform?: 'none' | 'uppercase' | 'lowercase' | 'date' | 'number'
  required: boolean
}

export interface ImportProgress {
  total: number
  processed: number
  succeeded: number
  failed: number
  errors: { row: number; error: string }[]
}

export function useBatchImport(onImportComplete?: (data: Record<string, string>[]) => void) {
  const { t } = useTranslation()
  const { createTimesheet } = useTimesheetsCrud()
  const { createExpense } = useExpensesCrud()
  const { createWorker } = useWorkersCrud()

  const [activeTab, setActiveTab] = useState<ImportType>('timesheets')
  const [csvData, setCsvData] = useState('')
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [showMapping, setShowMapping] = useState(false)
  const [fieldMappings, setFieldMappings] = useState<FieldMapping[]>([])
  const [importProgress, setImportProgress] = useState<ImportProgress | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [skipFirstRow, setSkipFirstRow] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parseCsv = (data: string) => {
    const lines = data.trim().split('\n')
    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
    const rows = lines.slice(1).map(line => line.split(',').map(v => v.trim().replace(/^["']|["']$/g, '')))
    return { headers, rows }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.csv')) { toast.error(t('batchImport.messages.selectCSV')); return }
    const reader = new FileReader()
    reader.onload = e => { setCsvData(e.target?.result as string); toast.success(t('batchImport.messages.fileLoaded')) }
    reader.onerror = () => toast.error(t('batchImport.messages.fileError'))
    reader.readAsText(file)
  }

  const validateCsv = (data: string, type: ImportType) => {
    setIsValidating(true)
    setTimeout(() => {
      const errors: string[] = []
      const warnings: string[] = []
      const preview: Record<string, string>[] = []

      if (!data.trim()) {
        setValidationResult({ valid: false, errors: ['No data provided'], warnings, rowCount: 0, preview: [], headers: [] })
        setIsValidating(false)
        return
      }

      const { headers, rows } = parseCsv(data)
      if (rows.length === 0) {
        setValidationResult({ valid: false, errors: ['CSV must contain at least one data row'], warnings, rowCount: 0, preview: [], headers })
        setIsValidating(false)
        return
      }

      const defs = FIELD_DEFINITIONS[type]
      const detectedMappings: FieldMapping[] = []

      defs.filter(f => f.required).forEach(def => {
        const matchingHeader = headers.find(h =>
          h.toLowerCase() === def.name.toLowerCase() ||
          h.toLowerCase().replace(/[_\s]/g, '') === def.name.toLowerCase().replace(/[_\s]/g, '')
        )
        if (matchingHeader) {
          detectedMappings.push({
            sourceField: matchingHeader,
            targetField: def.name,
            transform: def.type === 'number' ? 'number' : def.type === 'date' ? 'date' : 'none',
            required: true
          })
        } else {
          errors.push(`Missing required field: ${def.label}`)
        }
      })

      if (detectedMappings.length > 0) setFieldMappings(detectedMappings)

      for (let i = 0; i < Math.min(rows.length, 5); i++) {
        const row: Record<string, string> = {}
        headers.forEach((h, idx) => { row[h] = rows[i][idx] || '' })

        if (type === 'timesheets') {
          const hoursField = detectedMappings.find(m => m.targetField === 'hours')?.sourceField
          const rateField = detectedMappings.find(m => m.targetField === 'rate')?.sourceField
          if (hoursField) {
            const hours = parseFloat(row[hoursField])
            if (isNaN(hours) || hours <= 0) errors.push(`Row ${i + 1}: Invalid hours value "${row[hoursField]}"`)
            else if (hours > 80) warnings.push(`Row ${i + 1}: Hours value ${hours} seems unusually high`)
          }
          if (rateField) {
            const rate = parseFloat(row[rateField])
            if (isNaN(rate) || rate <= 0) errors.push(`Row ${i + 1}: Invalid rate value "${row[rateField]}"`)
          }
        }
        if (type === 'expenses') {
          const amountField = detectedMappings.find(m => m.targetField === 'amount')?.sourceField
          if (amountField) {
            const amount = parseFloat(row[amountField])
            if (isNaN(amount) || amount <= 0) errors.push(`Row ${i + 1}: Invalid amount value "${row[amountField]}"`)
          }
        }
        if (type === 'workers') {
          const emailField = detectedMappings.find(m => m.targetField === 'email')?.sourceField
          if (emailField && row[emailField] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[emailField])) {
            errors.push(`Row ${i + 1}: Invalid email format "${row[emailField]}"`)
          }
        }
        preview.push(row)
      }

      const rowCount = rows.length
      if (rowCount > 1000) warnings.push(`Large import: ${rowCount} rows will be processed. This may take some time.`)
      else if (rowCount > 500) warnings.push(`Medium import: ${rowCount} rows will be processed.`)

      setValidationResult({ valid: errors.length === 0, errors, warnings, rowCount, preview, headers })
      setIsValidating(false)
    }, 500)
  }

  const transformValue = (value: string, transform: string) => {
    if (transform === 'uppercase') return value.toUpperCase()
    if (transform === 'lowercase') return value.toLowerCase()
    if (transform === 'number') return parseFloat(value) || 0
    return value
  }

  const handleImport = async () => {
    if (!validationResult?.valid) { toast.error('Cannot import data with validation errors'); return }
    setIsImporting(true)
    const { headers, rows } = parseCsv(csvData)
    const progress: ImportProgress = { total: rows.length, processed: 0, succeeded: 0, failed: 0, errors: [] }
    setImportProgress(progress)

    for (let i = 0; i < rows.length; i += 10) {
      const batch = rows.slice(i, Math.min(i + 10, rows.length))
      await Promise.all(batch.map(async (row, batchIndex) => {
        try {
          const rowData: Record<string, any> = {}
          fieldMappings.forEach(mapping => {
            const sourceIndex = headers.indexOf(mapping.sourceField)
            if (sourceIndex >= 0) rowData[mapping.targetField] = transformValue(row[sourceIndex], mapping.transform || 'none')
          })
          if (activeTab === 'timesheets') {
            await createTimesheet({ workerId: `worker-${Date.now()}`, workerName: rowData.workerName, clientName: rowData.clientName, hours: rowData.hours, rate: rowData.rate, amount: rowData.hours * rowData.rate, weekEnding: rowData.weekEnding, status: rowData.status || 'pending', submittedDate: new Date().toISOString(), submissionMethod: 'bulk-import' })
          } else if (activeTab === 'expenses') {
            await createExpense({ workerId: `worker-${Date.now()}`, workerName: rowData.workerName, clientName: rowData.clientName, amount: rowData.amount, category: rowData.category, date: rowData.date, description: rowData.description || '', status: 'pending', currency: 'GBP', submittedDate: new Date().toISOString(), billable: true })
          } else {
            await createWorker({ name: rowData.name, email: rowData.email, type: rowData.type || 'contractor', status: rowData.status || 'active', complianceStatus: 'valid' })
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
      onImportComplete?.(r.map(row => Object.fromEntries(h.map((header, i) => [header, row[i]]))))
    }
    if (progress.failed > 0) toast.error(t('batchImport.messages.importError', { count: progress.failed }))
  }

  const resetImport = () => {
    setCsvData(''); setValidationResult(null); setFieldMappings([]); setImportProgress(null); setShowMapping(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const loadSample = (type: ImportType) => {
    setCsvData(SAMPLE_CSV[type])
    toast.info(t('batchImport.messages.sampleLoaded'))
  }

  return {
    t, activeTab, setActiveTab,
    csvData, setCsvData,
    validationResult,
    isValidating,
    showMapping, setShowMapping,
    fieldMappings, setFieldMappings,
    importProgress,
    isImporting,
    skipFirstRow, setSkipFirstRow,
    fileInputRef,
    validateCsv, handleImport, resetImport, loadSample, handleFileSelect,
  }
}
