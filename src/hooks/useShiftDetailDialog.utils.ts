import type { ShiftType, DayOfWeek } from '@/lib/types'
import type { ShiftForm } from './useShiftDetailDialog.types'

const DAYS: DayOfWeek[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
]

export function makeDefaultForm(date?: string): ShiftForm {
  return {
    date: date || new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    breakMinutes: '30',
    shiftType: 'standard',
    notes: '',
  }
}

export function calcHours(startTime: string, endTime: string, breakMinutes: string): number {
  if (!startTime || !endTime) return 0
  const [sh, sm] = startTime.split(':').map(Number)
  const [eh, em] = endTime.split(':').map(Number)
  let start = sh * 60 + sm
  let end = eh * 60 + em
  if (end < start) end += 24 * 60
  return Number((Math.max(0, end - start - (parseInt(breakMinutes) || 0)) / 60).toFixed(2))
}

export function calcMultiplier(shiftType: ShiftType, date: string, startTime: string): number {
  const dayOfWeek = new Date(date).getDay()
  const [hour] = startTime.split(':').map(Number)
  if (shiftType === 'holiday') return 2.0
  if (shiftType === 'weekend' || dayOfWeek === 0 || dayOfWeek === 6) return 1.5
  if (shiftType === 'night' || hour >= 22 || hour < 6) return 1.3
  if (shiftType === 'evening' || (hour >= 18 && hour < 22)) return 1.2
  if (shiftType === 'early-morning' || (hour >= 6 && hour < 8)) return 1.1
  if (shiftType === 'overtime') return 1.5
  return 1.0
}

export function getDayOfWeek(date: string): DayOfWeek {
  return DAYS[new Date(date).getDay()]
}
