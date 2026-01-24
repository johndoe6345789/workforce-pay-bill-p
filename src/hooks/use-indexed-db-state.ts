import { useState, useEffect, useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'

const ENTITY_STORE_NAMES = [
  STORES.TIMESHEETS,
  STORES.INVOICES,
  STORES.PAYROLL_RUNS,
  STORES.WORKERS,
  STORES.COMPLIANCE_DOCS,
  STORES.EXPENSES,
  STORES.RATE_CARDS,
] as string[]

export function useIndexedDBState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)
  const isEntityStore = ENTITY_STORE_NAMES.includes(key)

  useEffect(() => {
    const loadState = async () => {
      try {
        let storedValue: T | null = null

        if (isEntityStore) {
          try {
            const entities = await indexedDB.readAll(key)
            storedValue = (entities.length > 0 ? entities : null) as T | null
          } catch (error) {
            console.warn(`Store "${key}" not accessible, using default value`, error)
            storedValue = null
          }
        } else {
          storedValue = await indexedDB.getAppState<T>(key)
        }

        if (storedValue !== null) {
          setState(storedValue)
        }
      } catch (error) {
        console.error(`Failed to load state for key "${key}":`, error)
      } finally {
        setIsInitialized(true)
      }
    }

    loadState()
  }, [key, isEntityStore])

  const updateState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState = typeof value === 'function' 
        ? (value as (prev: T) => T)(prevState) 
        : value

      if (isInitialized) {
        if (isEntityStore && Array.isArray(newState)) {
          indexedDB.deleteAll(key)
            .then(() => {
              if (newState.length > 0) {
                return indexedDB.bulkCreate(key, newState)
              }
            })
            .catch(error => {
              console.error(`Failed to save entities for store "${key}":`, error)
            })
        } else {
          indexedDB.saveAppState(key, newState).catch(error => {
            console.error(`Failed to save state for key "${key}":`, error)
          })
        }
      }

      return newState
    })
  }, [key, isInitialized, isEntityStore])

  const deleteState = useCallback(() => {
    setState(defaultValue)
    if (isEntityStore) {
      indexedDB.deleteAll(key).catch(error => {
        console.error(`Failed to delete entities from store "${key}":`, error)
      })
    } else {
      indexedDB.deleteAppState(key).catch(error => {
        console.error(`Failed to delete state for key "${key}":`, error)
      })
    }
  }, [key, defaultValue, isEntityStore])

  return [state, updateState, deleteState]
}

export function useIndexedDBCache<T>(key: string, fetcher: () => Promise<T>, ttl?: number) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const cachedData = await indexedDB.getAppState<{ value: T; timestamp: number }>(key)
      
      if (cachedData && ttl) {
        const age = Date.now() - cachedData.timestamp
        if (age < ttl) {
          setData(cachedData.value)
          setIsLoading(false)
          return
        }
      }

      const freshData = await fetcher()
      await indexedDB.saveAppState(key, {
        value: freshData,
        timestamp: Date.now()
      })
      setData(freshData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setIsLoading(false)
    }
  }, [key, fetcher, ttl])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, isLoading, error, refresh }
}
