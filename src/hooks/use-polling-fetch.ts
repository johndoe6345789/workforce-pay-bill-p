import { useState, useCallback, useRef } from 'react'

interface PollingFetchParams<T> {
  fetcher: () => Promise<T>
  enabled: boolean
  isOnline: boolean
  consecutiveErrors: number
  errorThreshold: number
  maxInterval: number
  minInterval: number
  backoffMultiplier: number
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function usePollingFetch<T>({
  fetcher,
  enabled,
  isOnline,
  consecutiveErrors,
  errorThreshold,
  maxInterval,
  minInterval,
  backoffMultiplier,
  onSuccess,
  onError,
}: PollingFetchParams<T>) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentInterval, setCurrentInterval] = useState<number | null>(null)
  const mountedRef = useRef(true)

  const fetch = useCallback(async () => {
    if (!enabled || !isOnline) return

    setIsLoading(true)
    try {
      const result = await fetcher()
      if (!mountedRef.current) return

      setData(result)
      setError(null)
      setCurrentInterval(prev =>
        Math.max(minInterval, (prev ?? minInterval) / backoffMultiplier)
      )
      onSuccess?.(result)
    } catch (err) {
      if (!mountedRef.current) return

      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)

      if (consecutiveErrors >= errorThreshold) {
        setCurrentInterval(prev =>
          Math.min(maxInterval, (prev ?? maxInterval) * backoffMultiplier)
        )
      }
      onError?.(errorObj)
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [
    enabled,
    isOnline,
    fetcher,
    consecutiveErrors,
    errorThreshold,
    maxInterval,
    minInterval,
    backoffMultiplier,
    onSuccess,
    onError,
  ])

  return { data, setData, error, setError, isLoading, currentInterval, setCurrentInterval, mountedRef, fetch }
}
