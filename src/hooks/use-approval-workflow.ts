import { useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { ApprovalWorkflow } from './use-approval-workflow.types'
import { useApprovalApproveStep } from './use-approval-approve-step'
import { useApprovalRejectStep } from './use-approval-reject-step'

export type { ApprovalStep, ParallelApproval, ApprovalWorkflow } from './use-approval-workflow.types'

export function useApprovalWorkflow() {
  const [workflows = [], setWorkflows] = useKV<ApprovalWorkflow[]>('approval-workflows', [])

  const { approveStep } = useApprovalApproveStep(setWorkflows)
  const { rejectStep } = useApprovalRejectStep(setWorkflows)

  const createWorkflow = useCallback(
    (entityType: string, entityId: string, approverRoles: string[]): ApprovalWorkflow => {
      const workflow: ApprovalWorkflow = {
        id: `WF-${Date.now()}`,
        entityType, entityId,
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
      setWorkflows(current => [...(current || []), workflow])
      return workflow
    },
    [setWorkflows]
  )

  const getWorkflowsByEntity = useCallback(
    (entityType: string, entityId: string) =>
      workflows.filter(wf => wf.entityType === entityType && wf.entityId === entityId),
    [workflows]
  )

  const getPendingWorkflows = useCallback(
    () => workflows.filter(wf => wf.status === 'pending' || wf.status === 'in-progress'),
    [workflows]
  )

  const getCurrentStep = useCallback(
    (workflow: ApprovalWorkflow) => workflow.steps[workflow.currentStepIndex],
    []
  )

  return { workflows, createWorkflow, approveStep, rejectStep, getWorkflowsByEntity, getPendingWorkflows, getCurrentStep }
}
