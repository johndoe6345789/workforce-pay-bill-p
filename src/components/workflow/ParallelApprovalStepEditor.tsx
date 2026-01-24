import { useState } from 'react'
import { Plus, Trash, UserCircle, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { Separator } from '@/components/ui/separator'
import type { ApprovalStepTemplate, ParallelApprover } from '@/hooks/use-approval-workflow-templates'

interface ParallelApprovalStepEditorProps {
  step: ApprovalStepTemplate
  onChange: (updates: Partial<ApprovalStepTemplate>) => void
}

export function ParallelApprovalStepEditor({ step, onChange }: ParallelApprovalStepEditorProps) {
  const [newApproverName, setNewApproverName] = useState('')
  const [newApproverRole, setNewApproverRole] = useState('')
  const [newApproverEmail, setNewApproverEmail] = useState('')

  const handleAddApprover = () => {
    if (!newApproverName || !newApproverRole) return

    const newApprover: ParallelApprover = {
      id: `APPROVER-${Date.now()}`,
      name: newApproverName,
      role: newApproverRole,
      email: newApproverEmail || undefined,
      isRequired: true
    }

    onChange({
      parallelApprovers: [...(step.parallelApprovers || []), newApprover]
    })

    setNewApproverName('')
    setNewApproverRole('')
    setNewApproverEmail('')
  }

  const handleRemoveApprover = (approverId: string) => {
    onChange({
      parallelApprovers: (step.parallelApprovers || []).filter(a => a.id !== approverId)
    })
  }

  const handleUpdateApprover = (approverId: string, updates: Partial<ParallelApprover>) => {
    onChange({
      parallelApprovers: (step.parallelApprovers || []).map(a =>
        a.id === approverId ? { ...a, ...updates } : a
      )
    })
  }

  const handleToggleParallel = (enabled: boolean) => {
    onChange({
      isParallel: enabled,
      parallelApprovalMode: enabled ? 'all' : undefined,
      parallelApprovers: enabled ? (step.parallelApprovers?.length ? step.parallelApprovers : []) : undefined
    })
  }

  return (
    <Stack spacing={4}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Label htmlFor="parallel-toggle" className="text-sm font-medium">
            Enable Parallel Approvals
          </Label>
          <Switch
            id="parallel-toggle"
            checked={step.isParallel || false}
            onCheckedChange={handleToggleParallel}
          />
        </div>
        {step.isParallel && (
          <Badge variant="secondary" className="gap-1.5">
            <UserCircle size={14} />
            {step.parallelApprovers?.length || 0} Approvers
          </Badge>
        )}
      </div>

      {step.isParallel && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Approval Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={step.parallelApprovalMode || 'all'}
                onValueChange={(value) => onChange({ parallelApprovalMode: value as 'all' | 'any' | 'majority' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium">All Approvers</span>
                      <span className="text-xs text-muted-foreground">All approvers must approve</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="any">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium">Any Approver</span>
                      <span className="text-xs text-muted-foreground">At least one approver must approve</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="majority">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium">Majority</span>
                      <span className="text-xs text-muted-foreground">More than half must approve</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Parallel Approvers</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack spacing={4}>
                {(step.parallelApprovers || []).length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    No approvers added yet. Add approvers below to enable parallel reviews.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(step.parallelApprovers || []).map((approver) => (
                      <Card key={approver.id} className="bg-muted/30">
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
                                  onCheckedChange={(checked) =>
                                    handleUpdateApprover(approver.id, { isRequired: checked })
                                  }
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveApprover(approver.id)}
                              >
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
                    <div className="space-y-2">
                      <Label htmlFor="approver-name" className="text-xs">Name *</Label>
                      <Input
                        id="approver-name"
                        placeholder="John Doe"
                        value={newApproverName}
                        onChange={(e) => setNewApproverName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="approver-role" className="text-xs">Role *</Label>
                      <Input
                        id="approver-role"
                        placeholder="Manager"
                        value={newApproverRole}
                        onChange={(e) => setNewApproverRole(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="approver-email" className="text-xs">Email</Label>
                      <Input
                        id="approver-email"
                        type="email"
                        placeholder="john@example.com"
                        value={newApproverEmail}
                        onChange={(e) => setNewApproverEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddApprover}
                    disabled={!newApproverName || !newApproverRole}
                  >
                    <Plus className="mr-2" size={16} />
                    Add Approver
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
