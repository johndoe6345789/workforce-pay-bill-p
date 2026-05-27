import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { ApprovalStep } from '@/hooks/use-approval-workflow'
import { useParallelApprovalStepView } from '@/hooks/useParallelApprovalStepView'
import { ApproverCard } from '@/components/workflow/ApproverCard'
import { ApprovalProgressSection } from '@/components/workflow/ApprovalProgressSection'
import { MODE_DESCRIPTIONS } from '@/data/parallel-approval-config'

interface Props {
  step: ApprovalStep
  onApprove?: (approverId: string, comments?: string) => void
  onReject?: (approverId: string, comments?: string) => void
  currentUserId?: string
  readOnly?: boolean
}

export function ParallelApprovalStepView({ step, onApprove, onReject, currentUserId, readOnly = false }: Props) {
  const vm = useParallelApprovalStepView(onApprove, onReject)

  if (!step.isParallel || !step.parallelApprovals) return null

  const approvals = step.parallelApprovals
  const counts = {
    approved: approvals.filter(p => p.status === 'approved').length,
    rejected: approvals.filter(p => p.status === 'rejected').length,
    pending:  approvals.filter(p => p.status === 'pending').length,
  }
  const totalCount = approvals.length
  const required = approvals.filter(p => p.isRequired)
  const requiredApprovedCount = required.filter(p => p.status === 'approved').length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-base">Parallel Approval Progress</CardTitle>
            <p className="text-sm text-muted-foreground">{MODE_DESCRIPTIONS[step.parallelApprovalMode ?? ''] ?? ''}</p>
          </div>
          <Badge variant={step.status === 'approved' ? 'default' : 'secondary'}>{step.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ApprovalProgressSection counts={counts} totalCount={totalCount} required={required} requiredApprovedCount={requiredApprovedCount} />

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Approvers</h4>
          {approvals.map(approval => (
            <ApproverCard
              key={approval.id}
              approval={approval}
              isActive={vm.activeApproverId === approval.id}
              canTakeAction={!readOnly && currentUserId === approval.approverId && approval.status === 'pending'}
              comment={vm.comments[approval.id] ?? ''}
              onSetActive={() => vm.setActiveApproverId(approval.id)}
              onCommentChange={v => vm.setComment(approval.id, v)}
              onApprove={() => vm.handleApprove(approval.id)}
              onReject={() => vm.handleReject(approval.id)}
              onCancel={() => vm.handleCancel(approval.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
