import type { Timesheet, Invoice, Worker, ComplianceDocument, Expense, PayrollRun } from './types'

export function isNotNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}

export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime())
}

export function isValidDateString(dateString: unknown): dateString is string {
  if (typeof dateString !== 'string') return false
  const date = new Date(dateString)
  return isValidDate(date)
}

export function isValidEmail(email: unknown): email is string {
  if (typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: unknown): phone is string {
  if (typeof phone !== 'string') return false
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone)
}

export function isValidURL(url: unknown): url is string {
  if (typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && value > 0 && isFinite(value)
}

export function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === 'number' && value >= 0 && isFinite(value)
}

export function isValidCurrency(currency: unknown): currency is string {
  if (typeof currency !== 'string') return false
  return /^[A-Z]{3}$/.test(currency)
}

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

export function isValidPermission(permission: unknown): permission is string {
  if (typeof permission !== 'string') return false
  
  const validPermissions = [
    'view:dashboard',
    'view:timesheets',
    'create:timesheets',
    'approve:timesheets',
    'view:billing',
    'create:invoices',
    'view:payroll',
    'process:payroll',
    'view:compliance',
    'manage:compliance',
    'view:expenses',
    'approve:expenses',
    'view:reports',
    'export:reports',
    'manage:users',
    'manage:settings',
    'view:audit-trail',
    'manage:permissions',
  ]
  
  return validPermissions.includes(permission)
}

export function isValidRole(role: unknown): role is string {
  if (typeof role !== 'string') return false
  
  const validRoles = [
    'super-admin',
    'admin',
    'manager',
    'accountant',
    'hr',
    'worker',
    'client',
  ]
  
  return validRoles.includes(role)
}

export function isValidStatus<T extends string>(
  value: unknown,
  validStatuses: readonly T[]
): value is T {
  return typeof value === 'string' && (validStatuses as readonly string[]).includes(value)
}

export function isArrayOf<T>(
  arr: unknown,
  typeGuard: (item: unknown) => item is T
): arr is T[] {
  return Array.isArray(arr) && arr.every(typeGuard)
}

export function isRecordOf<T>(
  obj: unknown,
  valueGuard: (value: unknown) => value is T
): obj is Record<string, T> {
  if (!obj || typeof obj !== 'object') return false
  
  return Object.values(obj).every(valueGuard)
}

export function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return obj !== null && typeof obj === 'object' && key in obj
}

export function hasProperties<K extends string>(
  obj: unknown,
  keys: K[]
): obj is Record<K, unknown> {
  return obj !== null && typeof obj === 'object' && keys.every(key => key in obj)
}
