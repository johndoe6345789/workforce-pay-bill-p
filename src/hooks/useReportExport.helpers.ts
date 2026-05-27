import type { PDFTableColumn } from '@/hooks/use-pdf-export'

export interface MetricValues {
  sum: number
  average: number
  count: number
  min: number
  max: number
}

export type MetricRow = Record<string, MetricValues>

export function buildMetricCsvValues(row: MetricRow, metrics: string[]): (number | string)[] {
  return metrics.flatMap(m => [
    row[m].sum,
    row[m].average.toFixed(2),
    row[m].count,
    row[m].min,
    row[m].max,
  ])
}

export function buildMetricPdfColumns(metric: string): PDFTableColumn[] {
  return [
    { header: `${metric} Sum`, key: `${metric}_sum`, align: 'right' },
    { header: `${metric} Avg`, key: `${metric}_avg`, align: 'right' },
    { header: `${metric} Count`, key: `${metric}_count`, align: 'right' },
  ]
}

export function buildMetricPdfRow(row: MetricRow, metric: string): Record<string, unknown> {
  return {
    [`${metric}_sum`]: row[metric].sum.toFixed(2),
    [`${metric}_avg`]: row[metric].average.toFixed(2),
    [`${metric}_count`]: row[metric].count,
  }
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
