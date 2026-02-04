export type TimesheetStatus = 'pending' | 'approved' | 'rejected' | 'processing' | 'awaiting-client' | 'awaiting-manager'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'credit' | 'cancelled'
export type InvoiceType = 'timesheet' | 'permanent-placement' | 'credit-note' | 'adhoc'
export type ShiftType = 'standard' | 'overtime' | 'weekend' | 'night' | 'holiday' | 'evening' | 'early-morning' | 'split-shift'
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
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
  shifts?: ShiftEntry[]
  rateCardId?: string
  validationErrors?: string[]
}

export interface ShiftEntry {
  id: string
  date: string
  dayOfWeek: DayOfWeek
  shiftType: ShiftType
  startTime: string
  endTime: string
  breakMinutes: number
  hours: number
  rate: number
  rateMultiplier: number
  amount: number
  notes?: string
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
  type?: InvoiceType
  relatedInvoiceId?: string
  placementDetails?: PlacementDetails
}

export interface PlacementDetails {
  candidateName: string
  position: string
  startDate: string
  salary: number
  feePercentage: number
  guaranteePeriod: number
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

export interface RateCard {
  id: string
  name: string
  clientName?: string
  role?: string
  standardRate: number
  overtimeMultiplier: number
  weekendMultiplier: number
  nightMultiplier: number
  holidayMultiplier: number
  effectiveFrom: string
  effectiveTo?: string
  validationRules?: ValidationRule[]
}

export interface ValidationRule {
  id: string
  type: 'max-hours-per-day' | 'max-hours-per-week' | 'min-break' | 'max-consecutive-days'
  value: number
  severity: 'warning' | 'error'
  message: string
}

export interface CreditNote {
  id: string
  creditNoteNumber: string
  originalInvoiceId: string
  originalInvoiceNumber: string
  clientName: string
  issueDate: string
  amount: number
  reason: string
  status: 'draft' | 'issued' | 'applied'
  currency: string
}

export interface AuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: string
  entityType: 'timesheet' | 'invoice' | 'payroll' | 'worker' | 'expense' | 'rate-card'
  entityId: string
  changes: Record<string, { from: any; to: any }>
  ipAddress?: string
}

export interface ShiftPatternTemplate {
  id: string
  name: string
  description: string
  shiftType: ShiftType
  isRecurring: boolean
  recurrencePattern?: RecurrencePattern
  defaultStartTime: string
  defaultEndTime: string
  defaultBreakMinutes: number
  daysOfWeek: DayOfWeek[]
  rateMultiplier: number
  createdDate: string
  lastUsedDate?: string
  usageCount: number
}

export interface RecurrencePattern {
  frequency: 'weekly' | 'fortnightly' | 'monthly' | 'custom'
  interval?: number
  endDate?: string
  excludeDates?: string[]
}

export type PurchaseOrderStatus = 'active' | 'expired' | 'fulfilled' | 'cancelled' | 'expiring-soon'

export interface PurchaseOrder {
  id: string
  poNumber: string
  clientId: string
  clientName: string
  issueDate: string
  expiryDate?: string
  totalValue: number
  remainingValue: number
  utilisedValue: number
  status: PurchaseOrderStatus
  currency: string
  linkedInvoices: LinkedInvoice[]
  notes?: string
  approvedBy?: string
  approvedDate?: string
  createdBy: string
  createdDate: string
  lastModifiedDate: string
  attachmentUrls?: string[]
  tags?: string[]
}

export interface LinkedInvoice {
  invoiceId: string
  invoiceNumber: string
  amount: number
  linkedDate: string
  linkedBy: string
}

export interface NewNotification {
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  relatedId?: string
}

export interface AppActions {
  handleApproveTimesheet: (id: string) => void
  handleRejectTimesheet: (id: string) => void
  handleAdjustTimesheet: (id: string, adjustmentData: TimesheetAdjustment) => void
  handleCreateInvoice: (timesheetId: string) => void
  handleCreateTimesheet: (data: {
    workerName: string
    clientName: string
    hours: number
    rate: number
    weekEnding: string
  }) => void
  handleCreateDetailedTimesheet: (data: {
    workerName: string
    clientName: string
    weekEnding: string
    shifts: ShiftEntry[]
    totalHours: number
    totalAmount: number
    baseRate: number
  }) => void
  handleBulkImport: (csvData: string) => void
  handleSendInvoice: (invoiceId: string) => void
  handleUploadDocument: (data: {
    workerId: string
    workerName: string
    documentType: string
    expiryDate: string
  }) => void
  handleCreateExpense: (data: {
    workerName: string
    clientName: string
    date: string
    category: string
    description: string
    amount: number
    billable: boolean
  }) => void
  handleApproveExpense: (id: string) => void
  handleRejectExpense: (id: string) => void
  handleCreatePlacementInvoice: (invoice: Invoice) => void
  handleCreateCreditNote: (creditNote: CreditNote, creditInvoice: Invoice) => void
}
