import { useState, useCallback, useEffect } from 'react'

export interface CacheOptions<T> {
  ttl?: number
  maxSize?: number
  serialize?: (data: T) => string
  deserialize?: (data: string) => T
}

interface CacheEntry<T> {
  data: T
  timestamp: number
}

export function useCache<T>(options: CacheOptions<T> = {}) {
  const {
    ttl = 5 * 60 * 1000,
    maxSize = 100,
    serialize = JSON.stringify,
    deserialize = JSON.parse
  } = options

  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map())
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)

  const isExpired = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp > ttl
  }, [ttl])

  const get = useCallback((key: string): T | undefined => {
    const entry = cache.get(key)
    
    if (!entry) {
      setMisses(prev => prev + 1)
      return undefined
    }

    if (isExpired(entry)) {
      setCache(prev => {
        const next = new Map(prev)
        next.delete(key)
        return next
      })
      setMisses(prev => prev + 1)
      return undefined
    }

    setHits(prev => prev + 1)
    return entry.data
  }, [cache, isExpired])

  const set = useCallback((key: string, data: T) => {
    setCache(prev => {
      const next = new Map(prev)

      if (next.size >= maxSize && !next.has(key)) {
        const oldestKey = Array.from(next.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)[0]?.[0]
        
        if (oldestKey) {
          next.delete(oldestKey)
        }
      }

      next.set(key, {
        data,
        timestamp: Date.now()
      })

      return next
    })
  }, [maxSize])

  const remove = useCallback((key: string) => {
    setCache(prev => {
      const next = new Map(prev)
      next.delete(key)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setCache(new Map())
    setHits(0)
    setMisses(0)
  }, [])

  const has = useCallback((key: string): boolean => {
    const entry = cache.get(key)
    if (!entry) return false
    if (isExpired(entry)) {
      remove(key)
      return false
    }
    return true
  }, [cache, isExpired, remove])

  const prune = useCallback(() => {
    setCache(prev => {
      const next = new Map(prev)
      const now = Date.now()
      
      for (const [key, entry] of next.entries()) {
        if (now - entry.timestamp > ttl) {
          next.delete(key)
        }
      }
      
      return next
    })
  }, [ttl])

  useEffect(() => {
    const interval = setInterval(prune, ttl)
    return () => clearInterval(interval)
  }, [prune, ttl])

  const getOrSet = useCallback(async (
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> => {
    const cached = get(key)
    if (cached !== undefined) {
      return cached
    }

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
          newCache.set(key, {
            data: deserialize(data),
            timestamp
          })
        }
      })

      setCache(newCache)
    } catch (error) {
      console.error('Failed to import cache:', error)
    }
  }, [ttl, deserialize])

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
