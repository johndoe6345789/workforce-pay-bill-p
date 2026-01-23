import { useState, useMemo } from 'react'
import {
  Plus,
  CurrencyDollar,
  Download,
  ChartBar,
  Calculator
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { PayrollDetailDialog } from '@/components/PayrollDetailDialog'
import { OneClickPayroll } from '@/components/OneClickPayroll'
import { usePayrollCalculations } from '@/hooks/use-payroll-calculations'
import { toast } from 'sonner'
import type { PayrollRun, Timesheet } from '@/lib/types'

interface PayrollViewProps {
  payrollRuns: PayrollRun[]
  timesheets: Timesheet[]
  onPayrollComplete: (run: PayrollRun) => void
}

export function PayrollView({ payrollRuns, timesheets, onPayrollComplete }: PayrollViewProps) {
  const [viewingPayroll, setViewingPayroll] = useState<PayrollRun | null>(null)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorGrossPay, setCalculatorGrossPay] = useState('1000')
  const [calculatorResult, setCalculatorResult] = useState<any>(null)
  
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
    pendingTimesheets.reduce((sum, ts) => sum + ts.amount, 0),
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Payroll Processing</h2>
          <p className="text-muted-foreground mt-1">Manage payroll runs and worker payments</p>
        </div>
        <div className="flex gap-2">
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
              <div className="space-y-4">
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
                  <div className="space-y-3 border-t pt-4">
                    <div className="grid grid-cols-2 gap-3">
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
                    </div>
                    
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
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus size={18} className="mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      <OneClickPayroll 
        timesheets={timesheets}
        onPayrollComplete={onPayrollComplete}
      />

      {showAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Approved Timesheets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{approvedTimesheets.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Ready for payroll</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{pendingTimesheets.length}</div>
              <p className="text-sm text-muted-foreground mt-1">
                £{totalPendingValue.toLocaleString()} value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Total Payroll Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{payrollRuns.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Last Run Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold font-mono">
                £{lastRun ? lastRun.totalAmount.toLocaleString() : '0'}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {lastRun ? `${lastRun.workersCount} workers paid` : 'No runs yet'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Next Pay Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">22 Jan 2025</div>
            <p className="text-sm text-muted-foreground mt-1">Weekly run in 3 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pendingTimesheets.length} timesheets</div>
            <p className="text-sm text-muted-foreground mt-1">Must be approved for payroll</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Last Run Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold font-mono">
              £{lastRun ? lastRun.totalAmount.toLocaleString() : '0'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {lastRun ? `${lastRun.workersCount} workers paid` : 'No runs yet'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {payrollRuns.map(run => (
          <Card 
            key={run.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setViewingPayroll(run)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <CurrencyDollar size={20} weight="fill" className="text-primary" />
                    <h3 className="font-semibold text-lg">Payroll Run</h3>
                    <Badge variant={run.status === 'completed' ? 'success' : run.status === 'failed' ? 'destructive' : 'warning'}>
                      {run.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  </div>
                </div>
                <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                  <Button size="sm" variant="outline" onClick={() => setViewingPayroll(run)}>
                    View Details
                  </Button>
                  {run.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <Download size={16} className="mr-2" />
                      Export
                    </Button>
                  )}
                </div>
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
      </div>

      <PayrollDetailDialog
        payrollRun={viewingPayroll}
        open={viewingPayroll !== null}
        onOpenChange={(open) => {
          if (!open) setViewingPayroll(null)
        }}
      />
    </div>
  )
}
