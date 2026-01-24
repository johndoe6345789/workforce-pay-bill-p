import { useState, useCallback } from 'react'
import { usePayrollCalculations } from './use-payroll-calculations'
import { useIndexedDBState } from './use-indexed-db-state'

export interface PayrollBatch {
  id: string
  periodStart: string
  periodEnd: string
  status: 'draft' | 'validating' | 'pending-approval' | 'approved' | 'rejected' | 'processing' | 'completed'
  workers: PayrollBatchWorker[]
  totalAmount: number
  totalWorkers: number
  createdAt: string
  createdBy: string
  submittedAt?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
  processedAt?: string
  validation?: BatchValidation
  approvalWorkflow?: ApprovalWorkflowState
}

export interface PayrollBatchWorker {
  id: string
  workerId: string
  name: string
  role: string
  timesheetCount: number
  totalHours: number
  grossPay: number
  netPay: number
  deductions: PayrollDeduction[]
  timesheets: any[]
  paymentMethod: string
}

export interface PayrollDeduction {
  type: string
  description: string
  amount: number
}

export interface BatchValidation {
  isValid: boolean
  hasErrors: boolean
  hasWarnings: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

export interface ValidationIssue {
  worker: string
  workerId: string
  type: string
  message: string
  severity: 'error' | 'warning'
}

export interface ApprovalWorkflowState {
  currentStep: number
  totalSteps: number
  steps: ApprovalStep[]
  canApprove: boolean
  canReject: boolean
}

export interface ApprovalStep {
  id: string
  name: string
  approverRole: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  comments?: string
}

export function usePayrollBatch() {
  const [currentBatch, setCurrentBatch] = useState<PayrollBatch | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const { calculatePayroll } = usePayrollCalculations()
  const [batches, setBatches] = useIndexedDBState<PayrollBatch[]>('payroll-batches', [])

  const createBatch = useCallback(async (workersData: any[]) => {
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
        paymentMethod: w.paymentMethod || 'PAYE'
      })),
      totalAmount: workersData.reduce((sum, w) => sum + w.totalAmount, 0),
      totalWorkers: workersData.length,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user',
      approvalWorkflow: {
        currentStep: 0,
        totalSteps: 3,
        steps: [
          {
            id: 'manager-review',
            name: 'Manager Review',
            approverRole: 'manager',
            status: 'pending'
          },
          {
            id: 'finance-approval',
            name: 'Finance Approval',
            approverRole: 'finance',
            status: 'pending'
          },
          {
            id: 'final-approval',
            name: 'Final Approval',
            approverRole: 'admin',
            status: 'pending'
          }
        ],
        canApprove: false,
        canReject: false
      }
    }

    setCurrentBatch(batch)
    return batch
  }, [calculatePayroll])

  const validateBatch = useCallback(async (batch: PayrollBatch) => {
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

      await new Promise(resolve => setTimeout(resolve, 50))
    }

    const validation: BatchValidation = {
      isValid: errors.length === 0,
      hasErrors: errors.length > 0,
      hasWarnings: warnings.length > 0,
      errors,
      warnings
    }

    const updatedBatch = {
      ...batch,
      validation,
      status: validation.isValid ? 'pending-approval' as const : 'draft' as const
    }

    setCurrentBatch(updatedBatch)
    setIsProcessing(false)
    setProgress(100)

    return validation
  }, [])

  const processBatch = useCallback(async (batch: PayrollBatch) => {
    setIsProcessing(true)
    setProgress(0)

    const updatedBatch = {
      ...batch,
      status: 'pending-approval' as const,
      submittedAt: new Date().toISOString()
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
    setProgress(100)

    setBatches(prev => [...prev, updatedBatch])
    
    setIsProcessing(false)
    return updatedBatch
  }, [setBatches])

  const approveBatchStep = useCallback(async (
    batchId: string, 
    stepId: string, 
    approverName: string,
    comments?: string
  ) => {
    setBatches(prev => prev.map(batch => {
      if (batch.id !== batchId) return batch

      const workflow = batch.approvalWorkflow
      if (!workflow) return batch

      const stepIndex = workflow.steps.findIndex(s => s.id === stepId)
      if (stepIndex === -1) return batch

      const updatedSteps = [...workflow.steps]
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        status: 'approved',
        approvedBy: approverName,
        approvedAt: new Date().toISOString(),
        comments
      }

      const allApproved = updatedSteps.every(s => s.status === 'approved')
      const currentStep = updatedSteps.findIndex(s => s.status === 'pending')

      return {
        ...batch,
        status: allApproved ? 'approved' : 'pending-approval',
        approvedAt: allApproved ? new Date().toISOString() : undefined,
        approvedBy: allApproved ? approverName : undefined,
        approvalWorkflow: {
          ...workflow,
          currentStep: currentStep === -1 ? workflow.totalSteps : currentStep,
          steps: updatedSteps,
          canApprove: currentStep !== -1,
          canReject: currentStep !== -1
        }
      }
    }))
  }, [setBatches])

  const rejectBatchStep = useCallback(async (
    batchId: string,
    stepId: string,
    rejectorName: string,
    reason: string
  ) => {
    setBatches(prev => prev.map(batch => {
      if (batch.id !== batchId) return batch

      const workflow = batch.approvalWorkflow
      if (!workflow) return batch

      const stepIndex = workflow.steps.findIndex(s => s.id === stepId)
      if (stepIndex === -1) return batch

      const updatedSteps = [...workflow.steps]
      updatedSteps[stepIndex] = {
        ...updatedSteps[stepIndex],
        status: 'rejected',
        rejectedBy: rejectorName,
        rejectedAt: new Date().toISOString(),
        comments: reason
      }

      return {
        ...batch,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: rejectorName,
        rejectionReason: reason,
        approvalWorkflow: {
          ...workflow,
          steps: updatedSteps,
          canApprove: false,
          canReject: false
        }
      }
    }))
  }, [setBatches])

  const completeBatch = useCallback(async (batchId: string) => {
    setBatches(prev => prev.map(batch => 
      batch.id === batchId
        ? {
            ...batch,
            status: 'completed',
            processedAt: new Date().toISOString()
          }
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
    completeBatch
  }
}

function getPeriodStart(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + diff)
  return monday.toISOString().split('T')[0]
}

function getPeriodEnd(): string {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diff = dayOfWeek === 0 ? 0 : 7 - dayOfWeek
  const sunday = new Date(today)
  sunday.setDate(today.getDate() + diff)
  return sunday.toISOString().split('T')[0]
}

function calculateNetPay(grossPay: number): number {
  const taxRate = 0.20
  const niRate = 0.12
  const totalDeductions = grossPay * (taxRate + niRate)
  return grossPay - totalDeductions
}

function calculateDeductions(grossPay: number): PayrollDeduction[] {
  const tax = grossPay * 0.20
  const ni = grossPay * 0.12
  
  return [
    {
      type: 'tax',
      description: 'Income Tax',
      amount: tax
    },
    {
      type: 'ni',
      description: 'National Insurance',
      amount: ni
    }
  ]
}
