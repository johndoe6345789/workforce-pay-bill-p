import { Plus, FlowArrow, Funnel } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { WorkflowTemplateEditor } from './workflow/WorkflowTemplateEditor'
import { WorkflowTemplateCard } from './workflow/WorkflowTemplateCard'
import { useApprovalWorkflowTemplateManager } from '@/hooks/useApprovalWorkflowTemplateManager'

const BATCH_TYPES: { value: string; label: string }[] = [
  { value: 'payroll',         label: 'Payroll' },
  { value: 'invoice',         label: 'Invoice' },
  { value: 'timesheet',       label: 'Timesheet' },
  { value: 'expense',         label: 'Expense' },
  { value: 'compliance',      label: 'Compliance' },
  { value: 'purchase-order',  label: 'Purchase Order' },
]

export function ApprovalWorkflowTemplateManager() {
  const vm = useApprovalWorkflowTemplateManager()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Approval Workflow Templates</h1>
          <p className="text-muted-foreground mt-1">Configure reusable approval workflows for different batch types</p>
        </div>
        <Dialog open={vm.showCreateDialog} onOpenChange={vm.setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2" size={16} />New Template</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Workflow Template</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                A new template will be created with default settings. You can customize it after creation.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => vm.setShowCreateDialog(false)}>Cancel</Button>
              <Button onClick={vm.handleCreate}>Create Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-4">
            <Funnel className="text-muted-foreground" size={20} />
            <Label htmlFor="batch-type-filter" className="text-sm font-medium">Filter by Batch Type</Label>
            <Select value={vm.filterBatchType} onValueChange={vm.setFilterBatchType}>
              <SelectTrigger id="batch-type-filter" className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {BATCH_TYPES.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {vm.filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FlowArrow className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-medium text-foreground mb-2">No Templates Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {vm.filterBatchType === 'all'
                ? 'Create your first workflow template to get started'
                : `No templates found for ${BATCH_TYPES.find(t => t.value === vm.filterBatchType)?.label} batch type`}
            </p>
            {vm.filterBatchType === 'all' && (
              <Button onClick={() => vm.setShowCreateDialog(true)}><Plus className="mr-2" size={16} />Create Template</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {vm.filteredTemplates.map(template => (
            <WorkflowTemplateCard
              key={template.id}
              template={template}
              onEdit={() => vm.setEditingTemplate(template)}
              onDelete={() => vm.handleDelete(template.id)}
              onDuplicate={() => vm.handleDuplicate(template.id)}
            />
          ))}
        </div>
      )}

      {vm.editingTemplate && (
        <WorkflowTemplateEditor
          template={vm.editingTemplate}
          open={!!vm.editingTemplate}
          onOpenChange={open => !open && vm.setEditingTemplate(null)}
          onSave={vm.handleSave}
        />
      )}
    </div>
  )
}
