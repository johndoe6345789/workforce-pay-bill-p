import { useCallback } from 'react'

export type ExportFormat = 'csv' | 'json' | 'xlsx'

export interface ExportOptions {
  filename?: string
  format?: ExportFormat
  columns?: string[]
  includeHeaders?: boolean
}

export function useDataExport() {
  const exportToCSV = useCallback(
    (data: any[], options: ExportOptions = {}) => {
      const {
        filename = 'export',
        columns,
        includeHeaders = true,
      } = options

      if (data.length === 0) {
        throw new Error('No data to export')
      }

      const keys = columns || Object.keys(data[0])
      let csv = ''

      if (includeHeaders) {
        csv += keys.join(',') + '\n'
      }

      data.forEach((row) => {
        const values = keys.map((key) => {
          const value = row[key]
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          if (stringValue.includes(',') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csv += values.join(',') + '\n'
      })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.csv`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    []
  )

  const exportToJSON = useCallback(
    (data: any[], options: ExportOptions = {}) => {
      const { filename = 'export' } = options

      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.json`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    []
  )

  const exportToExcel = useCallback(
    (data: any[], options: ExportOptions = {}) => {
      const {
        filename = 'export',
        columns,
        includeHeaders = true,
      } = options

      if (data.length === 0) {
        throw new Error('No data to export')
      }

      const keys = columns || Object.keys(data[0])
      
      let xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'
      xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" '
      xml += 'xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
      xml += '<Worksheet ss:Name="Sheet1"><Table>'

      if (includeHeaders) {
        xml += '<Row>'
        keys.forEach((key) => {
          xml += `<Cell><Data ss:Type="String">${escapeXml(String(key))}</Data></Cell>`
        })
        xml += '</Row>'
      }

      data.forEach((row) => {
        xml += '<Row>'
        keys.forEach((key) => {
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

      const blob = new Blob([xml], { type: 'application/vnd.ms-excel' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `${filename}.xls`
      link.click()
      URL.revokeObjectURL(link.href)
    },
    []
  )

  const exportData = useCallback(
    (data: any[], options: ExportOptions = {}) => {
      const { format = 'csv' } = options

      switch (format) {
        case 'csv':
          exportToCSV(data, options)
          break
        case 'json':
          exportToJSON(data, options)
          break
        case 'xlsx':
          exportToExcel(data, options)
          break
        default:
          throw new Error(`Unsupported export format: ${format}`)
      }
    },
    [exportToCSV, exportToJSON, exportToExcel]
  )

  return {
    exportToCSV,
    exportToJSON,
    exportToExcel,
    exportData,
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
