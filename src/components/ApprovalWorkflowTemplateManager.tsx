import { useState } from 'react'
import {
  Plus,
  Trash,
  Copy,
  FlowArrow,
  CheckCircle,
  PencilSimple,
  Funnel
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { Separator } from '@/components/ui/separator'
import { useApprovalWorkflowTemplates, type WorkflowTemplate } from '@/hooks/use-approval-workflow-templates'
import { toast } from 'sonner'
import { WorkflowTemplateEditor } from './workflow/WorkflowTemplateEditor'
import { WorkflowTemplateCard } from './workflow/WorkflowTemplateCard'

export function ApprovalWorkflowTemplateManager() {
  const {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    getTemplatesByBatchType
  } = useApprovalWorkflowTemplates()

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null)
  const [filterBatchType, setFilterBatchType] = useState<string>('all')

  const handleCreateTemplate = () => {
    const newTemplate = createTemplate(
      'New Workflow Template',
      'payroll' as const,
      'A new workflow template'
    )
    setEditingTemplate(newTemplate)
    setShowCreateDialog(false)
    toast.success('Template created')
  }

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId)
    toast.success('Template deleted')
  }

  const handleDuplicateTemplate = (templateId: string) => {
    duplicateTemplate(templateId)
    toast.success('Template duplicated')
  }

  const filteredTemplates = filterBatchType === 'all' 
    ? templates 
    : getTemplatesByBatchType(filterBatchType as WorkflowTemplate['batchType'])

  const batchTypes = [
    { value: 'payroll', label: 'Payroll' },
    { value: 'invoice', label: 'Invoice' },
    { value: 'timesheet', label: 'Timesheet' },
    { value: 'expense', label: 'Expense' },
    { value: 'compliance', label: 'Compliance' },
    { value: 'purchase-order', label: 'Purchase Order' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Approval Workflow Templates
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure reusable approval workflows for different batch types
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2" size={16} />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Workflow Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                A new template will be created with default settings. You can customize it after creation.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="border-b border-border">
          <div className="flex items-center gap-4">
            <Funnel className="text-muted-foreground" size={20} />
            <Label htmlFor="batch-type-filter" className="text-sm font-medium">
              Filter by Batch Type
            </Label>
            <Select value={filterBatchType} onValueChange={setFilterBatchType}>
              <SelectTrigger id="batch-type-filter" className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {batchTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {filteredTemplates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FlowArrow className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Templates Found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filterBatchType === 'all' 
                ? 'Create your first workflow template to get started' 
                : `No templates found for ${batchTypes.find(t => t.value === filterBatchType)?.label} batch type`
              }
            </p>
            {filterBatchType === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2" size={16} />
                Create Template
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map(template => (
            <WorkflowTemplateCard
              key={template.id}
              template={template}
              onEdit={() => setEditingTemplate(template)}
              onDelete={() => handleDeleteTemplate(template.id)}
              onDuplicate={() => handleDuplicateTemplate(template.id)}
            />
          ))}
        </div>
      )}

      {editingTemplate && (
        <WorkflowTemplateEditor
          template={editingTemplate}
          open={!!editingTemplate}
          onOpenChange={(open) => !open && setEditingTemplate(null)}
          onSave={(updatedTemplate) => {
            updateTemplate(updatedTemplate.id, updatedTemplate)
            setEditingTemplate(null)
            toast.success('Template updated')
          }}
        />
      )}
    </div>
  )
}
