import type { ExportColumn } from './data-export.types'

export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  setTimeout(() => {
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 100)
}

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string = 'export.csv'
): void {
  const headers = columns.map(col => col.label).join(',')

  const rows = data.map(row =>
    columns
      .map(col => {
        const value = col.format
          ? col.format(row[col.key], row)
          : row[col.key]
        const stringValue = String(value ?? '')
        if (
          stringValue.includes(',') ||
          stringValue.includes('"') ||
          stringValue.includes('\n')
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  )

  downloadFile([headers, ...rows].join('\n'), filename, 'text/csv')
}

export function exportToJSON<T>(
  data: T[],
  columns?: ExportColumn<T>[],
  filename: string = 'export.json',
  pretty: boolean = true
): void {
  const exportData = columns
    ? data.map(row => {
        const obj: Record<string, unknown> = {}
        columns.forEach(col => {
          obj[col.label] = col.format
            ? col.format(row[col.key], row)
            : row[col.key]
        })
        return obj
      })
    : data

  const json = pretty
    ? JSON.stringify(exportData, null, 2)
    : JSON.stringify(exportData)

  downloadFile(json, filename, 'application/json')
}

export function exportToExcel<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string = 'export.xlsx'
): void {
  const headers = columns.map(col => col.label).join('\t')

  const rows = data.map(row =>
    columns
      .map(col => {
        const value = col.format
          ? col.format(row[col.key], row)
          : row[col.key]
        return String(value ?? '')
      })
      .join('\t')
  )

  downloadFile(
    [headers, ...rows].join('\n'),
    filename.replace('.xlsx', '.xls'),
    'application/vnd.ms-excel'
  )
}
