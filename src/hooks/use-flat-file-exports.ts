import { useCallback } from 'react'
import type { ExportOptions, ExportRow } from './use-data-export.types'

function downloadBlob(blob: Blob, filename: string): void {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  link.click()
  URL.revokeObjectURL(link.href)
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function useFlatFileExports() {
  const exportToCSV = useCallback((data: ExportRow[], options: ExportOptions = {}) => {
    const { filename = 'export', columns, includeHeaders = true } = options
    if (data.length === 0) throw new Error('No data to export')

    const keys = columns || Object.keys(data[0])
    let csv = ''
    if (includeHeaders) csv += keys.join(',') + '\n'

    data.forEach(row => {
      const values = keys.map(key => {
        const value = row[key]
        if (value === null || value === undefined) return ''
        const str = String(value)
        return str.includes(',') || str.includes('"')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      })
      csv += values.join(',') + '\n'
    })

    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8;' }), `${filename}.csv`)
  }, [])

  const exportToJSON = useCallback((data: ExportRow[], options: ExportOptions = {}) => {
    const { filename = 'export' } = options
    downloadBlob(
      new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
      `${filename}.json`
    )
  }, [])

  const exportToExcel = useCallback((data: ExportRow[], options: ExportOptions = {}) => {
    const { filename = 'export', columns, includeHeaders = true } = options
    if (data.length === 0) throw new Error('No data to export')

    const keys = columns || Object.keys(data[0])
    let xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" '
    xml += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
    xml += '<Worksheet ss:Name="Sheet1"><Table>'

    if (includeHeaders) {
      xml += '<Row>'
      keys.forEach(key => {
        xml += `<Cell><Data ss:Type="String">${escapeXml(String(key))}</Data></Cell>`
      })
      xml += '</Row>'
    }

    data.forEach(row => {
      xml += '<Row>'
      keys.forEach(key => {
        const value = row[key]
        if (value === null || value === undefined) {
          xml += '<Cell><Data ss:Type="String"></Data></Cell>'
        } else if (typeof value === 'number') {
          xml += `<Cell><Data ss:Type="Number">${value}</Data></Cell>`
        } else {
          xml += `<Cell><Data ss:Type="String">${escapeXml(String(value))}</Data></Cell>`
        }
      })
      xml += '</Row>'
    })

    xml += '</Table></Worksheet></Workbook>'
    downloadBlob(
      new Blob([xml], { type: 'application/vnd.ms-excel' }),
      `${filename}.xls`
    )
  }, [])

  return { exportToCSV, exportToJSON, exportToExcel }
}
