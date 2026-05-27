import { CurrencyDollar, Users, CalendarBlank, ClockCounterClockwise, FileText, CheckCircle, Stack as StackIcon } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Grid } from '@/components/ui/grid'
import { MetricCard } from '@/components/ui/metric-card'
import { AdvancedDataTable } from '@/components/AdvancedDataTable'
import { OneClickPayroll } from '@/components/OneClickPayroll'
import { PayrollBatchProcessor } from '@/components/PayrollBatchProcessor'
import { PayrollBatchList } from '@/components/PayrollBatchList'
import type { usePayrollView } from '@/hooks/usePayrollView'
import type { Timesheet } from '@/lib/types'
import { toast } from 'sonner'

type VM = ReturnType<typeof usePayrollView>

interface Props {
  vm: VM
  timesheets: Timesheet[]
  workers: any[]
}

export function PayrollTabs({ vm, timesheets, workers }: Props) {
  return (
    <Tabs value={vm.activeTab} onValueChange={vm.setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview"><CurrencyDollar className="mr-2" />{vm.t('payroll.overview')}</TabsTrigger>
        <TabsTrigger value="batch-processing">
          <StackIcon className="mr-2" />{vm.t('payroll.batchProcessing')}
          {vm.pendingBatches.length > 0 && <Badge className="ml-2" variant="destructive">{vm.pendingBatches.length}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="approval-queue"><CheckCircle className="mr-2" />{vm.t('payroll.approvalQueue')}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <OneClickPayroll timesheets={timesheets} onPayrollComplete={vm.handlePayrollComplete} />

        {vm.showAnalytics && (
          <Grid cols={4} gap={4}>
            <MetricCard label={vm.t('payroll.approvedTimesheets')} value={vm.approvedTimesheets.length} description={vm.t('payroll.readyForPayroll')} icon={<Users size={24} />} />
            <MetricCard label={vm.t('payroll.pendingApproval')} value={vm.pendingTimesheets.length} description={`£${vm.totalPendingValue.toLocaleString()} value`} icon={<ClockCounterClockwise size={24} />} />
            <MetricCard label={vm.t('payroll.totalPayrollRuns')} value={vm.payrollRuns.length} icon={<CurrencyDollar size={24} />} />
            <MetricCard label={vm.t('payroll.lastRunTotal')} value={vm.lastRun ? `£${vm.lastRun.totalAmount.toLocaleString()}` : '£0'} description={vm.lastRun ? `${vm.lastRun.workersCount} ${vm.t('payroll.workersPaid')}` : vm.t('payroll.noRunsYet')} icon={<CurrencyDollar size={24} />} />
          </Grid>
        )}

        <Grid cols={4} gap={4}>
          <MetricCard label={vm.t('payroll.nextPayDate')} value="22 Jan 2025" description={vm.t('payroll.weeklyRun', { days: '3' })} icon={<CalendarBlank size={24} />} />
          <MetricCard label={vm.t('payroll.pendingApproval')} value={`${vm.pendingTimesheets.length} timesheets`} description={vm.t('payroll.mustBeApproved')} icon={<ClockCounterClockwise size={24} />} />
          <MetricCard label={vm.t('payroll.payePending')} value={vm.pendingPAYESubmissions.length} description={vm.t('payroll.rtiSubmissionsReady')} icon={<FileText size={24} />} onClick={() => vm.setShowPAYEManager(true)} className="cursor-pointer hover:bg-muted/50 transition-colors" />
          <MetricCard label={vm.t('payroll.payeSubmitted')} value={vm.submittedPAYESubmissions.length} description={vm.t('payroll.sentToHMRC')} icon={<CheckCircle size={24} />} onClick={() => vm.setShowPAYEManager(true)} className="cursor-pointer hover:bg-muted/50 transition-colors" />
        </Grid>

        <Grid cols={3} gap={4}>
          <MetricCard label={vm.t('payroll.lastRunTotal')} value={vm.lastRun ? `£${vm.lastRun.totalAmount.toLocaleString()}` : '£0'} description={vm.lastRun ? `${vm.lastRun.workersCount} ${vm.t('payroll.workersPaid')}` : vm.t('payroll.noRunsYet')} icon={<CurrencyDollar size={24} />} />
        </Grid>

        <AdvancedDataTable data={vm.payrollRuns} columns={vm.payrollColumns} rowKey="id" onRowClick={run => vm.setViewingPayroll(run)} emptyMessage={vm.t('payroll.noPayrollRunsYet')} showSearch showPagination showExport exportFilename={`payroll-runs-${new Date().toISOString().split('T')[0]}`} initialPageSize={20} />
      </TabsContent>

      <TabsContent value="batch-processing" className="space-y-6">
        <PayrollBatchProcessor timesheets={timesheets} workers={workers} onBatchComplete={() => { toast.success(vm.t('payroll.batchCreatedSuccess')); vm.setActiveTab('approval-queue') }} />
      </TabsContent>

      <TabsContent value="approval-queue" className="space-y-6">
        <PayrollBatchList currentUserRole={vm.currentUserRole} currentUserName={vm.currentUser?.name || 'Unknown User'} />
      </TabsContent>
    </Tabs>
  )
}
