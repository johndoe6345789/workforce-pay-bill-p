import { useCallback } from 'react'
import { indexedDB, type BaseEntity } from '@/lib/indexed-db'

export function useCrudRead<T extends BaseEntity>(storeName: string) {
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
        console.error(`Failed to read entities by index from ${storeName}:`, error)
        throw error
      }
    },
    [storeName]
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

  return { read, readAll, readByIndex, query }
}
