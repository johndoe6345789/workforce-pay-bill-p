import { useState, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Timesheet, ShiftEntry, ShiftType, DayOfWeek, RateCard } from '@/lib/types'

interface ShiftPremium {
  shiftType: ShiftType
  multiplier: number
  description: string
}

interface TimePattern {
  maxHoursPerDay: number
  maxHoursPerWeek: number
  maxConsecutiveDays: number
  minBreakMinutes: number
  minRestHours: number
}

interface TimesheetValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

interface WorkingTimeAnalytics {
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

interface ShiftCalculationOptions {
  rateCard?: RateCard
  baseRate?: number
  applyPremiums?: boolean
  roundToNearest?: number
}

const DEFAULT_SHIFT_PREMIUMS: ShiftPremium[] = [
  { shiftType: 'standard', multiplier: 1.0, description: 'Standard rate' },
  { shiftType: 'overtime', multiplier: 1.5, description: 'Time and a half' },
  { shiftType: 'weekend', multiplier: 1.5, description: 'Weekend premium' },
  { shiftType: 'night', multiplier: 1.33, description: 'Night shift premium' },
  { shiftType: 'holiday', multiplier: 2.0, description: 'Bank holiday rate' },
  { shiftType: 'evening', multiplier: 1.25, description: 'Evening premium' },
  { shiftType: 'early-morning', multiplier: 1.25, description: 'Early morning premium' },
  { shiftType: 'split-shift', multiplier: 1.15, description: 'Split shift premium' }
]

const DEFAULT_TIME_PATTERN: TimePattern = {
  maxHoursPerDay: 12,
  maxHoursPerWeek: 48,
  maxConsecutiveDays: 6,
  minBreakMinutes: 30,
  minRestHours: 11
}

export function useTimeTracking() {
  const [timesheets = [], setTimesheets] = useKV<Timesheet[]>('timesheets', [])
  const [rateCards = []] = useKV<RateCard[]>('rate-cards', [])
  const [shiftPremiums] = useState<ShiftPremium[]>(DEFAULT_SHIFT_PREMIUMS)

  const calculateShiftHours = useCallback((
    startTime: string,
    endTime: string,
    breakMinutes: number = 0
  ): number => {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)

    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
    
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }

    totalMinutes -= breakMinutes
    return Math.max(0, totalMinutes / 60)
  }, [])

  const determineShiftType = useCallback((
    startTime: string,
    dayOfWeek: DayOfWeek,
    isHoliday: boolean = false
  ): ShiftType => {
    if (isHoliday) return 'holiday'
    
    if (dayOfWeek === 'saturday' || dayOfWeek === 'sunday') {
      return 'weekend'
    }

    const hour = parseInt(startTime.split(':')[0])
    
    if (hour >= 22 || hour < 6) return 'night'
    if (hour >= 18) return 'evening'
    if (hour < 7) return 'early-morning'
    
    return 'standard'
  }, [])

  const getShiftMultiplier = useCallback((
    shiftType: ShiftType,
    rateCard?: RateCard
  ): number => {
    if (rateCard) {
      switch (shiftType) {
        case 'overtime': return rateCard.overtimeMultiplier
        case 'weekend': return rateCard.weekendMultiplier
        case 'night': return rateCard.nightMultiplier
        case 'holiday': return rateCard.holidayMultiplier
        default: return 1.0
      }
    }

    const premium = shiftPremiums.find(p => p.shiftType === shiftType)
    return premium?.multiplier || 1.0
  }, [shiftPremiums])

  const calculateShiftPay = useCallback((
    shift: Omit<ShiftEntry, 'id' | 'amount' | 'rateMultiplier'>,
    options: ShiftCalculationOptions = {}
  ): ShiftEntry => {
    const { rateCard, baseRate = 15, applyPremiums = true, roundToNearest = 0.25 } = options

    const hours = calculateShiftHours(shift.startTime, shift.endTime, shift.breakMinutes)
    const multiplier = applyPremiums ? getShiftMultiplier(shift.shiftType, rateCard) : 1.0
    const effectiveRate = (rateCard?.standardRate || baseRate) * multiplier
    
    let roundedHours = hours
    if (roundToNearest > 0) {
      roundedHours = Math.round(hours / roundToNearest) * roundToNearest
    }

    return {
      ...shift,
      id: `SHIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      hours: roundedHours,
      rate: effectiveRate,
      rateMultiplier: multiplier,
      amount: roundedHours * effectiveRate
    }
  }, [calculateShiftHours, getShiftMultiplier])

  const validateTimesheet = useCallback((
    timesheet: Timesheet,
    pattern: TimePattern = DEFAULT_TIME_PATTERN
  ): TimesheetValidationResult => {
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

    if (timesheet.amount <= 0) {
      errors.push('Timesheet amount must be greater than zero')
    }

    if (!timesheet.workerName || !timesheet.clientName) {
      errors.push('Worker name and client name are required')
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }, [])

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
    const standardHours = allShifts
      .filter(s => s.shiftType === 'standard')
      .reduce((sum, s) => sum + s.hours, 0)
    const overtimeHours = allShifts
      .filter(s => s.shiftType === 'overtime')
      .reduce((sum, s) => sum + s.hours, 0)
    const weekendHours = allShifts
      .filter(s => s.shiftType === 'weekend')
      .reduce((sum, s) => sum + s.hours, 0)
    const nightHours = allShifts
      .filter(s => s.shiftType === 'night')
      .reduce((sum, s) => sum + s.hours, 0)

    const uniqueDates = new Set(allShifts.map(s => s.date))
    const daysWorked = uniqueDates.size

    const shiftHours = allShifts.map(s => s.hours)
    const longestShift = shiftHours.length > 0 ? Math.max(...shiftHours) : 0
    const shortestShift = shiftHours.length > 0 ? Math.min(...shiftHours) : 0

    return {
      totalHours,
      standardHours,
      overtimeHours,
      weekendHours,
      nightHours,
      avgHoursPerDay: daysWorked > 0 ? totalHours / daysWorked : 0,
      daysWorked,
      longestShift,
      shortestShift
    }
  }, [timesheets])

  const createTimesheetFromShifts = useCallback((
    workerId: string,
    workerName: string,
    clientName: string,
    shifts: ShiftEntry[],
    weekEnding: string
  ): Timesheet => {
    const totalHours = shifts.reduce((sum, shift) => sum + shift.hours, 0)
    const totalAmount = shifts.reduce((sum, shift) => sum + shift.amount, 0)

    return {
      id: `TS-${Date.now()}`,
      workerId,
      workerName,
      clientName,
      weekEnding,
      hours: totalHours,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      amount: totalAmount,
      shifts
    }
  }, [])

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

  const findRateCard = useCallback((
    clientName?: string,
    role?: string
  ): RateCard | undefined => {
    return rateCards.find(rc => {
      if (clientName && rc.clientName !== clientName) return false
      if (role && rc.role !== role) return false
      
      const now = new Date()
      const effectiveFrom = new Date(rc.effectiveFrom)
      if (effectiveFrom > now) return false
      
      if (rc.effectiveTo) {
        const effectiveTo = new Date(rc.effectiveTo)
        if (effectiveTo < now) return false
      }
      
      return true
    })
  }, [rateCards])

  return {
    timesheets,
    shiftPremiums,
    calculateShiftHours,
    determineShiftType,
    getShiftMultiplier,
    calculateShiftPay,
    validateTimesheet,
    analyzeWorkingTime,
    createTimesheetFromShifts,
    calculateOvertimeHours,
    findRateCard
  }
}
