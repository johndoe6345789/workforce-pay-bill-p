import { useCallback } from 'react'
import { indexedDB, type BaseEntity } from '@/lib/indexed-db'

type SetEntities<T> = (updater: (prev: T[]) => T[]) => void

export function useCrudBulk<T extends BaseEntity>(
  storeName: string,
  setEntities: SetEntities<T>
) {
  const bulkCreate = useCallback(
    async (entitiesData: Omit<T, 'id'>[]) => {
      try {
        const newEntities = entitiesData.map(data => ({
          ...data,
          id: `${storeName}-${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 9)}`,
        })) as T[]

        await indexedDB.bulkCreate(storeName, newEntities)
        setEntities(current => [...current, ...newEntities])
        return newEntities
      } catch (error) {
        console.error(
          `Failed to bulk create entities in ${storeName}:`,
          error
        )
        throw error
      }
    },
    [storeName, setEntities]
  )

  const bulkUpdate = useCallback(
    async (updates: { id: string; updates: Partial<T> }[]) => {
      try {
        const updatedEntities = await Promise.all(
          updates.map(async ({ id, updates: data }) => {
            const existing = await indexedDB.read<T>(storeName, id)
            if (!existing)
              throw new Error(`Entity ${id} not found in ${storeName}`)
            return { ...existing, ...data }
          })
        )

        await indexedDB.bulkUpdate(storeName, updatedEntities)
        setEntities(current =>
          current.map(e => {
            const updated = updatedEntities.find(u => u.id === e.id)
            return updated ?? e
          })
        )
        return updatedEntities
      } catch (error) {
        console.error(
          `Failed to bulk update entities in ${storeName}:`,
          error
        )
        throw error
      }
    },
    [storeName, setEntities]
  )

  return { bulkCreate, bulkUpdate }
}
