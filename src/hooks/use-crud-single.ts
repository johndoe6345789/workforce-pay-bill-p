import { useCallback } from 'react'
import { indexedDB, type BaseEntity } from '@/lib/indexed-db'

type SetEntities<T> = (updater: (prev: T[]) => T[]) => void

export function useCrudSingle<T extends BaseEntity>(
  storeName: string,
  setEntities: SetEntities<T>
) {
  const create = useCallback(
    async (entity: Omit<T, 'id'>) => {
      const newEntity = {
        ...entity,
        id: `${storeName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      } as T

      try {
        await indexedDB.create(storeName, newEntity)
        setEntities(current => [...current, newEntity])
        return newEntity
      } catch (error) {
        console.error(`Failed to create entity in ${storeName}:`, error)
        throw error
      }
    },
    [storeName, setEntities]
  )

  const read = useCallback(
    async (id: string) => {
      try {
        return await indexedDB.read<T>(storeName, id)
      } catch (error) {
        console.error(`Failed to read entity from ${storeName}:`, error)
        throw error
      }
    },
    [storeName]
  )

  const readAll = useCallback(async () => {
    try {
      return await indexedDB.readAll<T>(storeName)
    } catch (error) {
      console.error(`Failed to read all entities from ${storeName}:`, error)
      throw error
    }
  }, [storeName])

  const readByIndex = useCallback(
    async (indexName: string, value: unknown) => {
      try {
        return await indexedDB.readByIndex<T>(storeName, indexName, value)
      } catch (error) {
        console.error(
          `Failed to read entities by index from ${storeName}:`,
          error
        )
        throw error
      }
    },
    [storeName]
  )

  const update = useCallback(
    async (id: string, updates: Partial<T>) => {
      try {
        const existing = await indexedDB.read<T>(storeName, id)
        if (!existing) throw new Error(`Entity not found in ${storeName}`)

        const updated = { ...existing, ...updates }
        await indexedDB.update(storeName, updated)
        setEntities(current => current.map(e => (e.id === id ? updated : e)))
        return updated
      } catch (error) {
        console.error(`Failed to update entity in ${storeName}:`, error)
        throw error
      }
    },
    [storeName, setEntities]
  )

  const remove = useCallback(
    async (id: string) => {
      try {
        await indexedDB.delete(storeName, id)
        setEntities(current => current.filter(e => e.id !== id))
      } catch (error) {
        console.error(`Failed to delete entity from ${storeName}:`, error)
        throw error
      }
    },
    [storeName, setEntities]
  )

  const query = useCallback(
    async (predicate: (entity: T) => boolean) => {
      try {
        return await indexedDB.query<T>(storeName, predicate)
      } catch (error) {
        console.error(`Failed to query entities in ${storeName}:`, error)
        throw error
      }
    },
    [storeName]
  )

  return { create, read, readAll, readByIndex, update, remove, query }
}
