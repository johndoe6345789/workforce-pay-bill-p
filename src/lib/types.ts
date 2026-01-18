export type TimesheetStatus = 'pending' | 'approved' | 'rejected' | 'processing'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
export type PayrollStatus = 'scheduled' | 'processing' | 'completed' | 'failed'
export type ComplianceStatus = 'valid' | 'expiring' | 'expired'
export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid'
export type NotificationType = 'timesheet' | 'invoice' | 'compliance' | 'expense' | 'payroll' | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Timesheet {
  id: string
  workerId: string
  workerName: string
  clientName: string
  weekEnding: string
  hours: number
  status: TimesheetStatus
  submittedDate: string
  approvedDate?: string
  amount: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  issueDate: string
  dueDate: string
  amount: number
  status: InvoiceStatus
  currency: string
}

export interface PayrollRun {
  id: string
  periodEnding: string
  workersCount: number
  totalAmount: number
  status: PayrollStatus
  processedDate?: string
}

export interface Worker {
  id: string
  name: string
  email: string
  type: 'employee' | 'contractor' | 'limited-company'
  status: 'active' | 'inactive'
  complianceStatus: ComplianceStatus
}

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

export interface ComplianceDocument {
  id: string
  workerId: string
  workerName: string
  documentType: string
  expiryDate: string
  status: ComplianceStatus
  daysUntilExpiry: number
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
