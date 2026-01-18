export type TimesheetStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'awaiting-client' | 'awaiting-manager'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'
export type PayrollStatus = 'scheduled' | 'processing' | 'completed' | 'failed'
export type ComplianceStatus = 'valid' | 'expiring' | 'expired'
export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'paid'
export type NotificationType = 'timesheet' | 'invoice' | 'compliance' | 'expense' | 'payroll' | 'system'
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'
export type SubmissionMethod = 'web' | 'mobile' | 'qr-scan' | 'email' | 'bulk-import'
export type ApprovalStep = 'manager' | 'client' | 'finance' | 'final'

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
  submissionMethod?: SubmissionMethod
  approvalHistory?: ApprovalHistoryEntry[]
  currentApprovalStep?: ApprovalStep
  rate?: number
  adjustments?: TimesheetAdjustment[]
}

export interface ApprovalHistoryEntry {
  step: ApprovalStep
  approverName: string
  approverEmail: string
  status: 'pending' | 'approved' | 'rejected'
  timestamp: string
  notes?: string
}

export interface TimesheetAdjustment {
  id: string
  adjustmentDate: string
  adjustedBy: string
  previousHours: number
  newHours: number
  previousRate?: number
  newRate?: number
  reason: string
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
  template?: string
  lineItems?: InvoiceLineItem[]
  notes?: string
  paymentTerms?: string
}

export interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
  timesheetId?: string
}

export interface InvoiceTemplate {
  id: string
  name: string
  headerText: string
  footerText: string
  defaultPaymentTerms: string
  logoUrl?: string
  accentColor: string
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

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  type: NotificationType
  variables: string[]
}

export interface QRTimesheetData {
  workerId: string
  workerName: string
  clientName: string
  weekEnding: string
  hours: number
  rate: number
  signature?: string
}
