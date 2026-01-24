import { useState, useCallback } from 'react'
import { indexedDB, BaseEntity } from '@/lib/indexed-db'

interface CRUDHookResult<T extends BaseEntity> {
  data: T[]
  isLoading: boolean
  error: Error | null
  create: (entity: T) => Promise<T>
  read: (id: string) => Promise<T | null>
  readAll: () => Promise<T[]>
  readByIndex: (indexName: string, value: any) => Promise<T[]>
  update: (entity: T) => Promise<T>
  remove: (id: string) => Promise<void>
  removeAll: () => Promise<void>
  bulkCreate: (entities: T[]) => Promise<T[]>
  bulkUpdate: (entities: T[]) => Promise<T[]>
  query: (predicate: (entity: T) => boolean) => Promise<T[]>
  refresh: () => Promise<void>
}

export function useCRUD<T extends BaseEntity>(storeName: string): CRUDHookResult<T> {
  const [data, setData] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const entities = await indexedDB.readAll<T>(storeName)
      setData(entities)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load data')
      setError(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [storeName])

  const create = useCallback(async (entity: T): Promise<T> => {
    setError(null)
    try {
      const created = await indexedDB.create(storeName, entity)
      await refresh()
      return created
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create entity')
      setError(error)
      throw error
    }
  }, [storeName, refresh])

  const read = useCallback(async (id: string): Promise<T | null> => {
    setError(null)
    try {
      return await indexedDB.read<T>(storeName, id)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to read entity')
      setError(error)
      throw error
    }
  }, [storeName])

  const readAll = useCallback(async (): Promise<T[]> => {
    setError(null)
    try {
      const entities = await indexedDB.readAll<T>(storeName)
      setData(entities)
      return entities
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to read all entities')
      setError(error)
      throw error
    }
  }, [storeName])

  const readByIndex = useCallback(async (indexName: string, value: any): Promise<T[]> => {
    setError(null)
    try {
      return await indexedDB.readByIndex<T>(storeName, indexName, value)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to read entities by index')
      setError(error)
      throw error
    }
  }, [storeName])

  const update = useCallback(async (entity: T): Promise<T> => {
    setError(null)
    try {
      const updated = await indexedDB.update(storeName, entity)
      await refresh()
      return updated
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update entity')
      setError(error)
      throw error
    }
  }, [storeName, refresh])

  const remove = useCallback(async (id: string): Promise<void> => {
    setError(null)
    try {
      await indexedDB.delete(storeName, id)
      await refresh()
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete entity')
      setError(error)
      throw error
    }
  }, [storeName, refresh])

  const removeAll = useCallback(async (): Promise<void> => {
    setError(null)
    try {
      await indexedDB.deleteAll(storeName)
      setData([])
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete all entities')
      setError(error)
      throw error
    }
  }, [storeName])

  const bulkCreate = useCallback(async (entities: T[]): Promise<T[]> => {
    setError(null)
    try {
      const created = await indexedDB.bulkCreate(storeName, entities)
      await refresh()
      return created
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk create entities')
      setError(error)
      throw error
    }
  }, [storeName, refresh])

  const bulkUpdate = useCallback(async (entities: T[]): Promise<T[]> => {
    setError(null)
    try {
      const updated = await indexedDB.bulkUpdate(storeName, entities)
      await refresh()
      return updated
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to bulk update entities')
      setError(error)
      throw error
    }
  }, [storeName, refresh])

  const query = useCallback(async (predicate: (entity: T) => boolean): Promise<T[]> => {
    setError(null)
    try {
      return await indexedDB.query<T>(storeName, predicate)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to query entities')
      setError(error)
      throw error
    }
  }, [storeName])

  return {
    data,
    isLoading,
    error,
    create,
    read,
    readAll,
    readByIndex,
    update,
    remove,
    removeAll,
    bulkCreate,
    bulkUpdate,
    query,
    refresh,
  }
}
