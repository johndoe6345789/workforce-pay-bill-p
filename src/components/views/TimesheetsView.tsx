import { Stack } from '@/components/ui/stack'
import { TimesheetTabs } from '@/components/timesheets/TimesheetTabs'
import { TimesheetAnalytics } from '@/components/timesheets/TimesheetAnalytics'
import { TimesheetSearchPanel } from '@/components/timesheets/TimesheetSearchPanel'
import { TimesheetFilterBar } from '@/components/timesheets/TimesheetFilterBar'
import { TimesheetActionDialogs } from '@/components/timesheets/TimesheetActionDialogs'
import { TimesheetPageHeader } from '@/components/timesheets/TimesheetPageHeader'
import { useTimesheetsView } from '@/hooks/useTimesheetsView'

interface TimesheetsViewProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateInvoice: (id: string) => void
}

export function TimesheetsView({ onCreateInvoice }: TimesheetsViewProps) {
  const vm = useTimesheetsView()

  return (
    <Stack spacing={6}>
      <TimesheetPageHeader
        showAnalytics={vm.showAnalytics}
        onToggleAnalytics={() => vm.setShowAnalytics(!vm.showAnalytics)}
        lastUpdated={vm.lastUpdated}
        t={vm.t}
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

      <TimesheetSearchPanel
        items={vm.timesheetsToFilter}
        fields={vm.timesheetFields}
        onResultsChange={vm.handleResultsChange}
        title={vm.t('timesheets.searchAndFilter')}
        description={vm.t('timesheets.findTimesheetsAdvanced')}
        resultsLabel={vm.t('timesheets.results', { count: vm.filteredTimesheets.length })}
        placeholder={vm.t('timesheets.searchPlaceholder')}
      />

      <TimesheetFilterBar
        statusFilter={vm.statusFilter}
        setStatusFilter={v => vm.setStatusFilter(v as any)}
        validationStats={vm.validationStats}
        t={vm.t}
      />

      <TimesheetTabs
        filteredTimesheets={vm.timesheetsWithValidation}
        onApprove={vm.handleApprove}
        onReject={vm.handleReject}
        onCreateInvoice={onCreateInvoice}
        onAdjust={vm.setSelectedTimesheet}
        onViewDetails={vm.setViewingTimesheet}
        onDelete={vm.handleDelete}
      />

      <TimesheetActionDialogs
        viewingTimesheet={vm.viewingTimesheet}
        setViewingTimesheet={vm.setViewingTimesheet}
        selectedTimesheet={vm.selectedTimesheet}
        setSelectedTimesheet={vm.setSelectedTimesheet}
        onAdjustSubmit={vm.handleTimeAndRateAdjustment}
      />
    </Stack>
  )
}
