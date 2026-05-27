import type { MarginAnalysis, ForecastData, Invoice, PayrollRun } from '@/lib/types'

export function calculateMarginAnalysis(
  invoices: Invoice[],
  payrollRuns: PayrollRun[]
): MarginAnalysis[] {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return months
    .slice(0, new Date().getMonth() + 1)
    .map((month, index) => {
      const monthRevenue = invoices
        .filter((inv) => {
          const d = new Date(inv.issueDate)
          return d.getMonth() === index && d.getFullYear() === 2025
        })
        .reduce((sum, inv) => sum + inv.amount, 0)
      const monthCosts = payrollRuns
        .filter((pr) => {
          const d = new Date(pr.periodEnding)
          return d.getMonth() === index && d.getFullYear() === 2025
        })
        .reduce((sum, pr) => sum + pr.totalAmount, 0)
      const margin = monthRevenue - monthCosts
      return {
        period: month,
        revenue: monthRevenue,
        costs: monthCosts,
        margin,
        marginPercentage:
          monthRevenue > 0 ? (margin / monthRevenue) * 100 : 0,
      }
    })
}

export function generateForecast(
  historical: MarginAnalysis[]
): ForecastData[] {
  if (historical.length < 2) return []
  const avgRevenue =
    historical.reduce((sum, d) => sum + d.revenue, 0) / historical.length
  const avgCosts =
    historical.reduce((sum, d) => sum + d.costs, 0) / historical.length
  const revenueGrowthRate =
    historical[0].revenue > 0
      ? (historical[historical.length - 1].revenue - historical[0].revenue) /
        historical[0].revenue /
        historical.length
      : 0.05
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun']
  const currentMonth = new Date().getMonth()
  return months
    .slice(currentMonth + 1, currentMonth + 4)
    .map((month, index) => ({
      period: month,
      predictedRevenue: avgRevenue * (1 + revenueGrowthRate * (index + 1)),
      predictedCosts:
        avgCosts * (1 + revenueGrowthRate * 0.7 * (index + 1)),
      predictedMargin:
        avgRevenue * (1 + revenueGrowthRate * (index + 1)) -
        avgCosts * (1 + revenueGrowthRate * 0.7 * (index + 1)),
      confidence: Math.max(60, 95 - index * 10),
    }))
}
