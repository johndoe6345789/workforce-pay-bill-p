export type ExportFormat = 'csv' | 'json' | 'xlsx'

export interface ExportColumn<T> {
  key: keyof T
  label: string
  format?: (value: T[keyof T], row: T) => string | number
}

export function exportToCSV<T>(
  data: T[],
  columns: ExportColumn<T>[],
  filename: string = 'export.csv'
): void {
  const headers = columns.map(col => col.label).join(',')
  
  const rows = data.map(row => {
    return columns.map(col => {
      const value = col.format 
        ? col.format(row[col.key], row)
        : row[col.key]
      
      const stringValue = String(value ?? '')
      
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      
      return stringValue
    }).join(',')
  })
  
  const csv = [headers, ...rows].join('\n')
  downloadFile(csv, filename, 'text/csv')
}

export function exportToJSON<T>(
  data: T[],
  columns?: ExportColumn<T>[],
  filename: string = 'export.json',
  pretty: boolean = true
): void {
  let exportData: any[]
  
  if (columns) {
    exportData = data.map(row => {
      const obj: any = {}
      columns.forEach(col => {
        obj[col.label] = col.format 
          ? col.format(row[col.key], row)
          : row[col.key]
      })
      return obj
    })
  } else {
    exportData = data
  }
  
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
  
  const rows = data.map(row => {
    return columns.map(col => {
      const value = col.format 
        ? col.format(row[col.key], row)
        : row[col.key]
      
      return String(value ?? '')
    }).join('\t')
  })
  
  const tsv = [headers, ...rows].join('\n')
  
  downloadFile(tsv, filename.replace('.xlsx', '.xls'), 'application/vnd.ms-excel')
}

function downloadFile(content: string, filename: string, mimeType: string): void {
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

export interface ExportOptions<T> {
  format: ExportFormat
  data: T[]
  columns: ExportColumn<T>[]
  filename?: string
  includeTimestamp?: boolean
}

export function exportData<T>(options: ExportOptions<T>): void {
  const { format, data, columns, includeTimestamp = true } = options
  
  let filename = options.filename || 'export'
  
  if (includeTimestamp) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    filename = `${filename}_${timestamp}`
  }
  
  switch (format) {
    case 'csv':
      exportToCSV(data, columns, `${filename}.csv`)
      break
    case 'json':
      exportToJSON(data, columns, `${filename}.json`)
      break
    case 'xlsx':
      exportToExcel(data, columns, `${filename}.xlsx`)
      break
  }
}
