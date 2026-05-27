import { useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import type { FormatOptions } from './use-formatter.types'

export function useDateFormatters(defaultOptions: FormatOptions) {
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

  return { formatDate, formatTime, formatDateTime }
}
