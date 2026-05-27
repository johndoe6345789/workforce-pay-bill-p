export type FormatType =
  | 'currency'
  | 'number'
  | 'percent'
  | 'date'
  | 'time'
  | 'datetime'

export interface FormatOptions {
  locale?: string
  currency?: string
  decimals?: number
  dateFormat?: string
  timeFormat?: string
}
