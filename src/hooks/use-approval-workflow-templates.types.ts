export interface ApprovalStepTemplate {
  id: string
  order: number
  name: string
  description?: string
  approverRole: string
  requiresComments: boolean
  canSkip: boolean
  skipConditions?: StepCondition[]
  autoApprovalConditions?: StepCondition[]
  escalationRules?: EscalationRule[]
  isParallel?: boolean
  parallelGroup?: string
  parallelApprovalMode?: 'all' | 'any' | 'majority'
  parallelApprovers?: ParallelApprover[]
}

export interface ParallelApprover {
  id: string
  name: string
  role: string
  email?: string
  isRequired: boolean
}

export interface StepCondition {
  id: string
  field: string
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains' | 'notEquals'
  value: string | number
  logic?: 'AND' | 'OR'
}

export interface EscalationRule {
  id: string
  hoursUntilEscalation: number
  escalateTo: string
  notifyOriginalApprover: boolean
}

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  batchType: 'payroll' | 'invoice' | 'timesheet' | 'expense' | 'compliance' | 'purchase-order'
  isActive: boolean
  isDefault: boolean
  steps: ApprovalStepTemplate[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  metadata?: {
    color?: string
    icon?: string
    tags?: string[]
  }
}
