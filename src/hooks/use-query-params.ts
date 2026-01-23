import { useState, useCallback, useEffect } from 'react'

export function useQueryParams<T extends Record<string, string | undefined>>(
  initialParams: T
): [T, (key: keyof T, value: string | undefined) => void, (params: Partial<T>) => void] {
  const [params, setParamsState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialParams
    
    const urlParams = new URLSearchParams(window.location.search)
    const result = { ...initialParams }
    
    Object.keys(initialParams).forEach((key) => {
      const value = urlParams.get(key)
      if (value !== null) {
        ;(result as any)[key] = value
      }
    })
    
    return result
  })

  const updateURL = useCallback((newParams: T) => {
    const urlParams = new URLSearchParams()
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        urlParams.set(key, value)
      }
    })
    
    const newURL = urlParams.toString()
      ? `${window.location.pathname}?${urlParams.toString()}`
      : window.location.pathname
      
    window.history.replaceState({}, '', newURL)
  }, [])

  const setParam = useCallback((key: keyof T, value: string | undefined) => {
    setParamsState((prev) => {
      const newParams = { ...prev, [key]: value }
      updateURL(newParams)
      return newParams
    })
  }, [updateURL])

  const setParams = useCallback((newParams: Partial<T>) => {
    setParamsState((prev) => {
      const merged = { ...prev, ...newParams }
      updateURL(merged)
      return merged
    })
  }, [updateURL])

  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search)
      const newParams = { ...initialParams }
      
      Object.keys(initialParams).forEach((key) => {
        const value = urlParams.get(key)
        if (value !== null) {
          ;(newParams as any)[key] = value
        }
      })
      
      setParamsState(newParams)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [initialParams])

  return [params, setParam, setParams]
}
