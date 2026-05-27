import type {
  Timesheet,
  Invoice,
  PayrollRun,
  Worker,
} from './use-json-data.types'

export interface ComplianceDoc {
  id: string
  workerId: string
  workerName: string
  documentType: string
  status: string
  expiryDate: string
  uploadDate: string
  verifiedDate: string
}

export interface Expense {
  id: string
  workerId: string
  workerName: string
  category: string
  amount: number
  date: string
  status: string
  description: string
  receiptAttached: boolean
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
}

export interface RateCard {
  id: string
  role: string
  clientName: string
  payRate: number
  chargeRate: number
  margin: number
  marginPercent: number
  currency: string
  validFrom: string
  validUntil: string
  overtimeMultiplier: number
  weekendMultiplier: number
  nightMultiplier?: number
}

export interface Client {
  id: string
  name: string
  industry: string
  status: string
  creditLimit: number
  outstandingBalance: number
  paymentTerms: number
  activeWorkers: number
  address: string
}

export interface AppData {
  timesheets: Timesheet[]
  invoices: Invoice[]
  payrollRuns: PayrollRun[]
  workers: Worker[]
  complianceDocs: ComplianceDoc[]
  expenses: Expense[]
  rateCards: RateCard[]
  clients: Client[]
}
