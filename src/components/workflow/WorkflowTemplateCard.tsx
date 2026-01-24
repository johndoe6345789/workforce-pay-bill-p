import {
  FlowArrow,
  PencilSimple,
  Trash,
  Copy,
  CheckCircle,
  XCircle,
  Star
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/ui/stack'
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
  const batchTypeLabels: Record<string, string> = {
    payroll: 'Payroll',
    invoice: 'Invoice',
    timesheet: 'Timesheet',
    expense: 'Expense',
    compliance: 'Compliance',
    'purchase-order': 'Purchase Order'
  }

  const batchTypeColors: Record<string, string> = {
    payroll: 'bg-accent/10 text-accent-foreground border-accent/30',
    invoice: 'bg-info/10 text-info-foreground border-info/30',
    timesheet: 'bg-success/10 text-success-foreground border-success/30',
    expense: 'bg-warning/10 text-warning-foreground border-warning/30',
    compliance: 'bg-destructive/10 text-destructive-foreground border-destructive/30',
    'purchase-order': 'bg-primary/10 text-primary-foreground border-primary/30'
  }

  return (
    <Card className={!template.isActive ? 'opacity-60' : ''}>
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {template.name}
              </h3>
              {template.isDefault && (
                <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
                  <Star size={12} className="mr-1" weight="fill" />
                  Default
                </Badge>
              )}
              <Badge
                variant="outline"
                className={batchTypeColors[template.batchType] || 'bg-secondary'}
              >
                {batchTypeLabels[template.batchType]}
              </Badge>
              {template.isActive ? (
                <Badge variant="outline" className="bg-success/10 text-success-foreground border-success/30">
                  <CheckCircle size={12} className="mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-muted/50 text-muted-foreground">
                  <XCircle size={12} className="mr-1" />
                  Inactive
                </Badge>
              )}
            </div>
            {template.description && (
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <PencilSimple size={16} className="mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={onDuplicate}>
              <Copy size={16} />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-3">
              Approval Steps ({template.steps.length})
            </p>
            <div className="space-y-2">
              {template.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-mono text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {step.name}
                      </span>
                      {step.canSkip && (
                        <Badge variant="outline" className="text-xs">
                          Skippable
                        </Badge>
                      )}
                      {step.requiresComments && (
                        <Badge variant="outline" className="text-xs">
                          Comments Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Approver: {step.approverRole}
                      {step.description && ` • ${step.description}`}
                    </p>
                  </div>
                  {step.escalationRules && step.escalationRules.length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {step.escalationRules.length} Escalation Rule{step.escalationRules.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(template.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
