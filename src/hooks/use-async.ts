import { useState, useCallback, useEffect } from 'react'

export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true
): AsyncState<T> & { execute: () => Promise<void> } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    
    try {
      const data = await asyncFunction()
      setState({ data, loading: false, error: null })
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate, execute])

  return { ...state, execute }
}
