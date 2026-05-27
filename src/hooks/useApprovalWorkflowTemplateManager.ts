import { useState } from 'react'
import { toast } from 'sonner'
import { useApprovalWorkflowTemplates, type WorkflowTemplate } from '@/hooks/use-approval-workflow-templates'

export function useApprovalWorkflowTemplateManager() {
  const { templates, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate, getTemplatesByBatchType } = useApprovalWorkflowTemplates()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<WorkflowTemplate | null>(null)
  const [filterBatchType, setFilterBatchType] = useState('all')

  const filteredTemplates = filterBatchType === 'all'
    ? templates
    : getTemplatesByBatchType(filterBatchType as WorkflowTemplate['batchType'])

  const handleCreate = () => {
    const t = createTemplate('New Workflow Template', 'payroll' as const, 'A new workflow template')
    setEditingTemplate(t)
    setShowCreateDialog(false)
    toast.success('Template created')
  }

  const handleDelete = (id: string) => { deleteTemplate(id); toast.success('Template deleted') }
  const handleDuplicate = (id: string) => { duplicateTemplate(id); toast.success('Template duplicated') }

  const handleSave = (updated: WorkflowTemplate) => {
    updateTemplate(updated.id, updated)
    setEditingTemplate(null)
    toast.success('Template updated')
  }

  return {
    filteredTemplates, filterBatchType, setFilterBatchType,
    showCreateDialog, setShowCreateDialog,
    editingTemplate, setEditingTemplate,
    handleCreate, handleDelete, handleDuplicate, handleSave,
  }
}
