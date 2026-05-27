import type { ShiftType } from '@/lib/types'

export interface ShiftPremium {
  shiftType: ShiftType
  multiplier: number
  description: string
}

export interface TimePattern {
  maxHoursPerDay: number
  maxHoursPerWeek: number
  maxConsecutiveDays: number
  minBreakMinutes: number
  minRestHours: number
}

export interface TimesheetValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface WorkingTimeAnalytics {
  totalHours: number
  standardHours: number
  overtimeHours: number
  weekendHours: number
  nightHours: number
  avgHoursPerDay: number
  daysWorked: number
  longestShift: number
  shortestShift: number
}

export interface ShiftCalculationOptions {
  rateCard?: import('@/lib/types').RateCard
  baseRate?: number
  applyPremiums?: boolean
  roundToNearest?: number
}

export const DEFAULT_SHIFT_PREMIUMS: ShiftPremium[] = [
  { shiftType: 'standard', multiplier: 1.0, description: 'Standard rate' },
  { shiftType: 'overtime', multiplier: 1.5, description: 'Time and a half' },
  { shiftType: 'weekend', multiplier: 1.5, description: 'Weekend premium' },
  { shiftType: 'night', multiplier: 1.33, description: 'Night shift premium' },
  { shiftType: 'holiday', multiplier: 2.0, description: 'Bank holiday rate' },
  { shiftType: 'evening', multiplier: 1.25, description: 'Evening premium' },
  { shiftType: 'early-morning', multiplier: 1.25, description: 'Early morning premium' },
  { shiftType: 'split-shift', multiplier: 1.15, description: 'Split shift premium' }
]

export const DEFAULT_TIME_PATTERN: TimePattern = {
  maxHoursPerDay: 12,
  maxHoursPerWeek: 48,
  maxConsecutiveDays: 6,
  minBreakMinutes: 30,
  minRestHours: 11
}
