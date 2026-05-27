import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ReportConfigForm } from '@/components/reports/ReportConfigForm'
import { ReportPreview } from '@/components/reports/ReportPreview'
import { ReportResultTable } from '@/components/reports/ReportResultTable'
import { useCustomReportBuilder } from '@/hooks/useCustomReportBuilder'
import type { Timesheet } from '@/lib/types'

interface CustomReportBuilderProps {
  timesheets: Timesheet[]
}

export function CustomReportBuilder({ timesheets }: CustomReportBuilderProps) {
  const vm = useCustomReportBuilder(timesheets)

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
              reportConfig={vm.reportConfig}
              setReportConfig={vm.setReportConfig}
              availableMetrics={vm.availableMetrics}
              availableFilters={vm.availableFilters}
              onGenerate={vm.generateReport}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
            <CardDescription>Summary of configured report</CardDescription>
          </CardHeader>
          <CardContent>
            <ReportPreview reportConfig={vm.reportConfig} />
          </CardContent>
        </Card>
      </div>

      {vm.reportResult && (
        <Card>
          <CardHeader><CardTitle>Report Results</CardTitle></CardHeader>
          <CardContent>
            <ReportResultTable
              reportResult={vm.reportResult}
              reportConfig={vm.reportConfig}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
