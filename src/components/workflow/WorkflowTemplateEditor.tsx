import { useState } from 'react'
import {
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Check,
  X,
  PlusCircle,
  MinusCircle
} from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { WorkflowTemplate, ApprovalStepTemplate, EscalationRule } from '@/hooks/use-approval-workflow-templates'

interface WorkflowTemplateEditorProps {
  template: WorkflowTemplate
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (template: WorkflowTemplate) => void
}

export function WorkflowTemplateEditor({
  template,
  open,
  onOpenChange,
  onSave
}: WorkflowTemplateEditorProps) {
  const [editedTemplate, setEditedTemplate] = useState<WorkflowTemplate>(template)
  const [editingStepId, setEditingStepId] = useState<string | null>(null)

  const handleSave = () => {
    onSave(editedTemplate)
    onOpenChange(false)
  }

  const addStep = () => {
    const newStep: ApprovalStepTemplate = {
      id: `STEP-${Date.now()}`,
      order: editedTemplate.steps.length,
      name: 'New Step',
      approverRole: 'Manager',
      requiresComments: false,
      canSkip: false
    }
    setEditedTemplate({
      ...editedTemplate,
      steps: [...editedTemplate.steps, newStep]
    })
    setEditingStepId(newStep.id)
  }

  const updateStep = (stepId: string, updates: Partial<ApprovalStepTemplate>) => {
    setEditedTemplate({
      ...editedTemplate,
      steps: editedTemplate.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    })
  }

  const removeStep = (stepId: string) => {
    setEditedTemplate({
      ...editedTemplate,
      steps: editedTemplate.steps
        .filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index }))
    })
    if (editingStepId === stepId) {
      setEditingStepId(null)
    }
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = editedTemplate.steps.findIndex(s => s.id === stepId)
    if (stepIndex === -1) return
    
    if (direction === 'up' && stepIndex === 0) return
    if (direction === 'down' && stepIndex === editedTemplate.steps.length - 1) return

    const newSteps = [...editedTemplate.steps]
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1
    
    const temp = newSteps[stepIndex]
    newSteps[stepIndex] = newSteps[targetIndex]
    newSteps[targetIndex] = temp
    
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index
    }))

    setEditedTemplate({
      ...editedTemplate,
      steps: reorderedSteps
    })
  }

  const addEscalationRule = (stepId: string) => {
    const newRule: EscalationRule = {
      id: `ESC-${Date.now()}`,
      hoursUntilEscalation: 24,
      escalateTo: 'Senior Manager',
      notifyOriginalApprover: true
    }

    updateStep(stepId, {
      escalationRules: [
        ...(editedTemplate.steps.find(s => s.id === stepId)?.escalationRules || []),
        newRule
      ]
    })
  }

  const updateEscalationRule = (stepId: string, ruleId: string, updates: Partial<EscalationRule>) => {
    const step = editedTemplate.steps.find(s => s.id === stepId)
    if (!step?.escalationRules) return

    updateStep(stepId, {
      escalationRules: step.escalationRules.map(rule =>
        rule.id === ruleId ? { ...rule, ...updates } : rule
      )
    })
  }

  const removeEscalationRule = (stepId: string, ruleId: string) => {
    const step = editedTemplate.steps.find(s => s.id === stepId)
    if (!step?.escalationRules) return

    updateStep(stepId, {
      escalationRules: step.escalationRules.filter(rule => rule.id !== ruleId)
    })
  }

  const approverRoles = [
    'Manager',
    'Senior Manager',
    'Director',
    'Finance Manager',
    'HR Manager',
    'Payroll Manager',
    'Compliance Officer',
    'Operations Manager',
    'CEO',
    'CFO'
  ]

  const batchTypes: Array<{ value: WorkflowTemplate['batchType']; label: string }> = [
    { value: 'payroll', label: 'Payroll' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'timesheet', label: 'Timesheet' },
    { value: 'expense', label: 'Expense' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'purchase-order', label: 'Purchase Order' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Workflow Template</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6 pb-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Template Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={editedTemplate.name}
                      onChange={(e) => setEditedTemplate({ ...editedTemplate, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-type">Batch Type</Label>
                    <Select
                      value={editedTemplate.batchType}
                      onValueChange={(value) => setEditedTemplate({ ...editedTemplate, batchType: value as WorkflowTemplate['batchType'] })}
                    >
                      <SelectTrigger id="batch-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {batchTypes.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedTemplate.description}
                    onChange={(e) => setEditedTemplate({ ...editedTemplate, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is-active"
                      checked={editedTemplate.isActive}
                      onCheckedChange={(checked) => setEditedTemplate({ ...editedTemplate, isActive: checked })}
                    />
                    <Label htmlFor="is-active" className="cursor-pointer">Active</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="is-default"
                      checked={editedTemplate.isDefault}
                      onCheckedChange={(checked) => setEditedTemplate({ ...editedTemplate, isDefault: checked })}
                    />
                    <Label htmlFor="is-default" className="cursor-pointer">Set as Default</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Approval Steps</CardTitle>
                <Button size="sm" onClick={addStep}>
                  <Plus size={16} className="mr-1" />
                  Add Step
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {editedTemplate.steps.map((step, index) => (
                  <Card key={step.id} className={editingStepId === step.id ? 'border-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="font-medium text-sm">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStep(step.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStep(step.id, 'down')}
                            disabled={index === editedTemplate.steps.length - 1}
                          >
                            <ArrowDown size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingStepId(editingStepId === step.id ? null : step.id)}
                          >
                            {editingStepId === step.id ? <MinusCircle size={16} /> : <PlusCircle size={16} />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(step.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {editingStepId === step.id && (
                      <CardContent className="space-y-4 pt-0">
                        <Separator />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Step Name</Label>
                            <Input
                              value={step.name}
                              onChange={(e) => updateStep(step.id, { name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Approver Role</Label>
                            <Select
                              value={step.approverRole}
                              onValueChange={(value) => updateStep(step.id, { approverRole: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {approverRoles.map(role => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description (Optional)</Label>
                          <Input
                            value={step.description || ''}
                            onChange={(e) => updateStep(step.id, { description: e.target.value })}
                          />
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={step.requiresComments}
                              onCheckedChange={(checked) => updateStep(step.id, { requiresComments: checked })}
                            />
                            <Label className="cursor-pointer">Requires Comments</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={step.canSkip}
                              onCheckedChange={(checked) => updateStep(step.id, { canSkip: checked })}
                            />
                            <Label className="cursor-pointer">Can Skip</Label>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Escalation Rules</Label>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addEscalationRule(step.id)}
                            >
                              <Plus size={14} className="mr-1" />
                              Add Rule
                            </Button>
                          </div>

                          {step.escalationRules?.map((rule) => (
                            <Card key={rule.id} className="bg-muted/30">
                              <CardContent className="p-3 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <Label className="text-xs">Hours Until Escalation</Label>
                                    <Input
                                      type="number"
                                      value={rule.hoursUntilEscalation}
                                      onChange={(e) => updateEscalationRule(step.id, rule.id, { hoursUntilEscalation: parseInt(e.target.value) })}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs">Escalate To</Label>
                                    <Select
                                      value={rule.escalateTo}
                                      onValueChange={(value) => updateEscalationRule(step.id, rule.id, { escalateTo: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {approverRoles.map(role => (
                                          <SelectItem key={role} value={role}>
                                            {role}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={rule.notifyOriginalApprover}
                                      onCheckedChange={(checked) => updateEscalationRule(step.id, rule.id, { notifyOriginalApprover: checked })}
                                    />
                                    <Label className="text-xs cursor-pointer">Notify Original Approver</Label>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeEscalationRule(step.id, rule.id)}
                                  >
                                    <Trash size={14} />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X size={16} className="mr-1" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check size={16} className="mr-1" />
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
