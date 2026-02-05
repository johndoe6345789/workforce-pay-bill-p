import { useState, useMemo, useCallback } from 'react'
import {
  Plus,
  CurrencyDollar,
  Download,
  ChartBar,
  Calculator,
  Users,
  CalendarBlank,
  ClockCounterClockwise,
  Trash,
  Stack as StackIcon,
  CheckCircle,
  FileText,
  Eye
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { AdvancedDataTable } from '@/components/AdvancedDataTable'
import { TableColumn } from '@/hooks/use-advanced-table'
import { PayrollDetailDialog } from '@/components/PayrollDetailDialog'
import { OneClickPayroll } from '@/components/OneClickPayroll'
import { CreatePayrollDialog } from '@/components/CreatePayrollDialog'
import { PayrollBatchProcessor } from '@/components/PayrollBatchProcessor'
import { PayrollBatchList } from '@/components/PayrollBatchList'
import { PAYEManager } from '@/components/PAYEManager'
import { CreatePAYESubmissionDialog } from '@/components/CreatePAYESubmissionDialog'
import { usePayrollCalculations } from '@/hooks/use-payroll-calculations'
import { usePayrollCrud } from '@/hooks/use-payroll-crud'
import { usePayrollBatch } from '@/hooks/use-payroll-batch'
import { usePAYEIntegration } from '@/hooks/use-paye-integration'
import { useTranslation } from '@/hooks/use-translation'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'sonner'
import type { Timesheet } from '@/lib/types'

interface PayrollViewProps {
  timesheets: Timesheet[]
  workers: any[]
}

export function PayrollView({ timesheets, workers }: PayrollViewProps) {
  const { t } = useTranslation()
  const [viewingPayroll, setViewingPayroll] = useState<any | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showPAYEManager, setShowPAYEManager] = useState(false)
  const [showCreatePAYE, setShowCreatePAYE] = useState(false)
  const [selectedPayrollForPAYE, setSelectedPayrollForPAYE] = useState<string | null>(null)
  const [calculatorGrossPay, setCalculatorGrossPay] = useState('1000')
  const [calculatorResult, setCalculatorResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  
  const currentUser = useAppSelector(state => state.auth.user)
  const currentUserRole = currentUser?.role || 'user'
  
  const {
    payrollRuns,
    createPayrollRun,
    updatePayrollRun,
    deletePayrollRun
  } = usePayrollCrud()
  
  const { batches } = usePayrollBatch()
  
  const { 
    calculatePayroll, 
    calculateBatchPayroll,
    payrollConfig 
  } = usePayrollCalculations()

  const { getPendingSubmissions, getSubmittedSubmissions } = usePAYEIntegration()

  const approvedTimesheets = useMemo(() => 
    timesheets.filter(ts => ts.status === 'approved'),
    [timesheets]
  )

  const pendingTimesheets = useMemo(() => 
    timesheets.filter(ts => ts.status === 'pending'),
    [timesheets]
  )

  const totalPendingValue = useMemo(() =>
    pendingTimesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0),
    [pendingTimesheets]
  )

  const lastRun = useMemo(() => 
    payrollRuns.length > 0 ? payrollRuns[payrollRuns.length - 1] : null,
    [payrollRuns]
  )
  
  const pendingBatches = useMemo(() => 
    batches.filter(b => b.status === 'pending-approval'),
    [batches]
  )
  
  const completedBatches = useMemo(() =>
    batches.filter(b => b.status === 'completed'),
    [batches]
  )

  const pendingPAYESubmissions = useMemo(
    () => getPendingSubmissions(),
    [getPendingSubmissions]
  )

  const submittedPAYESubmissions = useMemo(
    () => getSubmittedSubmissions(),
    [getSubmittedSubmissions]
  )

  const handleCalculate = () => {
    const grossPay = parseFloat(calculatorGrossPay)
    if (isNaN(grossPay) || grossPay <= 0) {
      toast.error(t('payroll.validGrossPayRequired'))
      return
    }

    const result = calculatePayroll('CALC-WORKER', grossPay, grossPay * 12, false)
    setCalculatorResult(result)
  }

  const handlePayrollComplete = useCallback(async (run: any) => {
    try {
      await createPayrollRun(run)
      toast.success(t('payroll.payrollCompleteSuccess'))
    } catch (error) {
      toast.error(t('payroll.payrollCompleteError'))
    }
  }, [createPayrollRun, t])

  const handleDeletePayrollRun = useCallback(async (runId: string) => {
    try {
      await deletePayrollRun(runId)
      toast.success(t('payroll.payrollDeleteSuccess'))
      if (viewingPayroll?.id === runId) {
        setViewingPayroll(null)
      }
    } catch (error) {
      toast.error(t('payroll.payrollDeleteError'))
    }
  }, [deletePayrollRun, viewingPayroll, t])

  const payrollColumns: TableColumn<any>[] = useMemo(() => [
    {
      key: 'periodEnding',
      label: t('payroll.periodEnding'),
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString()
    },
    {
      key: 'workersCount',
      label: t('payroll.workers'),
      sortable: true,
    },
    {
      key: 'totalAmount',
      label: t('payroll.totalAmount'),
      sortable: true,
      render: (value) => <span className="font-mono font-semibold">£{(value as number).toLocaleString()}</span>
    },
    {
      key: 'processedDate',
      label: t('payroll.processed'),
      sortable: true,
      render: (value) => value ? new Date(value as string).toLocaleDateString() : t('payroll.notYet')
    },
    {
      key: 'status',
      label: t('common.status'),
      sortable: true,
      render: (value) => (
        <Badge variant={
          value === 'completed' ? 'success' : 
          value === 'failed' ? 'destructive' : 
          'warning'
        }>
          {t(`payroll.status.${value}`)}
        </Badge>
      )
    },
    {
      key: 'id',
      label: t('common.actions'),
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setViewingPayroll(row)}
            title={t('payroll.viewDetails')}
          >
            <Eye size={16} />
          </Button>
          {row.status === 'completed' && (
            <>
              <Button 
                size="sm" 
                variant="ghost"
                className="text-primary hover:text-primary"
                onClick={() => {
                  setSelectedPayrollForPAYE(row.id)
                  setShowCreatePAYE(true)
                }}
                title={t('payroll.createPAYE')}
              >
                <FileText size={16} />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                title={t('payroll.export')}
              >
                <Download size={16} />
              </Button>
            </>
          )}
          <Button 
            size="sm" 
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDeletePayrollRun(row.id)}
            title={t('common.delete')}
          >
            <Trash size={16} />
          </Button>
        </div>
      )
    }
  ], [t, handleDeletePayrollRun])
  
  return (
    <Stack spacing={6}>
      <PageHeader
        title={t('payroll.title')}
        description={t('payroll.subtitle')}
        actions={
          <Stack direction="horizontal" spacing={2}>
            <Button 
              variant="outline" 
              onClick={() => setShowPAYEManager(true)}
            >
              <FileText size={18} className="mr-2" />
              {t('payroll.payeRTIManager')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <ChartBar size={18} className="mr-2" />
              {showAnalytics ? t('payroll.hideAnalytics') : t('payroll.showAnalytics')}
            </Button>
            <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calculator size={18} className="mr-2" />
                  {t('payroll.taxCalculator')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t('payroll.taxCalculator')}</DialogTitle>
                </DialogHeader>
                <Stack spacing={4}>
                  <div>
                    <label className="text-sm font-medium">{t('payroll.grossPayMonthly')}</label>
                    <input
                      type="number"
                      value={calculatorGrossPay}
                      onChange={(e) => setCalculatorGrossPay(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md"
                      placeholder="1000"
                    />
                  </div>
                  <Button onClick={handleCalculate}>{t('payroll.calculate')}</Button>
                  
                  {calculatorResult && (
                    <Stack spacing={3} className="border-t pt-4">
                      <Grid cols={2} gap={3}>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">{t('payroll.grossPay')}</div>
                            <div className="text-xl font-semibold font-mono">
                              £{calculatorResult.grossPay.toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">{t('payroll.netPay')}</div>
                            <div className="text-xl font-semibold font-mono text-success">
                              £{calculatorResult.netPay.toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">{t('payroll.breakdown')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {calculatorResult.breakdown.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span>{item.description}</span>
                              <span className={`font-mono ${item.amount < 0 ? 'text-destructive' : ''}`}>
                                £{Math.abs(item.amount).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="bg-muted/50">
                        <CardContent className="pt-4">
                          <div className="text-xs text-muted-foreground mb-1">{t('payroll.taxYear')}: {payrollConfig.taxYear}</div>
                          <div className="text-xs text-muted-foreground">{t('payroll.personalAllowance')}: £{payrollConfig.personalAllowance.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    </Stack>
                  )}
                </Stack>
              </DialogContent>
            </Dialog>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus size={18} className="mr-2" />
              {t('payroll.runPayroll')}
            </Button>
          </Stack>
        }
      />

      <CreatePayrollDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreatePayroll={async (payroll) => {
          await createPayrollRun(payroll)
        }}
        timesheets={timesheets}
        workers={workers}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            <CurrencyDollar className="mr-2" />
            {t('payroll.overview')}
          </TabsTrigger>
          <TabsTrigger value="batch-processing">
            <StackIcon className="mr-2" />
            {t('payroll.batchProcessing')}
            {pendingBatches.length > 0 && (
              <Badge className="ml-2" variant="destructive">
                {pendingBatches.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approval-queue">
            <CheckCircle className="mr-2" />
            {t('payroll.approvalQueue')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OneClickPayroll 
            timesheets={timesheets}
            onPayrollComplete={handlePayrollComplete}
          />

          {showAnalytics && (
            <Grid cols={4} gap={4}>
              <MetricCard
                label={t('payroll.approvedTimesheets')}
                value={approvedTimesheets.length}
                description={t('payroll.readyForPayroll')}
                icon={<Users size={24} />}
              />
              <MetricCard
                label={t('payroll.pendingApproval')}
                value={pendingTimesheets.length}
                description={`£${totalPendingValue.toLocaleString()} value`}
                icon={<ClockCounterClockwise size={24} />}
              />
              <MetricCard
                label={t('payroll.totalPayrollRuns')}
                value={payrollRuns.length}
                icon={<CurrencyDollar size={24} />}
              />
              <MetricCard
                label={t('payroll.lastRunTotal')}
                value={lastRun ? `£${lastRun.totalAmount.toLocaleString()}` : '£0'}
                description={lastRun ? `${lastRun.workersCount} ${t('payroll.workersPaid')}` : t('payroll.noRunsYet')}
                icon={<Download size={24} />}
              />
            </Grid>
          )}

          <Grid cols={4} gap={4}>
            <MetricCard
              label={t('payroll.nextPayDate')}
              value="22 Jan 2025"
              description={t('payroll.weeklyRun', { days: '3' })}
              icon={<CalendarBlank size={24} />}
            />
            <MetricCard
              label={t('payroll.pendingApproval')}
              value={`${pendingTimesheets.length} timesheets`}
              description={t('payroll.mustBeApproved')}
              icon={<ClockCounterClockwise size={24} />}
            />
            <MetricCard
              label={t('payroll.payePending')}
              value={pendingPAYESubmissions.length}
              description={t('payroll.rtiSubmissionsReady')}
              icon={<FileText size={24} />}
              onClick={() => setShowPAYEManager(true)}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            />
            <MetricCard
              label={t('payroll.payeSubmitted')}
              value={submittedPAYESubmissions.length}
              description={t('payroll.sentToHMRC')}
              icon={<CheckCircle size={24} />}
              onClick={() => setShowPAYEManager(true)}
              className="cursor-pointer hover:bg-muted/50 transition-colors"
            />
          </Grid>

          <Grid cols={3} gap={4}>
            <MetricCard
              label={t('payroll.lastRunTotal')}
              value={lastRun ? `£${lastRun.totalAmount.toLocaleString()}` : '£0'}
              description={lastRun ? `${lastRun.workersCount} ${t('payroll.workersPaid')}` : t('payroll.noRunsYet')}
              icon={<CurrencyDollar size={24} />}
            />
          </Grid>

          <AdvancedDataTable
            data={payrollRuns}
            columns={payrollColumns}
            rowKey="id"
            onRowClick={(run) => setViewingPayroll(run)}
            emptyMessage={t('payroll.noPayrollRunsYet')}
            showSearch={true}
            showPagination={true}
            showExport={true}
            exportFilename={`payroll-runs-${new Date().toISOString().split('T')[0]}`}
            initialPageSize={20}
          />
        </TabsContent>

        <TabsContent value="batch-processing" className="space-y-6">
          <PayrollBatchProcessor
            timesheets={timesheets}
            workers={workers}
            onBatchComplete={() => {
              toast.success(t('payroll.batchCreatedSuccess'))
              setActiveTab('approval-queue')
            }}
          />
        </TabsContent>

        <TabsContent value="approval-queue" className="space-y-6">
          <PayrollBatchList
            currentUserRole={currentUserRole}
            currentUserName={currentUser?.name || 'Unknown User'}
          />
        </TabsContent>
      </Tabs>

      <PayrollDetailDialog
        payrollRun={viewingPayroll}
        open={viewingPayroll !== null}
        onOpenChange={(open) => {
          if (!open) setViewingPayroll(null)
        }}
      />

      <PAYEManager
        payrollRunId={selectedPayrollForPAYE || undefined}
        open={showPAYEManager}
        onOpenChange={setShowPAYEManager}
      />

      {selectedPayrollForPAYE && (
        <CreatePAYESubmissionDialog
          payrollRunId={selectedPayrollForPAYE}
          open={showCreatePAYE}
          onOpenChange={setShowCreatePAYE}
          onSuccess={() => {
            setShowPAYEManager(true)
          }}
        />
      )}
    </Stack>
  )
}
