import type { ShiftPatternTemplate } from '@/lib/types'

export const DEFAULT_SHIFT_FORM: Partial<ShiftPatternTemplate> = {
  name: '',
  description: '',
  shiftType: 'night',
  isRecurring: true,
  defaultStartTime: '22:00',
  defaultEndTime: '06:00',
  defaultBreakMinutes: 30,
  daysOfWeek: [],
  rateMultiplier: 1.0,
}
