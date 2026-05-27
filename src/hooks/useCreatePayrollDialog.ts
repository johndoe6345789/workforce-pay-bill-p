import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import type { PayrollRun, Timesheet, Worker } from '@/lib/types'

export const payrollSchema = z.object({
  periodEnding: z.string().min(1, 'Period ending date is required'),
  processingType: z.enum(['all-approved', 'selected-workers', 'one-click']),
  selectedWorkerIds: z.array(z.string()).optional(),
})

export type PayrollFormData = z.infer<typeof payrollSchema>

interface Options {
  timesheets: Timesheet[]
  workers: Worker[]
  onCreatePayroll: (payroll: Omit<PayrollRun, 'id'>) => Promise<void>
  onOpenChange: (open: boolean) => void
}

export function useCreatePayrollDialog({ timesheets, workers, onCreatePayroll, onOpenChange }: Options) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedWorkers, setSelectedWorkers] = useState<Set<string>>(new Set())

  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      periodEnding: new Date().toISOString().split('T')[0],
      processingType: 'all-approved',
      selectedWorkerIds: [],
    },
  })

  const processingType = form.watch('processingType')
  const periodEnding = form.watch('periodEnding')

  const approvedTimesheets = useMemo(() =>
    timesheets.filter(ts => ts.status === 'approved' && ts.weekEnding <= periodEnding),
    [timesheets, periodEnding]
  )

  const eligibleWorkers = useMemo(() => {
    const workerIds = new Set(approvedTimesheets.map(ts => ts.workerId))
    return workers.filter(w => workerIds.has(w.id) && w.status === 'active')
  }, [approvedTimesheets, workers])

  const payrollAmount = useMemo(() => {
    let relevant = approvedTimesheets
    if (processingType === 'selected-workers' && selectedWorkers.size > 0) {
      relevant = approvedTimesheets.filter(ts => selectedWorkers.has(ts.workerId))
    }
    return relevant.reduce((sum, ts) => sum + (ts.amount || 0), 0)
  }, [approvedTimesheets, processingType, selectedWorkers])

  const workerCount = processingType === 'selected-workers' ? selectedWorkers.size : eligibleWorkers.length

  const toggleWorker = (workerId: string) => {
    const next = new Set(selectedWorkers)
    next.has(workerId) ? next.delete(workerId) : next.add(workerId)
    setSelectedWorkers(next)
  }

  const selectAll = () => setSelectedWorkers(new Set(eligibleWorkers.map(w => w.id)))
  const deselectAll = () => setSelectedWorkers(new Set())

  const onSubmit = async (data: PayrollFormData) => {
    if (processingType === 'selected-workers' && selectedWorkers.size === 0) {
      toast.error('Please select at least one worker')
      return
    }
    setIsSubmitting(true)
    try {
      await onCreatePayroll({ periodEnding: data.periodEnding, workersCount: workerCount, totalAmount: payrollAmount, status: 'scheduled' })
      toast.success('Payroll run created successfully')
      form.reset()
      setSelectedWorkers(new Set())
      onOpenChange(false)
    } catch {
      toast.error('Failed to create payroll run')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
    setSelectedWorkers(new Set())
  }

  return {
    form,
    processingType,
    isSubmitting,
    selectedWorkers,
    approvedTimesheets,
    eligibleWorkers,
    payrollAmount,
    workerCount,
    toggleWorker,
    selectAll,
    deselectAll,
    onSubmit: form.handleSubmit(onSubmit),
    handleCancel,
  }
}
