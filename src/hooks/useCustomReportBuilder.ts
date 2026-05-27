import { useState } from 'react'
import { toast } from 'sonner'
import { calculateMarginData, filterData, aggregateData } from '@/components/reports/report-utils'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { usePayrollCrud } from '@/hooks/use-payroll-crud'
import { useExpensesCrud } from '@/hooks/use-expenses-crud'
import type { Timesheet } from '@/lib/types'

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
  dateRange: { from: string; to: string }
  groupBy?: GroupByField
  metrics: string[]
  filters: ReportFilter[]
}

const DEFAULT_DATE_RANGE = {
  from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  to: new Date().toISOString().split('T')[0],
}

export const AVAILABLE_METRICS: Record<ReportType, string[]> = {
  timesheet: ['hours', 'amount', 'count'],
  invoice: ['amount', 'count'],
  payroll: ['totalAmount', 'workersCount'],
  expense: ['amount', 'count'],
  margin: ['revenue', 'costs', 'margin', 'marginPercentage'],
}

export const AVAILABLE_FILTERS: Record<ReportType, string[]> = {
  timesheet: ['status', 'workerName', 'clientName'],
  invoice: ['status', 'clientName', 'currency'],
  payroll: ['status'],
  expense: ['status', 'category', 'billable'],
  margin: ['period'],
}

/** Owns report config state and generates report results. */
export function useCustomReportBuilder(timesheets: Timesheet[]) {
  const { invoices } = useInvoicesCrud()
  const { payrollRuns } = usePayrollCrud()
  const { expenses } = useExpensesCrud()

  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '', type: 'timesheet',
    dateRange: DEFAULT_DATE_RANGE,
    groupBy: undefined, metrics: [], filters: [],
  })
  const [reportResult, setReportResult] = useState<unknown>(null)

  const generateReport = () => {
    if (!reportConfig.name) {
      toast.error('Please enter a report name'); return
    }
    if (reportConfig.metrics.length === 0) {
      toast.error('Please select at least one metric'); return
    }
    const dataMap: Record<ReportType, unknown[]> = {
      timesheet: timesheets, invoice: invoices,
      payroll: payrollRuns, expense: expenses,
      margin: calculateMarginData(invoices, payrollRuns),
    }
    const raw = filterData(dataMap[reportConfig.type], reportConfig)
    const aggregated = aggregateData(raw, reportConfig)
    setReportResult({
      name: reportConfig.name,
      generatedAt: new Date().toISOString(),
      totalRecords: raw.length, data: aggregated,
    })
    toast.success('Report generated successfully')
  }

  return {
    reportConfig, setReportConfig,
    reportResult, generateReport,
    availableMetrics: AVAILABLE_METRICS,
    availableFilters: AVAILABLE_FILTERS,
  }
}
