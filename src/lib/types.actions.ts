import type { TimesheetAdjustment, ShiftEntry } from './types.timesheet'
import type { Invoice, CreditNote } from './types.invoice'

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
