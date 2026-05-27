import { useState } from 'react'
import { usePerformanceTest, type DatasetType } from '@/hooks/use-performance-test'
import { performanceMonitor } from '@/lib/performance-monitor'

export function usePerformanceTestPanel() {
  const [datasetType, setDatasetType] = useState<DatasetType>('timesheets')
  const [count, setCount] = useState(1000)
  const { generateTestData, clearResults, getReport, isGenerating, results } = usePerformanceTest()

  const runTest = async () => { await generateTestData(datasetType, count) }
  const viewFullReport = () => { performanceMonitor.logReport() }

  return {
    datasetType, setDatasetType,
    count, setCount,
    runTest, viewFullReport, clearResults, isGenerating,
    report: getReport(), results,
  }
}
