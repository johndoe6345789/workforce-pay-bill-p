import { Plus, ChartBar, Calculator, FileText } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Stack } from '@/components/ui/stack'
import { PayrollDetailDialog } from '@/components/PayrollDetailDialog'
import { CreatePayrollDialog } from '@/components/CreatePayrollDialog'
import { PAYEManager } from '@/components/PAYEManager'
import { CreatePAYESubmissionDialog } from '@/components/CreatePAYESubmissionDialog'
import { TaxCalculatorDialog } from '@/components/payroll/TaxCalculatorDialog'
import { usePayrollView } from '@/hooks/usePayrollView'
import { PayrollTabs } from '@/components/views/PayrollTabs'
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

      <PayrollTabs vm={vm} timesheets={timesheets} workers={workers} />

      <PayrollDetailDialog payrollRun={vm.viewingPayroll} open={vm.viewingPayroll !== null} onOpenChange={open => { if (!open) vm.setViewingPayroll(null) }} />

      <PAYEManager payrollRunId={vm.selectedPayrollForPAYE || undefined} open={vm.showPAYEManager} onOpenChange={vm.setShowPAYEManager} />

      {vm.selectedPayrollForPAYE && (
        <CreatePAYESubmissionDialog payrollRunId={vm.selectedPayrollForPAYE} open={vm.showCreatePAYE} onOpenChange={vm.setShowCreatePAYE} onSuccess={() => vm.setShowPAYEManager(true)} />
      )}
    </Stack>
  )
}
