import { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ChatCircle,
  User,
  CalendarBlank
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Stack } from '@/components/ui/stack'
import { DataList } from '@/components/ui/data-list'
import { Separator } from '@/components/ui/separator'
import { usePayrollBatch, type PayrollBatch, type ApprovalStep } from '@/hooks/use-payroll-batch'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface PayrollApprovalWorkflowProps {
  batch: PayrollBatch
  currentUserRole: string
  currentUserName: string
  onApprove?: (batchId: string) => void
  onReject?: (batchId: string) => void
}

export function PayrollApprovalWorkflow({
  batch,
  currentUserRole,
  currentUserName,
  onApprove,
  onReject
}: PayrollApprovalWorkflowProps) {
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
    } catch (error) {
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
    } catch (error) {
      toast.error('Failed to reject batch')
    }
  }

  const getStepStatusBadge = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved':
        return (
          <Badge className="bg-success/10 text-success-foreground border-success/30">
            <CheckCircle className="mr-1" size={14} />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1" size={14} />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1" size={14} />
            Pending
          </Badge>
        )
    }
  }

  const getBatchStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      'draft': {
        label: 'Draft',
        className: 'bg-muted text-muted-foreground',
        icon: null
      },
      'pending-approval': {
        label: 'Pending Approval',
        className: 'bg-warning/10 text-warning-foreground border-warning/30',
        icon: Clock
      },
      'approved': {
        label: 'Approved',
        className: 'bg-success/10 text-success-foreground border-success/30',
        icon: CheckCircle
      },
      'rejected': {
        label: 'Rejected',
        className: 'bg-destructive/10 text-destructive-foreground border-destructive/30',
        icon: XCircle
      },
      'processing': {
        label: 'Processing',
        className: 'bg-accent/10 text-accent-foreground border-accent/30',
        icon: Clock
      },
      'completed': {
        label: 'Completed',
        className: 'bg-success/10 text-success-foreground border-success/30',
        icon: CheckCircle
      }
    }

    const config = statusConfig[status] || statusConfig.draft
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        {Icon && <Icon className="mr-1" size={14} />}
        {config.label}
      </Badge>
    )
  }

  if (!workflow) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">
            No approval workflow configured for this batch
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Approval Workflow</CardTitle>
            {getBatchStatusBadge(batch.status)}
          </div>
        </CardHeader>
        <CardContent>
          <Stack spacing={4}>
            <div className="space-y-4">
              {workflow.steps.map((step, index) => (
                <div key={step.id}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{step.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Approver: {step.approverRole}
                          </div>
                        </div>
                        {getStepStatusBadge(step)}
                      </div>

                      {step.status === 'approved' && step.approvedBy && (
                        <div className="mt-2 p-3 bg-success/5 rounded-lg border border-success/20">
                          <div className="flex items-start gap-2 text-sm">
                            <User className="text-success flex-shrink-0" size={16} />
                            <div>
                              <div>
                                <span className="font-medium">Approved by:</span> {step.approvedBy}
                              </div>
                              {step.approvedAt && (
                                <div className="text-muted-foreground">
                                  {format(new Date(step.approvedAt), 'PPpp')}
                                </div>
                              )}
                              {step.comments && (
                                <div className="mt-1 text-muted-foreground">
                                  <ChatCircle className="inline mr-1" size={14} />
                                  {step.comments}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {step.status === 'rejected' && step.rejectedBy && (
                        <div className="mt-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                          <div className="flex items-start gap-2 text-sm">
                            <User className="text-destructive flex-shrink-0" size={16} />
                            <div>
                              <div>
                                <span className="font-medium">Rejected by:</span> {step.rejectedBy}
                              </div>
                              {step.rejectedAt && (
                                <div className="text-muted-foreground">
                                  {format(new Date(step.rejectedAt), 'PPpp')}
                                </div>
                              )}
                              {step.comments && (
                                <div className="mt-1 text-destructive">
                                  <ChatCircle className="inline mr-1" size={14} />
                                  {step.comments}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {step.status === 'pending' && index === workflow.currentStep && canInteract && (
                        <div className="mt-3 flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => setShowApproveDialog(true)}
                          >
                            <CheckCircle className="mr-2" />
                            Approve
                          </Button>
                          <Button 
                            size="sm"
                            variant="destructive"
                            onClick={() => setShowRejectDialog(true)}
                          >
                            <XCircle className="mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {index < workflow.steps.length - 1 && (
                    <div className="ml-4 my-2 h-8 w-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <div className="text-sm font-medium mb-2">Batch Details</div>
              <DataList
                items={[
                  { label: 'Batch ID', value: batch.id },
                  { label: 'Period', value: `${batch.periodStart} to ${batch.periodEnd}` },
                  { label: 'Workers', value: batch.totalWorkers },
                  { label: 'Total Amount', value: `£${batch.totalAmount.toLocaleString()}` },
                  { label: 'Created', value: format(new Date(batch.createdAt), 'PPpp') },
                  { label: 'Created By', value: batch.createdBy },
                  ...(batch.submittedAt ? [{ label: 'Submitted', value: format(new Date(batch.submittedAt), 'PPpp') }] : []),
                  ...(batch.approvedAt ? [{ label: 'Approved', value: format(new Date(batch.approvedAt), 'PPpp') }] : []),
                  ...(batch.rejectedAt ? [{ label: 'Rejected', value: format(new Date(batch.rejectedAt), 'PPpp') }] : [])
                ]}
              />
            </div>
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payroll Batch</DialogTitle>
            <DialogDescription>
              You are about to approve this payroll batch. This action will move it to the next approval step.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-comments">Comments (optional)</Label>
              <Textarea
                id="approve-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any comments or notes..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payroll Batch</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this payroll batch. This will stop the approval workflow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this batch is being rejected..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
