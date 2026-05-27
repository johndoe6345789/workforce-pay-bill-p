import type { ParallelApproval } from './use-approval-workflow.types'

export function checkParallelStepCompletion(
  parallelApprovals: ParallelApproval[],
  mode: 'all' | 'any' | 'majority'
): boolean {
  const requiredApprovals = parallelApprovals.filter(pa => pa.isRequired)
  const requiredApproved = requiredApprovals.every(pa => pa.status === 'approved')
  if (!requiredApproved) return false
  const approvedCount = parallelApprovals.filter(pa => pa.status === 'approved').length
  const totalCount = parallelApprovals.length
  switch (mode) {
    case 'all': return approvedCount === totalCount
    case 'any': return approvedCount > 0
    case 'majority': return approvedCount > totalCount / 2
    default: return false
  }
}
