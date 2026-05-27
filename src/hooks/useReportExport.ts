import { toast } from 'sonner'
import { usePDFExport, type PDFTableColumn } from '@/hooks/use-pdf-export'
import { buildMetricCsvValues, buildMetricPdfColumns, buildMetricPdfRow, downloadBlob, type MetricRow } from './useReportExport.helpers'

type ReportType = 'timesheet' | 'invoice' | 'payroll' | 'expense' | 'margin'
type GroupByField = 'worker' | 'client' | 'date' | 'status' | 'month' | 'week'

interface ReportConfig {
  name: string
  type: ReportType
  dateRange: { from: string; to: string }
  groupBy?: GroupByField
  metrics: string[]
  filters: unknown[]
}

interface ReportResult {
  name: string
  generatedAt: string
  totalRecords: number
  data: MetricRow[]
}

export function useReportExport(reportResult: ReportResult, reportConfig: ReportConfig) {
  const { exportTableToPDF } = usePDFExport()
  const dateSuffix = new Date().toISOString().split('T')[0]
  const baseName = reportConfig.name.replace(/\s+/g, '_')

  const exportCSV = () => {
    const { groupBy, metrics } = reportConfig
    const lines: string[] = []
    if (groupBy) {
      lines.push([groupBy, ...metrics.flatMap(m => [`${m}_sum`, `${m}_average`, `${m}_count`, `${m}_min`, `${m}_max`])].join(','))
      reportResult.data.forEach(row => lines.push([row[groupBy as keyof MetricRow] as unknown as string, ...buildMetricCsvValues(row, metrics)].join(',')))
    } else {
      lines.push(metrics.flatMap(m => [`${m}_sum`, `${m}_average`, `${m}_count`, `${m}_min`, `${m}_max`]).join(','))
      lines.push(buildMetricCsvValues(reportResult.data[0], metrics).join(','))
    }
    downloadBlob(new Blob([lines.join('\n')], { type: 'text/csv' }), `${baseName}_${dateSuffix}.csv`)
    toast.success('Report exported to CSV')
  }

  const exportPDF = () => {
    const { groupBy, metrics } = reportConfig
    const columns: PDFTableColumn[] = []
    const pdfData: Record<string, unknown>[] = []
    if (groupBy) {
      columns.push({ header: groupBy.charAt(0).toUpperCase() + groupBy.slice(1), key: groupBy, align: 'left' })
      metrics.forEach(m => columns.push(...buildMetricPdfColumns(m)))
      reportResult.data.forEach(row => pdfData.push({
        [groupBy]: row[groupBy as keyof MetricRow] as unknown,
        ...metrics.reduce((acc, m) => ({ ...acc, ...buildMetricPdfRow(row, m) }), {}),
      }))
    } else {
      metrics.forEach(m => columns.push(...buildMetricPdfColumns(m)))
      pdfData.push(metrics.reduce((acc, m) => ({ ...acc, ...buildMetricPdfRow(reportResult.data[0], m) }), {}))
    }
    exportTableToPDF(pdfData, columns, { filename: `${baseName}_${dateSuffix}`, title: reportResult.name, includeTimestamp: true, includePageNumbers: true })
    toast.success('Report exported to PDF')
  }

  return { exportCSV, exportPDF }
}
