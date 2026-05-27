import type { Timesheet, Invoice, Worker, ComplianceDocument, Expense, PayrollRun } from './types'
import { isValidEmail } from './type-guards.primitives'

export function isValidTimesheet(obj: unknown): obj is Timesheet {
  if (!obj || typeof obj !== 'object') return false

  const t = obj as Record<string, unknown>

  return (
    typeof t.id === 'string' &&
    typeof t.workerName === 'string' &&
    typeof t.clientName === 'string' &&
    typeof t.hours === 'number' &&
    typeof t.rate === 'number' &&
    typeof t.amount === 'number' &&
    typeof t.weekEnding === 'string' &&
    ['pending', 'approved', 'rejected', 'processing'].includes(t.status as string)
  )
}

export function isValidInvoice(obj: unknown): obj is Invoice {
  if (!obj || typeof obj !== 'object') return false

  const i = obj as Record<string, unknown>

  return (
    typeof i.id === 'string' &&
    typeof i.invoiceNumber === 'string' &&
    typeof i.clientName === 'string' &&
    typeof i.amount === 'number' &&
    typeof i.issueDate === 'string' &&
    typeof i.dueDate === 'string' &&
    ['draft', 'sent', 'paid', 'overdue', 'cancelled'].includes(i.status as string)
  )
}

export function isValidWorker(obj: unknown): obj is Worker {
  if (!obj || typeof obj !== 'object') return false

  const w = obj as Record<string, unknown>

  return (
    typeof w.id === 'string' &&
    typeof w.name === 'string' &&
    typeof w.email === 'string' &&
    isValidEmail(w.email)
  )
}

export function isValidComplianceDocument(obj: unknown): obj is ComplianceDocument {
  if (!obj || typeof obj !== 'object') return false

  const c = obj as Record<string, unknown>

  return (
    typeof c.id === 'string' &&
    typeof c.workerName === 'string' &&
    typeof c.documentType === 'string' &&
    typeof c.status === 'string' &&
    ['valid', 'expiring', 'expired', 'missing', 'pending'].includes(c.status as string)
  )
}

export function isValidExpense(obj: unknown): obj is Expense {
  if (!obj || typeof obj !== 'object') return false

  const e = obj as Record<string, unknown>

  return (
    typeof e.id === 'string' &&
    typeof e.workerName === 'string' &&
    typeof e.amount === 'number' &&
    typeof e.category === 'string' &&
    typeof e.date === 'string' &&
    ['pending', 'approved', 'rejected', 'reimbursed'].includes(e.status as string)
  )
}

export function isValidPayrollRun(obj: unknown): obj is PayrollRun {
  if (!obj || typeof obj !== 'object') return false

  const p = obj as Record<string, unknown>

  return (
    typeof p.id === 'string' &&
    typeof p.payPeriod === 'string' &&
    typeof p.totalAmount === 'number' &&
    typeof p.workerCount === 'number' &&
    ['draft', 'processing', 'completed', 'paid'].includes(p.status as string)
  )
}
