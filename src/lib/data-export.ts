export type { ExportFormat, ExportColumn, ExportOptions } from './data-export.types'
export { exportToCSV, exportToJSON, exportToExcel } from './data-export-utils'

import type { ExportOptions } from './data-export.types'
import { exportToCSV, exportToJSON, exportToExcel } from './data-export-utils'

export function exportData<T>(options: ExportOptions<T>): void {
  const { format, data, columns, includeTimestamp = true } = options

  let filename = options.filename ?? 'export'

  if (includeTimestamp) {
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')
      .slice(0, -5)
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
