import { useCallback } from 'react'
import { indexedDB, type BaseEntity } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'

export function useCRUD<T extends BaseEntity>(storeName: string) {
  const [entities, setEntities] = useIndexedDBState<T[]>(storeName, [])

  const create = useCallback(async (entity: Omit<T, 'id'>) => {
    const newEntity = {
      ...entity,
      id: `${storeName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    } as T
    
    try {
      await indexedDB.create(storeName, newEntity)
      setEntities(current => [...current, newEntity])
      return newEntity
    } catch (error) {
      console.error(`Failed to create entity in ${storeName}:`, error)
      throw error
    }
  }, [storeName, setEntities])

  const read = useCallback(async (id: string) => {
    try {
      return await indexedDB.read<T>(storeName, id)
    } catch (error) {
      console.error(`Failed to read entity from ${storeName}:`, error)
      throw error
    }
  }, [storeName])

  const readAll = useCallback(async () => {
    try {
      return await indexedDB.readAll<T>(storeName)
    } catch (error) {
      console.error(`Failed to read all entities from ${storeName}:`, error)
      throw error
    }
  }, [storeName])

  const readByIndex = useCallback(async (indexName: string, value: any) => {
    try {
      return await indexedDB.readByIndex<T>(storeName, indexName, value)
    } catch (error) {
      console.error(`Failed to read entities by index from ${storeName}:`, error)
      throw error
    }
  }, [storeName])

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    try {
      const existing = await indexedDB.read<T>(storeName, id)
      if (!existing) throw new Error(`Entity not found in ${storeName}`)

      const updated = { ...existing, ...updates }
      await indexedDB.update(storeName, updated)
      
      setEntities(current =>
        current.map(e => e.id === id ? updated : e)
      )
      return updated
    } catch (error) {
      console.error(`Failed to update entity in ${storeName}:`, error)
      throw error
    }
  }, [storeName, setEntities])

  const remove = useCallback(async (id: string) => {
    try {
      await indexedDB.delete(storeName, id)
      setEntities(current => current.filter(e => e.id !== id))
    } catch (error) {
      console.error(`Failed to delete entity from ${storeName}:`, error)
      throw error
    }
  }, [storeName, setEntities])

  const bulkCreate = useCallback(async (entitiesData: Omit<T, 'id'>[]) => {
    try {
      const newEntities = entitiesData.map(data => ({
        ...data,
        id: `${storeName}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      })) as T[]

      await indexedDB.bulkCreate(storeName, newEntities)
      setEntities(current => [...current, ...newEntities])
      return newEntities
    } catch (error) {
      console.error(`Failed to bulk create entities in ${storeName}:`, error)
      throw error
    }
  }, [storeName, setEntities])

  const bulkUpdate = useCallback(async (updates: { id: string; updates: Partial<T> }[]) => {
    try {
      const updatedEntities = await Promise.all(
        updates.map(async ({ id, updates: data }) => {
          const existing = await indexedDB.read<T>(storeName, id)
          if (!existing) throw new Error(`Entity ${id} not found in ${storeName}`)
          return { ...existing, ...data }
        })
      )

      await indexedDB.bulkUpdate(storeName, updatedEntities)
      
      setEntities(current =>
        current.map(e => {
          const updated = updatedEntities.find(u => u.id === e.id)
          return updated || e
        })
      )
      
      return updatedEntities
    } catch (error) {
      console.error(`Failed to bulk update entities in ${storeName}:`, error)
      throw error
    }
  }, [storeName, setEntities])

  const query = useCallback(async (predicate: (entity: T) => boolean) => {
    try {
      return await indexedDB.query<T>(storeName, predicate)
    } catch (error) {
      console.error(`Failed to query entities in ${storeName}:`, error)
      throw error
    }
  }, [storeName])

  return {
    entities,
    create,
    read,
    readAll,
    readByIndex,
    update,
    remove,
    bulkCreate,
    bulkUpdate,
    query
  }
}

export { useTimesheetsCrud } from './use-timesheets-crud'
export { useInvoicesCrud } from './use-invoices-crud'
export { usePayrollCrud } from './use-payroll-crud'
export { useExpensesCrud } from './use-expenses-crud'
export { useComplianceCrud } from './use-compliance-crud'
export { useWorkersCrud } from './use-workers-crud'
