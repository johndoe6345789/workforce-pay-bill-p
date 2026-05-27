import { Download, Funnel, ChartBar, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui/page-header'
import { Stack } from '@/components/ui/stack'
import { TimesheetDetailDialog } from '@/components/TimesheetDetailDialog'
import { TimeAndRateAdjustmentWizard } from '@/components/TimeAndRateAdjustmentWizard'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { TimesheetCreateDialogs } from '@/components/timesheets/TimesheetCreateDialogs'
import { TimesheetTabs } from '@/components/timesheets/TimesheetTabs'
import { TimesheetAnalytics } from '@/components/timesheets/TimesheetAnalytics'
import { LiveRefreshIndicator } from '@/components/LiveRefreshIndicator'
import { useTimesheetsView } from '@/hooks/useTimesheetsView'

interface TimesheetsViewProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateInvoice: (id: string) => void
}

export function TimesheetsView({ onCreateInvoice }: TimesheetsViewProps) {
  const vm = useTimesheetsView()

  const timesheetFields: FilterField[] = [
    { name: 'workerName', label: vm.t('timesheets.workerName'), type: 'text' },
    { name: 'clientName', label: vm.t('timesheets.clientName'), type: 'text' },
    { name: 'status', label: vm.t('timesheets.status.all'), type: 'select', options: [
      { value: 'pending', label: vm.t('timesheets.status.pending') },
      { value: 'approved', label: vm.t('timesheets.status.approved') },
      { value: 'rejected', label: vm.t('timesheets.status.rejected') }
    ]},
    { name: 'hours', label: vm.t('timesheets.hours'), type: 'number' },
    { name: 'amount', label: vm.t('timesheets.amount'), type: 'number' },
    { name: 'weekEnding', label: vm.t('timesheets.weekEnding'), type: 'date' }
  ]

  return (
    <Stack spacing={6}>
      <div className="flex items-center justify-between">
        <PageHeader
          title={vm.t('timesheets.title')}
          description={vm.t('timesheets.subtitle')}
          actions={
            <Stack direction="horizontal" spacing={2}>
              <Button variant="outline" onClick={() => vm.setShowAnalytics(!vm.showAnalytics)}>
                <ChartBar size={18} className="mr-2" />
                {vm.showAnalytics ? vm.t('timesheets.hideAnalytics') : vm.t('timesheets.showAnalytics')}
              </Button>
              <TimesheetCreateDialogs
                isCreateDialogOpen={vm.isCreateDialogOpen}
                setIsCreateDialogOpen={vm.setIsCreateDialogOpen}
                isBulkImportOpen={vm.isBulkImportOpen}
                setIsBulkImportOpen={vm.setIsBulkImportOpen}
                formData={vm.formData}
                setFormData={vm.setFormData}
                csvData={vm.csvData}
                setCsvData={vm.setCsvData}
                onCreateTimesheet={vm.handleCreateTimesheet}
                onCreateDetailedTimesheet={vm.handleCreateDetailedTimesheet}
                onBulkImport={vm.handleBulkImport}
              />
            </Stack>
          }
        />
        <LiveRefreshIndicator lastUpdated={vm.lastUpdated} pollingInterval={1000} />
      </div>

      {vm.showAnalytics && (
        <TimesheetAnalytics
          totalCount={vm.filteredTimesheets.length}
          pendingCount={vm.pendingCount}
          approvedCount={vm.approvedCount}
          totalHours={vm.totalHours}
          totalValue={vm.totalValue}
          approvalRate={vm.approvalRate}
          validationInvalid={vm.validationStats.invalid}
          t={vm.t}
        />
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{vm.t('timesheets.searchAndFilter')}</CardTitle>
              <CardDescription className="text-xs mt-1">{vm.t('timesheets.findTimesheetsAdvanced')}</CardDescription>
            </div>
            <Badge variant="secondary" className="font-mono">
              {vm.t('timesheets.results', { count: vm.filteredTimesheets.length })}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <AdvancedSearch
            items={vm.timesheetsToFilter}
            fields={timesheetFields}
            onResultsChange={vm.handleResultsChange}
            placeholder={vm.t('timesheets.searchPlaceholder')}
          />
        </CardContent>
      </Card>

      <Stack direction="horizontal" spacing={3} align="center" justify="between">
        <Stack direction="horizontal" spacing={3}>
          <Select value={vm.statusFilter} onValueChange={v => vm.setStatusFilter(v as any)}>
            <SelectTrigger className="w-48">
              <div className="flex items-center gap-2"><Funnel size={16} /><SelectValue /></div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{vm.t('timesheets.status.all')}</SelectItem>
              <SelectItem value="pending">{vm.t('timesheets.status.pending')}</SelectItem>
              <SelectItem value="approved">{vm.t('timesheets.status.approved')}</SelectItem>
              <SelectItem value="rejected">{vm.t('timesheets.status.rejected')}</SelectItem>
            </SelectContent>
          </Select>
          {vm.validationStats.invalid > 0 && (
            <Badge variant="destructive" className="px-3 py-1.5">
              <Warning size={14} weight="bold" className="mr-1" />
              {vm.t('timesheets.validationErrors', { count: vm.validationStats.invalid, errors: vm.validationStats.invalid === 1 ? vm.t('timesheets.error') : vm.t('timesheets.errors') })}
            </Badge>
          )}
        </Stack>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          {vm.t('timesheets.exportCsv')}
        </Button>
      </Stack>

      <TimesheetTabs
        filteredTimesheets={vm.timesheetsWithValidation}
        onApprove={vm.handleApprove}
        onReject={vm.handleReject}
        onCreateInvoice={onCreateInvoice}
        onAdjust={vm.setSelectedTimesheet}
        onViewDetails={vm.setViewingTimesheet}
        onDelete={vm.handleDelete}
      />

      <TimesheetDetailDialog
        timesheet={vm.viewingTimesheet}
        open={vm.viewingTimesheet !== null}
        onOpenChange={open => { if (!open) vm.setViewingTimesheet(null) }}
      />

      {vm.selectedTimesheet && (
        <TimeAndRateAdjustmentWizard
          timesheet={{ id: vm.selectedTimesheet.id, workerId: vm.selectedTimesheet.workerId, workerName: vm.selectedTimesheet.workerName, clientName: vm.selectedTimesheet.clientName, hoursWorked: vm.selectedTimesheet.hours, rate: vm.selectedTimesheet.rate || 0, status: vm.selectedTimesheet.status }}
          open={vm.selectedTimesheet !== null}
          onOpenChange={open => { if (!open) vm.setSelectedTimesheet(null) }}
          onSubmit={vm.handleTimeAndRateAdjustment}
        />
      )}
    </Stack>
  )
}
