import { useCallback } from 'react'
import type { PayrollBatch } from './use-payroll-batch.types'

type BatchSetter = (updater: (prev: PayrollBatch[]) => PayrollBatch[]) => void

export function usePayrollBatchApproval(setBatches: BatchSetter) {
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
        comments,
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
          canReject: currentStep !== -1,
        },
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
        comments: reason,
      }

      return {
        ...batch,
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectedBy: rejectorName,
        rejectionReason: reason,
        approvalWorkflow: { ...workflow, steps: updatedSteps, canApprove: false, canReject: false },
      }
    }))
  }, [setBatches])

  return { approveBatchStep, rejectBatchStep }
}
