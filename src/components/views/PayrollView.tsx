import { Plus, CurrencyDollar, ChartBar, Calculator, Users, CalendarBlank, ClockCounterClockwise, FileText, CheckCircle, Stack as StackIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { AdvancedDataTable } from '@/components/AdvancedDataTable'
import { PayrollDetailDialog } from '@/components/PayrollDetailDialog'
import { OneClickPayroll } from '@/components/OneClickPayroll'
import { CreatePayrollDialog } from '@/components/CreatePayrollDialog'
import { PayrollBatchProcessor } from '@/components/PayrollBatchProcessor'
import { PayrollBatchList } from '@/components/PayrollBatchList'
import { PAYEManager } from '@/components/PAYEManager'
import { CreatePAYESubmissionDialog } from '@/components/CreatePAYESubmissionDialog'
import { TaxCalculatorDialog } from '@/components/payroll/TaxCalculatorDialog'
import { usePayrollView } from '@/hooks/usePayrollView'
import { toast } from 'sonner'
import type { Timesheet } from '@/lib/types'

interface PayrollViewProps {
  timesheets: Timesheet[]
  workers: any[]
}

export function PayrollView({ timesheets, workers }: PayrollViewProps) {
  const vm = usePayrollView(timesheets)

  return (
    <Stack spacing={6}>
      <PageHeader
        title={vm.t('payroll.title')}
        description={vm.t('payroll.subtitle')}
        actions={
          <Stack direction="horizontal" spacing={2}>
            <Button variant="outline" onClick={() => vm.setShowPAYEManager(true)}>
              <FileText size={18} className="mr-2" />{vm.t('payroll.payeRTIManager')}
            </Button>
            <Button variant="outline" onClick={() => vm.setShowAnalytics(!vm.showAnalytics)}>
              <ChartBar size={18} className="mr-2" />
              {vm.showAnalytics ? vm.t('payroll.hideAnalytics') : vm.t('payroll.showAnalytics')}
            </Button>
            <Button variant="outline" onClick={() => vm.setShowCalculator(true)}>
              <Calculator size={18} className="mr-2" />{vm.t('payroll.taxCalculator')}
            </Button>
            <Button onClick={() => vm.setShowCreateDialog(true)}>
              <Plus size={18} className="mr-2" />{vm.t('payroll.runPayroll')}
            </Button>
          </Stack>
        }
      />

      <TaxCalculatorDialog open={vm.showCalculator} onOpenChange={vm.setShowCalculator} grossPay={vm.calculatorGrossPay} setGrossPay={vm.setCalculatorGrossPay} result={vm.calculatorResult} onCalculate={vm.handleCalculate} payrollConfig={vm.payrollConfig} t={vm.t} />

      <CreatePayrollDialog open={vm.showCreateDialog} onOpenChange={vm.setShowCreateDialog} onCreatePayroll={async (payroll) => { await vm.createPayrollRun(payroll) }} timesheets={timesheets} workers={workers} />

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

      <PayrollDetailDialog payrollRun={vm.viewingPayroll} open={vm.viewingPayroll !== null} onOpenChange={open => { if (!open) vm.setViewingPayroll(null) }} />

      <PAYEManager payrollRunId={vm.selectedPayrollForPAYE || undefined} open={vm.showPAYEManager} onOpenChange={vm.setShowPAYEManager} />

      {vm.selectedPayrollForPAYE && (
        <CreatePAYESubmissionDialog payrollRunId={vm.selectedPayrollForPAYE} open={vm.showCreatePAYE} onOpenChange={vm.setShowCreatePAYE} onSuccess={() => vm.setShowPAYEManager(true)} />
      )}
    </Stack>
  )
}
