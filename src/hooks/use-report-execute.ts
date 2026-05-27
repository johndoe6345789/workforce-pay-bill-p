import { useCallback } from 'react'
import type { ScheduledReport, ReportExecution, ReportType } from './use-scheduled-reports.types'

export function useReportExecute(
  generateReportData: (type: ReportType, filters?: Record<string, unknown>) => unknown[],
  exportToCSV: (data: unknown[], options: { filename: string }) => unknown,
  exportToExcel: (data: unknown[], options: { filename: string }) => unknown,
  setExecutions: (updater: (prev: ReportExecution[]) => ReportExecution[]) => void,
) {
  const executeReport = useCallback(async (schedule: ScheduledReport): Promise<ReportExecution> => {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      const data = generateReportData(schedule.type, schedule.filters)

      let exportResult
      const filename = `${schedule.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`

      if (schedule.format === 'csv') {
        exportResult = exportToCSV(data, { filename })
      } else if (schedule.format === 'excel') {
        exportResult = exportToExcel(data, { filename })
      } else if (schedule.format === 'json') {
        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        exportResult = true
      }

      const execution: ReportExecution = {
        id: executionId,
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        reportType: schedule.type,
        executedAt: new Date().toISOString(),
        status: 'success',
        format: schedule.format,
        recordCount: data.length
      }

      setExecutions(prev => [execution, ...prev].slice(0, 100))

      return execution
    } catch (error) {
      const execution: ReportExecution = {
        id: executionId,
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        reportType: schedule.type,
        executedAt: new Date().toISOString(),
        status: 'failed',
        format: schedule.format,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }

      setExecutions(prev => [execution, ...prev].slice(0, 100))

      return execution
    }
  }, [generateReportData, exportToCSV, exportToExcel, setExecutions])

  return { executeReport }
}
