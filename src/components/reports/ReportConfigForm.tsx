import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Plus } from '@phosphor-icons/react'
import type { ReportType, ReportFilter, ReportConfig } from '@/hooks/useCustomReportBuilder'
import { ReportFilterRows } from '@/components/reports/ReportFilterRows'
import { ReportMetricsSection } from '@/components/reports/ReportMetricsSection'
import { ReportTypeSelector } from '@/components/reports/ReportTypeSelector'
import { DATE_FIELDS } from '@/data/report-config-options'

interface Props {
  reportConfig: ReportConfig
  setReportConfig: (config: ReportConfig) => void
  availableMetrics: Record<ReportType, string[]>
  availableFilters: Record<ReportType, string[]>
  onGenerate: () => void
}

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

      <ReportTypeSelector
        type={reportConfig.type}
        groupBy={reportConfig.groupBy}
        onChangeType={(v: ReportType) => patch({ type: v, metrics: [], filters: [] })}
        onChangeGroupBy={v => patch({ groupBy: v })}
      />

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

      <ReportMetricsSection
        metrics={reportConfig.metrics}
        availableMetrics={availableMetrics[reportConfig.type]}
        onToggle={toggleMetric}
      />

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Filters</Label>
          <Button size="sm" variant="outline" onClick={addFilter}><Plus size={16} className="mr-2" />Add Filter</Button>
        </div>
        <ReportFilterRows
          filters={reportConfig.filters}
          availableFilters={availableFilters[reportConfig.type]}
          onUpdate={updateFilter}
          onRemove={removeFilter}
        />
      </div>

      <Button className="w-full" size="lg" onClick={onGenerate}>Generate Report</Button>
    </div>
  )
}
