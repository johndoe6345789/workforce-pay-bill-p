import { useState, useCallback } from 'react'
import { generateLargeDataset, createMockTimesheet, createMockInvoice, createMockPayroll, createMockWorker } from '@/lib/data-generator'
import { performanceMonitor } from '@/lib/performance-monitor'

export type DatasetType = 'timesheets' | 'invoices' | 'payroll' | 'workers'

interface PerformanceTestResult {
  datasetType: DatasetType
  count: number
  generationTime: number
  renderTime?: number
  memoryUsed?: number
}

export function usePerformanceTest() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<PerformanceTestResult[]>([])

  const generateTestData = useCallback(async (type: DatasetType, count: number) => {
    setIsGenerating(true)

    try {
      performanceMonitor.start(`generate-${type}`)
      
      let data: any[]
      switch (type) {
        case 'timesheets':
          data = await generateLargeDataset({ count, template: createMockTimesheet, batchSize: 1000 })
          break
        case 'invoices':
          data = await generateLargeDataset({ count, template: createMockInvoice, batchSize: 1000 })
          break
        case 'payroll':
          data = await generateLargeDataset({ count, template: createMockPayroll, batchSize: 1000 })
          break
        case 'workers':
          data = await generateLargeDataset({ count, template: createMockWorker, batchSize: 1000 })
          break
      }

      const metric = performanceMonitor.end(`generate-${type}`)

      const result: PerformanceTestResult = {
        datasetType: type,
        count,
        generationTime: metric?.duration || 0,
        memoryUsed: metric?.memory?.used,
      }

      setResults((prev) => [...prev, result])

      return data
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
    performanceMonitor.clear()
  }, [])

  const getReport = useCallback(() => {
    return {
      totalTests: results.length,
      averageGenerationTime:
        results.reduce((sum, r) => sum + r.generationTime, 0) / results.length || 0,
      totalItemsGenerated: results.reduce((sum, r) => sum + r.count, 0),
      results,
    }
  }, [results])

  return {
    generateTestData,
    clearResults,
    getReport,
    isGenerating,
    results,
  }
}
