export interface PayrollBatch {
  id: string
  periodStart: string
  periodEnd: string
  status: 'draft' | 'validating' | 'pending-approval' | 'approved' | 'rejected' | 'processing' | 'completed'
  workers: PayrollBatchWorker[]
  totalAmount: number
  totalWorkers: number
  createdAt: string
  createdBy: string
  submittedAt?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectionReason?: string
  processedAt?: string
  validation?: BatchValidation
  approvalWorkflow?: ApprovalWorkflowState
}

export interface PayrollBatchWorker {
  id: string
  workerId: string
  name: string
  role: string
  timesheetCount: number
  totalHours: number
  grossPay: number
  netPay: number
  deductions: PayrollDeduction[]
  timesheets: unknown[]
  paymentMethod: string
}

export interface PayrollDeduction {
  type: string
  description: string
  amount: number
}

export interface BatchValidation {
  isValid: boolean
  hasErrors: boolean
  hasWarnings: boolean
  errors: ValidationIssue[]
  warnings: ValidationIssue[]
}

export interface ValidationIssue {
  worker: string
  workerId: string
  type: string
  message: string
  severity: 'error' | 'warning'
}

export interface ApprovalWorkflowState {
  currentStep: number
  totalSteps: number
  steps: ApprovalStep[]
  canApprove: boolean
  canReject: boolean
}

export interface ApprovalStep {
  id: string
  name: string
  approverRole: string
  status: 'pending' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  comments?: string
}

export interface WorkerInput {
  id: string
  name: string
  role: string
  timesheets: unknown[]
  totalHours: number
  totalAmount: number
  paymentMethod?: string
}
