import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, ClockCounterClockwise } from '@phosphor-icons/react'
import type { Worker, Timesheet } from '@/lib/types'
import { useMissingTimesheetsReport } from '@/hooks/useMissingTimesheetsReport'
import { MissingTimesheetsSummary } from '@/components/missing-timesheets/MissingTimesheetsSummary'
import { MissingTimesheetRow } from '@/components/missing-timesheets/MissingTimesheetRow'

interface Props { workers: Worker[]; timesheets: Timesheet[] }

export function MissingTimesheetsReport({ workers, timesheets }: Props) {
  const vm = useMissingTimesheetsReport(workers, timesheets)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Missing Timesheets Report</h2>
          <p className="text-muted-foreground mt-1">Track outstanding timesheet submissions</p>
        </div>
        <Button onClick={vm.handleExportReport} disabled={vm.sortedReports.length === 0}>
          <Download size={18} className="mr-2" />Export Report
        </Button>
      </div>

      <MissingTimesheetsSummary reports={vm.missingReports} />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by days:</span>
          <Select value={vm.filterDays} onValueChange={v => vm.setFilterDays(v as any)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="7">≤ 7 days</SelectItem>
              <SelectItem value="14">≤ 14 days</SelectItem>
              <SelectItem value="30">≤ 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={vm.sortBy} onValueChange={v => vm.setSortBy(v as any)}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="overdue">Days Overdue</SelectItem>
              <SelectItem value="worker">Worker Name</SelectItem>
              <SelectItem value="client">Client Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {vm.sortedReports.length === 0 ? (
        <Card className="p-12 text-center">
          <ClockCounterClockwise size={48} className="mx-auto text-success mb-4" weight="fill" />
          <h3 className="text-lg font-semibold mb-2">All timesheets up to date!</h3>
          <p className="text-muted-foreground">No missing timesheets found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {vm.sortedReports.map(report => (
            <MissingTimesheetRow key={report.workerId} report={report} onSendReminder={vm.handleSendReminder} />
          ))}
        </div>
      )}
    </div>
  )
}
