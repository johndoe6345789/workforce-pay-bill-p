import { useState, useCallback } from 'react'

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

    const loadPromise = import(`@/data/translations/${locale}.json`)
      .then((module) => {
        const data = module.default || module
        cache[locale] = data
        return data
      })
      .catch((err) => {
        console.error(`Failed to load translations for ${locale}:`, err)
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
    await Promise.all(
      locales.map(locale => 
        loadTranslations(locale).catch(err => {
          console.error(`Failed to preload ${locale}:`, err)
        })
      )
    )
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
