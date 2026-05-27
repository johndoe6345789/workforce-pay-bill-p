import { Button } from '@/components/ui/button'
import { CardDescription } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Download, FileCsv, FilePdf } from '@phosphor-icons/react'
import { useReportExport } from '@/hooks/useReportExport'

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

interface Props {
  reportResult: ReportResult
  reportConfig: ReportConfig
}

const METRIC_SUB_COLS = [
  { key: 'sum',   label: 'Sum',   cls: 'border-l' },
  { key: 'avg',   label: 'Avg',   cls: '' },
  { key: 'count', label: 'Count', cls: '' },
  { key: 'min',   label: 'Min',   cls: '' },
  { key: 'max',   label: 'Max',   cls: '' },
]

function fmtCell(val: any): string | number {
  return typeof val === 'number' ? val.toFixed(2) : val ?? 0
}

export function ReportResultTable({ reportResult, reportConfig }: Props) {
  const { exportCSV, exportPDF } = useReportExport(reportResult, reportConfig)
  const { groupBy, metrics } = reportConfig

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
            <Button variant="outline"><Download size={18} className="mr-2" />Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={exportCSV}><FileCsv className="mr-2" size={18} />Export as CSV</DropdownMenuItem>
            <DropdownMenuItem onClick={exportPDF}><FilePdf className="mr-2" size={18} />Export as PDF</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {groupBy && <th className="px-4 py-3 text-left text-sm font-medium capitalize">{groupBy}</th>}
              {metrics.map(metric => (
                <th key={metric} colSpan={5} className="px-4 py-3 text-left text-sm font-medium capitalize border-l">{metric}</th>
              ))}
            </tr>
            <tr className="bg-muted/30">
              {groupBy && <th />}
              {metrics.map(metric => (
                METRIC_SUB_COLS.map(({ key, label, cls }) => (
                  <th key={`${metric}-${key}`} className={`px-4 py-2 text-left text-xs font-medium text-muted-foreground ${cls}`}>{label}</th>
                ))
              ))}
            </tr>
          </thead>
          <tbody>
            {reportResult.data.map((row: any, i: number) => (
              <tr key={i} className="border-t hover:bg-muted/20">
                {groupBy && <td className="px-4 py-3 text-sm font-medium">{row[groupBy]}</td>}
                {metrics.map(metric => (
                  METRIC_SUB_COLS.map(({ key, cls }) => {
                    const rawKey = key === 'avg' ? 'average' : key
                    return (
                      <td key={`${metric}-${key}`} className={`px-4 py-3 text-sm font-mono ${cls}`}>
                        {fmtCell(row[metric]?.[rawKey])}
                      </td>
                    )
                  })
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
