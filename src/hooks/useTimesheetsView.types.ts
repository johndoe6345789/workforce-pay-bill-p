import type { Timesheet } from '@/lib/types'

export interface TimesheetWithValidation extends Timesheet {
  validationErrors: string[]
  validationWarnings: string[]
  isValid: boolean
}

export interface TimesheetStats {
  pendingCount: number
  approvedCount: number
  totalHours: number
  totalValue: number
  approvalRate: number
}

export interface ValidationStats {
  invalid: number
  withWarnings: number
}
