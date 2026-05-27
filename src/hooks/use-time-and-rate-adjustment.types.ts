export interface TimeAndRateAdjustmentInput {
  timesheetId: string
  workerId: string
  workerName: string
  clientName: string
  originalHours: number
  originalRate: number
  adjustedHours?: number
  adjustedRate?: number
  adjustmentReason: string
  adjustmentType: 'time' | 'rate' | 'both'
  approvalRequired: boolean
  notes?: string
}

export interface AdjustmentRecord {
  id: string
  adjustmentDate: string
  adjustedBy: string
  adjustedByUserId: string
  previousHours: number
  newHours: number
  previousRate: number
  newRate: number
  previousAmount: number
  newAmount: number
  difference: number
  percentageChange: number
  reason: string
  notes?: string
  requiresApproval: boolean
  approvalStatus: 'pending_approval' | 'approved' | 'rejected' | 'applied'
  approvedBy?: string
  approvedDate?: string
  type: 'time' | 'rate' | 'both'
}

export const APPROVAL_THRESHOLDS = {
  absoluteAmount: 100,
  percentageChange: 10,
}
