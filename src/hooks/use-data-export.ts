import { useCallback } from 'react'
import { usePDFExport, type PDFTableColumn } from './use-pdf-export'
import { useFlatFileExports } from './use-flat-file-exports'
import type { ExportOptions, ExportRow } from './use-data-export.types'

export type { ExportFormat, ExportOptions, ExportRow } from './use-data-export.types'

export function useDataExport() {
  const { exportTableToPDF } = usePDFExport()
  const { exportToCSV, exportToJSON, exportToExcel } = useFlatFileExports()

  const exportToPDF = useCallback((data: ExportRow[], options: ExportOptions = {}) => {
    const {
      filename = 'export',
      columns,
      title = 'Data Export',
      columnHeaders = {}
    } = options

    if (data.length === 0) throw new Error('No data to export')

    const keys = columns || Object.keys(data[0])
    const pdfColumns: PDFTableColumn[] = keys.map(key => ({
      header: columnHeaders[key] || key,
      key,
      align: 'left' as const,
      format: (value: unknown): string => {
        if (value === null || value === undefined) return ''
        if (typeof value === 'number') return value.toLocaleString()
        return String(value)
      }
    }))

    exportTableToPDF(data, pdfColumns, {
      filename,
      title,
      includeTimestamp: true,
      includePageNumbers: true
    })
  }, [exportTableToPDF])

  const exportData = useCallback((data: ExportRow[], options: ExportOptions = {}) => {
    const { format = 'csv' } = options
    switch (format) {
      case 'csv':   return exportToCSV(data, options)
      case 'json':  return exportToJSON(data, options)
      case 'xlsx':  return exportToExcel(data, options)
      case 'pdf':   return exportToPDF(data, options)
      default:      throw new Error(`Unsupported export format: ${format}`)
    }
  }, [exportToCSV, exportToJSON, exportToExcel, exportToPDF])

  return { exportToCSV, exportToJSON, exportToExcel, exportToPDF, exportData }
}
