import { Button } from '@/components/ui/button'
import { CardDescription } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, FileCsv, FilePdf } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { usePDFExport, type PDFTableColumn } from '@/hooks/use-pdf-export'

type ReportType = 'timesheet' | 'invoice' | 'payroll' | 'expense' | 'margin'
type GroupByField = 'worker' | 'client' | 'date' | 'status' | 'month' | 'week'

interface ReportConfig {
  name: string
  type: ReportType
  dateRange: {
    from: string
    to: string
  }
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

interface ReportResultTableProps {
  reportResult: ReportResult
  reportConfig: ReportConfig
}

export function ReportResultTable({ reportResult, reportConfig }: ReportResultTableProps) {
  const { exportTableToPDF } = usePDFExport()

  const exportReport = () => {
    const csvLines: string[] = []
    
    if (reportConfig.groupBy) {
      const headers = [reportConfig.groupBy, ...reportConfig.metrics.flatMap(m => [
        `${m}_sum`, `${m}_average`, `${m}_count`, `${m}_min`, `${m}_max`
      ])]
      csvLines.push(headers.join(','))
      
      reportResult.data.forEach((row: any) => {
        const values: any[] = [row[reportConfig.groupBy!]]
        reportConfig.metrics.forEach(metric => {
          values.push(
            row[metric].sum,
            row[metric].average.toFixed(2),
            row[metric].count,
            row[metric].min,
            row[metric].max
          )
        })
        csvLines.push(values.join(','))
      })
    } else {
      const headers = reportConfig.metrics.flatMap(m => [
        `${m}_sum`, `${m}_average`, `${m}_count`, `${m}_min`, `${m}_max`
      ])
      csvLines.push(headers.join(','))
      
      const row = reportResult.data[0]
      const values: any[] = []
      reportConfig.metrics.forEach(metric => {
        values.push(
          row[metric].sum,
          row[metric].average.toFixed(2),
          row[metric].count,
          row[metric].min,
          row[metric].max
        )
      })
      csvLines.push(values.join(','))
    }

    const csv = csvLines.join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${reportConfig.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Report exported to CSV')
  }

  const exportPDFReport = () => {
    const pdfData: any[] = []
    const columns: PDFTableColumn[] = []

    if (reportConfig.groupBy) {
      columns.push({
        header: reportConfig.groupBy.charAt(0).toUpperCase() + reportConfig.groupBy.slice(1),
        key: reportConfig.groupBy,
        align: 'left'
      })

      reportConfig.metrics.forEach(metric => {
        columns.push(
          { header: `${metric} Sum`, key: `${metric}_sum`, align: 'right' },
          { header: `${metric} Avg`, key: `${metric}_avg`, align: 'right' },
          { header: `${metric} Count`, key: `${metric}_count`, align: 'right' }
        )
      })

      reportResult.data.forEach((row: any) => {
        const pdfRow: any = { [reportConfig.groupBy!]: row[reportConfig.groupBy!] }
        reportConfig.metrics.forEach(metric => {
          pdfRow[`${metric}_sum`] = row[metric].sum.toFixed(2)
          pdfRow[`${metric}_avg`] = row[metric].average.toFixed(2)
          pdfRow[`${metric}_count`] = row[metric].count
        })
        pdfData.push(pdfRow)
      })
    } else {
      reportConfig.metrics.forEach(metric => {
        columns.push(
          { header: `${metric} Sum`, key: `${metric}_sum`, align: 'right' },
          { header: `${metric} Avg`, key: `${metric}_avg`, align: 'right' },
          { header: `${metric} Count`, key: `${metric}_count`, align: 'right' }
        )
      })

      const row = reportResult.data[0]
      const pdfRow: any = {}
      reportConfig.metrics.forEach(metric => {
        pdfRow[`${metric}_sum`] = row[metric].sum.toFixed(2)
        pdfRow[`${metric}_avg`] = row[metric].average.toFixed(2)
        pdfRow[`${metric}_count`] = row[metric].count
      })
      pdfData.push(pdfRow)
    }

    exportTableToPDF(pdfData, columns, {
      filename: `${reportConfig.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`,
      title: reportResult.name,
      includeTimestamp: true,
      includePageNumbers: true
    })

    toast.success('Report exported to PDF')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{reportResult.name}</h3>
          <CardDescription>
            Generated on {new Date(reportResult.generatedAt).toLocaleString()} • {reportResult.totalRecords} records
          </CardDescription>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportReport}>
              <FileCsv className="mr-2" size={18} />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDFReport}>
              <FilePdf className="mr-2" size={18} />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {reportConfig.groupBy && (
                <th className="px-4 py-3 text-left text-sm font-medium capitalize">
                  {reportConfig.groupBy}
                </th>
              )}
              {reportConfig.metrics.map((metric) => (
                <th key={metric} colSpan={5} className="px-4 py-3 text-left text-sm font-medium capitalize border-l">
                  {metric}
                </th>
              ))}
            </tr>
            <tr className="bg-muted/30">
              {reportConfig.groupBy && <th></th>}
              {reportConfig.metrics.map((metric) => (
                <>
                  <th key={`${metric}-sum`} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground border-l">Sum</th>
                  <th key={`${metric}-avg`} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Avg</th>
                  <th key={`${metric}-count`} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Count</th>
                  <th key={`${metric}-min`} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Min</th>
                  <th key={`${metric}-max`} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Max</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {reportResult.data.map((row: any, index: number) => (
              <tr key={index} className="border-t hover:bg-muted/20">
                {reportConfig.groupBy && (
                  <td className="px-4 py-3 text-sm font-medium">
                    {row[reportConfig.groupBy]}
                  </td>
                )}
                {reportConfig.metrics.map((metric) => (
                  <>
                    <td key={`${metric}-sum`} className="px-4 py-3 text-sm font-mono border-l">
                      {typeof row[metric]?.sum === 'number' ? row[metric].sum.toFixed(2) : row[metric]?.sum || 0}
                    </td>
                    <td key={`${metric}-avg`} className="px-4 py-3 text-sm font-mono">
                      {typeof row[metric]?.average === 'number' ? row[metric].average.toFixed(2) : row[metric]?.average || 0}
                    </td>
                    <td key={`${metric}-count`} className="px-4 py-3 text-sm font-mono">
                      {row[metric]?.count || 0}
                    </td>
                    <td key={`${metric}-min`} className="px-4 py-3 text-sm font-mono">
                      {typeof row[metric]?.min === 'number' ? row[metric].min.toFixed(2) : row[metric]?.min || 0}
                    </td>
                    <td key={`${metric}-max`} className="px-4 py-3 text-sm font-mono">
                      {typeof row[metric]?.max === 'number' ? row[metric].max.toFixed(2) : row[metric]?.max || 0}
                    </td>
                  </>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
