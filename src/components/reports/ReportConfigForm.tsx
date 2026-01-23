import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Plus } from '@phosphor-icons/react'

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

interface ReportConfigFormProps {
  reportConfig: ReportConfig
  setReportConfig: (config: ReportConfig) => void
  availableMetrics: Record<ReportType, string[]>
  availableFilters: Record<ReportType, string[]>
  onGenerate: () => void
}

export function ReportConfigForm({ 
  reportConfig, 
  setReportConfig, 
  availableMetrics, 
  availableFilters,
  onGenerate
}: ReportConfigFormProps) {
  const toggleMetric = (metric: string) => {
    setReportConfig({
      ...reportConfig,
      metrics: reportConfig.metrics.includes(metric)
        ? reportConfig.metrics.filter(m => m !== metric)
        : [...reportConfig.metrics, metric]
    })
  }

  const addFilter = () => {
    setReportConfig({
      ...reportConfig,
      filters: [...reportConfig.filters, { field: availableFilters[reportConfig.type][0], operator: 'equals', value: '' }]
    })
  }

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    setReportConfig({
      ...reportConfig,
      filters: reportConfig.filters.map((f, i) => i === index ? { ...f, ...updates } : f)
    })
  }

  const removeFilter = (index: number) => {
    setReportConfig({
      ...reportConfig,
      filters: reportConfig.filters.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reportName">Report Name</Label>
        <Input
          id="reportName"
          placeholder="e.g., Monthly Revenue by Client"
          value={reportConfig.name}
          onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reportType">Report Type</Label>
          <Select
            value={reportConfig.type}
            onValueChange={(value: ReportType) => setReportConfig({ 
              ...reportConfig, 
              type: value,
              metrics: [],
              filters: []
            })}
          >
            <SelectTrigger id="reportType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="timesheet">Timesheets</SelectItem>
              <SelectItem value="invoice">Invoices</SelectItem>
              <SelectItem value="payroll">Payroll</SelectItem>
              <SelectItem value="expense">Expenses</SelectItem>
              <SelectItem value="margin">Margin Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupBy">Group By (Optional)</Label>
          <Select
            value={reportConfig.groupBy || 'none'}
            onValueChange={(value) => setReportConfig({ 
              ...reportConfig, 
              groupBy: value === 'none' ? undefined : value as GroupByField
            })}
          >
            <SelectTrigger id="groupBy">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="worker">Worker</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateFrom">Date From</Label>
          <Input
            id="dateFrom"
            type="date"
            value={reportConfig.dateRange.from}
            onChange={(e) => setReportConfig({
              ...reportConfig,
              dateRange: { ...reportConfig.dateRange, from: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateTo">Date To</Label>
          <Input
            id="dateTo"
            type="date"
            value={reportConfig.dateRange.to}
            onChange={(e) => setReportConfig({
              ...reportConfig,
              dateRange: { ...reportConfig.dateRange, to: e.target.value }
            })}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Metrics to Include</Label>
        <div className="space-y-2">
          {availableMetrics[reportConfig.type].map((metric) => (
            <div key={metric} className="flex items-center space-x-2">
              <Checkbox
                id={metric}
                checked={reportConfig.metrics.includes(metric)}
                onCheckedChange={() => toggleMetric(metric)}
              />
              <label htmlFor={metric} className="text-sm font-medium capitalize cursor-pointer">
                {metric}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Filters</Label>
          <Button size="sm" variant="outline" onClick={addFilter}>
            <Plus size={16} className="mr-2" />
            Add Filter
          </Button>
        </div>
        
        {reportConfig.filters.length === 0 ? (
          <p className="text-sm text-muted-foreground">No filters applied</p>
        ) : (
          <div className="space-y-2">
            {reportConfig.filters.map((filter, index) => (
              <div key={index} className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Select
                    value={filter.field}
                    onValueChange={(value) => updateFilter(index, { field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFilters[reportConfig.type].map((field) => (
                        <SelectItem key={field} value={field}>{field}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Select
                    value={filter.operator}
                    onValueChange={(value: any) => updateFilter(index, { operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater">Greater than</SelectItem>
                      <SelectItem value="less">Less than</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) => updateFilter(index, { value: e.target.value })}
                  />
                </div>
                <Button size="sm" variant="destructive" onClick={() => removeFilter(index)}>
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button className="w-full" size="lg" onClick={onGenerate}>
        Generate Report
      </Button>
    </div>
  )
}
