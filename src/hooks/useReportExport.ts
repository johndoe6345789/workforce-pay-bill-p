import { toast } from 'sonner'
import { usePDFExport, type PDFTableColumn } from '@/hooks/use-pdf-export'

type ReportType = 'timesheet' | 'invoice' | 'payroll' | 'expense' | 'margin'
type GroupByField = 'worker' | 'client' | 'date' | 'status' | 'month' | 'week'

interface ReportConfig {
  name: string
  type: ReportType
  dateRange: { from: string; to: string }
  groupBy?: GroupByField
  metrics: string[]
  filters: any[]
}

interface ReportResult {
  name: string
  generatedAt: string
  totalRecords: number
  data: any[]
}

function buildMetricCsvValues(row: any, metrics: string[]) {
  return metrics.flatMap(m => [
    row[m].sum,
    row[m].average.toFixed(2),
    row[m].count,
    row[m].min,
    row[m].max,
  ])
}

function buildMetricPdfColumns(metric: string): PDFTableColumn[] {
  return [
    { header: `${metric} Sum`, key: `${metric}_sum`, align: 'right' },
    { header: `${metric} Avg`, key: `${metric}_avg`, align: 'right' },
    { header: `${metric} Count`, key: `${metric}_count`, align: 'right' },
  ]
}

function buildMetricPdfRow(row: any, metric: string) {
  return {
    [`${metric}_sum`]: row[metric].sum.toFixed(2),
    [`${metric}_avg`]: row[metric].average.toFixed(2),
    [`${metric}_count`]: row[metric].count,
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function useReportExport(reportResult: ReportResult, reportConfig: ReportConfig) {
  const { exportTableToPDF } = usePDFExport()
  const dateSuffix = new Date().toISOString().split('T')[0]
  const baseName = reportConfig.name.replace(/\s+/g, '_')

  const exportCSV = () => {
    const lines: string[] = []
    const { groupBy, metrics } = reportConfig

    if (groupBy) {
      lines.push([groupBy, ...metrics.flatMap(m => [`${m}_sum`, `${m}_average`, `${m}_count`, `${m}_min`, `${m}_max`])].join(','))
      reportResult.data.forEach((row: any) => {
        lines.push([row[groupBy], ...buildMetricCsvValues(row, metrics)].join(','))
      })
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
    const pdfData: any[] = []

    if (groupBy) {
      columns.push({ header: groupBy.charAt(0).toUpperCase() + groupBy.slice(1), key: groupBy, align: 'left' })
      metrics.forEach(m => columns.push(...buildMetricPdfColumns(m)))
      reportResult.data.forEach((row: any) => {
        pdfData.push({ [groupBy]: row[groupBy], ...metrics.reduce((acc, m) => ({ ...acc, ...buildMetricPdfRow(row, m) }), {}) })
      })
    } else {
      metrics.forEach(m => columns.push(...buildMetricPdfColumns(m)))
      pdfData.push(metrics.reduce((acc, m) => ({ ...acc, ...buildMetricPdfRow(reportResult.data[0], m) }), {}))
    }

    exportTableToPDF(pdfData, columns, { filename: `${baseName}_${dateSuffix}`, title: reportResult.name, includeTimestamp: true, includePageNumbers: true })
    toast.success('Report exported to PDF')
  }

  return { exportCSV, exportPDF }
}
