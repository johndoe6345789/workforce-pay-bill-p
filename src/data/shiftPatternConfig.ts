import { Moon, Sun, CalendarBlank, Clock } from '@phosphor-icons/react'
import type { ShiftType, DayOfWeek } from '@/lib/types'

export const DAYS_OF_WEEK: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const SHIFT_TYPES: { value: ShiftType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'night', label: 'Night Shift', icon: Moon, color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  { value: 'weekend', label: 'Weekend', icon: CalendarBlank, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { value: 'evening', label: 'Evening', icon: Sun, color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
  { value: 'early-morning', label: 'Early Morning', icon: Sun, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  { value: 'standard', label: 'Standard', icon: Clock, color: 'bg-muted text-muted-foreground border-border' },
  { value: 'overtime', label: 'Overtime', icon: Clock, color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { value: 'holiday', label: 'Holiday', icon: CalendarBlank, color: 'bg-red-500/10 text-red-500 border-red-500/20' },
  { value: 'split-shift', label: 'Split Shift', icon: Clock, color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' },
]

export function getShiftTypeConfig(type: ShiftType) {
  return SHIFT_TYPES.find(st => st.value === type) ?? SHIFT_TYPES[4]
}

export function calculateHours(startTime: string, endTime: string, breakMinutes: number): number {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
  if (totalMinutes < 0) totalMinutes += 24 * 60
  return (totalMinutes - breakMinutes) / 60
}
