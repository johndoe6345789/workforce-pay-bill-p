import { useState, useCallback } from 'react'

export interface UseAsyncActionResult<T, P extends any[]> {
  execute: (...args: P) => Promise<T | undefined>
  data: T | undefined
  loading: boolean
  error: Error | null
  reset: () => void
}

export function useAsyncAction<T, P extends any[]>(
  asyncFunction: (...args: P) => Promise<T>
): UseAsyncActionResult<T, P> {
  const [data, setData] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (...args: P) => {
      setLoading(true)
      setError(null)

      try {
        const result = await asyncFunction(...args)
        setData(result)
        return result
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Unknown error')
        setError(error)
        return undefined
      } finally {
        setLoading(false)
      }
    },
    [asyncFunction]
  )

  const reset = useCallback(() => {
    setData(undefined)
    setLoading(false)
    setError(null)
  }, [])

  return { execute, data, loading, error, reset }
}
