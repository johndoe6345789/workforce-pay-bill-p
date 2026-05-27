import { useState } from 'react'

export function useParallelApprovalStepView(
  onApprove?: (approverId: string, comments?: string) => void,
  onReject?: (approverId: string, comments?: string) => void,
) {
  const [comments, setComments] = useState<Record<string, string>>({})
  const [activeApproverId, setActiveApproverId] = useState<string | null>(null)

  const clearApprover = (id: string) => {
    setComments(prev => { const next = { ...prev }; delete next[id]; return next })
    setActiveApproverId(null)
  }

  const handleApprove = (approverId: string) => {
    onApprove?.(approverId, comments[approverId])
    clearApprover(approverId)
  }

  const handleReject = (approverId: string) => {
    onReject?.(approverId, comments[approverId])
    clearApprover(approverId)
  }

  const handleCancel = (approverId: string) => clearApprover(approverId)

  const setComment = (id: string, value: string) =>
    setComments(prev => ({ ...prev, [id]: value }))

  return { comments, activeApproverId, setActiveApproverId, handleApprove, handleReject, handleCancel, setComment }
}
