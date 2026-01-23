import { useState, useCallback } from 'react'

export type DownloadFormat = 'csv' | 'json' | 'txt'

export interface UseDownloadReturn {
  download: (data: string, filename: string, format?: DownloadFormat) => void
  downloadJSON: (data: any, filename: string) => void
  downloadCSV: (data: any[], filename: string) => void
  isDownloading: boolean
}

export function useDownload(): UseDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false)

  const download = useCallback((data: string, filename: string, format: DownloadFormat = 'txt') => {
    setIsDownloading(true)

    try {
      const mimeTypes = {
        csv: 'text/csv',
        json: 'application/json',
        txt: 'text/plain'
      }

      const blob = new Blob([data], { type: mimeTypes[format] })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } finally {
      setIsDownloading(false)
    }
  }, [])

  const downloadJSON = useCallback((data: any, filename: string) => {
    const jsonString = JSON.stringify(data, null, 2)
    download(jsonString, `${filename}.json`, 'json')
  }, [download])

  const downloadCSV = useCallback((data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header]
          const escaped = String(value).replace(/"/g, '""')
          return `"${escaped}"`
        }).join(',')
      )
    ]

    const csvString = csvRows.join('\n')
    download(csvString, `${filename}.csv`, 'csv')
  }, [download])

  return {
    download,
    downloadJSON,
    downloadCSV,
    isDownloading
  }
}
