import { useCallback } from 'react'
import type { MarginCalculation, PeriodComparison } from './use-margin-analysis.types'

type CalculateMarginForPeriod = (
  startDate: Date,
  endDate: Date,
  includeExpenses?: boolean
) => MarginCalculation

export function useMarginAnalysisForecast(
  calculateMarginForPeriod: CalculateMarginForPeriod
) {
  const comparePeriods = useCallback((
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date
  ): PeriodComparison => {
    const current = calculateMarginForPeriod(currentStart, currentEnd)
    const previous = calculateMarginForPeriod(previousStart, previousEnd)

    const revenueChange = current.revenue - previous.revenue
    const revenueChangePercentage =
      previous.revenue > 0 ? (revenueChange / previous.revenue) * 100 : 0

    const marginChange = current.grossMargin - previous.grossMargin
    const marginChangePercentage =
      previous.grossMargin > 0 ? (marginChange / previous.grossMargin) * 100 : 0

    return {
      current,
      previous,
      revenueChange,
      revenueChangePercentage,
      marginChange,
      marginChangePercentage
    }
  }, [calculateMarginForPeriod])

  const calculateBreakEvenPoint = useCallback((
    fixedCosts: number,
    avgMarginPercentage: number
  ): number => {
    if (avgMarginPercentage <= 0) return 0
    return fixedCosts / (avgMarginPercentage / 100)
  }, [])

  const forecastRevenue = useCallback((
    historicalMonths: number = 6,
    forecastMonths: number = 3
  ): number[] => {
    const now = new Date()
    const monthlyRevenue: number[] = []

    for (let i = historicalMonths - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      monthlyRevenue.push(calculateMarginForPeriod(startDate, endDate).revenue)
    }

    const avgRevenue =
      monthlyRevenue.reduce((sum, rev) => sum + rev, 0) / monthlyRevenue.length

    const trend =
      monthlyRevenue.length > 1
        ? (monthlyRevenue[monthlyRevenue.length - 1] - monthlyRevenue[0]) /
          monthlyRevenue.length
        : 0

    return Array.from({ length: forecastMonths }, (_, i) => avgRevenue + trend * (i + 1))
  }, [calculateMarginForPeriod])

  return { comparePeriods, calculateBreakEvenPoint, forecastRevenue }
}
