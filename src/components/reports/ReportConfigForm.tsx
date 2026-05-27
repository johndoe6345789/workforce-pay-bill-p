import { Button } from '@/components/ui/button'
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
  dateRange: { from: string; to: string }
  groupBy?: GroupByField
  metrics: string[]
  filters: ReportFilter[]
}

interface Props {
  reportConfig: ReportConfig
  setReportConfig: (config: ReportConfig) => void
  availableMetrics: Record<ReportType, string[]>
  availableFilters: Record<ReportType, string[]>
  onGenerate: () => void
}

const REPORT_TYPES: { value: ReportType; label: string }[] = [
  { value: 'timesheet', label: 'Timesheets' },
  { value: 'invoice',   label: 'Invoices' },
  { value: 'payroll',   label: 'Payroll' },
  { value: 'expense',   label: 'Expenses' },
  { value: 'margin',    label: 'Margin Analysis' },
]

const GROUP_BY_OPTIONS: { value: string; label: string }[] = [
  { value: 'none',   label: 'None' },
  { value: 'worker', label: 'Worker' },
  { value: 'client', label: 'Client' },
  { value: 'status', label: 'Status' },
  { value: 'date',   label: 'Date' },
  { value: 'month',  label: 'Month' },
  { value: 'week',   label: 'Week' },
]

const FILTER_OPERATORS: { value: string; label: string }[] = [
  { value: 'equals',   label: 'Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greater',  label: 'Greater than' },
  { value: 'less',     label: 'Less than' },
]

const DATE_FIELDS: { id: string; label: string; key: 'from' | 'to' }[] = [
  { id: 'dateFrom', label: 'Date From', key: 'from' },
  { id: 'dateTo',   label: 'Date To',   key: 'to' },
]

export function ReportConfigForm({ reportConfig, setReportConfig, availableMetrics, availableFilters, onGenerate }: Props) {
  const patch = (updates: Partial<ReportConfig>) => setReportConfig({ ...reportConfig, ...updates })

  const toggleMetric = (metric: string) =>
    patch({ metrics: reportConfig.metrics.includes(metric) ? reportConfig.metrics.filter(m => m !== metric) : [...reportConfig.metrics, metric] })

  const addFilter = () =>
    patch({ filters: [...reportConfig.filters, { field: availableFilters[reportConfig.type][0], operator: 'equals', value: '' }] })

  const updateFilter = (i: number, updates: Partial<ReportFilter>) =>
    patch({ filters: reportConfig.filters.map((f, idx) => idx === i ? { ...f, ...updates } : f) })

  const removeFilter = (i: number) =>
    patch({ filters: reportConfig.filters.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reportName">Report Name</Label>
        <Input
          id="reportName"
          placeholder="e.g., Monthly Revenue by Client"
          value={reportConfig.name}
          onChange={e => patch({ name: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="reportType">Report Type</Label>
          <Select value={reportConfig.type} onValueChange={(v: ReportType) => patch({ type: v, metrics: [], filters: [] })}>
            <SelectTrigger id="reportType"><SelectValue /></SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupBy">Group By (Optional)</Label>
          <Select
            value={reportConfig.groupBy ?? 'none'}
            onValueChange={v => patch({ groupBy: v === 'none' ? undefined : v as GroupByField })}
          >
            <SelectTrigger id="groupBy"><SelectValue /></SelectTrigger>
            <SelectContent>
              {GROUP_BY_OPTIONS.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {DATE_FIELDS.map(({ id, label, key }) => (
          <div key={id} className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
              id={id}
              type="date"
              value={reportConfig.dateRange[key]}
              onChange={e => patch({ dateRange: { ...reportConfig.dateRange, [key]: e.target.value } })}
            />
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-3">
        <Label>Metrics to Include</Label>
        <div className="space-y-2">
          {availableMetrics[reportConfig.type].map(metric => (
            <div key={metric} className="flex items-center space-x-2">
              <Checkbox id={metric} checked={reportConfig.metrics.includes(metric)} onCheckedChange={() => toggleMetric(metric)} />
              <label htmlFor={metric} className="text-sm font-medium capitalize cursor-pointer">{metric}</label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Filters</Label>
          <Button size="sm" variant="outline" onClick={addFilter}><Plus size={16} className="mr-2" />Add Filter</Button>
        </div>

        {reportConfig.filters.length === 0 ? (
          <p className="text-sm text-muted-foreground">No filters applied</p>
        ) : (
          <div className="space-y-2">
            {reportConfig.filters.map((filter, i) => (
              <div key={i} className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Select value={filter.field} onValueChange={v => updateFilter(i, { field: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {availableFilters[reportConfig.type].map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Select value={filter.operator} onValueChange={(v: any) => updateFilter(i, { operator: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {FILTER_OPERATORS.map(({ value, label }) => <SelectItem key={value} value={value}>{label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-2">
                  <Input placeholder="Value" value={filter.value} onChange={e => updateFilter(i, { value: e.target.value })} />
                </div>
                <Button size="sm" variant="destructive" onClick={() => removeFilter(i)}>Remove</Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button className="w-full" size="lg" onClick={onGenerate}>Generate Report</Button>
    </div>
  )
}
