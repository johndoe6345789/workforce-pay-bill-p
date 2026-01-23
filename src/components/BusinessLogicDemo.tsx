import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
  useInvoicing,
  usePayrollCalculations,
  useTimeTracking,
  useMarginAnalysis,
  useComplianceTracking
} from '@/hooks'
import {
  Receipt,
  CurrencyCircleDollar,
  Clock,
  TrendUp,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Warning
} from '@phosphor-icons/react'

export function BusinessLogicDemo() {
  const [activeTab, setActiveTab] = useState('invoicing')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Business Logic Hooks Demo</h1>
        <p className="text-muted-foreground">
          Specialized hooks for invoicing, payroll, time tracking, margin analysis, and compliance
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="invoicing">
            <Receipt className="mr-2 h-4 w-4" />
            Invoicing
          </TabsTrigger>
          <TabsTrigger value="payroll">
            <CurrencyCircleDollar className="mr-2 h-4 w-4" />
            Payroll
          </TabsTrigger>
          <TabsTrigger value="time">
            <Clock className="mr-2 h-4 w-4" />
            Time Tracking
          </TabsTrigger>
          <TabsTrigger value="margin">
            <TrendUp className="mr-2 h-4 w-4" />
            Margin Analysis
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoicing" className="space-y-4">
          <InvoicingDemo />
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <PayrollDemo />
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <TimeTrackingDemo />
        </TabsContent>

        <TabsContent value="margin" className="space-y-4">
          <MarginAnalysisDemo />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <ComplianceDemo />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function InvoicingDemo() {
  const {
    invoices,
    calculateInvoiceAging,
    getOverdueInvoices,
    getInvoicesByStatus
  } = useInvoicing()

  const aging = calculateInvoiceAging()
  const overdue = getOverdueInvoices()
  const draft = getInvoicesByStatus('draft')
  const paid = getInvoicesByStatus('paid')

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoices.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {draft.length} draft, {paid.length} paid
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Current</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">£{aging.current.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Not yet due</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">30 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">£{aging.days30.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">1-30 days overdue</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">90+ Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            £{aging.over90.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{overdue.length} invoices</p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Invoice Aging Breakdown</CardTitle>
          <CardDescription>Breakdown of outstanding invoices by age</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Current</span>
              <span className="font-semibold">£{aging.current.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">1-30 days</span>
              <span className="font-semibold">£{aging.days30.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">31-60 days</span>
              <span className="font-semibold">£{aging.days60.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">61-90 days</span>
              <span className="font-semibold">£{aging.days90.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm">90+ days</span>
              <span className="font-semibold text-destructive">£{aging.over90.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function PayrollDemo() {
  const { payrollConfig, calculatePayroll } = usePayrollCalculations()
  const [result, setResult] = useState<any>(null)

  const handleCalculate = () => {
    const calc = calculatePayroll('demo-worker', 3000, 36000, true)
    setResult(calc)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Payroll Configuration</CardTitle>
          <CardDescription>Current UK tax year settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <span className="text-sm font-medium">Tax Year:</span>
              <p className="text-muted-foreground">{payrollConfig.taxYear}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Personal Allowance:</span>
              <p className="text-muted-foreground">£{payrollConfig.personalAllowance.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Employer NI Rate:</span>
              <p className="text-muted-foreground">{(payrollConfig.employerNIRate * 100).toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-sm font-medium">Pension Rate:</span>
              <p className="text-muted-foreground">{(payrollConfig.pensionRate * 100).toFixed(1)}%</p>
            </div>
          </div>

          <Separator />

          <div>
            <Button onClick={handleCalculate}>Calculate Example Payroll</Button>
            <p className="text-sm text-muted-foreground mt-2">
              Calculate for £3,000 monthly (£36,000 annual) with student loan
            </p>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Calculation Result</CardTitle>
            <CardDescription>{result.workerName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.breakdown.map((item: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">{item.description}</span>
                    <span className={`font-semibold ${item.amount < 0 ? 'text-destructive' : ''}`}>
                      £{Math.abs(item.amount).toFixed(2)}
                    </span>
                  </div>
                  {index < result.breakdown.length - 1 && <Separator />}
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Employer Cost:</span>
                <span className="text-lg font-bold">£{result.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function TimeTrackingDemo() {
  const { shiftPremiums, calculateShiftHours } = useTimeTracking()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Shift Premiums</CardTitle>
          <CardDescription>Automatic rate multipliers for different shift types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {shiftPremiums.map(premium => (
              <div key={premium.shiftType} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium capitalize">{premium.shiftType.replace('-', ' ')}</p>
                  <p className="text-sm text-muted-foreground">{premium.description}</p>
                </div>
                <Badge variant={premium.multiplier > 1.5 ? 'default' : 'secondary'}>
                  {premium.multiplier.toFixed(2)}x
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Shift Calculator</CardTitle>
          <CardDescription>Calculate hours with break deduction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <span className="text-sm font-medium">Example: 09:00 - 17:00</span>
              <p className="text-muted-foreground">30 min break</p>
              <p className="text-lg font-bold mt-1">
                {calculateShiftHours('09:00', '17:00', 30).toFixed(2)} hours
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Example: 22:00 - 06:00</span>
              <p className="text-muted-foreground">60 min break</p>
              <p className="text-lg font-bold mt-1">
                {calculateShiftHours('22:00', '06:00', 60).toFixed(2)} hours
              </p>
            </div>
            <div>
              <span className="text-sm font-medium">Example: 14:00 - 22:00</span>
              <p className="text-muted-foreground">No break</p>
              <p className="text-lg font-bold mt-1">
                {calculateShiftHours('14:00', '22:00', 0).toFixed(2)} hours
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MarginAnalysisDemo() {
  const { analyzeClientProfitability } = useMarginAnalysis()
  const clients = analyzeClientProfitability().slice(0, 5)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Top Clients by Revenue</CardTitle>
          <CardDescription>Client profitability analysis</CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <div className="space-y-4">
              {clients.map((client, index) => (
                <div key={client.clientName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="font-medium">{client.clientName}</span>
                    </div>
                    <Badge variant={client.marginPercentage > 20 ? 'default' : 'secondary'}>
                      {client.marginPercentage.toFixed(1)}% margin
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Revenue:</span>
                      <p className="font-semibold">£{client.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Margin:</span>
                      <p className="font-semibold">£{client.margin.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Invoices:</span>
                      <p className="font-semibold">{client.invoiceCount}</p>
                    </div>
                  </div>
                  {index < clients.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No client data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function ComplianceDemo() {
  const { complianceRules, getComplianceDashboard } = useComplianceTracking()
  const dashboard = getComplianceDashboard()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.complianceRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard.compliantWorkers} of {dashboard.totalWorkers} workers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{dashboard.documentsExpiringSoon}</div>
            <p className="text-xs text-muted-foreground mt-1">Documents need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{dashboard.documentsExpired}</div>
            <p className="text-xs text-muted-foreground mt-1">Urgent action required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compliance Rules</CardTitle>
          <CardDescription>Configured document requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {complianceRules.map(rule => (
              <div key={rule.documentType} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex items-start gap-3">
                  {rule.required ? (
                    <CheckCircle className="h-5 w-5 text-success mt-0.5" weight="fill" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{rule.documentType}</p>
                    <p className="text-sm text-muted-foreground">
                      {rule.required ? 'Required' : 'Optional'} • 
                      Warning at {rule.expiryWarningDays} days • 
                      Renewal lead time {rule.renewalLeadDays} days
                    </p>
                  </div>
                </div>
                {rule.required && <Badge>Required</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
