import { useState, useCallback } from 'react'
import { CacheEntry } from './use-cache.types'

export function useCacheStore<T>(ttl: number, maxSize: number) {
  const [cache, setCache] = useState<Map<string, CacheEntry<T>>>(new Map())
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)

  const isExpired = useCallback(
    (entry: CacheEntry<T>): boolean => Date.now() - entry.timestamp > ttl,
    [ttl]
  )

  const get = useCallback((key: string): T | undefined => {
    const entry = cache.get(key)
    if (!entry) {
      setMisses(prev => prev + 1)
      return undefined
    }
    if (isExpired(entry)) {
      setCache(prev => { const n = new Map(prev); n.delete(key); return n })
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
        if (oldestKey) next.delete(oldestKey)
      }
      next.set(key, { data, timestamp: Date.now() })
      return next
    })
  }, [maxSize])

  const remove = useCallback((key: string) => {
    setCache(prev => { const n = new Map(prev); n.delete(key); return n })
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
        if (now - entry.timestamp > ttl) next.delete(key)
      }
      return next
    })
  }, [ttl])

  return { cache, hits, misses, get, set, remove, clear, has, prune }
}
