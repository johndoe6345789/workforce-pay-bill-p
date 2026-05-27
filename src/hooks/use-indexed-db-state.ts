import { useState, useEffect, useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'

export { useIndexedDBCache } from './use-indexed-db-cache'

const ENTITY_STORES = [
  STORES.TIMESHEETS, STORES.INVOICES, STORES.PAYROLL_RUNS,
  STORES.WORKERS, STORES.COMPLIANCE_DOCS, STORES.EXPENSES, STORES.RATE_CARDS,
] as string[]

export function useIndexedDBState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)
  const isEntityStore = ENTITY_STORES.includes(key)

  useEffect(() => {
    const loadState = async () => {
      try {
        let storedValue: T | null = null
        if (isEntityStore) {
          try {
            const entities = await indexedDB.readAll(key)
            storedValue = (entities.length > 0 ? entities : null) as T | null
          } catch (err) {
            console.warn(`Store "${key}" not accessible, using default`, err)
          }
        } else {
          storedValue = await indexedDB.getAppState<T>(key)
        }
        if (storedValue !== null) setState(storedValue)
      } catch (error) {
        console.error(`Failed to load state for "${key}":`, error)
      } finally {
        setIsInitialized(true)
      }
    }
    loadState()
  }, [key, isEntityStore])

  const updateState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState =
        typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value
      if (isInitialized) {
        if (isEntityStore && Array.isArray(newState)) {
          indexedDB.deleteAll(key)
            .then(() => (newState as unknown[]).length > 0
              ? indexedDB.bulkCreate(key, newState as unknown[])
              : undefined)
            .catch(err => console.error(`Failed to save to "${key}":`, err))
        } else {
          indexedDB.saveAppState(key, newState)
            .catch(err => console.error(`Failed to save state "${key}":`, err))
        }
      }
      return newState
    })
  }, [key, isInitialized, isEntityStore])

  const deleteState = useCallback(() => {
    setState(defaultValue)
    const op = isEntityStore
      ? indexedDB.deleteAll(key)
      : indexedDB.deleteAppState(key)
    op.catch(err => console.error(`Failed to delete "${key}":`, err))
  }, [key, defaultValue, isEntityStore])

  return [state, updateState, deleteState]
}
