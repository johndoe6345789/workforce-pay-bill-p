import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ParallelApprovalStepView } from '@/components/workflow/ParallelApprovalStepView'
import type { ApprovalWorkflow } from '@/hooks/use-approval-workflow'

interface Props {
  workflow: ApprovalWorkflow
  readOnly?: boolean
  currentUserId?: string
  onApprove?: (approverId: string, comments?: string) => void
  onReject?: (approverId: string, comments?: string) => void
}

const STATUS_VARIANT: Record<string, 'default' | 'destructive' | 'secondary'> = {
  approved: 'default',
  rejected: 'destructive',
}

export function WorkflowCard({ workflow, readOnly, currentUserId, onApprove, onReject }: Props) {
  const dateLabel = readOnly ? 'Completed' : 'Created'
  const dateValue = readOnly
    ? (workflow.completedDate ? new Date(workflow.completedDate).toLocaleString() : 'N/A')
    : new Date(workflow.createdDate).toLocaleString()

  return (
    <Card className={readOnly ? 'opacity-75' : undefined}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{workflow.entityType} - {workflow.entityId}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{dateLabel}: {dateValue}</p>
          </div>
          <Badge variant={STATUS_VARIANT[workflow.status] ?? 'secondary'}>{workflow.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {workflow.steps.filter(step => step.isParallel).map(step => (
          <div key={step.id}>
            <ParallelApprovalStepView
              step={step}
              readOnly={readOnly}
              currentUserId={currentUserId}
              onApprove={onApprove ? (id, c) => onApprove(id, c) : undefined}
              onReject={onReject ? (id, c) => onReject(id, c) : undefined}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
