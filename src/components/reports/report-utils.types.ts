export type ReportType = 'timesheet' | 'invoice' | 'payroll' | 'expense' | 'margin'
export type GroupByField = 'worker' | 'client' | 'date' | 'status' | 'month' | 'week'

export interface ReportFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater' | 'less'
  value: string
}

export interface ReportConfig {
  name: string
  type: ReportType
  dateRange: {
    from: string
    to: string
  }
  groupBy?: GroupByField
  metrics: string[]
  filters: ReportFilter[]
}

export interface MetricAggregate {
  sum: number
  average: number
  count: number
  min: number
  max: number
}

export interface MarginDataPoint {
  period: string
  revenue: number
  costs: number
  margin: number
  marginPercentage: number
}
