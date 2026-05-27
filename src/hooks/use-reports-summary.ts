import type { MarginAnalysis, ForecastData } from '@/lib/types'

export interface ReportsSummary {
  totalRevenue: number
  totalCosts: number
  totalMargin: number
  avgMarginPercentage: number
  monthOverMonthChange: number
  maxValue: number
}

export function deriveReportsSummary(
  marginAnalysis: MarginAnalysis[],
  forecast: ForecastData[]
): ReportsSummary {
  const totalRevenue = marginAnalysis.reduce((sum, m) => sum + m.revenue, 0)
  const totalCosts = marginAnalysis.reduce((sum, m) => sum + m.costs, 0)
  const totalMargin = totalRevenue - totalCosts
  const avgMarginPercentage =
    totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0
  const lastMonth = marginAnalysis[marginAnalysis.length - 1]
  const prevMonth = marginAnalysis[marginAnalysis.length - 2]
  const monthOverMonthChange = prevMonth
    ? ((lastMonth.marginPercentage - prevMonth.marginPercentage) /
        Math.abs(prevMonth.marginPercentage)) *
      100
    : 0
  const maxValue = Math.max(
    ...marginAnalysis.map((m) => Math.max(m.revenue, m.costs)),
    ...forecast.map((f) => Math.max(f.predictedRevenue, f.predictedCosts))
  )
  return {
    totalRevenue,
    totalCosts,
    totalMargin,
    avgMarginPercentage,
    monthOverMonthChange,
    maxValue,
  }
}
