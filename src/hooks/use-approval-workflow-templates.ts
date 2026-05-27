import { useCallback } from 'react'
import { useIndexedDBState } from './use-indexed-db-state'
import { WorkflowTemplate } from './use-approval-workflow-templates.types'
import { useWorkflowTemplateCrud } from './use-workflow-template-crud'
import { useWorkflowStepCrud } from './use-workflow-step-crud'

export type {
  ApprovalStepTemplate,
  ParallelApprover,
  StepCondition,
  EscalationRule,
  WorkflowTemplate
} from './use-approval-workflow-templates.types'

export function useApprovalWorkflowTemplates() {
  const [templates = [], setTemplates] = useIndexedDBState<WorkflowTemplate[]>(
    'workflow-templates',
    []
  )

  const templateCrud = useWorkflowTemplateCrud(setTemplates)
  const stepCrud = useWorkflowStepCrud(setTemplates)

  const getTemplatesByBatchType = useCallback(
    (batchType: WorkflowTemplate['batchType']) => {
      return templates.filter((t) => t.batchType === batchType)
    },
    [templates]
  )

  const getDefaultTemplate = useCallback(
    (batchType: WorkflowTemplate['batchType']) => {
      return templates.find((t) => t.batchType === batchType && t.isDefault)
    },
    [templates]
  )

  const getActiveTemplates = useCallback(() => {
    return templates.filter((t) => t.isActive)
  }, [templates])

  return {
    templates,
    ...templateCrud,
    ...stepCrud,
    getTemplatesByBatchType,
    getDefaultTemplate,
    getActiveTemplates
  }
}
