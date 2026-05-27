import { Plus, Trash, ArrowUp, ArrowDown, Check, X, PlusCircle, MinusCircle } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { StepEditorPanel } from './StepEditorPanel'
import { WorkflowTemplateDetailsCard } from './WorkflowTemplateDetailsCard'
import { useWorkflowTemplateEditor } from '@/hooks/useWorkflowTemplateEditor'
import type { WorkflowTemplate } from '@/hooks/use-approval-workflow-templates'

interface Props {
  template: WorkflowTemplate
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (template: WorkflowTemplate) => void
}

export function WorkflowTemplateEditor({ template, open, onOpenChange, onSave }: Props) {
  const vm = useWorkflowTemplateEditor(template)

  const handleSave = () => { onSave(vm.editedTemplate); onOpenChange(false) }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Workflow Template</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
          <div className="space-y-6 pb-4">
            <WorkflowTemplateDetailsCard template={vm.editedTemplate} patch={vm.patch} />

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Approval Steps</CardTitle>
                <Button size="sm" onClick={vm.addStep}><Plus size={16} className="mr-1" />Add Step</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {vm.editedTemplate.steps.map((step, index) => (
                  <Card key={step.id} className={vm.editingStepId === step.id ? 'border-primary' : ''}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{index + 1}</Badge>
                          <span className="font-medium text-sm">{step.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => vm.moveStep(step.id, 'up')} disabled={index === 0}><ArrowUp size={16} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => vm.moveStep(step.id, 'down')} disabled={index === vm.editedTemplate.steps.length - 1}><ArrowDown size={16} /></Button>
                          <Button variant="ghost" size="sm" onClick={() => vm.toggleEditStep(step.id)}>
                            {vm.editingStepId === step.id ? <MinusCircle size={16} /> : <PlusCircle size={16} />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => vm.removeStep(step.id)}><Trash size={16} /></Button>
                        </div>
                      </div>
                    </CardHeader>
                    {vm.editingStepId === step.id && (
                      <StepEditorPanel
                        step={step}
                        onUpdate={updates => vm.updateStep(step.id, updates)}
                        onAddEscalation={() => vm.addEscalationRule(step.id)}
                        onUpdateEscalation={(ruleId, updates) => vm.updateEscalationRule(step.id, ruleId, updates)}
                        onRemoveEscalation={ruleId => vm.removeEscalationRule(step.id, ruleId)}
                      />
                    )}
                  </Card>
                ))}
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}><X size={16} className="mr-1" />Cancel</Button>
          <Button onClick={handleSave}><Check size={16} className="mr-1" />Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
