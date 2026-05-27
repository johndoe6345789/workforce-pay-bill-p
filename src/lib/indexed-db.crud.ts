import type { BaseEntity } from './indexed-db.types'

export function dbCreate<T extends BaseEntity>(db: IDBDatabase, storeName: string, entity: T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const req = db.transaction([storeName], 'readwrite').objectStore(storeName).add(entity)
      req.onsuccess = () => resolve(entity)
      req.onerror = () => reject(new Error(`Failed to create entity in ${storeName}`))
    } catch (error) { reject(error) }
  })
}

export function dbRead<T extends BaseEntity>(db: IDBDatabase, storeName: string, id: string): Promise<T | null> {
  return new Promise((resolve, reject) => {
    try {
      const req = db.transaction([storeName], 'readonly').objectStore(storeName).get(id)
      req.onsuccess = () => resolve((req.result as T) ?? null)
      req.onerror = () => reject(new Error(`Failed to read entity from ${storeName}`))
    } catch (error) { reject(error) }
  })
}

export function dbReadAll<T extends BaseEntity>(db: IDBDatabase, storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      const req = db.transaction([storeName], 'readonly').objectStore(storeName).getAll()
      req.onsuccess = () => resolve((req.result as T[]) ?? [])
      req.onerror = () => reject(new Error(`Failed to read all entities from ${storeName}`))
    } catch (error) { reject(error) }
  })
}

export function dbReadByIndex<T extends BaseEntity>(
  db: IDBDatabase,
  storeName: string,
  indexName: string,
  value: IDBValidKey | IDBKeyRange
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    try {
      const req = db.transaction([storeName], 'readonly')
        .objectStore(storeName).index(indexName).getAll(value)
      req.onsuccess = () => resolve((req.result as T[]) ?? [])
      req.onerror = () => reject(new Error(`Failed to read entities by index from ${storeName}`))
    } catch (error) { reject(error) }
  })
}

export function dbUpdate<T extends BaseEntity>(db: IDBDatabase, storeName: string, entity: T): Promise<T> {
  return new Promise((resolve, reject) => {
    try {
      const req = db.transaction([storeName], 'readwrite').objectStore(storeName).put(entity)
      req.onsuccess = () => resolve(entity)
      req.onerror = () => reject(new Error(`Failed to update entity in ${storeName}`))
    } catch (error) { reject(error) }
  })
}

export function dbDelete(db: IDBDatabase, storeName: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const req = db.transaction([storeName], 'readwrite').objectStore(storeName).delete(id)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(`Failed to delete entity from ${storeName}`))
    } catch (error) { reject(error) }
  })
}

export function dbDeleteAll(db: IDBDatabase, storeName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const req = db.transaction([storeName], 'readwrite').objectStore(storeName).clear()
      req.onsuccess = () => resolve()
      req.onerror = () => reject(new Error(`Failed to clear store ${storeName}`))
    } catch (error) { reject(error) }
  })
}
