import { useCallback } from 'react'
import { toast } from 'sonner'

export type ExportFormat = 'csv' | 'json' | 'xlsx'

export function useExport() {
  const exportToCSV = useCallback((data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('No data to export')
      return
    }

    const headers = Object.keys(data[0])
    const csv = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header]
          const stringValue = value?.toString() || ''
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue
        }).join(',')
      )
    ].join('\n')

    downloadFile(csv, `${filename}.csv`, 'text/csv')
    toast.success('Exported to CSV')
  }, [])

  const exportToJSON = useCallback((data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast.error('No data to export')
      return
    }

    const json = JSON.stringify(data, null, 2)
    downloadFile(json, `${filename}.json`, 'application/json')
    toast.success('Exported to JSON')
  }, [])

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return {
    exportToCSV,
    exportToJSON
  }
}
