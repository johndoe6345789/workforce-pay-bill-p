import { useCallback } from 'react'
import type { Timesheet, ShiftEntry } from '@/lib/types'
import type { WorkingTimeAnalytics } from './use-time-tracking.types'

export function useTimeAnalysis(timesheets: Timesheet[]) {
  const analyzeWorkingTime = useCallback((
    workerId: string,
    startDate: Date,
    endDate: Date
  ): WorkingTimeAnalytics => {
    const workerTimesheets = timesheets.filter(ts => {
      if (ts.workerId !== workerId) return false
      const tsDate = new Date(ts.weekEnding)
      return tsDate >= startDate && tsDate <= endDate
    })
    const allShifts = workerTimesheets.flatMap(ts => ts.shifts || [])
    const totalHours = workerTimesheets.reduce((sum, ts) => sum + ts.hours, 0)
    const standardHours = allShifts.filter(s => s.shiftType === 'standard').reduce((sum, s) => sum + s.hours, 0)
    const overtimeHours = allShifts.filter(s => s.shiftType === 'overtime').reduce((sum, s) => sum + s.hours, 0)
    const weekendHours = allShifts.filter(s => s.shiftType === 'weekend').reduce((sum, s) => sum + s.hours, 0)
    const nightHours = allShifts.filter(s => s.shiftType === 'night').reduce((sum, s) => sum + s.hours, 0)
    const uniqueDates = new Set(allShifts.map(s => s.date))
    const daysWorked = uniqueDates.size
    const shiftHours = allShifts.map(s => s.hours)
    return {
      totalHours, standardHours, overtimeHours, weekendHours, nightHours,
      avgHoursPerDay: daysWorked > 0 ? totalHours / daysWorked : 0,
      daysWorked,
      longestShift: shiftHours.length > 0 ? Math.max(...shiftHours) : 0,
      shortestShift: shiftHours.length > 0 ? Math.min(...shiftHours) : 0,
    }
  }, [timesheets])

  const calculateOvertimeHours = useCallback((
    shifts: ShiftEntry[],
    standardHoursThreshold: number = 40
  ): { standard: number; overtime: number } => {
    const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0)
    return {
      standard: Math.min(totalHours, standardHoursThreshold),
      overtime: Math.max(0, totalHours - standardHoursThreshold)
    }
  }, [])

  return { analyzeWorkingTime, calculateOvertimeHours }
}
