import type { ShiftType, DayOfWeek } from './types.timesheet'

export type PayrollStatus = 'scheduled' | 'processing' | 'completed' | 'failed'
export type ComplianceStatus = 'valid' | 'expiring' | 'expired'

export interface ValidationRule {
  id: string
  type: 'max-hours-per-day' | 'max-hours-per-week' | 'min-break' | 'max-consecutive-days'
  value: number
  severity: 'warning' | 'error'
  message: string
}

export interface RateCard {
  id: string
  name: string
  clientName?: string
  role?: string
  standardRate: number
  overtimeMultiplier: number
  weekendMultiplier: number
  nightMultiplier: number
  holidayMultiplier: number
  effectiveFrom: string
  effectiveTo?: string
  validationRules?: ValidationRule[]
}

export interface RecurrencePattern {
  frequency: 'weekly' | 'fortnightly' | 'monthly' | 'custom'
  interval?: number
  endDate?: string
  excludeDates?: string[]
}

export interface ShiftPatternTemplate {
  id: string
  name: string
  description: string
  shiftType: ShiftType
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  defaultStartTime: string
  defaultEndTime: string
  defaultBreakMinutes: number
  daysOfWeek: DayOfWeek[]
  rateMultiplier: number
  createdDate: string
  lastUsedDate?: string
  usageCount: number
}

export interface PayrollRun {
  id: string
  periodEnding: string
  workersCount: number
  totalAmount: number
  status: PayrollStatus
  processedDate?: string
}

export interface Worker {
  id: string
  name: string
  email: string
  type: 'employee' | 'contractor' | 'limited-company'
  status: 'active' | 'inactive'
  complianceStatus: ComplianceStatus
}
