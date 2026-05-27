import { useCallback } from 'react'
import type { ApprovalWorkflow } from './use-approval-workflow.types'
import { checkParallelStepCompletion } from './use-approval-parallel'

export function useApprovalRejectStep(
  setWorkflows: (updater: (current: ApprovalWorkflow[]) => ApprovalWorkflow[]) => void,
) {
  const rejectStep = useCallback(
    async (workflowId: string, stepId: string, comments?: string, approverId?: string) => {
      const user = await window.spark.user()
      if (!user) return
      setWorkflows(current => {
        if (!current) return []
        return current.map(wf => {
          if (wf.id !== workflowId) return wf
          const updatedSteps = wf.steps.map(step => {
            if (step.id !== stepId) return step
            if (step.isParallel && step.parallelApprovals && approverId) {
              const updatedParallelApprovals = step.parallelApprovals.map(pa =>
                pa.id === approverId
                  ? { ...pa, status: 'rejected' as const, rejectedDate: new Date().toISOString(), comments }
                  : pa
              )
              const hasRequiredRejection = updatedParallelApprovals.some(pa => pa.isRequired && pa.status === 'rejected')
              return {
                ...step,
                parallelApprovals: updatedParallelApprovals,
                status: hasRequiredRejection ? ('rejected' as const) : ('pending' as const),
                rejectedDate: hasRequiredRejection ? new Date().toISOString() : undefined,
              }
            }
            return { ...step, status: 'rejected' as const, approverName: user.login, rejectedDate: new Date().toISOString(), comments }
          })
          const hasRejectedStep = updatedSteps.some(s => s.status === 'rejected')
          return {
            ...wf,
            steps: updatedSteps,
            status: hasRejectedStep ? ('rejected' as const) : wf.status,
            completedDate: hasRejectedStep ? new Date().toISOString() : wf.completedDate,
          }
        })
      })
    },
    [setWorkflows]
  )
  return { rejectStep }
}
