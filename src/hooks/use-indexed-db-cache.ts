import { useState, useEffect, useCallback } from 'react'
import { indexedDB } from '@/lib/indexed-db'

interface CachedEntry<T> {
  value: T
  timestamp: number
}

export function useIndexedDBCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const cachedData = await indexedDB.getAppState<CachedEntry<T>>(key)

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
        timestamp: Date.now(),
      })
      setData(freshData)
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch data')
      )
    } finally {
      setIsLoading(false)
    }
  }, [key, fetcher, ttl])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, isLoading, error, refresh }
}
