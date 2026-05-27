import { useCallback } from 'react'
import type { FormatOptions } from './use-formatter.types'

export function useNumericFormatters(defaultOptions: FormatOptions) {
  const formatCurrency = useCallback(
    (value: number, options: FormatOptions = {}) => {
      const { locale = 'en-GB', currency = 'GBP', decimals = 2 } = {
        ...defaultOptions,
        ...options,
      }
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
    },
    [defaultOptions]
  )

  const formatNumber = useCallback(
    (value: number, options: FormatOptions = {}) => {
      const { locale = 'en-GB', decimals = 2 } = {
        ...defaultOptions,
        ...options,
      }
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value)
    },
    [defaultOptions]
  )

  const formatPercent = useCallback(
    (value: number, options: FormatOptions = {}) => {
      const { locale = 'en-GB', decimals = 1 } = {
        ...defaultOptions,
        ...options,
      }
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(value / 100)
    },
    [defaultOptions]
  )

  return { formatCurrency, formatNumber, formatPercent }
}
