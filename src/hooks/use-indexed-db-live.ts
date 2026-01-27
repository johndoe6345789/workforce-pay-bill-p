import { useState, useEffect, useCallback, useRef } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'

const ENTITY_STORE_NAMES = [
  STORES.TIMESHEETS,
  STORES.INVOICES,
  STORES.PAYROLL_RUNS,
  STORES.WORKERS,
  STORES.COMPLIANCE_DOCS,
  STORES.EXPENSES,
  STORES.RATE_CARDS,
  STORES.PURCHASE_ORDERS,
] as string[]

type ChangeListener = () => void
type StoreListeners = Map<string, Set<ChangeListener>>

class IndexedDBLiveManager {
  private listeners: StoreListeners = new Map()
  private pollInterval: number = 1000
  private intervalId: NodeJS.Timeout | null = null
  private lastChecksums: Map<string, string> = new Map()

  constructor() {
    this.startPolling()
  }

  private generateChecksum(data: any[]): string {
    return JSON.stringify(data.map(item => item.id + item.status + (item.updatedAt || '')))
  }

  private async checkForChanges() {
    for (const storeName of ENTITY_STORE_NAMES) {
      try {
        const data = await indexedDB.readAll(storeName)
        const checksum = this.generateChecksum(data)
        const lastChecksum = this.lastChecksums.get(storeName)

        if (lastChecksum !== undefined && checksum !== lastChecksum) {
          this.notifyListeners(storeName)
        }

        this.lastChecksums.set(storeName, checksum)
      } catch (error) {
        console.warn(`Failed to check changes for ${storeName}:`, error)
      }
    }
  }

  private startPolling() {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      this.checkForChanges()
    }, this.pollInterval)
  }

  private stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  subscribe(storeName: string, listener: ChangeListener) {
    if (!this.listeners.has(storeName)) {
      this.listeners.set(storeName, new Set())
    }
    this.listeners.get(storeName)!.add(listener)

    return () => {
      const storeListeners = this.listeners.get(storeName)
      if (storeListeners) {
        storeListeners.delete(listener)
        if (storeListeners.size === 0) {
          this.listeners.delete(storeName)
        }
      }

      if (this.listeners.size === 0) {
        this.stopPolling()
      }
    }
  }

  private notifyListeners(storeName: string) {
    const storeListeners = this.listeners.get(storeName)
    if (storeListeners) {
      storeListeners.forEach(listener => listener())
    }
  }

  setPollingInterval(ms: number) {
    this.pollInterval = ms
    if (this.intervalId) {
      this.stopPolling()
      this.startPolling()
    }
  }

  destroy() {
    this.stopPolling()
    this.listeners.clear()
    this.lastChecksums.clear()
  }
}

let liveManager: IndexedDBLiveManager | null = null

function getLiveManager(): IndexedDBLiveManager {
  if (!liveManager) {
    liveManager = new IndexedDBLiveManager()
  }
  return liveManager
}

export function useIndexedDBLive<T>(
  storeName: string,
  defaultValue: T,
  options?: {
    enabled?: boolean
    pollingInterval?: number
  }
): [T, (value: T | ((prev: T) => T)) => void, () => void, () => Promise<void>] {
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
          storedValue = null
        }
      } else {
        storedValue = await indexedDB.getAppState<T>(storeName)
      }

      if (isMountedRef.current) {
        if (storedValue !== null) {
          setState(storedValue)
        } else if (!isInitialized) {
          setState(defaultValue)
        }
      }
    } catch (error) {
      console.error(`Failed to load state for store "${storeName}":`, error)
    } finally {
      if (isMountedRef.current) {
        setIsInitialized(true)
      }
    }
  }, [storeName, isEntityStore, defaultValue, isInitialized])

  useEffect(() => {
    isMountedRef.current = true
    loadData()

    return () => {
      isMountedRef.current = false
    }
  }, [loadData])

  useEffect(() => {
    if (!enabled || !isInitialized) return

    const manager = getLiveManager()
    
    if (options?.pollingInterval) {
      manager.setPollingInterval(options.pollingInterval)
    }

    const unsubscribe = manager.subscribe(storeName, () => {
      loadData()
    })

    return unsubscribe
  }, [storeName, enabled, isInitialized, loadData, options?.pollingInterval])

  const updateState = useCallback((value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState = typeof value === 'function' 
        ? (value as (prev: T) => T)(prevState) 
        : value

      if (isInitialized) {
        if (isEntityStore && Array.isArray(newState)) {
          indexedDB.deleteAll(storeName)
            .then(() => {
              if (newState.length > 0) {
                return indexedDB.bulkCreate(storeName, newState)
              }
            })
            .catch(error => {
              console.error(`Failed to save entities for store "${storeName}":`, error)
            })
        } else {
          indexedDB.saveAppState(storeName, newState).catch(error => {
            console.error(`Failed to save state for store "${storeName}":`, error)
          })
        }
      }

      return newState
    })
  }, [storeName, isInitialized, isEntityStore])

  const deleteState = useCallback(() => {
    setState(defaultValue)
    if (isEntityStore) {
      indexedDB.deleteAll(storeName).catch(error => {
        console.error(`Failed to delete entities from store "${storeName}":`, error)
      })
    } else {
      indexedDB.deleteAppState(storeName).catch(error => {
        console.error(`Failed to delete state for store "${storeName}":`, error)
      })
    }
  }, [storeName, defaultValue, isEntityStore])

  const refresh = useCallback(async () => {
    await loadData()
  }, [loadData])

  return [state, updateState, deleteState, refresh]
}

export function useIndexedDBLivePolling(interval?: number) {
  useEffect(() => {
    const manager = getLiveManager()
    
    if (interval) {
      manager.setPollingInterval(interval)
    }

    return () => {
    }
  }, [interval])
}

export function cleanupIndexedDBLiveManager() {
  if (liveManager) {
    liveManager.destroy()
    liveManager = null
  }
}
