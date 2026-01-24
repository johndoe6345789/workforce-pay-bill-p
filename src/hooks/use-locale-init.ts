import { useEffect, useRef } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLocale } from '@/store/slices/uiSlice'

type Locale = 'en' | 'es' | 'fr'

export function useLocaleInit() {
  const dispatch = useAppDispatch()
  const reduxLocale = useAppSelector(state => state.ui.locale)
  const [dbLocale] = useIndexedDBState<Locale>('app-locale', 'en')
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current && dbLocale && dbLocale !== reduxLocale) {
      dispatch(setLocale(dbLocale))
      initialized.current = true
    }
  }, [dbLocale, reduxLocale, dispatch])
}
