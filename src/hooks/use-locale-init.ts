import { useEffect, useRef, useState } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLocale, setTranslationsReady } from '@/store/slices/uiSlice'

type Locale = 'en' | 'es' | 'fr'

async function preloadTranslations(locale: Locale): Promise<void> {
  try {
    await import(`@/data/translations/${locale}.json`)
  } catch (err) {
    console.error(`Failed to preload translations for ${locale}`, err)
  }
}

export function useLocaleInit() {
  const dispatch = useAppDispatch()
  const reduxLocale = useAppSelector(state => state.ui.locale)
  const [dbLocale] = useIndexedDBState<Locale>('app-locale', 'en')
  const initialized = useRef(false)
  const [isPreloading, setIsPreloading] = useState(true)

  useEffect(() => {
    async function initializeLocale() {
      if (initialized.current) return
      
      const localeToUse = dbLocale || 'en'
      
      await preloadTranslations(localeToUse)
      
      if (localeToUse !== reduxLocale) {
        dispatch(setLocale(localeToUse))
      }
      
      dispatch(setTranslationsReady(true))
      setIsPreloading(false)
      initialized.current = true
    }

    initializeLocale()
  }, [dbLocale, reduxLocale, dispatch])

  return { isPreloading }
}
