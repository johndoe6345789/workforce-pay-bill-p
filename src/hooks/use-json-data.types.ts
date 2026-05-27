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
