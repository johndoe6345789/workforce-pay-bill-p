import { Badge } from '@/components/ui/badge'
import { ChartBar } from '@phosphor-icons/react'

type ReportType = 'timesheet' | 'invoice' | 'payroll' | 'expense' | 'margin'
type GroupByField = 'worker' | 'client' | 'date' | 'status' | 'month' | 'week'

interface ReportFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater' | 'less'
  value: string
}

interface ReportConfig {
  name: string
  type: ReportType
  dateRange: {
    from: string
    to: string
  }
  groupBy?: GroupByField
  metrics: string[]
  filters: ReportFilter[]
}

interface ReportPreviewProps {
  reportConfig: ReportConfig
}

export function ReportPreview({ reportConfig }: ReportPreviewProps) {
  if (!reportConfig.name) {
    return (
      <div className="text-center py-8">
        <ChartBar size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
        <p className="text-sm text-muted-foreground">Configure your report to see a preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-1">Name</p>
        <p className="font-medium">{reportConfig.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">Type</p>
        <Badge>{reportConfig.type}</Badge>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">Date Range</p>
        <p className="text-sm">{reportConfig.dateRange.from} to {reportConfig.dateRange.to}</p>
      </div>
      {reportConfig.groupBy && (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Grouped By</p>
          <Badge variant="outline">{reportConfig.groupBy}</Badge>
        </div>
      )}
      <div>
        <p className="text-sm text-muted-foreground mb-1">Metrics ({reportConfig.metrics.length})</p>
        <div className="flex flex-wrap gap-1">
          {reportConfig.metrics.map((metric) => (
            <Badge key={metric} variant="secondary">{metric}</Badge>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">Filters ({reportConfig.filters.length})</p>
        {reportConfig.filters.length === 0 ? (
          <p className="text-sm">None</p>
        ) : (
          <div className="space-y-1">
            {reportConfig.filters.map((filter, i) => (
              <p key={i} className="text-xs">
                {filter.field} {filter.operator} "{filter.value}"
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
