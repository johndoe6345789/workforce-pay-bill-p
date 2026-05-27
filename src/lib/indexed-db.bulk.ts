import type { BaseEntity } from './indexed-db.types'

function runBulk<T extends BaseEntity>(
  db: IDBDatabase,
  storeName: string,
  entities: T[],
  op: 'add' | 'put',
  verb: string
): Promise<T[]> {
  if (entities.length === 0) return Promise.resolve([])
  return new Promise((resolve, reject) => {
    try {
      const store = db.transaction([storeName], 'readwrite').objectStore(storeName)
      let completed = 0
      let errorCount = 0
      entities.forEach(entity => {
        const req = op === 'add' ? store.add(entity) : store.put(entity)
        req.onsuccess = () => {
          completed++
          if (completed === entities.length) {
            errorCount > 0
              ? reject(new Error(`Failed to ${verb} ${errorCount} entities in ${storeName}`))
              : resolve(entities)
          }
        }
        req.onerror = () => {
          errorCount++
          completed++
          if (completed === entities.length)
            reject(new Error(`Failed to ${verb} ${errorCount} entities in ${storeName}`))
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function dbBulkCreate<T extends BaseEntity>(
  db: IDBDatabase,
  storeName: string,
  entities: T[]
): Promise<T[]> {
  return runBulk(db, storeName, entities, 'add', 'create')
}

export function dbBulkUpdate<T extends BaseEntity>(
  db: IDBDatabase,
  storeName: string,
  entities: T[]
): Promise<T[]> {
  return runBulk(db, storeName, entities, 'put', 'update')
}
