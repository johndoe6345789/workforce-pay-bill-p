import { useCallback } from 'react'
import type { FormatType, FormatOptions } from './use-formatter.types'
import { useNumericFormatters } from './use-numeric-formatters'
import { useDateFormatters } from './use-date-formatters'

export type { FormatType, FormatOptions } from './use-formatter.types'

export function useFormatter(defaultOptions: FormatOptions = {}) {
  const { formatCurrency, formatNumber, formatPercent } =
    useNumericFormatters(defaultOptions)
  const { formatDate, formatTime, formatDateTime } =
    useDateFormatters(defaultOptions)

  const formatValue = useCallback(
    (value: unknown, type: FormatType, options: FormatOptions = {}) => {
      switch (type) {
        case 'currency':
          return formatCurrency(value as number, options)
        case 'number':
          return formatNumber(value as number, options)
        case 'percent':
          return formatPercent(value as number, options)
        case 'date':
          return formatDate(value as string | Date, options)
        case 'time':
          return formatTime(value as string | Date, options)
        case 'datetime':
          return formatDateTime(value as string | Date, options)
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
