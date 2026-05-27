import { CheckCircle, XCircle, Clock, User, ChatCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import type { ApprovalStep } from '@/hooks/use-payroll-batch'

const STEP_STATUS_BADGE: Record<ApprovalStep['status'], React.ReactNode> = {
  approved: (
    <Badge className="bg-success/10 text-success-foreground border-success/30">
      <CheckCircle className="mr-1" size={14} />Approved
    </Badge>
  ),
  rejected: (
    <Badge variant="destructive">
      <XCircle className="mr-1" size={14} />Rejected
    </Badge>
  ),
  pending: (
    <Badge variant="secondary">
      <Clock className="mr-1" size={14} />Pending
    </Badge>
  ),
}

interface Props {
  step: ApprovalStep
  index: number
  isCurrentStep: boolean
  canInteract: boolean
  isLast: boolean
  onApprove: () => void
  onReject: () => void
}

export function ApprovalStepItem({ step, index, isCurrentStep, canInteract, isLast, onApprove, onReject }: Props) {
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium">{step.name}</div>
              <div className="text-sm text-muted-foreground">Approver: {step.approverRole}</div>
            </div>
            {STEP_STATUS_BADGE[step.status]}
          </div>

          {step.status === 'approved' && step.approvedBy && (
            <div className="mt-2 p-3 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-start gap-2 text-sm">
                <User className="text-success flex-shrink-0" size={16} />
                <div>
                  <div><span className="font-medium">Approved by:</span> {step.approvedBy}</div>
                  {step.approvedAt && <div className="text-muted-foreground">{format(new Date(step.approvedAt), 'PPpp')}</div>}
                  {step.comments && <div className="mt-1 text-muted-foreground"><ChatCircle className="inline mr-1" size={14} />{step.comments}</div>}
                </div>
              </div>
            </div>
          )}

          {step.status === 'rejected' && step.rejectedBy && (
            <div className="mt-2 p-3 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="flex items-start gap-2 text-sm">
                <User className="text-destructive flex-shrink-0" size={16} />
                <div>
                  <div><span className="font-medium">Rejected by:</span> {step.rejectedBy}</div>
                  {step.rejectedAt && <div className="text-muted-foreground">{format(new Date(step.rejectedAt), 'PPpp')}</div>}
                  {step.comments && <div className="mt-1 text-destructive"><ChatCircle className="inline mr-1" size={14} />{step.comments}</div>}
                </div>
              </div>
            </div>
          )}

          {step.status === 'pending' && isCurrentStep && canInteract && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" onClick={onApprove}><CheckCircle className="mr-2" />Approve</Button>
              <Button size="sm" variant="destructive" onClick={onReject}><XCircle className="mr-2" />Reject</Button>
            </div>
          )}
        </div>
      </div>
      {!isLast && <div className="ml-4 my-2 h-8 w-0.5 bg-border" />}
    </div>
  )
}
