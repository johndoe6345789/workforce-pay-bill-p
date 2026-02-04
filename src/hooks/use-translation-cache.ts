import { useState, useEffect, useCallback } from 'react'

interface TranslationCache {
  [locale: string]: Record<string, any>
}

const cache: TranslationCache = {}
const loadingStates: { [locale: string]: Promise<Record<string, any>> | null } = {}

export function useTranslationCache() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const loadTranslations = useCallback(async (locale: string): Promise<Record<string, any>> => {
    if (cache[locale]) {
      return cache[locale]
    }

    if (loadingStates[locale]) {
      return loadingStates[locale]!
    }

    setIsLoading(true)
    setError(null)

    const loadPromise = fetch(`/src/data/translations/${locale}.json`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${locale}`)
        }
        const data = await response.json()
        cache[locale] = data
        return data
      })
      .catch((err) => {
        setError(err)
        throw err
      })
      .finally(() => {
        loadingStates[locale] = null
        setIsLoading(false)
      })

    loadingStates[locale] = loadPromise
    return loadPromise
  }, [])

  const preloadTranslations = useCallback(async (locales: string[]) => {
    await Promise.all(locales.map(locale => loadTranslations(locale)))
  }, [loadTranslations])

  const clearCache = useCallback((locale?: string) => {
    if (locale) {
      delete cache[locale]
      loadingStates[locale] = null
    } else {
      Object.keys(cache).forEach(key => delete cache[key])
      Object.keys(loadingStates).forEach(key => loadingStates[key] = null)
    }
  }, [])

  const getCachedTranslation = useCallback((locale: string): Record<string, any> | null => {
    return cache[locale] || null
  }, [])

  return {
    loadTranslations,
    preloadTranslations,
    clearCache,
    getCachedTranslation,
    isLoading,
    error,
  }
}
