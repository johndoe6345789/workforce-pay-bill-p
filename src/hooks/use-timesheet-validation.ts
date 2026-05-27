import type { Timesheet, ShiftEntry } from '@/lib/types'
import type { TimePattern, TimesheetValidationResult } from './use-time-tracking.types'
import { DEFAULT_TIME_PATTERN } from './use-time-tracking.types'

export function validateTimesheet(
  timesheet: Timesheet,
  pattern: TimePattern = DEFAULT_TIME_PATTERN
): TimesheetValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (timesheet.hours > pattern.maxHoursPerWeek) {
    errors.push(`Total hours (${timesheet.hours}) exceeds maximum weekly hours (${pattern.maxHoursPerWeek})`)
  }

  if (timesheet.shifts && timesheet.shifts.length > 0) {
    const shiftsByDay = timesheet.shifts.reduce((acc, shift) => {
      if (!acc[shift.date]) acc[shift.date] = []
      acc[shift.date].push(shift)
      return acc
    }, {} as Record<string, ShiftEntry[]>)

    Object.entries(shiftsByDay).forEach(([date, shifts]) => {
      const dailyHours = shifts.reduce((sum, s) => sum + s.hours, 0)
      if (dailyHours > pattern.maxHoursPerDay) {
        errors.push(`Hours on ${date} (${dailyHours}) exceed maximum daily hours (${pattern.maxHoursPerDay})`)
      }
      if (dailyHours > 6) {
        const hasBreak = shifts.some(s => s.breakMinutes >= pattern.minBreakMinutes)
        if (!hasBreak) {
          warnings.push(`No adequate break recorded for ${date} (${dailyHours} hours worked)`)
        }
      }
    })

    const dates = Object.keys(shiftsByDay).sort()
    let consecutiveDays = 1
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1])
      const currDate = new Date(dates[i])
      const dayDiff = (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      if (dayDiff === 1) {
        consecutiveDays++
        if (consecutiveDays > pattern.maxConsecutiveDays) {
          errors.push(`More than ${pattern.maxConsecutiveDays} consecutive working days detected`)
          break
        }
      } else {
        consecutiveDays = 1
      }
    }
  }

  if (timesheet.amount <= 0) errors.push('Timesheet amount must be greater than zero')
  if (!timesheet.workerName || !timesheet.clientName) errors.push('Worker name and client name are required')

  return { isValid: errors.length === 0, errors, warnings }
}
