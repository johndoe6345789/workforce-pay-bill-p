import { useState } from 'react'
import { toast } from 'sonner'
import { usePayrollBatch, type PayrollBatch } from '@/hooks/use-payroll-batch'

interface Options {
  batch: PayrollBatch
  currentUserRole: string
  currentUserName: string
  onApprove?: (batchId: string) => void
  onReject?: (batchId: string) => void
}

export function usePayrollApprovalWorkflow({ batch, currentUserRole, currentUserName, onApprove, onReject }: Options) {
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [comments, setComments] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  const { approveBatchStep, rejectBatchStep } = usePayrollBatch()

  const workflow = batch.approvalWorkflow
  const currentStep = workflow?.steps[workflow.currentStep]
  const canInteract = currentStep?.approverRole === currentUserRole && currentStep?.status === 'pending'

  const handleApprove = async () => {
    if (!currentStep) return
    try {
      await approveBatchStep(batch.id, currentStep.id, currentUserName, comments)
      toast.success('Batch approved successfully')
      setShowApproveDialog(false)
      setComments('')
      onApprove?.(batch.id)
    } catch {
      toast.error('Failed to approve batch')
    }
  }

  const handleReject = async () => {
    if (!currentStep) return
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }
    try {
      await rejectBatchStep(batch.id, currentStep.id, currentUserName, rejectionReason)
      toast.success('Batch rejected')
      setShowRejectDialog(false)
      setRejectionReason('')
      onReject?.(batch.id)
    } catch {
      toast.error('Failed to reject batch')
    }
  }

  return {
    workflow,
    currentStep,
    canInteract,
    showApproveDialog, setShowApproveDialog,
    showRejectDialog, setShowRejectDialog,
    comments, setComments,
    rejectionReason, setRejectionReason,
    handleApprove,
    handleReject,
  }
}
