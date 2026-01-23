import { useMemo } from 'react'

export interface RateBreakdown {
  baseRate: number
  overtimeRate: number
  nightShiftPremium: number
  weekendPremium: number
  holidayPremium: number
  totalRate: number
}

export interface RateCalculationOptions {
  baseRate: number
  hours: number
  isOvertime?: boolean
  isNightShift?: boolean
  isWeekend?: boolean
  isHoliday?: boolean
  overtimeMultiplier?: number
  nightShiftMultiplier?: number
  weekendMultiplier?: number
  holidayMultiplier?: number
}

export function useRateCalculator() {
  const calculateRate = useMemo(() => {
    return (options: RateCalculationOptions): RateBreakdown => {
      const {
        baseRate,
        hours,
        isOvertime = false,
        isNightShift = false,
        isWeekend = false,
        isHoliday = false,
        overtimeMultiplier = 1.5,
        nightShiftMultiplier = 1.25,
        weekendMultiplier = 1.5,
        holidayMultiplier = 2.0,
      } = options

      let effectiveRate = baseRate
      const breakdown: RateBreakdown = {
        baseRate,
        overtimeRate: 0,
        nightShiftPremium: 0,
        weekendPremium: 0,
        holidayPremium: 0,
        totalRate: baseRate,
      }

      if (isOvertime) {
        breakdown.overtimeRate = baseRate * (overtimeMultiplier - 1)
        effectiveRate *= overtimeMultiplier
      }

      if (isNightShift) {
        breakdown.nightShiftPremium = baseRate * (nightShiftMultiplier - 1)
        effectiveRate *= nightShiftMultiplier
      }

      if (isWeekend) {
        breakdown.weekendPremium = baseRate * (weekendMultiplier - 1)
        effectiveRate *= weekendMultiplier
      }

      if (isHoliday) {
        breakdown.holidayPremium = baseRate * (holidayMultiplier - 1)
        effectiveRate *= holidayMultiplier
      }

      breakdown.totalRate = effectiveRate

      return breakdown
    }
  }, [])

  const calculateTotalAmount = useMemo(() => {
    return (options: RateCalculationOptions): number => {
      const breakdown = calculateRate(options)
      return breakdown.totalRate * options.hours
    }
  }, [calculateRate])

  const calculateMargin = useMemo(() => {
    return (chargeRate: number, payRate: number): number => {
      if (chargeRate === 0) return 0
      return ((chargeRate - payRate) / chargeRate) * 100
    }
  }, [])

  return {
    calculateRate,
    calculateTotalAmount,
    calculateMargin,
  }
}
