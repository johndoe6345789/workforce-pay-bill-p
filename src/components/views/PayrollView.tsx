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
  Trash
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { PayrollDetailDialog } from '@/components/PayrollDetailDialog'
import { OneClickPayroll } from '@/components/OneClickPayroll'
import { usePayrollCalculations } from '@/hooks/use-payroll-calculations'
import { usePayrollCrud } from '@/hooks/use-payroll-crud'
import { toast } from 'sonner'
import type { Timesheet } from '@/lib/types'

interface PayrollViewProps {
  timesheets: Timesheet[]
}

export function PayrollView({ timesheets }: PayrollViewProps) {
  const [viewingPayroll, setViewingPayroll] = useState<any | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorGrossPay, setCalculatorGrossPay] = useState('1000')
  const [calculatorResult, setCalculatorResult] = useState<any>(null)
  
  const {
    payrollRuns,
    createPayrollRun,
    updatePayrollRun,
    deletePayrollRun
  } = usePayrollCrud()
  
  const { 
    calculatePayroll, 
    calculateBatchPayroll,
    payrollConfig 
  } = usePayrollCalculations()

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

  const handleCalculate = () => {
    const grossPay = parseFloat(calculatorGrossPay)
    if (isNaN(grossPay) || grossPay <= 0) {
      toast.error('Please enter a valid gross pay amount')
      return
    }

    const result = calculatePayroll('CALC-WORKER', grossPay, grossPay * 12, false)
    setCalculatorResult(result)
  }

  const handlePayrollComplete = useCallback(async (run: any) => {
    try {
      await createPayrollRun(run)
      toast.success('Payroll run completed successfully')
    } catch (error) {
      toast.error('Failed to complete payroll run')
    }
  }, [createPayrollRun])

  const handleDeletePayrollRun = useCallback(async (runId: string) => {
    try {
      await deletePayrollRun(runId)
      toast.success('Payroll run deleted successfully')
      if (viewingPayroll?.id === runId) {
        setViewingPayroll(null)
      }
    } catch (error) {
      toast.error('Failed to delete payroll run')
    }
  }, [deletePayrollRun, viewingPayroll])
  
  return (
    <Stack spacing={6}>
      <PageHeader
        title="Payroll Processing"
        description="Manage payroll runs and worker payments"
        actions={
          <Stack direction="horizontal" spacing={2}>
            <Button 
              variant="outline" 
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              <ChartBar size={18} className="mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </Button>
            <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Calculator size={18} className="mr-2" />
                  Tax Calculator
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Payroll Tax Calculator</DialogTitle>
                </DialogHeader>
                <Stack spacing={4}>
                  <div>
                    <label className="text-sm font-medium">Gross Pay (Monthly)</label>
                    <input
                      type="number"
                      value={calculatorGrossPay}
                      onChange={(e) => setCalculatorGrossPay(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-input rounded-md"
                      placeholder="1000"
                    />
                  </div>
                  <Button onClick={handleCalculate}>Calculate</Button>
                  
                  {calculatorResult && (
                    <Stack spacing={3} className="border-t pt-4">
                      <Grid cols={2} gap={3}>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">Gross Pay</div>
                            <div className="text-xl font-semibold font-mono">
                              £{calculatorResult.grossPay.toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-4">
                            <div className="text-sm text-muted-foreground">Net Pay</div>
                            <div className="text-xl font-semibold font-mono text-success">
                              £{calculatorResult.netPay.toFixed(2)}
                            </div>
                          </CardContent>
                        </Card>
                      </Grid>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">Breakdown</CardTitle>
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
                          <div className="text-xs text-muted-foreground mb-1">Tax Year: {payrollConfig.taxYear}</div>
                          <div className="text-xs text-muted-foreground">Personal Allowance: £{payrollConfig.personalAllowance.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                    </Stack>
                  )}
                </Stack>
              </DialogContent>
            </Dialog>
            <Button>
              <Plus size={18} className="mr-2" />
              Run Payroll
            </Button>
          </Stack>
        }
      />

      <OneClickPayroll 
        timesheets={timesheets}
        onPayrollComplete={handlePayrollComplete}
      />

      {showAnalytics && (
        <Grid cols={4} gap={4}>
          <MetricCard
            label="Approved Timesheets"
            value={approvedTimesheets.length}
            description="Ready for payroll"
            icon={<Users size={24} />}
          />
          <MetricCard
            label="Pending Approval"
            value={pendingTimesheets.length}
            description={`£${totalPendingValue.toLocaleString()} value`}
            icon={<ClockCounterClockwise size={24} />}
          />
          <MetricCard
            label="Total Payroll Runs"
            value={payrollRuns.length}
            icon={<CurrencyDollar size={24} />}
          />
          <MetricCard
            label="Last Run Total"
            value={lastRun ? `£${lastRun.totalAmount.toLocaleString()}` : '£0'}
            description={lastRun ? `${lastRun.workersCount} workers paid` : 'No runs yet'}
            icon={<Download size={24} />}
          />
        </Grid>
      )}

      <Grid cols={3} gap={4}>
        <MetricCard
          label="Next Pay Date"
          value="22 Jan 2025"
          description="Weekly run in 3 days"
          icon={<CalendarBlank size={24} />}
        />
        <MetricCard
          label="Pending Approval"
          value={`${pendingTimesheets.length} timesheets`}
          description="Must be approved for payroll"
          icon={<ClockCounterClockwise size={24} />}
        />
        <MetricCard
          label="Last Run Total"
          value={lastRun ? `£${lastRun.totalAmount.toLocaleString()}` : '£0'}
          description={lastRun ? `${lastRun.workersCount} workers paid` : 'No runs yet'}
          icon={<CurrencyDollar size={24} />}
        />
      </Grid>

      <Stack spacing={3}>
        {payrollRuns.map(run => (
          <Card 
            key={run.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setViewingPayroll(run)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Stack spacing={2} className="flex-1">
                  <Stack direction="horizontal" spacing={3} align="center">
                    <CurrencyDollar size={20} weight="fill" className="text-primary" />
                    <h3 className="font-semibold text-lg">Payroll Run</h3>
                    <Badge variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'destructive' : 'warning'}>
                      {run.status}
                    </Badge>
                  </Stack>
                  <Grid cols={4} gap={4} className="text-sm">
                    <div>
                      <p className="text-muted-foreground">Period Ending</p>
                      <p className="font-medium">{new Date(run.periodEnding).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Workers</p>
                      <p className="font-medium">{run.workersCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-semibold font-mono text-lg">£{run.totalAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processed</p>
                      <p className="font-medium">
                        {run.processedDate ? new Date(run.processedDate).toLocaleDateString() : 'Not yet'}
                      </p>
                    </div>
                  </Grid>
                </Stack>
                <Stack direction="horizontal" spacing={2} className="ml-4" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" onClick={() => setViewingPayroll(run)}>
                    View Details
                  </Button>
                  {run.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <Download size={16} className="mr-2" />
                      Export
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeletePayrollRun(run.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </Stack>
              </div>
            </CardContent>
          </Card>
        ))}

        {payrollRuns.length === 0 && (
          <Card className="p-12 text-center">
            <CurrencyDollar size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No payroll runs yet</h3>
            <p className="text-muted-foreground">Create your first payroll run to get started</p>
          </Card>
        )}
      </Stack>

      <PayrollDetailDialog
        payrollRun={viewingPayroll}
        open={viewingPayroll !== null}
        onOpenChange={(open) => {
          if (!open) setViewingPayroll(null)
        }}
      />
    </Stack>
  )
}
