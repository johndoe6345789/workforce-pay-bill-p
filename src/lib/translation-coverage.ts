export type { TranslationCoverage } from './translation-coverage.types'
import type { TranslationCoverage } from './translation-coverage.types'
import { REACT_PAGES, PAGES_WITH_TRANSLATIONS } from './translation-coverage-data'

export { REACT_PAGES, PAGES_WITH_TRANSLATIONS } from './translation-coverage-data'

export function calculateTranslationCoverage(): TranslationCoverage {
  const totalPages = REACT_PAGES.length
  const translatedPages = PAGES_WITH_TRANSLATIONS.length
  const percentage = Math.round((translatedPages / totalPages) * 100)

  const pagesWithoutTranslations = REACT_PAGES.filter(
    page => !PAGES_WITH_TRANSLATIONS.includes(page)
  )

  return {
    totalPages,
    translatedPages,
    percentage,
    pagesWithoutTranslations,
  }
}
