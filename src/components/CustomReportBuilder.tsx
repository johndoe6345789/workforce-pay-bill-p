import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ReportConfigForm } from '@/components/reports/ReportConfigForm'
import { ReportPreview } from '@/components/reports/ReportPreview'
import { ReportResultTable } from '@/components/reports/ReportResultTable'
import { calculateMarginData, filterData, aggregateData } from '@/components/reports/report-utils'
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
        data = calculateMarginData(invoices, payrollRuns)
        break
    }

    data = filterData(data, reportConfig)
    const aggregated = aggregateData(data, reportConfig)

    const result = {
      name: reportConfig.name,
      generatedAt: new Date().toISOString(),
      totalRecords: data.length,
      data: aggregated
    }

    setReportResult(result)
    toast.success('Report generated successfully')
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
          <CardContent>
            <ReportConfigForm
              reportConfig={reportConfig}
              setReportConfig={setReportConfig}
              availableMetrics={availableMetrics}
              availableFilters={availableFilters}
              onGenerate={generateReport}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>Summary of configured report</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportPreview reportConfig={reportConfig} />
          </CardContent>
        </Card>
      </div>

      {reportResult && (
        <Card>
          <CardHeader>
            <CardTitle>Report Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportResultTable 
              reportResult={reportResult} 
              reportConfig={reportConfig} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
