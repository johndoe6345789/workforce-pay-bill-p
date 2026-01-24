import { useKV } from '@github/spark/hooks'
import { useState, useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLocale as setReduxLocale } from '@/store/slices/uiSlice'

type Translations = Record<string, any>
type Locale = 'en' | 'es' | 'fr'

const AVAILABLE_LOCALES: Locale[] = ['en', 'es', 'fr']
const DEFAULT_LOCALE: Locale = 'en'

export function useTranslation() {
  const dispatch = useAppDispatch()
  const reduxLocale = useAppSelector(state => state.ui.locale)
  const [, setKVLocale] = useKV<Locale>('app-locale', DEFAULT_LOCALE)
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const locale = reduxLocale

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await import(`@/data/translations/${locale}.json`)
        setTranslations(response.default || response)
      } catch (err) {
        console.error(`Failed to load translations for locale: ${locale}`, err)
        setError(err as Error)
        
        if (locale !== DEFAULT_LOCALE) {
          try {
            const fallbackResponse = await import(`@/data/translations/${DEFAULT_LOCALE}.json`)
            setTranslations(fallbackResponse.default || fallbackResponse)
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

  const changeLocale = useCallback((newLocale: Locale) => {
    if (AVAILABLE_LOCALES.includes(newLocale)) {
      dispatch(setReduxLocale(newLocale))
      setKVLocale(newLocale)
    }
  }, [dispatch, setKVLocale])

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
  const [, setKVLocale] = useKV<Locale>('app-locale', DEFAULT_LOCALE)
  
  return useCallback((newLocale: Locale) => {
    if (AVAILABLE_LOCALES.includes(newLocale)) {
      dispatch(setReduxLocale(newLocale))
      setKVLocale(newLocale)
    }
  }, [dispatch, setKVLocale])
}
