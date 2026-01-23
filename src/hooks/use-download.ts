import { useCallback, useState } from 'react'

export function useDownload() {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadFile = useCallback(async (
    data: string | Blob,
    filename: string,
    type?: string
  ) => {
    setIsDownloading(true)
    
    try {
      const blob = typeof data === 'string' 
        ? new Blob([data], { type: type || 'text/plain' })
        : data

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      return true
    } catch (error) {
      console.error('Download failed:', error)
      return false
    } finally {
      setIsDownloading(false)
    }
  }, [])

  const downloadJSON = useCallback((data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2)
    return downloadFile(json, filename, 'application/json')
  }, [downloadFile])

  const downloadCSV = useCallback((data: any[], filename: string) => {
    if (data.length === 0) return Promise.resolve(false)
    
    const headers = Object.keys(data[0])
    const csv = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header]
          const stringValue = String(value ?? '')
          return stringValue.includes(',') ? `"${stringValue}"` : stringValue
        }).join(',')
      )
    ].join('\n')
    
    return downloadFile(csv, filename, 'text/csv')
  }, [downloadFile])

  return {
    isDownloading,
    downloadFile,
    downloadJSON,
    downloadCSV
  }
}
