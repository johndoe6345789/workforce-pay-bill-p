import { useCallback } from 'react'
import { useIndexedDBState } from './use-indexed-db-state'

export interface ApprovalStepTemplate {
  id: string
  order: number
  name: string
  description?: string
  approverRole: string
  requiresComments: boolean
  canSkip: boolean
  skipConditions?: StepCondition[]
  autoApprovalConditions?: StepCondition[]
  escalationRules?: EscalationRule[]
}

export interface StepCondition {
  id: string
  field: string
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains' | 'notEquals'
  value: string | number
  logic?: 'AND' | 'OR'
}

export interface EscalationRule {
  id: string
  hoursUntilEscalation: number
  escalateTo: string
  notifyOriginalApprover: boolean
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  batchType: 'payroll' | 'invoice' | 'timesheet' | 'expense' | 'compliance' | 'purchase-order'
  isActive: boolean
  isDefault: boolean
  steps: ApprovalStepTemplate[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  metadata?: {
    color?: string
    icon?: string
    tags?: string[]
  }
}

export function useApprovalWorkflowTemplates() {
  const [templates = [], setTemplates] = useIndexedDBState<WorkflowTemplate[]>(
    'workflow-templates',
    []
  )

  const createTemplate = useCallback(
    (name: string, batchType: WorkflowTemplate['batchType'], description: string = ''): WorkflowTemplate => {
      const newTemplate: WorkflowTemplate = {
        id: `TPL-${Date.now()}`,
        name,
        description,
        batchType,
        isActive: true,
        isDefault: false,
        steps: [
          {
            id: `STEP-${Date.now()}-1`,
            order: 0,
            name: 'Initial Review',
            description: 'First level approval',
            approverRole: 'Manager',
            requiresComments: false,
            canSkip: false
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setTemplates((current) => [...(current || []), newTemplate])
      return newTemplate
    },
    [setTemplates]
  )

  const updateTemplate = useCallback(
    (templateId: string, updates: Partial<WorkflowTemplate>) => {
      setTemplates((current) => {
        if (!current) return []
        return current.map((template) => {
          if (template.id === templateId) {
            return {
              ...template,
              ...updates,
              updatedAt: new Date().toISOString()
            }
          }
          return template
        })
      })
    },
    [setTemplates]
  )

  const deleteTemplate = useCallback(
    (templateId: string) => {
      setTemplates((current) => {
        if (!current) return []
        return current.filter((template) => template.id !== templateId)
      })
    },
    [setTemplates]
  )

  const duplicateTemplate = useCallback(
    (templateId: string) => {
      setTemplates((current) => {
        if (!current) return []
        const original = current.find((t) => t.id === templateId)
        if (!original) return current

        const duplicate: WorkflowTemplate = {
          ...original,
          id: `TPL-${Date.now()}`,
          name: `${original.name} (Copy)`,
          isDefault: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          steps: original.steps.map((step, index) => ({
            ...step,
            id: `STEP-${Date.now()}-${index}`
          }))
        }

        return [...current, duplicate]
      })
    },
    [setTemplates]
  )

  const addStep = useCallback(
    (templateId: string, step: Omit<ApprovalStepTemplate, 'id' | 'order'>) => {
      setTemplates((current) => {
        if (!current) return []
        return current.map((template) => {
          if (template.id === templateId) {
            const newStep: ApprovalStepTemplate = {
              ...step,
              id: `STEP-${Date.now()}`,
              order: template.steps.length
            }
            return {
              ...template,
              steps: [...template.steps, newStep],
              updatedAt: new Date().toISOString()
            }
          }
          return template
        })
      })
    },
    [setTemplates]
  )

  const updateStep = useCallback(
    (templateId: string, stepId: string, updates: Partial<ApprovalStepTemplate>) => {
      setTemplates((current) => {
        if (!current) return []
        return current.map((template) => {
          if (template.id === templateId) {
            return {
              ...template,
              steps: template.steps.map((step) =>
                step.id === stepId ? { ...step, ...updates } : step
              ),
              updatedAt: new Date().toISOString()
            }
          }
          return template
        })
      })
    },
    [setTemplates]
  )

  const removeStep = useCallback(
    (templateId: string, stepId: string) => {
      setTemplates((current) => {
        if (!current) return []
        return current.map((template) => {
          if (template.id === templateId) {
            const updatedSteps = template.steps
              .filter((step) => step.id !== stepId)
              .map((step, index) => ({ ...step, order: index }))
            
            return {
              ...template,
              steps: updatedSteps,
              updatedAt: new Date().toISOString()
            }
          }
          return template
        })
      })
    },
    [setTemplates]
  )

  const reorderSteps = useCallback(
    (templateId: string, stepIds: string[]) => {
      setTemplates((current) => {
        if (!current) return []
        return current.map((template) => {
          if (template.id === templateId) {
            const reorderedSteps = stepIds
              .map((id) => template.steps.find((s) => s.id === id))
              .filter((s): s is ApprovalStepTemplate => s !== undefined)
              .map((step, index) => ({ ...step, order: index }))
            
            return {
              ...template,
              steps: reorderedSteps,
              updatedAt: new Date().toISOString()
            }
          }
          return template
        })
      })
    },
    [setTemplates]
  )

  const setDefaultTemplate = useCallback(
    (templateId: string, batchType: WorkflowTemplate['batchType']) => {
      setTemplates((current) => {
        if (!current) return []
        return current.map((template) => ({
          ...template,
          isDefault: template.id === templateId && template.batchType === batchType,
          updatedAt: new Date().toISOString()
        }))
      })
    },
    [setTemplates]
  )

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
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    addStep,
    updateStep,
    removeStep,
    reorderSteps,
    setDefaultTemplate,
    getTemplatesByBatchType,
    getDefaultTemplate,
    getActiveTemplates
  }
}
