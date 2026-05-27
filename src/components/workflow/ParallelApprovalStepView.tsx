import { CheckCircle } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import type { ApprovalStep } from '@/hooks/use-approval-workflow'
import { useParallelApprovalStepView } from '@/hooks/useParallelApprovalStepView'
import { ApproverCard } from '@/components/workflow/ApproverCard'

const MODE_DESCRIPTIONS: Record<string, string> = {
  all:      'All approvers must approve',
  any:      'At least one approver must approve',
  majority: 'More than half must approve',
}

const STAT_CELLS = [
  { key: 'approved', label: 'Approved', bg: 'bg-success/10',     text: 'text-success' },
  { key: 'pending',  label: 'Pending',  bg: 'bg-muted',          text: 'text-muted-foreground' },
  { key: 'rejected', label: 'Rejected', bg: 'bg-destructive/10', text: 'text-destructive' },
] as const

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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">{counts.approved} / {totalCount} Approved</span>
          </div>
          <Progress value={(counts.approved / totalCount) * 100} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {STAT_CELLS.map(({ key, label, bg, text }) => (
            <div key={key} className={`text-center p-3 ${bg} rounded-md`}>
              <div className={`text-2xl font-semibold ${text}`}>{counts[key]}</div>
              <div className="text-xs text-muted-foreground mt-1">{label}</div>
            </div>
          ))}
        </div>

        {required.length > 0 && (
          <div className="p-3 bg-info/10 border border-info/20 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="destructive" className="text-xs">Required</Badge>
              <span className="text-muted-foreground">
                {requiredApprovedCount} / {required.length} required approvals completed
              </span>
              {requiredApprovedCount === required.length && (
                <CheckCircle size={16} weight="fill" className="text-success ml-auto" />
              )}
            </div>
          </div>
        )}

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
