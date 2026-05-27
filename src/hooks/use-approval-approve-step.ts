import { useCallback } from 'react'
import type { ApprovalWorkflow } from './use-approval-workflow.types'
import { checkParallelStepCompletion } from './use-approval-parallel'

export function useApprovalApproveStep(
  setWorkflows: (updater: (current: ApprovalWorkflow[]) => ApprovalWorkflow[]) => void,
) {
  const approveStep = useCallback(
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
                  ? { ...pa, status: 'approved' as const, approvedDate: new Date().toISOString(), comments }
                  : pa
              )
              const isStepComplete = checkParallelStepCompletion(updatedParallelApprovals, step.parallelApprovalMode || 'all')
              return {
                ...step,
                parallelApprovals: updatedParallelApprovals,
                status: isStepComplete ? ('approved' as const) : ('pending' as const),
                approvedDate: isStepComplete ? new Date().toISOString() : undefined,
              }
            }
            return { ...step, status: 'approved' as const, approverName: user.login, approvedDate: new Date().toISOString(), comments }
          })
          const currentStep = updatedSteps.find(s => s.id === stepId)
          const isLastStep = currentStep && currentStep.order === updatedSteps.length - 1
          const allApproved = updatedSteps.every(s => s.status === 'approved')
          return {
            ...wf,
            steps: updatedSteps,
            currentStepIndex: isLastStep ? wf.currentStepIndex : wf.currentStepIndex + 1,
            status: allApproved ? ('approved' as const) : ('in-progress' as const),
            completedDate: allApproved ? new Date().toISOString() : undefined,
          }
        })
      })
    },
    [setWorkflows]
  )
  return { approveStep }
}
