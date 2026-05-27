import { useCallback } from 'react'
import type {
  PayrollBatch,
  BatchValidation,
  ValidationIssue,
} from './use-payroll-batch.types'

interface UseBatchValidateControls {
  setIsProcessing: (value: boolean) => void
  setProgress: (value: number) => void
  setCurrentBatch: (batch: PayrollBatch) => void
}

export function usePayrollBatchValidate({
  setIsProcessing,
  setProgress,
  setCurrentBatch,
}: UseBatchValidateControls) {
  const validateBatch = useCallback(async (batch: PayrollBatch): Promise<BatchValidation> => {
    setIsProcessing(true)
    setProgress(0)

    const errors: ValidationIssue[] = []
    const warnings: ValidationIssue[] = []

    for (let i = 0; i < batch.workers.length; i++) {
      const worker = batch.workers[i]
      setProgress((i / batch.workers.length) * 100)

      if (worker.grossPay <= 0) {
        errors.push({
          worker: worker.name,
          workerId: worker.workerId,
          type: 'invalid-amount',
          message: 'Gross pay must be greater than zero',
          severity: 'error'
        })
      }

      if (worker.timesheetCount === 0) {
        errors.push({
          worker: worker.name,
          workerId: worker.workerId,
          type: 'missing-timesheets',
          message: 'No timesheets found for this worker',
          severity: 'error'
        })
      }

      if (worker.totalHours > 60) {
        warnings.push({
          worker: worker.name,
          workerId: worker.workerId,
          type: 'excessive-hours',
          message: `Total hours (${worker.totalHours}) exceeds recommended weekly maximum`,
          severity: 'warning'
        })
      }

      if (worker.grossPay > 10000) {
        warnings.push({
          worker: worker.name,
          workerId: worker.workerId,
          type: 'high-amount',
          message: `Gross pay (£${worker.grossPay}) is unusually high`,
          severity: 'warning'
        })
      }

      await new Promise<void>(resolve => setTimeout(resolve, 50))
    }

    const validation: BatchValidation = {
      isValid: errors.length === 0,
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0,
      errors,
      warnings
    }

    const updatedBatch: PayrollBatch = {
      ...batch,
      validation,
      status: validation.isValid ? 'pending-approval' : 'draft'
    }

    setCurrentBatch(updatedBatch)
    setIsProcessing(false)
    setProgress(100)

    return validation
  }, [setIsProcessing, setProgress, setCurrentBatch])

  return { validateBatch }
}
