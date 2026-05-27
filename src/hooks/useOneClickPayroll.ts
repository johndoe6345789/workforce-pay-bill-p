import { useState } from 'react'
import { toast } from 'sonner'
import type { Timesheet, PayrollRun } from '@/lib/types'

export interface PayrollPreviewData {
  workers: {
    workerId: string
    workerName: string
    amount: number
    hours: number
    timesheetCount: number
  }[]
  totalAmount: number
  totalWorkers: number
  totalTimesheets: number
}

export function useOneClickPayroll(timesheets: Timesheet[], onPayrollComplete: (run: PayrollRun) => void) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [payrollPreview, setPayrollPreview] = useState<PayrollPreviewData | null>(null)

  const approvedTimesheets = timesheets.filter(t => t.status === 'approved')
  const uniqueWorkers = new Set(approvedTimesheets.map(t => t.workerId)).size
  const totalAmount = approvedTimesheets.reduce((sum, t) => sum + t.amount, 0)

  const generatePayrollPreview = () => {
    const workerPayments = new Map<string, { name: string; amount: number; hours: number; count: number }>()

    approvedTimesheets.forEach(ts => {
      const existing = workerPayments.get(ts.workerId) || { name: ts.workerName, amount: 0, hours: 0, count: 0 }
      workerPayments.set(ts.workerId, {
        name: ts.workerName,
        amount: existing.amount + ts.amount,
        hours: existing.hours + ts.hours,
        count: existing.count + 1,
      })
    })

    setPayrollPreview({
      workers: Array.from(workerPayments.entries()).map(([id, data]) => ({
        workerId: id,
        workerName: data.name,
        amount: data.amount,
        hours: data.hours,
        timesheetCount: data.count,
      })),
      totalAmount,
      totalWorkers: uniqueWorkers,
      totalTimesheets: approvedTimesheets.length,
    })

    setShowConfirmation(true)
  }

  const processPayroll = async () => {
    setIsProcessing(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const newPayrollRun: PayrollRun = {
      id: `PR-${Date.now()}`,
      periodEnding: new Date().toISOString().split('T')[0],
      workersCount: uniqueWorkers,
      totalAmount,
      status: 'completed',
      processedDate: new Date().toISOString(),
    }

    onPayrollComplete(newPayrollRun)
    setIsProcessing(false)
    setShowConfirmation(false)
    toast.success(`Payroll processed: £${totalAmount.toLocaleString()} paid to ${uniqueWorkers} workers`)
  }

  return {
    approvedTimesheets,
    uniqueWorkers,
    totalAmount,
    isProcessing,
    showConfirmation,
    setShowConfirmation,
    payrollPreview,
    generatePayrollPreview,
    processPayroll,
  }
}
