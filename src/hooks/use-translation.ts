import { useState, useEffect, useCallback } from 'react'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setLocale as setReduxLocale } from '@/store/slices/uiSlice'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import {
  Locale,
  AVAILABLE_LOCALES,
  DEFAULT_LOCALE,
  translationsCache,
  loadTranslationFile
} from './use-translation-loader'

export { preloadAllTranslations } from './use-translation-loader'
export type { Locale } from './use-translation-loader'

type Translations = Record<string, unknown>

export function useLocale() {
  return useAppSelector(state => state.ui.locale)
}

export function useChangeLocale() {
  const dispatch = useAppDispatch()
  const [, setDBLocale] = useIndexedDBState<Locale>('app-locale', DEFAULT_LOCALE)
  return useCallback(async (newLocale: Locale) => {
    if (!AVAILABLE_LOCALES.includes(newLocale)) return
    try {
      if (!translationsCache.has(newLocale)) await loadTranslationFile(newLocale)
      dispatch(setReduxLocale(newLocale))
      setDBLocale(newLocale)
    } catch (err) {
      console.error(`Failed to load translations for ${newLocale}`, err)
    }
  }, [dispatch, setDBLocale])
}

export function useTranslation() {
  const locale = useAppSelector(state => state.ui.locale)
  const translationsReady = useAppSelector(state => state.ui.translationsReady)
  const changeLocale = useChangeLocale()
  const [translations, setTranslations] = useState<Translations>(
    () => translationsCache.get(locale) || {}
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const load = async () => {
      if (translationsCache.has(locale)) {
        setTranslations(translationsCache.get(locale)!)
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        setError(null)
        setTranslations(await loadTranslationFile(locale))
      } catch (err) {
        console.error(`Failed to load translations for locale: ${locale}`, err)
        setError(err instanceof Error ? err : new Error(String(err)))
        if (locale !== DEFAULT_LOCALE) {
          try { setTranslations(await loadTranslationFile(DEFAULT_LOCALE)) }
          catch (e) { console.error('Failed to load fallback translations', e) }
        }
      } finally {
        setIsLoading(false)
      }
    }
    if (translationsReady) load()
  }, [locale, translationsReady])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: unknown = translations
      for (const k of keys) {
        if (value && typeof value === 'object' && k in (value as object)) {
          value = (value as Record<string, unknown>)[k]
        } else return key
      }
      if (typeof value !== 'string') return key
      if (params) {
        return value.replace(/\{\{(\w+)\}\}/g, (match, pk: string) =>
          params[pk]?.toString() || match
        )
      }
      return value
    },
    [translations]
  )

  return { t, locale, changeLocale, availableLocales: AVAILABLE_LOCALES, isLoading, error }
}
