import { indexedDB, STORES } from '@/lib/indexed-db'
import type { ChangeListener, StoreListeners } from './use-indexed-db-live.types'

export const ENTITY_STORE_NAMES = [
  STORES.TIMESHEETS,
  STORES.INVOICES,
  STORES.PAYROLL_RUNS,
  STORES.WORKERS,
  STORES.COMPLIANCE_DOCS,
  STORES.EXPENSES,
  STORES.RATE_CARDS,
  STORES.PURCHASE_ORDERS,
] as string[]

export class IndexedDBLiveManager {
  private listeners: StoreListeners = new Map()
  private pollInterval: number = 1000
  private intervalId: NodeJS.Timeout | null = null
  private lastChecksums: Map<string, string> = new Map()

  constructor() {
    this.startPolling()
  }

  private generateChecksum(data: Array<{ id: unknown; status: unknown; updatedAt?: unknown }>): string {
    return JSON.stringify(data.map(item => `${item.id}${item.status}${item.updatedAt ?? ''}`))
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
    this.intervalId = setInterval(() => { this.checkForChanges() }, this.pollInterval)
  }

  private stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  subscribe(storeName: string, listener: ChangeListener) {
    if (!this.listeners.has(storeName)) this.listeners.set(storeName, new Set())
    this.listeners.get(storeName)!.add(listener)
    return () => {
      const sl = this.listeners.get(storeName)
      if (sl) { sl.delete(listener); if (sl.size === 0) this.listeners.delete(storeName) }
      if (this.listeners.size === 0) this.stopPolling()
    }
  }

  private notifyListeners(storeName: string) {
    this.listeners.get(storeName)?.forEach(listener => listener())
  }

  setPollingInterval(ms: number) {
    this.pollInterval = ms
    if (this.intervalId) { this.stopPolling(); this.startPolling() }
  }

  destroy() {
    this.stopPolling()
    this.listeners.clear()
    this.lastChecksums.clear()
  }
}

let liveManager: IndexedDBLiveManager | null = null

export function getLiveManager(): IndexedDBLiveManager {
  if (!liveManager) liveManager = new IndexedDBLiveManager()
  return liveManager
}

export function cleanupIndexedDBLiveManager() {
  if (liveManager) {
    liveManager.destroy()
    liveManager = null
  }
}
