import { Trash, UserCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { ParallelApprover } from '@/hooks/use-approval-workflow-templates'

interface Props {
  approver: ParallelApprover
  updateApprover: (id: string, updates: Partial<ParallelApprover>) => void
  removeApprover: (id: string) => void
}

export function ParallelApproverItem({ approver, updateApprover, removeApprover }: Props) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <UserCircle size={20} className="text-muted-foreground" />
              <span className="font-medium text-sm">{approver.name}</span>
              {approver.isRequired && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>Role: {approver.role}</div>
              {approver.email && <div>Email: {approver.email}</div>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2">
              <Label className="text-xs text-muted-foreground">Required</Label>
              <Switch
                checked={approver.isRequired}
                onCheckedChange={checked => updateApprover(approver.id, { isRequired: checked })}
              />
            </div>
            <Button variant="ghost" size="sm" onClick={() => removeApprover(approver.id)}>
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
