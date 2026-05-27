import type { ReportType, GroupByField } from '@/hooks/useCustomReportBuilder'

export const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: 'timesheet', label: 'Timesheets' },
  { value: 'invoice',   label: 'Invoices' },
  { value: 'payroll',   label: 'Payroll' },
  { value: 'expense',   label: 'Expenses' },
  { value: 'margin',    label: 'Margin Analysis' },
]

export const GROUP_BY_OPTIONS: { value: GroupByField | 'none'; label: string }[] = [
  { value: 'none',   label: 'None' },
  { value: 'worker', label: 'Worker' },
  { value: 'client', label: 'Client' },
  { value: 'status', label: 'Status' },
  { value: 'date',   label: 'Date' },
  { value: 'month',  label: 'Month' },
  { value: 'week',   label: 'Week' },
]

export const DATE_FIELDS: { id: string; label: string; key: 'from' | 'to' }[] = [
  { id: 'dateFrom', label: 'Date From', key: 'from' },
  { id: 'dateTo',   label: 'Date To',   key: 'to' },
]
