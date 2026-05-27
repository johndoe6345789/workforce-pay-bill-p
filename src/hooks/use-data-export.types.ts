export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf'

export interface ExportOptions {
  filename?: string
  format?: ExportFormat
  columns?: string[]
  includeHeaders?: boolean
  title?: string
  columnHeaders?: Record<string, string>
}

export type ExportRow = Record<string, unknown>
