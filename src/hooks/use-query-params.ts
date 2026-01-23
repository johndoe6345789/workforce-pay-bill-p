import { useState, useCallback, useEffect } from 'react'

export function useQueryParams<T extends Record<string, string>>() {
  const [params, setParams] = useState<T>(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const result = {} as T
    searchParams.forEach((value, key) => {
      result[key as keyof T] = value as T[keyof T]
    })
    return result
  })

  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search)
      const result = {} as T
      searchParams.forEach((value, key) => {
        result[key as keyof T] = value as T[keyof T]
      })
      setParams(result)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const updateParams = useCallback((updates: Partial<T>) => {
    const searchParams = new URLSearchParams(window.location.search)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        searchParams.delete(key)
      } else {
        searchParams.set(key, String(value))
      }
    })

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`
    window.history.pushState({}, '', newUrl)

    setParams(prev => {
      const newParams = { ...prev }
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          delete newParams[key as keyof T]
        } else {
          newParams[key as keyof T] = value as T[keyof T]
        }
      })
      return newParams
    })
  }, [])

  const clearParams = useCallback(() => {
    window.history.pushState({}, '', window.location.pathname)
    setParams({} as T)
  }, [])

  return {
    params,
    updateParams,
    clearParams
  }
}
