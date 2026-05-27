export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid'
export type NotificationType = 'timesheet' | 'invoice' | 'compliance' | 'expense' | 'payroll' | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface DashboardMetrics {
  pendingTimesheets: number
  pendingApprovals: number
  overdueInvoices: number
  complianceAlerts: number
  monthlyRevenue: number
  monthlyPayroll: number
  grossMargin: number
  activeWorkers: number
  pendingExpenses: number
}

export interface Expense {
  id: string
  workerId: string
  workerName: string
  clientName: string
  date: string
  category: string
  description: string
  amount: number
  currency: string
  status: ExpenseStatus
  receiptUrl?: string
  submittedDate: string
  approvedDate?: string
  billable: boolean
}

export interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  relatedId?: string
}

export interface NewNotification {
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  relatedId?: string
}

export interface MarginAnalysis {
  period: string
  revenue: number
  costs: number
  margin: number
  marginPercentage: number
}

export interface ForecastData {
  period: string
  predictedRevenue: number
  predictedCosts: number
  predictedMargin: number
  confidence: number
}

export interface CurrencyRate {
  code: string
  name: string
  symbol: string
  rateToGBP: number
  lastUpdated: string
}

export interface MissingTimesheetReport {
  workerId: string
  workerName: string
  clientName: string
  expectedWeekEnding: string
  daysOverdue: number
  lastSubmissionDate?: string
}
