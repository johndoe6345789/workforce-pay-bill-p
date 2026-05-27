import { useState } from 'react'
import type { WorkflowTemplate, ApprovalStepTemplate, EscalationRule } from '@/hooks/use-approval-workflow-templates'

export const APPROVER_ROLES = [
  'Manager', 'Senior Manager', 'Director', 'Finance Manager', 'HR Manager',
  'Payroll Manager', 'Compliance Officer', 'Operations Manager', 'CEO', 'CFO'
]

export const BATCH_TYPES: Array<{ value: WorkflowTemplate['batchType']; label: string }> = [
  { value: 'payroll', label: 'Payroll' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'timesheet', label: 'Timesheet' },
  { value: 'expense', label: 'Expense' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'purchase-order', label: 'Purchase Order' }
]

export function useWorkflowTemplateEditor(initialTemplate: WorkflowTemplate) {
  const [editedTemplate, setEditedTemplate] = useState<WorkflowTemplate>(initialTemplate)
  const [editingStepId, setEditingStepId] = useState<string | null>(null)

  const patch = (updates: Partial<WorkflowTemplate>) => setEditedTemplate(t => ({ ...t, ...updates }))

  const updateStep = (stepId: string, updates: Partial<ApprovalStepTemplate>) => {
    patch({ steps: editedTemplate.steps.map(s => s.id === stepId ? { ...s, ...updates } : s) })
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
    patch({ steps: [...editedTemplate.steps, newStep] })
    setEditingStepId(newStep.id)
  }

  const removeStep = (stepId: string) => {
    patch({ steps: editedTemplate.steps.filter(s => s.id !== stepId).map((s, i) => ({ ...s, order: i })) })
    if (editingStepId === stepId) setEditingStepId(null)
  }

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const idx = editedTemplate.steps.findIndex(s => s.id === stepId)
    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === editedTemplate.steps.length - 1) return
    const next = [...editedTemplate.steps]
    const target = direction === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[target]] = [next[target], next[idx]]
    patch({ steps: next.map((s, i) => ({ ...s, order: i })) })
  }

  const addEscalationRule = (stepId: string) => {
    const newRule: EscalationRule = {
      id: `ESC-${Date.now()}`,
      hoursUntilEscalation: 24,
      escalateTo: 'Senior Manager',
      notifyOriginalApprover: true
    }
    const step = editedTemplate.steps.find(s => s.id === stepId)
    updateStep(stepId, { escalationRules: [...(step?.escalationRules || []), newRule] })
  }

  const updateEscalationRule = (stepId: string, ruleId: string, updates: Partial<EscalationRule>) => {
    const step = editedTemplate.steps.find(s => s.id === stepId)
    if (!step?.escalationRules) return
    updateStep(stepId, { escalationRules: step.escalationRules.map(r => r.id === ruleId ? { ...r, ...updates } : r) })
  }

  const removeEscalationRule = (stepId: string, ruleId: string) => {
    const step = editedTemplate.steps.find(s => s.id === stepId)
    if (!step?.escalationRules) return
    updateStep(stepId, { escalationRules: step.escalationRules.filter(r => r.id !== ruleId) })
  }

  const toggleEditStep = (stepId: string) => setEditingStepId(id => id === stepId ? null : stepId)

  return {
    editedTemplate, patch,
    editingStepId, toggleEditStep,
    addStep, updateStep, removeStep, moveStep,
    addEscalationRule, updateEscalationRule, removeEscalationRule,
  }
}
