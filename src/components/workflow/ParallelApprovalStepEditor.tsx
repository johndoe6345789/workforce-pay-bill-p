import { Plus, Trash, UserCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { Separator } from '@/components/ui/separator'
import type { ApprovalStepTemplate } from '@/hooks/use-approval-workflow-templates'
import { useParallelApprovalStepEditor } from '@/hooks/useParallelApprovalStepEditor'

interface Props {
  step: ApprovalStepTemplate
  onChange: (updates: Partial<ApprovalStepTemplate>) => void
}

const APPROVAL_MODES: { value: string; label: string; desc: string }[] = [
  { value: 'all',      label: 'All Approvers', desc: 'All approvers must approve' },
  { value: 'any',      label: 'Any Approver',  desc: 'At least one approver must approve' },
  { value: 'majority', label: 'Majority',       desc: 'More than half must approve' },
]

const NEW_APPROVER_FIELDS = [
  { id: 'approver-name',  label: 'Name *',     placeholder: 'John Doe',          type: 'text',  key: 'newName'  as const },
  { id: 'approver-role',  label: 'Role *',     placeholder: 'Manager',           type: 'text',  key: 'newRole'  as const },
  { id: 'approver-email', label: 'Email',      placeholder: 'john@example.com',  type: 'email', key: 'newEmail' as const },
]

export function ParallelApprovalStepEditor({ step, onChange }: Props) {
  const vm = useParallelApprovalStepEditor(step, onChange)
  const approvers = step.parallelApprovers ?? []
  const fieldValues = { newName: vm.newName, newRole: vm.newRole, newEmail: vm.newEmail }
  const fieldSetters = { newName: vm.setNewName, newRole: vm.setNewRole, newEmail: vm.setNewEmail }

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
                onValueChange={value => onChange({ parallelApprovalMode: value as 'all' | 'any' | 'majority' })}
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
                      <Card key={approver.id} className="bg-muted/30">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <UserCircle size={20} className="text-muted-foreground" />
                                <span className="font-medium text-sm">{approver.name}</span>
                                {approver.isRequired && <Badge variant="destructive" className="text-xs">Required</Badge>}
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
                                  onCheckedChange={checked => vm.updateApprover(approver.id, { isRequired: checked })}
                                />
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => vm.removeApprover(approver.id)}>
                                <Trash size={16} />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Add New Approver</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {NEW_APPROVER_FIELDS.map(({ id, label, placeholder, type, key }) => (
                      <div key={id} className="space-y-2">
                        <Label htmlFor={id} className="text-xs">{label}</Label>
                        <Input
                          id={id}
                          type={type}
                          placeholder={placeholder}
                          value={fieldValues[key]}
                          onChange={e => fieldSetters[key](e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <Button size="sm" onClick={vm.addApprover} disabled={!vm.newName || !vm.newRole}>
                    <Plus className="mr-2" size={16} />Add Approver
                  </Button>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </>
      )}
    </Stack>
  )
}
