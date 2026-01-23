import { useState, useEffect } from 'react'
import appData from '@/data/app-data.json'

export interface Shift {
  date: string
  start: string
  end: string
  hours: number
  type: string
}

export interface Timesheet {
  id: string
  workerId: string
  workerName: string
  clientName: string
  weekEnding: string
  totalHours: number
  regularHours: number
  overtimeHours: number
  status: string
  rate: number
  total: number
  submittedDate: string
  approvedDate?: string
  shifts: Shift[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Invoice {
  id: string
  clientName: string
  amount: number
  vat: number
  total: number
  status: string
  dueDate: string
  invoiceDate: string
  paidDate?: string
  items: InvoiceItem[]
}

export interface PayrollEntry {
  workerId: string
  workerName: string
  gross: number
  net: number
  tax: number
  ni: number
}

export interface PayrollRun {
  id: string
  periodEnding: string
  status: string
  totalGross: number
  totalNet: number
  totalTax: number
  totalNI: number
  processedDate?: string
  paymentDate?: string
  workerCount: number
  entries: PayrollEntry[]
}

export interface Worker {
  id: string
  name: string
  email: string
  phone: string
  status: string
  role: string
  startDate: string
  paymentType: string
  currentClient: string
}

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

export function useJsonData() {
  const [data, setData] = useState<AppData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      setData(appData as AppData)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load data'))
      setIsLoading(false)
    }
  }, [])

  return { data, isLoading, error }
}
