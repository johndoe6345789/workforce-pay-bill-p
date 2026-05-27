import { UserCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { Separator } from '@/components/ui/separator'
import type { ApprovalStepTemplate } from '@/hooks/use-approval-workflow-templates'
import { useParallelApprovalStepEditor } from '@/hooks/useParallelApprovalStepEditor'
import { ParallelApproverItem } from './ParallelApproverItem'
import { AddApproverForm } from './AddApproverForm'
import { APPROVAL_MODES } from '@/data/parallel-approval-config'

interface Props {
  step: ApprovalStepTemplate
  onChange: (updates: Partial<ApprovalStepTemplate>) => void
}

export function ParallelApprovalStepEditor({ step, onChange }: Props) {
  const vm = useParallelApprovalStepEditor(step, onChange)
  const approvers = step.parallelApprovers ?? []

  return (
    <Stack spacing={4}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Label htmlFor="parallel-toggle" className="text-sm font-medium">Enable Parallel Approvals</Label>
          <Switch id="parallel-toggle" checked={step.isParallel ?? false} onCheckedChange={vm.toggleParallel} />
        </div>
        {step.isParallel && (
          <Badge variant="secondary" className="gap-1.5">
            <UserCircle size={14} />{approvers.length} Approvers
          </Badge>
        )}
      </div>

      {step.isParallel && (
        <>
          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Approval Mode</CardTitle></CardHeader>
            <CardContent>
              <Select
                value={step.parallelApprovalMode ?? 'all'}
                onValueChange={v => onChange({ parallelApprovalMode: v as 'all' | 'any' | 'majority' })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {APPROVAL_MODES.map(({ value, label, desc }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex flex-col items-start gap-1">
                        <span className="font-medium">{label}</span>
                        <span className="text-xs text-muted-foreground">{desc}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm font-medium">Parallel Approvers</CardTitle></CardHeader>
            <CardContent>
              <Stack spacing={4}>
                {approvers.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No approvers added yet. Add approvers below to enable parallel reviews.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {approvers.map(approver => (
                      <ParallelApproverItem
                        key={approver.id}
                        approver={approver}
                        updateApprover={vm.updateApprover}
                        removeApprover={vm.removeApprover}
                      />
                    ))}
                  </div>
                )}
                <Separator />
                <AddApproverForm
                  newName={vm.newName} setNewName={vm.setNewName}
                  newRole={vm.newRole} setNewRole={vm.setNewRole}
                  newEmail={vm.newEmail} setNewEmail={vm.setNewEmail}
                  addApprover={vm.addApprover}
                />
              </Stack>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  )
}
