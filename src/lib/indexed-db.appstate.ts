import { APP_STATE_STORE } from './indexed-db.types'
import type { AppStateData } from './indexed-db.types'

export function dbSaveAppState<T>(db: IDBDatabase, key: string, value: T): Promise<void> {
  const stateData: AppStateData = { key, value, timestamp: Date.now() }
  return new Promise((resolve, reject) => {
    const store = db.transaction([APP_STATE_STORE], 'readwrite').objectStore(APP_STATE_STORE)
    const req = store.put(stateData)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(new Error('Failed to save app state'))
  })
}

export function dbGetAppState<T>(db: IDBDatabase, key: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const store = db.transaction([APP_STATE_STORE], 'readonly').objectStore(APP_STATE_STORE)
    const req = store.get(key)
    req.onsuccess = () => {
      const data = req.result as AppStateData | undefined
      resolve(data ? (data.value as T) : null)
    }
    req.onerror = () => reject(new Error('Failed to get app state'))
  })
}

export function dbDeleteAppState(db: IDBDatabase, key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const store = db.transaction([APP_STATE_STORE], 'readwrite').objectStore(APP_STATE_STORE)
    const req = store.delete(key)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(new Error('Failed to delete app state'))
  })
}

export function dbClearAppState(db: IDBDatabase): Promise<void> {
  return new Promise((resolve, reject) => {
    const store = db.transaction([APP_STATE_STORE], 'readwrite').objectStore(APP_STATE_STORE)
    const req = store.clear()
    req.onsuccess = () => resolve()
    req.onerror = () => reject(new Error('Failed to clear app state'))
  })
}
