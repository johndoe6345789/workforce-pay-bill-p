const DB_NAME = 'WorkForceProDB'
const DB_VERSION = 1
const SESSION_STORE = 'sessions'
const APP_STATE_STORE = 'appState'

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
}

export const indexedDB = new IndexedDBManager()
export type { SessionData, AppStateData }
