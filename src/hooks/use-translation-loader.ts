type Translations = Record<string, unknown>
export type Locale = 'en' | 'es' | 'fr'

export const AVAILABLE_LOCALES: Locale[] = ['en', 'es', 'fr']
export const DEFAULT_LOCALE: Locale = 'en'

export const translationsCache: Map<Locale, Translations> = new Map()
const loadingPromises: Map<Locale, Promise<Translations>> = new Map()

export async function loadTranslationFile(
  locale: Locale
): Promise<Translations> {
  if (translationsCache.has(locale)) {
    return translationsCache.get(locale)!
  }

  if (loadingPromises.has(locale)) {
    return loadingPromises.get(locale)!
  }

  const promise = import(`@/data/translations/${locale}.json`)
    .then(response => {
      const translations: Translations = response.default || response
      translationsCache.set(locale, translations)
      loadingPromises.delete(locale)
      return translations
    })
    .catch((err: unknown) => {
      loadingPromises.delete(locale)
      console.error(`Failed to load translations for ${locale}:`, err)
      throw err
    })

  loadingPromises.set(locale, promise)
  return promise
}

export async function preloadAllTranslations(): Promise<void> {
  await Promise.all(
    AVAILABLE_LOCALES.map(locale =>
      loadTranslationFile(locale).catch((err: unknown) => {
        console.error(`Failed to preload ${locale}:`, err)
      })
    )
  )
}
