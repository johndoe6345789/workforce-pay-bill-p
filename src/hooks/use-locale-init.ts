import { useEffect, useRef, useState } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLocale, setTranslationsReady } from '@/store/slices/uiSlice'
import { preloadAllTranslations } from '@/hooks/use-translation'

type Locale = 'en' | 'es' | 'fr'

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
      
      await preloadAllTranslations()
      
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
