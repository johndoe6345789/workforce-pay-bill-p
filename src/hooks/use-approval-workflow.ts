import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'

export interface ApprovalStep {
  id: string
  order: number
  approverRole: string
  approverName?: string
  status: 'pending' | 'approved' | 'rejected' | 'skipped'
  approvedDate?: string
  rejectedDate?: string
  comments?: string
  isParallel?: boolean
  parallelGroup?: string
  parallelApprovals?: ParallelApproval[]
  parallelApprovalMode?: 'all' | 'any' | 'majority'
}

export interface ParallelApproval {
  id: string
  approverId: string
  approverName: string
  approverRole: string
  status: 'pending' | 'approved' | 'rejected'
  approvedDate?: string
  rejectedDate?: string
  comments?: string
  isRequired: boolean
}

export interface ApprovalWorkflow {
  id: string
  entityType: string
  entityId: string
  status: 'pending' | 'in-progress' | 'approved' | 'rejected'
  steps: ApprovalStep[]
  currentStepIndex: number
  createdDate: string
  completedDate?: string
}

export function useApprovalWorkflow() {
  const [workflows = [], setWorkflows] = useKV<ApprovalWorkflow[]>('approval-workflows', [])

  const createWorkflow = useCallback(
    (
      entityType: string,
      entityId: string,
      approverRoles: string[]
    ): ApprovalWorkflow => {
      const workflow: ApprovalWorkflow = {
        id: `WF-${Date.now()}`,
        entityType,
        entityId,
        status: 'pending',
        currentStepIndex: 0,
        createdDate: new Date().toISOString(),
        steps: approverRoles.map((role, index) => ({
          id: `STEP-${Date.now()}-${index}`,
          order: index,
          approverRole: role,
          status: 'pending',
        })),
      }

      setWorkflows((current) => [...(current || []), workflow])
      return workflow
    },
    [setWorkflows]
  )

  const approveStep = useCallback(
    async (workflowId: string, stepId: string, comments?: string, approverId?: string) => {
      const user = await window.spark.user()
      if (!user) return
      
      setWorkflows((current) => {
        if (!current) return []
        return current.map((wf) => {
          if (wf.id !== workflowId) return wf

          const updatedSteps = wf.steps.map((step) => {
            if (step.id === stepId) {
              if (step.isParallel && step.parallelApprovals && approverId) {
                const updatedParallelApprovals = step.parallelApprovals.map((pa) => {
                  if (pa.id === approverId) {
                    return {
                      ...pa,
                      status: 'approved' as const,
                      approvedDate: new Date().toISOString(),
                      comments,
                    }
                  }
                  return pa
                })

                const isStepComplete = checkParallelStepCompletion(
                  updatedParallelApprovals,
                  step.parallelApprovalMode || 'all'
                )

                return {
                  ...step,
                  parallelApprovals: updatedParallelApprovals,
                  status: isStepComplete ? ('approved' as const) : ('pending' as const),
                  approvedDate: isStepComplete ? new Date().toISOString() : undefined,
                }
              } else {
                return {
                  ...step,
                  status: 'approved' as const,
                  approverName: user.login,
                  approvedDate: new Date().toISOString(),
                  comments,
                }
              }
            }
            return step
          })

          const currentStep = updatedSteps.find((s) => s.id === stepId)
          const isLastStep =
            currentStep && currentStep.order === updatedSteps.length - 1
          const allApproved = updatedSteps.every((s) => s.status === 'approved')

          return {
            ...wf,
            steps: updatedSteps,
            currentStepIndex: isLastStep
              ? wf.currentStepIndex
              : wf.currentStepIndex + 1,
            status: allApproved ? ('approved' as const) : ('in-progress' as const),
            completedDate: allApproved ? new Date().toISOString() : undefined,
          }
        })
      })
    },
    [setWorkflows]
  )

  const checkParallelStepCompletion = (
    parallelApprovals: ParallelApproval[],
    mode: 'all' | 'any' | 'majority'
  ): boolean => {
    const requiredApprovals = parallelApprovals.filter((pa) => pa.isRequired)
    const allApprovals = parallelApprovals

    const requiredApproved = requiredApprovals.every((pa) => pa.status === 'approved')
    if (!requiredApproved) return false

    const approvedCount = allApprovals.filter((pa) => pa.status === 'approved').length
    const totalCount = allApprovals.length

    switch (mode) {
      case 'all':
        return approvedCount === totalCount
      case 'any':
        return approvedCount > 0
      case 'majority':
        return approvedCount > totalCount / 2
      default:
        return false
    }
  }

  const rejectStep = useCallback(
    async (workflowId: string, stepId: string, comments?: string, approverId?: string) => {
      const user = await window.spark.user()
      if (!user) return
      
      setWorkflows((current) => {
        if (!current) return []
        return current.map((wf) => {
          if (wf.id !== workflowId) return wf

          const updatedSteps = wf.steps.map((step) => {
            if (step.id === stepId) {
              if (step.isParallel && step.parallelApprovals && approverId) {
                const updatedParallelApprovals = step.parallelApprovals.map((pa) => {
                  if (pa.id === approverId) {
                    return {
                      ...pa,
                      status: 'rejected' as const,
                      rejectedDate: new Date().toISOString(),
                      comments,
                    }
                  }
                  return pa
                })

                const hasRequiredRejection = updatedParallelApprovals.some(
                  (pa) => pa.isRequired && pa.status === 'rejected'
                )

                return {
                  ...step,
                  parallelApprovals: updatedParallelApprovals,
                  status: hasRequiredRejection ? ('rejected' as const) : ('pending' as const),
                  rejectedDate: hasRequiredRejection ? new Date().toISOString() : undefined,
                }
              } else {
                return {
                  ...step,
                  status: 'rejected' as const,
                  approverName: user.login,
                  rejectedDate: new Date().toISOString(),
                  comments,
                }
              }
            }
            return step
          })

          const hasRejectedStep = updatedSteps.some((s) => s.status === 'rejected')

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

  const getWorkflowsByEntity = useCallback(
    (entityType: string, entityId: string) => {
      return workflows.filter(
        (wf) => wf.entityType === entityType && wf.entityId === entityId
      )
    },
    [workflows]
  )

  const getPendingWorkflows = useCallback(() => {
    return workflows.filter(
      (wf) => wf.status === 'pending' || wf.status === 'in-progress'
    )
  }, [workflows])

  const getCurrentStep = useCallback((workflow: ApprovalWorkflow) => {
    return workflow.steps[workflow.currentStepIndex]
  }, [])

  return {
    workflows,
    createWorkflow,
    approveStep,
    rejectStep,
    getWorkflowsByEntity,
    getPendingWorkflows,
    getCurrentStep,
  }
}
