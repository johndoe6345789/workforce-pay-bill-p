import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useState, useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLocale as setReduxLocale } from '@/store/slices/uiSlice'

type Translations = Record<string, any>
type Locale = 'en' | 'es' | 'fr'

const AVAILABLE_LOCALES: Locale[] = ['en', 'es', 'fr']
const DEFAULT_LOCALE: Locale = 'en'

const translationsCache: Map<Locale, Translations> = new Map()
const loadingPromises: Map<Locale, Promise<Translations>> = new Map()

async function loadTranslationFile(locale: Locale): Promise<Translations> {
  if (translationsCache.has(locale)) {
    return translationsCache.get(locale)!
  }

  if (loadingPromises.has(locale)) {
    return loadingPromises.get(locale)!
  }

  const promise = import(`@/data/translations/${locale}.json`)
    .then(response => {
      const translations = response.default || response
      translationsCache.set(locale, translations)
      loadingPromises.delete(locale)
      return translations
    })
    .catch(err => {
      loadingPromises.delete(locale)
      throw err
    })

  loadingPromises.set(locale, promise)
  return promise
}

export function useTranslation() {
  const dispatch = useAppDispatch()
  const reduxLocale = useAppSelector(state => state.ui.locale)
  const [, setDBLocale] = useIndexedDBState<Locale>('app-locale', DEFAULT_LOCALE)
  const [translations, setTranslations] = useState<Translations>(() => 
    translationsCache.get(reduxLocale) || {}
  )
  const [isLoading, setIsLoading] = useState(!translationsCache.has(reduxLocale))
  const [error, setError] = useState<Error | null>(null)

  const locale = reduxLocale

  useEffect(() => {
    const loadTranslations = async () => {
      if (translationsCache.has(locale)) {
        setTranslations(translationsCache.get(locale)!)
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        
        const loadedTranslations = await loadTranslationFile(locale)
        setTranslations(loadedTranslations)
      } catch (err) {
        console.error(`Failed to load translations for locale: ${locale}`, err)
        setError(err as Error)
        
        if (locale !== DEFAULT_LOCALE) {
          try {
            const fallbackTranslations = await loadTranslationFile(DEFAULT_LOCALE)
            setTranslations(fallbackTranslations)
          } catch (fallbackErr) {
            console.error('Failed to load fallback translations', fallbackErr)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadTranslations()
  }, [locale])

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = translations

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }, [translations])

  const changeLocale = useCallback(async (newLocale: Locale) => {
    if (AVAILABLE_LOCALES.includes(newLocale)) {
      try {
        await loadTranslationFile(newLocale)
        dispatch(setReduxLocale(newLocale))
        setDBLocale(newLocale)
      } catch (err) {
        console.error(`Failed to change locale to ${newLocale}`, err)
      }
    }
  }, [dispatch, setDBLocale])

  return {
    t,
    locale,
    changeLocale,
    availableLocales: AVAILABLE_LOCALES,
    isLoading,
    error
  }
}

export function useLocale() {
  const locale = useAppSelector(state => state.ui.locale)
  return locale
}

export function useChangeLocale() {
  const dispatch = useAppDispatch()
  const [, setDBLocale] = useIndexedDBState<Locale>('app-locale', DEFAULT_LOCALE)
  
  return useCallback(async (newLocale: Locale) => {
    if (AVAILABLE_LOCALES.includes(newLocale)) {
      dispatch(setReduxLocale(newLocale))
      setDBLocale(newLocale)
      
      try {
        await loadTranslationFile(newLocale)
      } catch (err) {
        console.error(`Failed to load translations for ${newLocale}`, err)
      }
    }
  }, [dispatch, setDBLocale])
}
