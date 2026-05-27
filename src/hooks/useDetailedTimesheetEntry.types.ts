import type { DayOfWeek } from '@/lib/types'

export interface TimesheetSubmitData {
  workerName: string
  clientName: string
  weekEnding: string
  shifts: import('@/lib/types').ShiftEntry[]
  totalHours: number
  totalAmount: number
  baseRate: number
}

export const DAY_MAP: Record<DayOfWeek, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
  thursday: 4, friday: 5, saturday: 6
}
