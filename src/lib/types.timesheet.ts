export type TimesheetStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'awaiting-client' | 'awaiting-manager'
export type ShiftType = 'standard' | 'overtime' | 'weekend' | 'night' | 'holiday' | 'evening' | 'early-morning' | 'split-shift'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type SubmissionMethod = 'web' | 'mobile' | 'qr-scan' | 'email' | 'bulk-import'
export type ApprovalStep = 'manager' | 'client' | 'finance' | 'final'

export interface ApprovalHistoryEntry {
  step: ApprovalStep
  approverName: string
  approverEmail: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: string
  notes?: string
}

export interface TimesheetAdjustment {
  id: string
  adjustmentDate: string
  adjustedBy: string
  previousHours: number
  newHours: number
  previousRate?: number
  newRate?: number
  reason: string
}

export interface ShiftEntry {
  id: string
  date: string
  dayOfWeek: DayOfWeek
  shiftType: ShiftType
  startTime: string
  endTime: string
  breakMinutes: number
  hours: number
  rate: number
  rateMultiplier: number
  amount: number
  notes?: string
}

export interface Timesheet {
  id: string
  workerId: string
  workerName: string
  clientName: string
  weekEnding: string
  hours: number
  status: TimesheetStatus
  submittedDate: string
  approvedDate?: string
  amount: number
  submissionMethod?: SubmissionMethod
  approvalHistory?: ApprovalHistoryEntry[]
  currentApprovalStep?: ApprovalStep
  rate?: number
  adjustments?: TimesheetAdjustment[]
  shifts?: ShiftEntry[]
  rateCardId?: string
  validationErrors?: string[]
}
