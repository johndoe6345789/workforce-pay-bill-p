import { SESSION_STORE } from './indexed-db.types'
import type { SessionData } from './indexed-db.types'

type DeleteFn = (id: string) => void

export function dbSaveSession(
  db: IDBDatabase,
  data: Omit<SessionData, 'id' | 'loginTimestamp' | 'lastActivityTimestamp'>
): Promise<string> {
  const id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  const full: SessionData = {
    ...data,
    id,
    loginTimestamp: Date.now(),
    lastActivityTimestamp: Date.now(),
    expiresAt: data.expiresAt ?? Date.now() + 24 * 60 * 60 * 1000,
  }
  return new Promise((resolve, reject) => {
    const req = db.transaction([SESSION_STORE], 'readwrite').objectStore(SESSION_STORE).put(full)
    req.onsuccess = () => resolve(id)
    req.onerror = () => reject(new Error('Failed to save session'))
  })
}

export function dbGetSession(
  db: IDBDatabase, sessionId: string, onExpired: DeleteFn
): Promise<SessionData | null> {
  return new Promise((resolve, reject) => {
    const req = db.transaction([SESSION_STORE], 'readonly').objectStore(SESSION_STORE).get(sessionId)
    req.onsuccess = () => {
      const s = req.result as SessionData | undefined
      if (s?.expiresAt && s.expiresAt < Date.now()) { onExpired(s.id); resolve(null) }
      else resolve(s ?? null)
    }
    req.onerror = () => reject(new Error('Failed to get session'))
  })
}

export function dbGetCurrentSession(db: IDBDatabase, onExpired: DeleteFn): Promise<SessionData | null> {
  return new Promise((resolve, reject) => {
    const req = db.transaction([SESSION_STORE], 'readonly')
      .objectStore(SESSION_STORE).index('lastActivityTimestamp').openCursor(null, 'prev')
    req.onsuccess = () => {
      const cursor = req.result
      if (!cursor) { resolve(null); return }
      const s = cursor.value as SessionData
      if (s.expiresAt && s.expiresAt < Date.now()) { onExpired(s.id); resolve(null) }
      else resolve(s)
    }
    req.onerror = () => reject(new Error('Failed to get current session'))
  })
}

export function dbUpdateSessionActivity(db: IDBDatabase, session: SessionData): Promise<void> {
  const updated = { ...session, lastActivityTimestamp: Date.now() }
  return new Promise((resolve, reject) => {
    const req = db.transaction([SESSION_STORE], 'readwrite').objectStore(SESSION_STORE).put(updated)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(new Error('Failed to update session activity'))
  })
}

export function dbDeleteSession(db: IDBDatabase, sessionId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = db.transaction([SESSION_STORE], 'readwrite').objectStore(SESSION_STORE).delete(sessionId)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(new Error('Failed to delete session'))
  })
}

export function dbGetAllSessions(db: IDBDatabase, onExpired: DeleteFn): Promise<SessionData[]> {
  return new Promise((resolve, reject) => {
    const req = db.transaction([SESSION_STORE], 'readonly').objectStore(SESSION_STORE).getAll()
    req.onsuccess = () => {
      const all = req.result as SessionData[]
      all.filter(s => s.expiresAt && s.expiresAt < Date.now()).forEach(s => onExpired(s.id))
      resolve(all.filter(s => !s.expiresAt || s.expiresAt >= Date.now()))
    }
    req.onerror = () => reject(new Error('Failed to get all sessions'))
  })
}

export function dbClearAllSessions(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = db.transaction([SESSION_STORE], 'readwrite').objectStore(SESSION_STORE).clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(new Error('Failed to clear sessions'))
  })
}
