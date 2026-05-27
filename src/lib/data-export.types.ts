export type ExportFormat = 'csv' | 'json' | 'xlsx'

export interface ExportColumn<T> {
  key: keyof T
  label: string
  format?: (value: T[keyof T], row: T) => string | number
}

export interface ExportOptions<T> {
  format: ExportFormat
  data: T[]
  columns: ExportColumn<T>[]
  filename?: string
  includeTimestamp?: boolean
}
