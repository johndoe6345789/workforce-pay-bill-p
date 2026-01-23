import { useState, useEffect, useCallback } from 'react'

export interface UseFetchOptions<T> {
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  skip?: boolean
}

export interface UseFetchResult<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useFetch<T = any>(
  url: string | null,
  options: UseFetchOptions<T> = {}
): UseFetchResult<T> {
  const { initialData, onSuccess, onError, skip = false } = options
  const [data, setData] = useState<T | undefined>(initialData)
  const [loading, setLoading] = useState(!skip && !!url)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    if (!url || skip) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
      onSuccess?.(result)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [url, skip, onSuccess, onError])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
