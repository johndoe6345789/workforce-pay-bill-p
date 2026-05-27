import { useState } from 'react'
import { useApprovalWorkflow, type ApprovalWorkflow, type ApprovalStep } from '@/hooks/use-approval-workflow'
import { useApprovalWorkflowTemplates } from '@/hooks/use-approval-workflow-templates'
import { toast } from 'sonner'

export function useParallelApprovalDemo() {
  const { workflows, approveStep, rejectStep } = useApprovalWorkflow()
  const { templates } = useApprovalWorkflowTemplates()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState('')
  const [entityId, setEntityId] = useState('')
  const [simulatedUserId, setSimulatedUserId] = useState('APPROVER-1')

  const parallelTemplates = templates.filter(t => t.steps.some(s => s.isParallel))
  const activeWorkflows = workflows.filter(w => (w.status === 'pending' || w.status === 'in-progress') && w.steps.some(s => s.isParallel))
  const completedWorkflows = workflows.filter(w => (w.status === 'approved' || w.status === 'rejected') && w.steps.some(s => s.isParallel))

  const handleCreateWorkflow = () => {
    if (!selectedTemplateId || !entityId) return
    const template = templates.find(t => t.id === selectedTemplateId)
    if (!template) return

    const newWorkflow: ApprovalWorkflow = {
      id: `WF-${Date.now()}`,
      entityType: template.batchType,
      entityId,
      status: 'pending',
      currentStepIndex: 0,
      createdDate: new Date().toISOString(),
      steps: template.steps.map((stepTemplate, index) => {
        const baseStep: ApprovalStep = {
          id: `STEP-${Date.now()}-${index}`,
          order: index,
          approverRole: stepTemplate.approverRole,
          status: 'pending',
          isParallel: stepTemplate.isParallel,
          parallelApprovalMode: stepTemplate.parallelApprovalMode
        }
        if (stepTemplate.isParallel && stepTemplate.parallelApprovers) {
          baseStep.parallelApprovals = stepTemplate.parallelApprovers.map(approver => ({
            id: approver.id,
            approverId: approver.id,
            approverName: approver.name,
            approverRole: approver.role,
            status: 'pending',
            isRequired: approver.isRequired
          }))
        }
        return baseStep
      })
    }

    void newWorkflow
    toast.success('Parallel approval workflow created')
    setShowCreateDialog(false)
    setEntityId('')
    setSelectedTemplateId('')
  }

  const handleApprove = (workflowId: string, stepId: string, approverId: string, comments?: string) => {
    approveStep(workflowId, stepId, comments, approverId)
    toast.success('Approval recorded')
  }

  const handleReject = (workflowId: string, stepId: string, approverId: string, comments?: string) => {
    rejectStep(workflowId, stepId, comments, approverId)
    toast.error('Rejection recorded')
  }

  return {
    showCreateDialog, setShowCreateDialog,
    selectedTemplateId, setSelectedTemplateId,
    entityId, setEntityId,
    simulatedUserId, setSimulatedUserId,
    parallelTemplates, activeWorkflows, completedWorkflows,
    handleCreateWorkflow, handleApprove, handleReject,
  }
}
