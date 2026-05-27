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
