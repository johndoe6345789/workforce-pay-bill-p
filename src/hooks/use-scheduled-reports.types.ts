export type ReportType =
  | 'margin-analysis'
  | 'revenue-summary'
  | 'payroll-summary'
  | 'timesheet-summary'
  | 'expense-summary'
  | 'cash-flow'
  | 'compliance-status'
  | 'worker-utilization'

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly'
export type ReportFormat = 'csv' | 'excel' | 'pdf' | 'json'
export type ReportStatus = 'active' | 'paused' | 'failed'

export interface ScheduledReport {
  id: string
  name: string
  description?: string
  type: ReportType
  frequency: ReportFrequency
  format: ReportFormat
  status: ReportStatus
  recipients: string[]
  filters?: Record<string, unknown>
  nextRunDate: string
  lastRunDate?: string
  lastRunStatus?: 'success' | 'failed'
  lastRunError?: string
  createdAt: string
  createdBy: string
  runCount: number
}

export interface ReportExecution {
  id: string
  scheduleId: string
  scheduleName: string
  reportType: ReportType
  executedAt: string
  status: 'success' | 'failed'
  format: ReportFormat
  recordCount: number
  fileSize?: number
  error?: string
  downloadUrl?: string
}
