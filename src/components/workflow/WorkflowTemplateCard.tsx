import { Trash, Copy, PencilSimple, FlowArrow, CheckCircle, Users } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { WorkflowTemplate } from '@/hooks/use-approval-workflow-templates'

interface WorkflowTemplateCardProps {
  template: WorkflowTemplate
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function WorkflowTemplateCard({ 
  template, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: WorkflowTemplateCardProps) {
  const batchTypeLabels: Record<WorkflowTemplate['batchType'], string> = {
    'payroll': 'Payroll',
    'invoice': 'Invoice',
    'timesheet': 'Timesheet',
    'expense': 'Expense',
    'compliance': 'Compliance',
    'purchase-order': 'Purchase Order'
  }

  const parallelStepsCount = template.steps.filter(s => s.isParallel).length
  const totalApprovers = template.steps.reduce((sum, step) => {
    if (step.isParallel && step.parallelApprovers) {
      return sum + step.parallelApprovers.length
    }
    return sum + 1
  }, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-base truncate">{template.name}</CardTitle>
              {template.isDefault && (
                <Badge variant="default" className="shrink-0">Default</Badge>
              )}
              {!template.isActive && (
                <Badge variant="outline" className="shrink-0">Inactive</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {template.description}
            </p>
          </div>
          <Badge variant="secondary">{batchTypeLabels[template.batchType]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <FlowArrow size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{template.steps.length} Steps</span>
          </div>
          {parallelStepsCount > 0 && (
            <div className="flex items-center gap-2">
              <Users size={16} className="text-primary" />
              <span className="text-primary font-medium">{parallelStepsCount} Parallel</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">{totalApprovers} Approvers</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onEdit}
            className="flex-1"
          >
            <PencilSimple className="mr-2" size={16} />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDuplicate}
          >
            <Copy size={16} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDelete}
          >
            <Trash size={16} />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
