import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setLocale } from '@/store/slices/uiSlice'

type Locale = 'en' | 'es' | 'fr'

export function useLocaleInit() {
  const dispatch = useAppDispatch()
  const reduxLocale = useAppSelector(state => state.ui.locale)
  const [kvLocale] = useKV<Locale>('app-locale', 'en')

  useEffect(() => {
    if (kvLocale && kvLocale !== reduxLocale) {
      dispatch(setLocale(kvLocale))
    }
  }, [kvLocale, reduxLocale, dispatch])
}
