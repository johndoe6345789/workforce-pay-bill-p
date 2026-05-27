import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'

interface PayrollConfig { taxYear: string; personalAllowance: number }
interface BreakdownItem { description: string; amount: number }
interface CalculatorResult { grossPay: number; netPay: number; breakdown: BreakdownItem[] }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  grossPay: string
  setGrossPay: (v: string) => void
  result: CalculatorResult | null
  onCalculate: () => void
  payrollConfig: PayrollConfig
  t: (key: string, params?: Record<string, unknown>) => string
}

export function TaxCalculatorDialog({ open, onOpenChange, grossPay, setGrossPay, result, onCalculate, payrollConfig, t }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('payroll.taxCalculator')}</DialogTitle>
        </DialogHeader>
        <Stack spacing={4}>
          <div>
            <label className="text-sm font-medium">{t('payroll.grossPayMonthly')}</label>
            <input type="number" value={grossPay} onChange={e => setGrossPay(e.target.value)} className="w-full mt-1 px-3 py-2 border border-input rounded-md" placeholder="1000" />
          </div>
          <Button onClick={onCalculate}>{t('payroll.calculate')}</Button>
          {result && (
            <Stack spacing={3} className="border-t pt-4">
              <Grid cols={2} gap={3}>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">{t('payroll.grossPay')}</div>
                    <div className="text-xl font-semibold font-mono">£{result.grossPay.toFixed(2)}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <div className="text-sm text-muted-foreground">{t('payroll.netPay')}</div>
                    <div className="text-xl font-semibold font-mono text-success">£{result.netPay.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </Grid>
              <Card>
                <CardHeader><CardTitle className="text-sm">{t('payroll.breakdown')}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.description}</span>
                      <span className={`font-mono ${item.amount < 0 ? 'text-destructive' : ''}`}>£{Math.abs(item.amount).toFixed(2)}</span>
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
  )
}
