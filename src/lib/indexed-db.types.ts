export const DB_NAME = 'WorkForceProDB'
export const DB_VERSION = 4
export const SESSION_STORE = 'sessions'
export const APP_STATE_STORE = 'appState'
export const TIMESHEETS_STORE = 'timesheets'
export const INVOICES_STORE = 'invoices'
export const PAYROLL_RUNS_STORE = 'payrollRuns'
export const WORKERS_STORE = 'workers'
export const COMPLIANCE_DOCS_STORE = 'complianceDocs'
export const EXPENSES_STORE = 'expenses'
export const RATE_CARDS_STORE = 'rateCards'
export const PURCHASE_ORDERS_STORE = 'purchaseOrders'

export const STORES = {
  SESSIONS: SESSION_STORE,
  APP_STATE: APP_STATE_STORE,
  TIMESHEETS: TIMESHEETS_STORE,
  INVOICES: INVOICES_STORE,
  PAYROLL_RUNS: PAYROLL_RUNS_STORE,
  WORKERS: WORKERS_STORE,
  COMPLIANCE_DOCS: COMPLIANCE_DOCS_STORE,
  EXPENSES: EXPENSES_STORE,
  RATE_CARDS: RATE_CARDS_STORE,
  PURCHASE_ORDERS: PURCHASE_ORDERS_STORE,
} as const

export interface SessionData {
  id: string
  userId: string
  email: string
  name: string
  role: string
  roleId?: string
  avatarUrl?: string
  permissions?: string[]
  currentEntity: string
  loginTimestamp: number
  lastActivityTimestamp: number
  expiresAt?: number
}

export interface AppStateData {
  key: string
  value: unknown
  timestamp: number
}

export interface BaseEntity {
  id: string
  [key: string]: unknown
}
