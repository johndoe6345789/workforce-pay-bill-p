import { useState, useCallback } from 'react'
import { useIndexedDBState } from './use-indexed-db-state'
import { usePayrollBatchValidate } from './use-payroll-batch-validate'
import { usePayrollBatchApproval } from './use-payroll-batch-approval'
import { getPeriodStart, getPeriodEnd, calculateNetPay, calculateDeductions } from './use-payroll-batch.utils'
import type { PayrollBatch, WorkerInput } from './use-payroll-batch.types'

export type {
  PayrollBatch,
  PayrollBatchWorker,
  PayrollDeduction,
  BatchValidation,
  ValidationIssue,
  ApprovalWorkflowState,
  ApprovalStep,
} from './use-payroll-batch.types'

const INITIAL_APPROVAL_STEPS = [
  { id: 'manager-review', name: 'Manager Review', approverRole: 'manager', status: 'pending' as const },
  { id: 'finance-approval', name: 'Finance Approval', approverRole: 'finance', status: 'pending' as const },
  { id: 'final-approval', name: 'Final Approval', approverRole: 'admin', status: 'pending' as const },
]
const INITIAL_APPROVAL_WORKFLOW: PayrollBatch['approvalWorkflow'] = {
  currentStep: 0, totalSteps: 3, steps: INITIAL_APPROVAL_STEPS, canApprove: false, canReject: false,
}

export function usePayrollBatch() {
  const [currentBatch, setCurrentBatch] = useState<PayrollBatch | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [batches, setBatches] = useIndexedDBState<PayrollBatch[]>('payroll-batches', [])

  const { validateBatch } = usePayrollBatchValidate({ setIsProcessing, setProgress, setCurrentBatch })
  const { approveBatchStep, rejectBatchStep } = usePayrollBatchApproval(setBatches)

  const createBatch = useCallback(async (workersData: WorkerInput[]) => {
    const batch: PayrollBatch = {
      id: `BATCH-${Date.now()}`,
      periodStart: getPeriodStart(),
      periodEnd: getPeriodEnd(),
      status: 'draft',
      workers: workersData.map(w => ({
        id: `${Date.now()}-${w.id}`,
        workerId: w.id,
        name: w.name,
        role: w.role,
        timesheetCount: w.timesheets.length,
        totalHours: w.totalHours,
        grossPay: w.totalAmount,
        netPay: calculateNetPay(w.totalAmount),
        deductions: calculateDeductions(w.totalAmount),
        timesheets: w.timesheets,
        paymentMethod: w.paymentMethod ?? 'PAYE',
      })),
      totalAmount: workersData.reduce((sum, w) => sum + w.totalAmount, 0),
      totalWorkers: workersData.length,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      approvalWorkflow: INITIAL_APPROVAL_WORKFLOW,
    }
    setCurrentBatch(batch)
    return batch
  }, [])

  const processBatch = useCallback(async (batch: PayrollBatch) => {
    setIsProcessing(true)
    setProgress(0)
    const updatedBatch: PayrollBatch = {
      ...batch,
      status: 'pending-approval',
      submittedAt: new Date().toISOString(),
    }
    await new Promise<void>(resolve => setTimeout(resolve, 1000))
    setProgress(100)
    setBatches(prev => [...prev, updatedBatch])
    setIsProcessing(false)
    return updatedBatch
  }, [setBatches])

  const completeBatch = useCallback(async (batchId: string) => {
    setBatches(prev => prev.map(batch =>
      batch.id === batchId
        ? { ...batch, status: 'completed', processedAt: new Date().toISOString() }
        : batch
    ))
  }, [setBatches])

  return {
    batches,
    currentBatch,
    isProcessing,
    progress,
    createBatch,
    validateBatch,
    processBatch,
    approveBatchStep,
    rejectBatchStep,
    completeBatch,
  }
}
