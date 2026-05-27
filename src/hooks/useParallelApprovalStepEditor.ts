import { useState } from 'react'
import type { ApprovalStepTemplate, ParallelApprover } from '@/hooks/use-approval-workflow-templates'

export function useParallelApprovalStepEditor(step: ApprovalStepTemplate, onChange: (u: Partial<ApprovalStepTemplate>) => void) {
  const [newName, setNewName] = useState('')
  const [newRole, setNewRole] = useState('')
  const [newEmail, setNewEmail] = useState('')

  const addApprover = () => {
    if (!newName || !newRole) return
    const next: ParallelApprover = {
      id: `APPROVER-${Date.now()}`,
      name: newName,
      role: newRole,
      email: newEmail || undefined,
      isRequired: true,
    }
    onChange({ parallelApprovers: [...(step.parallelApprovers ?? []), next] })
    setNewName('')
    setNewRole('')
    setNewEmail('')
  }

  const removeApprover = (id: string) =>
    onChange({ parallelApprovers: (step.parallelApprovers ?? []).filter(a => a.id !== id) })

  const updateApprover = (id: string, updates: Partial<ParallelApprover>) =>
    onChange({ parallelApprovers: (step.parallelApprovers ?? []).map(a => a.id === id ? { ...a, ...updates } : a) })

  const toggleParallel = (enabled: boolean) =>
    onChange({
      isParallel: enabled,
      parallelApprovalMode: enabled ? 'all' : undefined,
      parallelApprovers: enabled ? (step.parallelApprovers ?? []) : undefined,
    })

  return { newName, setNewName, newRole, setNewRole, newEmail, setNewEmail, addApprover, removeApprover, updateApprover, toggleParallel }
}
