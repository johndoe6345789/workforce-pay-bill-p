import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Stack } from '@/components/ui/stack'
import { DataList } from '@/components/ui/data-list'
import { type PayrollBatch } from '@/hooks/use-payroll-batch'
import { format } from 'date-fns'
import { usePayrollApprovalWorkflow } from '@/hooks/usePayrollApprovalWorkflow'
import { ApprovalStepItem } from '@/components/approval-workflow/ApprovalStepItem'
import { ApproveDialog } from '@/components/approval-workflow/ApproveDialog'
import { RejectDialog } from '@/components/approval-workflow/RejectDialog'

interface PayrollApprovalWorkflowProps {
  batch: PayrollBatch
  currentUserRole: string
  currentUserName: string
  onApprove?: (batchId: string) => void
  onReject?: (batchId: string) => void
}

const BATCH_STATUS_CONFIG: Record<string, { label: string; className: string; Icon: React.ElementType | null }> = {
  'draft': { label: 'Draft', className: 'bg-muted text-muted-foreground', Icon: null },
  'pending-approval': { label: 'Pending Approval', className: 'bg-warning/10 text-warning-foreground border-warning/30', Icon: Clock },
  'approved': { label: 'Approved', className: 'bg-success/10 text-success-foreground border-success/30', Icon: CheckCircle },
  'rejected': { label: 'Rejected', className: 'bg-destructive/10 text-destructive-foreground border-destructive/30', Icon: XCircle },
  'processing': { label: 'Processing', className: 'bg-accent/10 text-accent-foreground border-accent/30', Icon: Clock },
  'completed': { label: 'Completed', className: 'bg-success/10 text-success-foreground border-success/30', Icon: CheckCircle },
}

export function PayrollApprovalWorkflow({ batch, currentUserRole, currentUserName, onApprove, onReject }: PayrollApprovalWorkflowProps) {
  const vm = usePayrollApprovalWorkflow({ batch, currentUserRole, currentUserName, onApprove, onReject })

  if (!vm.workflow) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-sm text-muted-foreground text-center">No approval workflow configured for this batch</p>
        </CardContent>
      </Card>
    )
  }

  const statusConfig = BATCH_STATUS_CONFIG[batch.status] ?? BATCH_STATUS_CONFIG.draft
  const { Icon } = statusConfig

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Approval Workflow</CardTitle>
            <Badge className={statusConfig.className}>
              {Icon && <Icon className="mr-1" size={14} />}{statusConfig.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Stack spacing={4}>
            <div className="space-y-4">
              {vm.workflow.steps.map((step, index) => (
                <ApprovalStepItem
                  key={step.id}
                  step={step}
                  index={index}
                  isCurrentStep={index === vm.workflow!.currentStep}
                  canInteract={vm.canInteract}
                  isLast={index === vm.workflow!.steps.length - 1}
                  onApprove={() => vm.setShowApproveDialog(true)}
                  onReject={() => vm.setShowRejectDialog(true)}
                />
              ))}
            </div>
            <Separator />
            <div>
              <div className="text-sm font-medium mb-2">Batch Details</div>
              <DataList items={[
                { label: 'Batch ID', value: batch.id },
                { label: 'Period', value: `${batch.periodStart} to ${batch.periodEnd}` },
                { label: 'Workers', value: batch.totalWorkers },
                { label: 'Total Amount', value: `£${batch.totalAmount.toLocaleString()}` },
                { label: 'Created', value: format(new Date(batch.createdAt), 'PPpp') },
                { label: 'Created By', value: batch.createdBy },
                ...(batch.submittedAt ? [{ label: 'Submitted', value: format(new Date(batch.submittedAt), 'PPpp') }] : []),
                ...(batch.approvedAt ? [{ label: 'Approved', value: format(new Date(batch.approvedAt), 'PPpp') }] : []),
                ...(batch.rejectedAt ? [{ label: 'Rejected', value: format(new Date(batch.rejectedAt), 'PPpp') }] : []),
              ]} />
            </div>
          </Stack>
        </CardContent>
      </Card>

      <ApproveDialog open={vm.showApproveDialog} onOpenChange={vm.setShowApproveDialog} comments={vm.comments} setComments={vm.setComments} onConfirm={vm.handleApprove} />
      <RejectDialog open={vm.showRejectDialog} onOpenChange={vm.setShowRejectDialog} rejectionReason={vm.rejectionReason} setRejectionReason={vm.setRejectionReason} onConfirm={vm.handleReject} />
    </>
  )
}
