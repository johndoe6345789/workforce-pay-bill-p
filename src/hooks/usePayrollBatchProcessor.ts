import { useState, useMemo } from 'react'
import { usePayrollBatch } from '@/hooks/use-payroll-batch'
import { toast } from 'sonner'

export function usePayrollBatchProcessor(timesheets: any[], workers: any[], onBatchComplete?: (batch: any) => void) {
  const [selectedWorkers, setSelectedWorkers] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const { createBatch, validateBatch, processBatch, currentBatch, isProcessing, progress } = usePayrollBatch()

  const approvedTimesheets = useMemo(() => timesheets.filter(ts => ts.status === 'approved'), [timesheets])

  const workersWithTimesheets = useMemo(() => {
    const workerMap = new Map<string, any>()
    approvedTimesheets.forEach(ts => {
      if (!workerMap.has(ts.workerId)) {
        const worker = workers.find((w: any) => w.id === ts.workerId)
        workerMap.set(ts.workerId, { ...worker, timesheets: [], totalHours: 0, totalAmount: 0 })
      }
      const w = workerMap.get(ts.workerId)
      w.timesheets.push(ts)
      w.totalHours += ts.totalHours || ts.hours || 0
      w.totalAmount += ts.total || ts.amount || 0
    })
    return Array.from(workerMap.values())
  }, [approvedTimesheets, workers])

  const selectedWorkerData = useMemo(() => workersWithTimesheets.filter(w => selectedWorkers.includes(w.id)), [workersWithTimesheets, selectedWorkers])

  const batchTotals = useMemo(() => ({
    workers: selectedWorkerData.length,
    timesheets: selectedWorkerData.reduce((sum, w) => sum + w.timesheets.length, 0),
    hours: selectedWorkerData.reduce((sum, w) => sum + w.totalHours, 0),
    amount: selectedWorkerData.reduce((sum, w) => sum + w.totalAmount, 0)
  }), [selectedWorkerData])

  const handleToggleWorker = (workerId: string) =>
    setSelectedWorkers(prev => prev.includes(workerId) ? prev.filter(id => id !== workerId) : [...prev, workerId])

  const handleSelectAll = () =>
    setSelectedWorkers(selectedWorkers.length === workersWithTimesheets.length ? [] : workersWithTimesheets.map(w => w.id))

  const handleValidate = async () => {
    if (!selectedWorkers.length) { toast.error('Please select at least one worker'); return }
    const batch = await createBatch(selectedWorkerData)
    const validation = await validateBatch(batch)
    if (validation.hasErrors) { setShowValidation(true); toast.warning(`Validation found ${validation.errors.length} issue(s)`) }
    else { toast.success('Batch validation passed'); setShowPreview(true) }
  }

  const handleProcess = async () => {
    if (!currentBatch) return
    try {
      const result = await processBatch(currentBatch)
      toast.success('Payroll batch submitted for approval')
      onBatchComplete?.(result)
      setShowPreview(false)
      setSelectedWorkers([])
    } catch { toast.error('Failed to process payroll batch') }
  }

  return {
    selectedWorkers, workersWithTimesheets, batchTotals,
    showPreview, setShowPreview,
    showValidation, setShowValidation,
    currentBatch, isProcessing, progress,
    handleToggleWorker, handleSelectAll, handleValidate, handleProcess,
  }
}
