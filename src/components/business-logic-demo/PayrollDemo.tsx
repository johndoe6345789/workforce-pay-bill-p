import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { usePayrollCalculations } from '@/hooks'

export function PayrollDemo() {
  const { payrollConfig, calculatePayroll } = usePayrollCalculations()
  const [result, setResult] = useState<any>(null)

  const handleCalculate = () => setResult(calculatePayroll('demo-worker', 3000, 36000, true))

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Payroll Configuration</CardTitle><CardDescription>Current UK tax year settings</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div><span className="text-sm font-medium">Tax Year:</span><p className="text-muted-foreground">{payrollConfig.taxYear}</p></div>
            <div><span className="text-sm font-medium">Personal Allowance:</span><p className="text-muted-foreground">£{payrollConfig.personalAllowance.toLocaleString()}</p></div>
            <div><span className="text-sm font-medium">Employer NI Rate:</span><p className="text-muted-foreground">{(payrollConfig.employerNIRate * 100).toFixed(1)}%</p></div>
            <div><span className="text-sm font-medium">Pension Rate:</span><p className="text-muted-foreground">{(payrollConfig.pensionRate * 100).toFixed(1)}%</p></div>
          </div>
          <Separator />
          <div>
            <Button onClick={handleCalculate}>Calculate Example Payroll</Button>
            <p className="text-sm text-muted-foreground mt-2">Calculate for £3,000 monthly (£36,000 annual) with student loan</p>
          </div>
        </CardContent>
      </Card>
      {result && (
        <Card>
          <CardHeader><CardTitle>Calculation Result</CardTitle><CardDescription>{result.workerName}</CardDescription></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.breakdown.map((item: any, index: number) => (
                <div key={index}>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm">{item.description}</span>
                    <span className={`font-semibold ${item.amount < 0 ? 'text-destructive' : ''}`}>£{Math.abs(item.amount).toFixed(2)}</span>
                  </div>
                  {index < result.breakdown.length - 1 && <Separator />}
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center"><span className="font-semibold">Total Employer Cost:</span><span className="text-lg font-bold">£{result.totalCost.toFixed(2)}</span></div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
