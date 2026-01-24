import { useState, useEffect, useCallback } from 'react'
import { indexedDB } from '@/lib/indexed-db'

export function useIndexedDBState<T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [state, setState] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedValue = await indexedDB.getAppState<T>(key)
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
  }, [key])

  const updateState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState = typeof value === 'function' 
        ? (value as (prev: T) => T)(prevState) 
        : value

      if (isInitialized) {
        indexedDB.saveAppState(key, newState).catch(error => {
          console.error(`Failed to save state for key "${key}":`, error)
        })
      }

      return newState
    })
  }, [key, isInitialized])

  const deleteState = useCallback(() => {
    setState(defaultValue)
    indexedDB.deleteAppState(key).catch(error => {
      console.error(`Failed to delete state for key "${key}":`, error)
    })
  }, [key, defaultValue])

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
