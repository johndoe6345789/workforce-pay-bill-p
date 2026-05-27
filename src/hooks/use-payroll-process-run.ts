import { useState, useCallback } from 'react'
import type { PayrollRun } from '@/lib/types'
import type { PayrollCalculationResult } from './use-payroll-calculations.types'

export function usePAYEProcessRun(
  calculateBatchPayroll: (timesheetIds: string[]) => PayrollCalculationResult[],
  setPayrollRuns: (updater: (current: PayrollRun[]) => PayrollRun[]) => void,
) {
  const [isProcessing, setIsProcessing] = useState(false)

  const processPayrollRun = useCallback(async (
    periodEnding: string,
    timesheetIds: string[]
  ): Promise<PayrollRun> => {
    setIsProcessing(true)
    try {
      const calculations = calculateBatchPayroll(timesheetIds)
      const totalAmount = calculations.reduce((sum, calc) => sum + calc.netPay, 0)
      const payrollRun: PayrollRun = {
        id: `PR-${Date.now()}`,
        periodEnding,
        workersCount: calculations.length,
        totalAmount,
        status: 'completed',
        processedDate: new Date().toISOString()
      }
      setPayrollRuns(current => [...(current || []), payrollRun])
      return payrollRun
    } finally {
      setIsProcessing(false)
    }
  }, [calculateBatchPayroll, setPayrollRuns])

  return { isProcessing, processPayrollRun }
}
