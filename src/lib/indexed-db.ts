const DB_NAME = 'WorkForceProDB'
const DB_VERSION = 3
const SESSION_STORE = 'sessions'
const APP_STATE_STORE = 'appState'
const TIMESHEETS_STORE = 'timesheets'
const INVOICES_STORE = 'invoices'
const PAYROLL_RUNS_STORE = 'payrollRuns'
const WORKERS_STORE = 'workers'
const COMPLIANCE_DOCS_STORE = 'complianceDocs'
const EXPENSES_STORE = 'expenses'
const RATE_CARDS_STORE = 'rateCards'

interface SessionData {
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

interface AppStateData {
  key: string
  value: unknown
  timestamp: number
}

interface BaseEntity {
  id: string
  [key: string]: any
}

class IndexedDBManager {
  private db: IDBDatabase | null = null
  private initPromise: Promise<void> | null = null

  async init(): Promise<void> {
    if (this.db) return
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'))
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        if (!db.objectStoreNames.contains(SESSION_STORE)) {
          const sessionStore = db.createObjectStore(SESSION_STORE, { keyPath: 'id' })
          sessionStore.createIndex('userId', 'userId', { unique: false })
          sessionStore.createIndex('lastActivityTimestamp', 'lastActivityTimestamp', { unique: false })
        }

        if (!db.objectStoreNames.contains(APP_STATE_STORE)) {
          db.createObjectStore(APP_STATE_STORE, { keyPath: 'key' })
        }

        if (!db.objectStoreNames.contains(TIMESHEETS_STORE)) {
          const timesheetsStore = db.createObjectStore(TIMESHEETS_STORE, { keyPath: 'id' })
          timesheetsStore.createIndex('workerId', 'workerId', { unique: false })
          timesheetsStore.createIndex('status', 'status', { unique: false })
          timesheetsStore.createIndex('weekEnding', 'weekEnding', { unique: false })
        }

        if (!db.objectStoreNames.contains(INVOICES_STORE)) {
          const invoicesStore = db.createObjectStore(INVOICES_STORE, { keyPath: 'id' })
          invoicesStore.createIndex('clientId', 'clientId', { unique: false })
          invoicesStore.createIndex('status', 'status', { unique: false })
          invoicesStore.createIndex('invoiceDate', 'invoiceDate', { unique: false })
        }

        if (!db.objectStoreNames.contains(PAYROLL_RUNS_STORE)) {
          const payrollStore = db.createObjectStore(PAYROLL_RUNS_STORE, { keyPath: 'id' })
          payrollStore.createIndex('status', 'status', { unique: false })
          payrollStore.createIndex('periodEnding', 'periodEnding', { unique: false })
        }

        if (!db.objectStoreNames.contains(WORKERS_STORE)) {
          const workersStore = db.createObjectStore(WORKERS_STORE, { keyPath: 'id' })
          workersStore.createIndex('status', 'status', { unique: false })
          workersStore.createIndex('email', 'email', { unique: false })
        }

        if (!db.objectStoreNames.contains(COMPLIANCE_DOCS_STORE)) {
          const complianceStore = db.createObjectStore(COMPLIANCE_DOCS_STORE, { keyPath: 'id' })
          complianceStore.createIndex('workerId', 'workerId', { unique: false })
          complianceStore.createIndex('status', 'status', { unique: false })
          complianceStore.createIndex('expiryDate', 'expiryDate', { unique: false })
        }

        if (!db.objectStoreNames.contains(EXPENSES_STORE)) {
          const expensesStore = db.createObjectStore(EXPENSES_STORE, { keyPath: 'id' })
          expensesStore.createIndex('workerId', 'workerId', { unique: false })
          expensesStore.createIndex('status', 'status', { unique: false })
          expensesStore.createIndex('date', 'date', { unique: false })
        }

        if (!db.objectStoreNames.contains(RATE_CARDS_STORE)) {
          const rateCardsStore = db.createObjectStore(RATE_CARDS_STORE, { keyPath: 'id' })
          rateCardsStore.createIndex('clientId', 'clientId', { unique: false })
          rateCardsStore.createIndex('role', 'role', { unique: false })
        }
      }
    })

    return this.initPromise
  }

  private async ensureDb(): Promise<IDBDatabase> {
    await this.init()
    if (!this.db) {
      throw new Error('Database not initialized')
    }
    return this.db
  }

  async saveSession(sessionData: Omit<SessionData, 'id' | 'loginTimestamp' | 'lastActivityTimestamp'>): Promise<string> {
    const db = await this.ensureDb()
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    const fullSessionData: SessionData = {
      ...sessionData,
      id: sessionId,
      loginTimestamp: Date.now(),
      lastActivityTimestamp: Date.now(),
      expiresAt: sessionData.expiresAt || Date.now() + (24 * 60 * 60 * 1000)
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readwrite')
      const store = transaction.objectStore(SESSION_STORE)
      const request = store.put(fullSessionData)

      request.onsuccess = () => resolve(sessionId)
      request.onerror = () => reject(new Error('Failed to save session'))
    })
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readonly')
      const store = transaction.objectStore(SESSION_STORE)
      const request = store.get(sessionId)

      request.onsuccess = () => {
        const session = request.result as SessionData | undefined
        if (session && session.expiresAt && session.expiresAt < Date.now()) {
          this.deleteSession(sessionId)
          resolve(null)
        } else {
          resolve(session || null)
        }
      }
      request.onerror = () => reject(new Error('Failed to get session'))
    })
  }

  async getCurrentSession(): Promise<SessionData | null> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readonly')
      const store = transaction.objectStore(SESSION_STORE)
      const index = store.index('lastActivityTimestamp')
      const request = index.openCursor(null, 'prev')

      request.onsuccess = () => {
        const cursor = request.result
        if (cursor) {
          const session = cursor.value as SessionData
          if (session.expiresAt && session.expiresAt < Date.now()) {
            this.deleteSession(session.id)
            resolve(null)
          } else {
            resolve(session)
          }
        } else {
          resolve(null)
        }
      }
      request.onerror = () => reject(new Error('Failed to get current session'))
    })
  }

  async updateSessionActivity(sessionId: string): Promise<void> {
    const db = await this.ensureDb()
    const session = await this.getSession(sessionId)
    
    if (!session) return

    session.lastActivityTimestamp = Date.now()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readwrite')
      const store = transaction.objectStore(SESSION_STORE)
      const request = store.put(session)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to update session activity'))
    })
  }

  async deleteSession(sessionId: string): Promise<void> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readwrite')
      const store = transaction.objectStore(SESSION_STORE)
      const request = store.delete(sessionId)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete session'))
    })
  }

  async getAllSessions(): Promise<SessionData[]> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readonly')
      const store = transaction.objectStore(SESSION_STORE)
      const request = store.getAll()

      request.onsuccess = () => {
        const sessions = request.result as SessionData[]
        const validSessions = sessions.filter(s => !s.expiresAt || s.expiresAt >= Date.now())
        
        const expiredSessions = sessions.filter(s => s.expiresAt && s.expiresAt < Date.now())
        expiredSessions.forEach(s => this.deleteSession(s.id))
        
        resolve(validSessions)
      }
      request.onerror = () => reject(new Error('Failed to get all sessions'))
    })
  }

  async clearAllSessions(): Promise<void> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SESSION_STORE], 'readwrite')
      const store = transaction.objectStore(SESSION_STORE)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to clear sessions'))
    })
  }

  async saveAppState<T>(key: string, value: T): Promise<void> {
    const db = await this.ensureDb()
    
    const stateData: AppStateData = {
      key,
      value,
      timestamp: Date.now()
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([APP_STATE_STORE], 'readwrite')
      const store = transaction.objectStore(APP_STATE_STORE)
      const request = store.put(stateData)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to save app state'))
    })
  }

  async getAppState<T>(key: string): Promise<T | null> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([APP_STATE_STORE], 'readonly')
      const store = transaction.objectStore(APP_STATE_STORE)
      const request = store.get(key)

      request.onsuccess = () => {
        const data = request.result as AppStateData | undefined
        resolve(data ? (data.value as T) : null)
      }
      request.onerror = () => reject(new Error('Failed to get app state'))
    })
  }

  async deleteAppState(key: string): Promise<void> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([APP_STATE_STORE], 'readwrite')
      const store = transaction.objectStore(APP_STATE_STORE)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to delete app state'))
    })
  }

  async clearAppState(): Promise<void> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([APP_STATE_STORE], 'readwrite')
      const store = transaction.objectStore(APP_STATE_STORE)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(new Error('Failed to clear app state'))
    })
  }

  async close(): Promise<void> {
    if (this.db) {
      this.db.close()
      this.db = null
      this.initPromise = null
    }
  }

  async create<T extends BaseEntity>(storeName: string, entity: T): Promise<T> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.add(entity)

        request.onsuccess = () => resolve(entity)
        request.onerror = () => reject(new Error(`Failed to create entity in ${storeName}`))
      } catch (error) {
        reject(error)
      }
    })
  }

  async read<T extends BaseEntity>(storeName: string, id: string): Promise<T | null> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.get(id)

        request.onsuccess = () => resolve(request.result || null)
        request.onerror = () => reject(new Error(`Failed to read entity from ${storeName}`))
      } catch (error) {
        reject(error)
      }
    })
  }

  async readAll<T extends BaseEntity>(storeName: string): Promise<T[]> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const request = store.getAll()

        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(new Error(`Failed to read all entities from ${storeName}`))
      } catch (error) {
        reject(error)
      }
    })
  }

  async readByIndex<T extends BaseEntity>(
    storeName: string, 
    indexName: string, 
    value: any
  ): Promise<T[]> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readonly')
        const store = transaction.objectStore(storeName)
        const index = store.index(indexName)
        const request = index.getAll(value)

        request.onsuccess = () => resolve(request.result || [])
        request.onerror = () => reject(new Error(`Failed to read entities by index from ${storeName}`))
      } catch (error) {
        reject(error)
      }
    })
  }

  async update<T extends BaseEntity>(storeName: string, entity: T): Promise<T> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.put(entity)

        request.onsuccess = () => resolve(entity)
        request.onerror = () => reject(new Error(`Failed to update entity in ${storeName}`))
      } catch (error) {
        reject(error)
      }
    })
  }

  async delete(storeName: string, id: string): Promise<void> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.delete(id)

        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error(`Failed to delete entity from ${storeName}`))
      } catch (error) {
        reject(error)
      }
    })
  }

  async deleteAll(storeName: string): Promise<void> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        const request = store.clear()

        request.onsuccess = () => resolve()
        request.onerror = () => reject(new Error(`Failed to clear store ${storeName}`))
      } catch (error) {
        reject(error)
      }
    })
  }

  async bulkCreate<T extends BaseEntity>(storeName: string, entities: T[]): Promise<T[]> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        let completed = 0
        const errors: Error[] = []

        entities.forEach(entity => {
          const request = store.add(entity)
          request.onsuccess = () => {
            completed++
            if (completed === entities.length) {
              if (errors.length > 0) {
                reject(new Error(`Failed to create ${errors.length} entities in ${storeName}`))
              } else {
                resolve(entities)
              }
            }
          }
          request.onerror = () => {
            errors.push(new Error(`Failed to create entity with id ${entity.id}`))
            completed++
            if (completed === entities.length) {
              reject(new Error(`Failed to create ${errors.length} entities in ${storeName}`))
            }
          }
        })

        if (entities.length === 0) {
          resolve([])
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async bulkUpdate<T extends BaseEntity>(storeName: string, entities: T[]): Promise<T[]> {
    const db = await this.ensureDb()

    return new Promise((resolve, reject) => {
      try {
        const transaction = db.transaction([storeName], 'readwrite')
        const store = transaction.objectStore(storeName)
        let completed = 0
        const errors: Error[] = []

        entities.forEach(entity => {
          const request = store.put(entity)
          request.onsuccess = () => {
            completed++
            if (completed === entities.length) {
              if (errors.length > 0) {
                reject(new Error(`Failed to update ${errors.length} entities in ${storeName}`))
              } else {
                resolve(entities)
              }
            }
          }
          request.onerror = () => {
            errors.push(new Error(`Failed to update entity with id ${entity.id}`))
            completed++
            if (completed === entities.length) {
              reject(new Error(`Failed to update ${errors.length} entities in ${storeName}`))
            }
          }
        })

        if (entities.length === 0) {
          resolve([])
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  async query<T extends BaseEntity>(
    storeName: string,
    predicate: (entity: T) => boolean
  ): Promise<T[]> {
    const all = await this.readAll<T>(storeName)
    return all.filter(predicate)
  }
}

export const indexedDB = new IndexedDBManager()

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
} as const

export type { SessionData, AppStateData, BaseEntity }
