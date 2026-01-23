import { useCallback } from 'react'
import { format, parseISO } from 'date-fns'

export type FormatType = 'currency' | 'number' | 'percent' | 'date' | 'time' | 'datetime'

export interface FormatOptions {
  locale?: string
  currency?: string
  decimals?: number
  dateFormat?: string
  timeFormat?: string
}

export function useFormatter(defaultOptions: FormatOptions = {}) {
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

  const formatDate = useCallback(
    (value: string | Date, options: FormatOptions = {}) => {
      const { dateFormat = 'dd MMM yyyy' } = { ...defaultOptions, ...options }
      const date = typeof value === 'string' ? parseISO(value) : value
      return format(date, dateFormat)
    },
    [defaultOptions]
  )

  const formatTime = useCallback(
    (value: string | Date, options: FormatOptions = {}) => {
      const { timeFormat = 'HH:mm' } = { ...defaultOptions, ...options }
      const date = typeof value === 'string' ? parseISO(value) : value
      return format(date, timeFormat)
    },
    [defaultOptions]
  )

  const formatDateTime = useCallback(
    (value: string | Date, options: FormatOptions = {}) => {
      const { dateFormat = 'dd MMM yyyy', timeFormat = 'HH:mm' } = {
        ...defaultOptions,
        ...options,
      }
      const date = typeof value === 'string' ? parseISO(value) : value
      return format(date, `${dateFormat} ${timeFormat}`)
    },
    [defaultOptions]
  )

  const formatValue = useCallback(
    (value: any, type: FormatType, options: FormatOptions = {}) => {
      switch (type) {
        case 'currency':
          return formatCurrency(value, options)
        case 'number':
          return formatNumber(value, options)
        case 'percent':
          return formatPercent(value, options)
        case 'date':
          return formatDate(value, options)
        case 'time':
          return formatTime(value, options)
        case 'datetime':
          return formatDateTime(value, options)
        default:
          return String(value)
      }
    },
    [formatCurrency, formatNumber, formatPercent, formatDate, formatTime, formatDateTime]
  )

  return {
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
    formatTime,
    formatDateTime,
    formatValue,
  }
}
