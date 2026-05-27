import { useState, useEffect, useCallback, useRef } from 'react'
import { indexedDB } from '@/lib/indexed-db'
import { ENTITY_STORE_NAMES, getLiveManager } from './use-indexed-db-live-manager'
import type { UseIndexedDBLiveOptions, UseIndexedDBLiveReturn } from './use-indexed-db-live.types'

export { cleanupIndexedDBLiveManager } from './use-indexed-db-live-manager'

export function useIndexedDBLive<T>(
  storeName: string,
  defaultValue: T,
  options?: UseIndexedDBLiveOptions
): UseIndexedDBLiveReturn<T> {
  const [state, setState] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)
  const isEntityStore = ENTITY_STORE_NAMES.includes(storeName)
  const enabled = options?.enabled !== false
  const isMountedRef = useRef(true)

  const loadData = useCallback(async () => {
    try {
      let storedValue: T | null = null
      if (isEntityStore) {
        try {
          const entities = await indexedDB.readAll(storeName)
          storedValue = (entities.length > 0 ? entities : null) as T | null
        } catch (error) {
          console.warn(`Store "${storeName}" not accessible, using default value`, error)
        }
      } else {
        storedValue = await indexedDB.getAppState<T>(storeName)
      }
      if (isMountedRef.current) {
        if (storedValue !== null) setState(storedValue)
        else if (!isInitialized) setState(defaultValue)
      }
    } catch (error) {
      console.error(`Failed to load state for store "${storeName}":`, error)
    } finally {
      if (isMountedRef.current) setIsInitialized(true)
    }
  }, [storeName, isEntityStore, defaultValue, isInitialized])

  useEffect(() => {
    isMountedRef.current = true
    loadData()
    return () => { isMountedRef.current = false }
  }, [loadData])

  useEffect(() => {
    if (!enabled || !isInitialized) return
    const manager = getLiveManager()
    if (options?.pollingInterval) manager.setPollingInterval(options.pollingInterval)
    return manager.subscribe(storeName, () => { loadData() })
  }, [storeName, enabled, isInitialized, loadData, options?.pollingInterval])

  const updateState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value
      if (isInitialized) {
        if (isEntityStore && Array.isArray(newState)) {
          indexedDB.deleteAll(storeName)
            .then(() => newState.length > 0 ? indexedDB.bulkCreate(storeName, newState) : undefined)
            .catch(e => console.error(`Failed to save entities for store "${storeName}":`, e))
        } else {
          indexedDB.saveAppState(storeName, newState)
            .catch(e => console.error(`Failed to save state for store "${storeName}":`, e))
        }
      }
      return newState
    })
  }, [storeName, isInitialized, isEntityStore])

  const deleteState = useCallback(() => {
    setState(defaultValue)
    if (isEntityStore) {
      indexedDB.deleteAll(storeName)
        .catch(e => console.error(`Failed to delete entities from store "${storeName}":`, e))
    } else {
      indexedDB.deleteAppState(storeName)
        .catch(e => console.error(`Failed to delete state for store "${storeName}":`, e))
    }
  }, [storeName, defaultValue, isEntityStore])

  const refresh = useCallback(async () => { await loadData() }, [loadData])

  return [state, updateState, deleteState, refresh]
}

export function useIndexedDBLivePolling(interval?: number) {
  useEffect(() => {
    const manager = getLiveManager()
    if (interval) manager.setPollingInterval(interval)
  }, [interval])
}
