import { useCallback, useEffect } from 'react'
import { CacheOptions, CacheEntry } from './use-cache.types'
import { useCacheStore } from './use-cache-store'

export type { CacheOptions } from './use-cache.types'

export function useCache<T>(options: CacheOptions<T> = {}) {
  const {
    ttl = 5 * 60 * 1000,
    maxSize = 100,
    serialize = JSON.stringify,
    deserialize = JSON.parse as (data: string) => T
  } = options

  const store = useCacheStore<T>(ttl, maxSize)
  const { cache, hits, misses, get, set, remove, clear, has, prune } = store

  useEffect(() => {
    const interval = setInterval(prune, ttl)
    return () => clearInterval(interval)
  }, [prune, ttl])

  const getOrSet = useCallback(async (
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> => {
    const cached = get(key)
    if (cached !== undefined) return cached
    const data = await fetcher()
    set(key, data)
    return data
  }, [get, set])

  const exportCache = useCallback((): string => {
    const entries = Array.from(cache.entries()).map(([key, entry]) => ({
      key,
      data: serialize(entry.data),
      timestamp: entry.timestamp
    }))
    return JSON.stringify(entries)
  }, [cache, serialize])

  const importCache = useCallback((exported: string) => {
    try {
      const entries = JSON.parse(exported) as Array<{
        key: string
        data: string
        timestamp: number
      }>
      const newCache = new Map<string, CacheEntry<T>>()
      const now = Date.now()
      entries.forEach(({ key, data, timestamp }) => {
        if (now - timestamp <= ttl) {
          newCache.set(key, { data: deserialize(data), timestamp })
        }
      })
      // rebuild via clear + individual sets to use existing state logic
      clear()
      newCache.forEach((entry, key) => set(key, entry.data))
    } catch (error) {
      console.error('Failed to import cache:', error)
    }
  }, [ttl, deserialize, clear, set])

  return {
    get,
    set,
    remove,
    clear,
    has,
    prune,
    getOrSet,
    size: cache.size,
    hits,
    misses,
    hitRate: hits + misses > 0 ? hits / (hits + misses) : 0,
    exportCache,
    importCache
  }
}
