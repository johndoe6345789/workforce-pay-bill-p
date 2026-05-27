import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Timesheet, ShiftEntry, RateCard } from '@/lib/types'
import { DEFAULT_SHIFT_PREMIUMS } from './use-time-tracking.types'
import type { ShiftPremium, TimePattern } from './use-time-tracking.types'
import { useShiftCalculations } from './use-shift-calculations'
import { validateTimesheet as validateTimesheetFn } from './use-timesheet-validation'
import { useTimeAnalysis } from './use-time-analysis'

export type { ShiftPremium, TimePattern, TimesheetValidationResult, WorkingTimeAnalytics, ShiftCalculationOptions } from './use-time-tracking.types'

export function useTimeTracking() {
  const [timesheets = [], setTimesheets] = useKV<Timesheet[]>('timesheets', [])
  const [rateCards = []] = useKV<RateCard[]>('rate-cards', [])
  const [shiftPremiums] = useState<ShiftPremium[]>(DEFAULT_SHIFT_PREMIUMS)

  const { calculateShiftHours, determineShiftType, getShiftMultiplier, calculateShiftPay } = useShiftCalculations(shiftPremiums)
  const { analyzeWorkingTime, calculateOvertimeHours } = useTimeAnalysis(timesheets)

  const validateTimesheet = useCallback(
    (ts: Timesheet, pattern?: TimePattern) => validateTimesheetFn(ts, pattern),
    []
  )

  const createTimesheetFromShifts = useCallback((
    workerId: string,
    workerName: string,
    clientName: string,
    shifts: ShiftEntry[],
    weekEnding: string
  ): Timesheet => {
    return {
      id: `TS-${Date.now()}`,
      workerId,
      workerName,
      clientName,
      weekEnding,
      hours: shifts.reduce((sum, s) => sum + s.hours, 0),
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: shifts.reduce((sum, s) => sum + s.amount, 0),
      shifts
    }
  }, [])

  const findRateCard = useCallback((clientName?: string, role?: string): RateCard | undefined => {
    return rateCards.find(rc => {
      if (clientName && rc.clientName !== clientName) return false
      if (role && rc.role !== role) return false
      const now = new Date()
      const effectiveFrom = new Date(rc.effectiveFrom)
      if (effectiveFrom > now) return false
      if (rc.effectiveTo && new Date(rc.effectiveTo) < now) return false
      return true
    })
  }, [rateCards])

  return {
    timesheets, shiftPremiums,
    calculateShiftHours, determineShiftType, getShiftMultiplier, calculateShiftPay,
    validateTimesheet, analyzeWorkingTime, createTimesheetFromShifts,
    calculateOvertimeHours, findRateCard,
  }
}
