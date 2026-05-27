import { useCallback } from 'react'
import { ApprovalStepTemplate, WorkflowTemplate } from './use-approval-workflow-templates.types'

type SetTemplates = (
  updater: (current: WorkflowTemplate[] | undefined) => WorkflowTemplate[]
) => void

export function useWorkflowStepCrud(setTemplates: SetTemplates) {
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

            return { ...template, steps: updatedSteps, updatedAt: new Date().toISOString() }
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

            return { ...template, steps: reorderedSteps, updatedAt: new Date().toISOString() }
          }
          return template
        })
      })
    },
    [setTemplates]
  )

  return { addStep, updateStep, removeStep, reorderSteps }
}
