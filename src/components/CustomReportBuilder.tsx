import React, { useState } from 'react'
import { 
  ChartBar, 
  Plus,
  Download,
  Funnel,
  Calendar,
  Table as TableIcon,
  CheckCircle
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import type { Invoice, PayrollRun, Timesheet, Expense } from '@/lib/types'

interface CustomReportBuilderProps {
  timesheets: Timesheet[]
  invoices: Invoice[]
  payrollRuns: PayrollRun[]
  expenses: Expense[]
}

type ReportType = 'timesheet' | 'invoice' | 'payroll' | 'expense' | 'margin'
type AggregationType = 'sum' | 'average' | 'count' | 'min' | 'max'
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
  filters: ReportFilter[]
}

interface ReportFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater' | 'less'
  value: string
}

export function CustomReportBuilder({ timesheets, invoices, payrollRuns, expenses }: CustomReportBuilderProps) {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    type: 'timesheet',
    dateRange: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0]
    },
    groupBy: undefined,
    metrics: [],
    filters: []
  })
  
  const [reportResult, setReportResult] = useState<any>(null)

  const availableMetrics: Record<ReportType, string[]> = {
    timesheet: ['hours', 'amount', 'count'],
    invoice: ['amount', 'count'],
    payroll: ['totalAmount', 'workersCount'],
    expense: ['amount', 'count'],
    margin: ['revenue', 'costs', 'margin', 'marginPercentage']
  }

  const availableFilters: Record<ReportType, string[]> = {
    timesheet: ['status', 'workerName', 'clientName'],
    invoice: ['status', 'clientName', 'currency'],
    payroll: ['status'],
    expense: ['status', 'category', 'billable'],
    margin: ['period']
  }

  const generateReport = () => {
    if (!reportConfig.name) {
      toast.error('Please enter a report name')
      return
    }

    if (reportConfig.metrics.length === 0) {
      toast.error('Please select at least one metric')
      return
    }

    let data: any[] = []
    
    switch (reportConfig.type) {
      case 'timesheet':
        data = timesheets
        break
      case 'invoice':
        data = invoices
        break
      case 'payroll':
        data = payrollRuns
        break
      case 'expense':
        data = expenses
        break
      case 'margin':
        data = calculateMarginData()
        break
    }

    data = data.filter(item => {
      const dateField = reportConfig.type === 'timesheet' ? 'weekEnding' :
                       reportConfig.type === 'invoice' ? 'issueDate' :
                       reportConfig.type === 'payroll' ? 'periodEnding' :
                       reportConfig.type === 'expense' ? 'date' : 'period'
      
      const itemDate = item[dateField]
      return itemDate >= reportConfig.dateRange.from && itemDate <= reportConfig.dateRange.to
    })

    reportConfig.filters.forEach(filter => {
      data = data.filter(item => {
        const value = item[filter.field]
        switch (filter.operator) {
          case 'equals':
            return value === filter.value
          case 'contains':
            return String(value).toLowerCase().includes(filter.value.toLowerCase())
          case 'greater':
            return Number(value) > Number(filter.value)
          case 'less':
            return Number(value) < Number(filter.value)
          default:
            return true
        }
      })
    })

    let result: any = {
      name: reportConfig.name,
      type: reportConfig.type,
      generatedAt: new Date().toISOString(),
      totalRecords: data.length,
      data: []
    }

    if (reportConfig.groupBy) {
      const grouped = new Map<string, any[]>()
      
      data.forEach(item => {
        let key = ''
        switch (reportConfig.groupBy) {
          case 'worker':
            key = item.workerName || 'Unknown'
            break
          case 'client':
            key = item.clientName || 'Unknown'
            break
          case 'status':
            key = item.status
            break
          case 'date':
            key = item.weekEnding || item.issueDate || item.date || item.periodEnding
            break
          case 'month':
            const date = new Date(item.weekEnding || item.issueDate || item.date || item.periodEnding)
            key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            break
          case 'week':
            const weekDate = new Date(item.weekEnding || item.issueDate || item.date || item.periodEnding)
            key = `Week ${Math.ceil(weekDate.getDate() / 7)}, ${weekDate.getFullYear()}`
            break
        }
        
        if (!grouped.has(key)) {
          grouped.set(key, [])
        }
        grouped.get(key)!.push(item)
      })

      result.data = Array.from(grouped.entries()).map(([key, items]) => {
        const metrics: any = { [reportConfig.groupBy!]: key }
        
        reportConfig.metrics.forEach(metric => {
          const values = items.map(item => Number(item[metric]) || 0)
          metrics[metric] = {
            sum: values.reduce((a, b) => a + b, 0),
            average: values.reduce((a, b) => a + b, 0) / values.length,
            count: values.length,
            min: Math.min(...values),
            max: Math.max(...values)
          }
        })
        
        return metrics
      })
    } else {
      const metrics: any = {}
      reportConfig.metrics.forEach(metric => {
        const values = data.map(item => Number(item[metric]) || 0)
        metrics[metric] = {
          sum: values.reduce((a, b) => a + b, 0),
          average: values.reduce((a, b) => a + b, 0) / values.length,
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values)
        }
      })
      result.data = [metrics]
    }

    setReportResult(result)
    toast.success('Report generated successfully')
  }

  const calculateMarginData = () => {
    const grouped = new Map<string, { revenue: number; costs: number }>()
    
    invoices.forEach(inv => {
      const key = inv.issueDate.substring(0, 7)
      const existing = grouped.get(key) || { revenue: 0, costs: 0 }
      grouped.set(key, { ...existing, revenue: existing.revenue + inv.amount })
    })

    payrollRuns.forEach(pr => {
      const key = pr.periodEnding.substring(0, 7)
      const existing = grouped.get(key) || { revenue: 0, costs: 0 }
      grouped.set(key, { ...existing, costs: existing.costs + pr.totalAmount })
    })

    return Array.from(grouped.entries()).map(([period, data]) => ({
      period,
      revenue: data.revenue,
      costs: data.costs,
      margin: data.revenue - data.costs,
      marginPercentage: data.revenue > 0 ? ((data.revenue - data.costs) / data.revenue) * 100 : 0
    }))
  }

  const toggleMetric = (metric: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metric)
        ? prev.metrics.filter(m => m !== metric)
        : [...prev.metrics, metric]
    }))
  }

  const addFilter = () => {
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, { field: availableFilters[prev.type][0], operator: 'equals', value: '' }]
    }))
  }

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map((f, i) => i === index ? { ...f, ...updates } : f)
    }))
  }

  const removeFilter = (index: number) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }))
  }

  const exportReport = () => {
    if (!reportResult) return

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Custom Report Builder</h2>
          <p className="text-muted-foreground mt-1">Build custom reports with flexible metrics and filters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
            <CardDescription>Configure your custom report parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <Button className="w-full" size="lg" onClick={generateReport}>
              <ChartBar size={20} className="mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>Summary of configured report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reportConfig.name ? (
              <>
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
              </>
            ) : (
              <div className="text-center py-8">
                <ChartBar size={48} className="mx-auto text-muted-foreground mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">Configure your report to see a preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {reportResult && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{reportResult.name}</CardTitle>
                <CardDescription>
                  Generated on {new Date(reportResult.generatedAt).toLocaleString()} • {reportResult.totalRecords} records
                </CardDescription>
              </div>
              <Button variant="outline" onClick={exportReport}>
                <Download size={18} className="mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}
