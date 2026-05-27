import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash } from '@phosphor-icons/react'
import { APPROVER_ROLES } from '@/hooks/useWorkflowTemplateEditor'
import type { EscalationRule } from '@/hooks/use-approval-workflow-templates'

interface Props {
  rule: EscalationRule
  onUpdate: (updates: Partial<EscalationRule>) => void
  onRemove: () => void
}

export function EscalationRuleCard({ rule, onUpdate, onRemove }: Props) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Hours Until Escalation</Label>
            <Input type="number" value={rule.hoursUntilEscalation} onChange={e => onUpdate({ hoursUntilEscalation: parseInt(e.target.value) })} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Escalate To</Label>
            <Select value={rule.escalateTo} onValueChange={value => onUpdate({ escalateTo: value })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {APPROVER_ROLES.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch checked={rule.notifyOriginalApprover} onCheckedChange={checked => onUpdate({ notifyOriginalApprover: checked })} />
            <Label className="text-xs cursor-pointer">Notify Original Approver</Label>
          </div>
          <Button variant="ghost" size="sm" onClick={onRemove}><Trash size={14} /></Button>
        </div>
      </CardContent>
    </Card>
  )
}
