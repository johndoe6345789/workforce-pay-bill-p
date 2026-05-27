import type { Invoice, PayrollRun } from '@/lib/types'
import type { ReportConfig, MarginDataPoint, MetricAggregate } from './report-utils.types'

export type { ReportType, GroupByField, ReportFilter, ReportConfig, MetricAggregate, MarginDataPoint } from './report-utils.types'

export function calculateMarginData(invoices: Invoice[], payrollRuns: PayrollRun[]): MarginDataPoint[] {
  const grouped = new Map<string, { revenue: number; costs: number }>()

  invoices.forEach(inv => {
    const key = inv.issueDate.substring(0, 7)
    const existing = grouped.get(key) || { revenue: 0, costs: 0 }
    grouped.set(key, { ...existing, revenue: existing.revenue + inv.amount })
  })

  payrollRuns.forEach(pr => {
    const key = pr.periodEnding.substring(0, 7)
    const existing = grouped.get(key) || { revenue: 0, costs: 0 }
    grouped.set(key, { ...existing, costs: existing.costs + pr.totalAmount })
  })

  return Array.from(grouped.entries()).map(([period, data]) => ({
    period,
    revenue: data.revenue,
    costs: data.costs,
    margin: data.revenue - data.costs,
    marginPercentage: data.revenue > 0 ? ((data.revenue - data.costs) / data.revenue) * 100 : 0,
  }))
}

export function filterData(data: Record<string, unknown>[], reportConfig: ReportConfig) {
  return data.filter(item => {
    for (const filter of reportConfig.filters) {
      const value = item[filter.field]
      const filterValue = filter.value.toLowerCase()

      switch (filter.operator) {
        case 'equals':
          if (String(value).toLowerCase() !== filterValue) return false
          break
        case 'contains':
          if (!String(value).toLowerCase().includes(filterValue)) return false
          break
        case 'greater':
          if (Number(value) <= Number(filter.value)) return false
          break
        case 'less':
          if (Number(value) >= Number(filter.value)) return false
          break
      }
    }

    const itemDate = (item.weekEnding || item.issueDate || item.periodEnding || item.date) as string | undefined
    if (itemDate) {
      if (itemDate < reportConfig.dateRange.from || itemDate > reportConfig.dateRange.to) {
        return false
      }
    }

    return true
  })
}

export function aggregateData(data: Record<string, unknown>[], reportConfig: ReportConfig) {
  if (!reportConfig.groupBy) {
    const aggregated: Record<string, MetricAggregate> = {}
    reportConfig.metrics.forEach(metric => {
      const values = data.map(item => Number(item[metric]) || 0)
      aggregated[metric] = {
        sum: values.reduce((a, b) => a + b, 0),
        average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
        count: values.length,
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
      }
    })
    return [aggregated]
  }

  const groups = new Map<string, Record<string, unknown>[]>()
  data.forEach(item => {
    const key = String(item[reportConfig.groupBy!] || 'Unknown')
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(item)
  })

  return Array.from(groups.entries()).map(([key, items]) => {
    const row: Record<string, unknown> = { [reportConfig.groupBy!]: key }
    reportConfig.metrics.forEach(metric => {
      const values = items.map(item => Number(item[metric]) || 0)
      row[metric] = {
        sum: values.reduce((a, b) => a + b, 0),
        average: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0,
        count: values.length,
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
      }
    })
    return row
  })
}
