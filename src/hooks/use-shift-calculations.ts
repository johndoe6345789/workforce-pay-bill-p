import { useCallback } from 'react'
import type { ShiftEntry, ShiftType, DayOfWeek, RateCard } from '@/lib/types'
import type { ShiftPremium, ShiftCalculationOptions } from './use-time-tracking.types'

export function useShiftCalculations(shiftPremiums: ShiftPremium[]) {
  const calculateShiftHours = useCallback((
    startTime: string,
    endTime: string,
    breakMinutes: number = 0
  ): number => {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
    if (totalMinutes < 0) totalMinutes += 24 * 60
    totalMinutes -= breakMinutes
    return Math.max(0, totalMinutes / 60)
  }, [])

  const determineShiftType = useCallback((
    startTime: string,
    dayOfWeek: DayOfWeek,
    isHoliday: boolean = false
  ): ShiftType => {
    if (isHoliday) return 'holiday'
    if (dayOfWeek === 'saturday' || dayOfWeek === 'sunday') return 'weekend'
    const hour = parseInt(startTime.split(':')[0])
    if (hour >= 22 || hour < 6) return 'night'
    if (hour >= 18) return 'evening'
    if (hour < 7) return 'early-morning'
    return 'standard'
  }, [])

  const getShiftMultiplier = useCallback((shiftType: ShiftType, rateCard?: RateCard): number => {
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
    const roundedHours = roundToNearest > 0
      ? Math.round(hours / roundToNearest) * roundToNearest
      : hours
    return {
      ...shift,
      id: `SHIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      hours: roundedHours,
      rate: effectiveRate,
      rateMultiplier: multiplier,
      amount: roundedHours * effectiveRate
    }
  }, [calculateShiftHours, getShiftMultiplier])

  return { calculateShiftHours, determineShiftType, getShiftMultiplier, calculateShiftPay }
}
