import { useState, useEffect, useRef, useCallback } from 'react'
import { useNetworkStatus } from './use-network-status'

interface AdaptivePollingOptions<T> {
  fetcher: () => Promise<T>
  baseInterval: number
  maxInterval?: number
  minInterval?: number
  backoffMultiplier?: number
  errorThreshold?: number
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

interface AdaptivePollingResult<T> {
  data: T | null
  error: Error | null
  isLoading: boolean
  currentInterval: number
  consecutiveErrors: number
  refetch: () => Promise<void>
  reset: () => void
}

export function useAdaptivePolling<T>({
  fetcher,
  baseInterval,
  maxInterval = baseInterval * 10,
  minInterval = baseInterval / 2,
  backoffMultiplier = 2,
  errorThreshold = 3,
  enabled = true,
  onSuccess,
  onError,
}: AdaptivePollingOptions<T>): AdaptivePollingResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentInterval, setCurrentInterval] = useState(baseInterval)
  const [consecutiveErrors, setConsecutiveErrors] = useState(0)
  const isOnline = useNetworkStatus()

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const mountedRef = useRef(true)
  const lastSuccessRef = useRef<number>(Date.now())

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const fetch = useCallback(async () => {
    if (!enabled || !isOnline) return

    setIsLoading(true)
    try {
      const result = await fetcher()
      if (!mountedRef.current) return

      setData(result)
      setError(null)
      setConsecutiveErrors(0)
      lastSuccessRef.current = Date.now()

      setCurrentInterval((prev) => Math.max(minInterval, prev / backoffMultiplier))

      onSuccess?.(result)
    } catch (err) {
      if (!mountedRef.current) return

      const errorObj = err instanceof Error ? err : new Error(String(err))
      setError(errorObj)
      setConsecutiveErrors((prev) => prev + 1)

      if (consecutiveErrors >= errorThreshold) {
        setCurrentInterval((prev) => Math.min(maxInterval, prev * backoffMultiplier))
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

  const reset = useCallback(() => {
    setCurrentInterval(baseInterval)
    setConsecutiveErrors(0)
    setError(null)
    lastSuccessRef.current = Date.now()
  }, [baseInterval])

  useEffect(() => {
    if (!enabled || !isOnline) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      return
    }

    const poll = async () => {
      await fetch()
      if (mountedRef.current && enabled && isOnline) {
        timeoutRef.current = setTimeout(poll, currentInterval)
      }
    }

    poll()

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [enabled, isOnline, currentInterval, fetch])

  return {
    data,
    error,
    isLoading,
    currentInterval,
    consecutiveErrors,
    refetch: fetch,
    reset,
  }
}
