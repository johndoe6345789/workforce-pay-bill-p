import {
  DB_NAME,
  DB_VERSION,
  SESSION_STORE,
  APP_STATE_STORE,
  TIMESHEETS_STORE,
  INVOICES_STORE,
  PAYROLL_RUNS_STORE,
  WORKERS_STORE,
  COMPLIANCE_DOCS_STORE,
  EXPENSES_STORE,
  RATE_CARDS_STORE,
  PURCHASE_ORDERS_STORE,
} from './indexed-db.types'

function setupStores(db: IDBDatabase): void {
  if (!db.objectStoreNames.contains(SESSION_STORE)) {
    const s = db.createObjectStore(SESSION_STORE, { keyPath: 'id' })
    s.createIndex('userId', 'userId', { unique: false })
    s.createIndex('lastActivityTimestamp', 'lastActivityTimestamp', { unique: false })
  }

  if (!db.objectStoreNames.contains(APP_STATE_STORE)) {
    db.createObjectStore(APP_STATE_STORE, { keyPath: 'key' })
  }

  if (!db.objectStoreNames.contains(TIMESHEETS_STORE)) {
    const s = db.createObjectStore(TIMESHEETS_STORE, { keyPath: 'id' })
    s.createIndex('workerId', 'workerId', { unique: false })
    s.createIndex('status', 'status', { unique: false })
    s.createIndex('weekEnding', 'weekEnding', { unique: false })
  }

  if (!db.objectStoreNames.contains(INVOICES_STORE)) {
    const s = db.createObjectStore(INVOICES_STORE, { keyPath: 'id' })
    s.createIndex('clientId', 'clientId', { unique: false })
    s.createIndex('status', 'status', { unique: false })
    s.createIndex('invoiceDate', 'invoiceDate', { unique: false })
  }

  if (!db.objectStoreNames.contains(PAYROLL_RUNS_STORE)) {
    const s = db.createObjectStore(PAYROLL_RUNS_STORE, { keyPath: 'id' })
    s.createIndex('status', 'status', { unique: false })
    s.createIndex('periodEnding', 'periodEnding', { unique: false })
  }

  if (!db.objectStoreNames.contains(WORKERS_STORE)) {
    const s = db.createObjectStore(WORKERS_STORE, { keyPath: 'id' })
    s.createIndex('status', 'status', { unique: false })
    s.createIndex('email', 'email', { unique: false })
  }

  if (!db.objectStoreNames.contains(COMPLIANCE_DOCS_STORE)) {
    const s = db.createObjectStore(COMPLIANCE_DOCS_STORE, { keyPath: 'id' })
    s.createIndex('workerId', 'workerId', { unique: false })
    s.createIndex('status', 'status', { unique: false })
    s.createIndex('expiryDate', 'expiryDate', { unique: false })
  }

  if (!db.objectStoreNames.contains(EXPENSES_STORE)) {
    const s = db.createObjectStore(EXPENSES_STORE, { keyPath: 'id' })
    s.createIndex('workerId', 'workerId', { unique: false })
    s.createIndex('status', 'status', { unique: false })
    s.createIndex('date', 'date', { unique: false })
  }

  if (!db.objectStoreNames.contains(RATE_CARDS_STORE)) {
    const s = db.createObjectStore(RATE_CARDS_STORE, { keyPath: 'id' })
    s.createIndex('clientId', 'clientId', { unique: false })
    s.createIndex('role', 'role', { unique: false })
  }

  if (!db.objectStoreNames.contains(PURCHASE_ORDERS_STORE)) {
    const s = db.createObjectStore(PURCHASE_ORDERS_STORE, { keyPath: 'id' })
    s.createIndex('poNumber', 'poNumber', { unique: false })
    s.createIndex('clientId', 'clientId', { unique: false })
    s.createIndex('status', 'status', { unique: false })
    s.createIndex('issueDate', 'issueDate', { unique: false })
    s.createIndex('expiryDate', 'expiryDate', { unique: false })
  }
}

export function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(new Error('Failed to open IndexedDB'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      setupStores((event.target as IDBOpenDBRequest).result)
    }
  })
}
