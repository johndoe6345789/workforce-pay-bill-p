import { useCallback } from 'react'
import { WorkflowTemplate } from './use-approval-workflow-templates.types'

type SetTemplates = (updater: (current: WorkflowTemplate[] | undefined) => WorkflowTemplate[]) => void

export function useWorkflowTemplateCrud(setTemplates: SetTemplates) {
  const createTemplate = useCallback(
    (name: string, batchType: WorkflowTemplate['batchType'], description = ''): WorkflowTemplate => {
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
        return current.map((t) =>
          t.id === templateId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
        )
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
        return [
          ...current,
          {
            ...original,
            id: `TPL-${Date.now()}`,
            name: `${original.name} (Copy)`,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            steps: original.steps.map((step, index) => ({ ...step, id: `STEP-${Date.now()}-${index}` }))
          }
        ]
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

  return {
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    setDefaultTemplate
  }
}
