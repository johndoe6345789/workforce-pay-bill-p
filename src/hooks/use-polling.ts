import { useState, useEffect, useRef, useCallback } from 'react'

export interface PollingOptions<T> {
  interval: number
  enabled?: boolean
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  maxRetries?: number
  backoffMultiplier?: number
  shouldRetry?: (error: Error, retryCount: number) => boolean
}

export function usePolling<T>(
  fetchFn: () => Promise<T>,
  options: PollingOptions<T>
) {
  const {
    interval,
    enabled = true,
    onSuccess,
    onError,
    maxRetries = 3,
    backoffMultiplier = 1.5,
    shouldRetry = () => true
  } = options

  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isPolling, setIsPolling] = useState(enabled)
  const [retryCount, setRetryCount] = useState(0)

  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isMountedRef = useRef(true)

  const poll = useCallback(async () => {
    try {
      const result = await fetchFn()
      
      if (!isMountedRef.current) return

      setData(result)
      setError(null)
      void setRetryCount(0)
      onSuccess?.(result)
      
      if (isPolling && isMountedRef.current) {
        timerRef.current = setTimeout(() => { void poll() }, interval)
      }
    } catch (err) {
      if (!isMountedRef.current) return

      const error = err instanceof Error ? err : new Error('Polling failed')
      setError(error)
      onError?.(error)

      const currentRetry = retryCount + 1
      
      if (currentRetry < maxRetries && shouldRetry(error, currentRetry)) {
        void setRetryCount(currentRetry)
        const backoffDelay = interval * Math.pow(backoffMultiplier, currentRetry)
        
        if (isPolling && isMountedRef.current) {
          timerRef.current = setTimeout(() => { void poll() }, backoffDelay)
        }
      } else {
        setIsPolling(false)
      }
    }
  }, [fetchFn, interval, isPolling, retryCount, maxRetries, backoffMultiplier, shouldRetry, onSuccess, onError])

  const start = useCallback(() => {
    setIsPolling(true)
    void setRetryCount(0)
    void poll()
  }, [poll])

  const stop = useCallback(() => {
    setIsPolling(false)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }, [])

  const reset = useCallback(() => {
    stop()
    setData(null)
    setError(null)
    setRetryCount(0)
  }, [stop])

  const refresh = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    await poll()
  }, [poll])

  useEffect(() => {
    if (enabled && isPolling) {
      const startPolling = async () => {
        await poll()
      }
      void startPolling()
    }

    return () => {
      isMountedRef.current = false
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [enabled, isPolling, poll])

  return {
    data,
    error,
    isPolling,
    retryCount,
    start,
    stop,
    reset,
    refresh
  }
}
