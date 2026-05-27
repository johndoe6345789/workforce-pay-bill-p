import { CurrencyDollar, CheckCircle, Users, Calculator, ArrowRight } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePermissions } from '@/hooks/use-permissions'
import { useOneClickPayroll } from '@/hooks/useOneClickPayroll'
import { PayrollPreviewDialog } from '@/components/one-click-payroll/PayrollPreviewDialog'
import type { Timesheet, PayrollRun } from '@/lib/types'

interface Props {
  timesheets: Timesheet[]
  onPayrollComplete: (run: PayrollRun) => void
}

const STATS = [
  { Icon: Users,       label: 'Workers',      key: 'uniqueWorkers'  as const },
  { Icon: CheckCircle, label: 'Timesheets',   key: 'timesheetCount' as const },
  { Icon: Calculator,  label: 'Total Amount', key: 'totalAmount'    as const },
]

export function OneClickPayroll({ timesheets, onPayrollComplete }: Props) {
  const { hasPermission } = usePermissions()
  const vm = useOneClickPayroll(timesheets, onPayrollComplete)

  if (vm.approvedTimesheets.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <CurrencyDollar size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No approved timesheets</h3>
          <p className="text-muted-foreground">Approve timesheets to run payroll</p>
        </CardContent>
      </Card>
    )
  }

  const statValues = {
    uniqueWorkers:  String(vm.uniqueWorkers),
    timesheetCount: String(vm.approvedTimesheets.length),
    totalAmount:    `£${vm.totalAmount.toLocaleString()}`,
  }

  return (
    <>
      <Card className="border-l-4 border-accent/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CurrencyDollar size={24} className="text-accent" weight="fill" />
            One-Click Payroll
          </CardTitle>
          <CardDescription>Process payroll instantly from approved timesheets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATS.map(({ Icon, label, key }) => (
              <div key={label} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Icon size={18} />
                  <span className="text-sm">{label}</span>
                </div>
                <div className="text-2xl font-semibold font-mono">{statValues[key]}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
            <CheckCircle size={24} className="text-accent" weight="fill" />
            <div className="flex-1">
              <p className="font-medium">Ready to process</p>
              <p className="text-sm text-muted-foreground">All timesheets approved and validated</p>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={vm.generatePayrollPreview} disabled={!hasPermission('payroll.process')}>
            <CurrencyDollar size={20} className="mr-2" />
            Process Payroll Now
            <ArrowRight size={20} className="ml-2" />
          </Button>
          {!hasPermission('payroll.process') && (
            <p className="text-sm text-muted-foreground text-center">You don't have permission to process payroll</p>
          )}
        </CardContent>
      </Card>

      <PayrollPreviewDialog
        open={vm.showConfirmation}
        onOpenChange={vm.setShowConfirmation}
        preview={vm.payrollPreview}
        isProcessing={vm.isProcessing}
        onConfirm={vm.processPayroll}
      />
    </>
  )
}
