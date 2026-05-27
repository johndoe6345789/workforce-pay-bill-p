import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { CardContent } from '@/components/ui/card'
import { Plus } from '@phosphor-icons/react'
import { ParallelApprovalStepEditor } from './ParallelApprovalStepEditor'
import { EscalationRuleCard } from './EscalationRuleCard'
import { APPROVER_ROLES } from '@/hooks/useWorkflowTemplateEditor'
import type { ApprovalStepTemplate, EscalationRule } from '@/hooks/use-approval-workflow-templates'

interface Props {
  step: ApprovalStepTemplate
  onUpdate: (updates: Partial<ApprovalStepTemplate>) => void
  onAddEscalation: () => void
  onUpdateEscalation: (ruleId: string, updates: Partial<EscalationRule>) => void
  onRemoveEscalation: (ruleId: string) => void
}

export function StepEditorPanel({ step, onUpdate, onAddEscalation, onUpdateEscalation, onRemoveEscalation }: Props) {
  return (
    <CardContent className="space-y-4 pt-0">
      <Separator />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Step Name</Label>
          <Input value={step.name} onChange={e => onUpdate({ name: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Approver Role</Label>
          <Select value={step.approverRole} onValueChange={value => onUpdate({ approverRole: value })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {APPROVER_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description (Optional)</Label>
        <Input value={step.description || ''} onChange={e => onUpdate({ description: e.target.value })} />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={step.requiresComments} onCheckedChange={checked => onUpdate({ requiresComments: checked })} />
          <Label className="cursor-pointer">Requires Comments</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={step.canSkip} onCheckedChange={checked => onUpdate({ canSkip: checked })} />
          <Label className="cursor-pointer">Can Skip</Label>
        </div>
      </div>
      <Separator />
      <ParallelApprovalStepEditor step={step} onChange={onUpdate} />
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Escalation Rules</Label>
          <Button variant="outline" size="sm" onClick={onAddEscalation}><Plus size={14} className="mr-1" />Add Rule</Button>
        </div>
        {step.escalationRules?.map(rule => (
          <EscalationRuleCard
            key={rule.id}
            rule={rule}
            onUpdate={updates => onUpdateEscalation(rule.id, updates)}
            onRemove={() => onRemoveEscalation(rule.id)}
          />
        ))}
      </div>
    </CardContent>
  )
}
