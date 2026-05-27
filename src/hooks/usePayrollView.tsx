import { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, FileText, Download, Trash } from '@phosphor-icons/react'
import { usePayrollCalculations } from '@/hooks/use-payroll-calculations'
import { usePayrollCrud } from '@/hooks/use-payroll-crud'
import { usePayrollBatch } from '@/hooks/use-payroll-batch'
import { usePAYEIntegration } from '@/hooks/use-paye-integration'
import { useTranslation } from '@/hooks/use-translation'
import { useAppSelector } from '@/store/hooks'
import { toast } from 'sonner'
import type { TableColumn } from '@/hooks/use-advanced-table'
import type { Timesheet } from '@/lib/types'

export function usePayrollView(timesheets: Timesheet[]) {
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

  const { payrollRuns, createPayrollRun, deletePayrollRun } = usePayrollCrud()
  const { batches } = usePayrollBatch()
  const { calculatePayroll, payrollConfig } = usePayrollCalculations()
  const { getPendingSubmissions, getSubmittedSubmissions } = usePAYEIntegration()

  const approvedTimesheets = useMemo(() => timesheets.filter(ts => ts.status === 'approved'), [timesheets])
  const pendingTimesheets = useMemo(() => timesheets.filter(ts => ts.status === 'pending'), [timesheets])
  const totalPendingValue = useMemo(() => pendingTimesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0), [pendingTimesheets])
  const lastRun = useMemo(() => payrollRuns.length > 0 ? payrollRuns[payrollRuns.length - 1] : null, [payrollRuns])
  const pendingBatches = useMemo(() => batches.filter(b => b.status === 'pending-approval'), [batches])
  const pendingPAYESubmissions = useMemo(() => getPendingSubmissions(), [getPendingSubmissions])
  const submittedPAYESubmissions = useMemo(() => getSubmittedSubmissions(), [getSubmittedSubmissions])

  const handleCalculate = () => {
    const grossPay = parseFloat(calculatorGrossPay)
    if (isNaN(grossPay) || grossPay <= 0) { toast.error(t('payroll.validGrossPayRequired')); return }
    setCalculatorResult(calculatePayroll('CALC-WORKER', grossPay, grossPay * 12, false))
  }

  const handlePayrollComplete = useCallback(async (run: any) => {
    try { await createPayrollRun(run); toast.success(t('payroll.payrollCompleteSuccess')) }
    catch { toast.error(t('payroll.payrollCompleteError')) }
  }, [createPayrollRun, t])

  const handleDeletePayrollRun = useCallback(async (runId: string) => {
    try {
      await deletePayrollRun(runId)
      toast.success(t('payroll.payrollDeleteSuccess'))
      if (viewingPayroll?.id === runId) setViewingPayroll(null)
    } catch { toast.error(t('payroll.payrollDeleteError')) }
  }, [deletePayrollRun, viewingPayroll, t])

  const payrollColumns: TableColumn<any>[] = useMemo(() => [
    { key: 'periodEnding', label: t('payroll.periodEnding'), sortable: true, render: (v) => new Date(v as string).toLocaleDateString() },
    { key: 'workersCount', label: t('payroll.workers'), sortable: true },
    { key: 'totalAmount', label: t('payroll.totalAmount'), sortable: true, render: (v) => <span className="font-mono font-semibold">£{(v as number).toLocaleString()}</span> },
    { key: 'processedDate', label: t('payroll.processed'), sortable: true, render: (v) => v ? new Date(v as string).toLocaleDateString() : t('payroll.notYet') },
    { key: 'status', label: t('common.status'), sortable: true, render: (v) => <Badge variant={v === 'completed' ? 'success' : v === 'failed' ? 'destructive' : 'warning'}>{t(`payroll.status.${v}`)}</Badge> },
    {
      key: 'id', label: t('common.actions'), sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => setViewingPayroll(row)} title={t('payroll.viewDetails')}><Eye size={16} /></Button>
          {row.status === 'completed' && (
            <>
              <Button size="sm" variant="ghost" className="text-primary hover:text-primary" onClick={() => { setSelectedPayrollForPAYE(row.id); setShowCreatePAYE(true) }} title={t('payroll.createPAYE')}><FileText size={16} /></Button>
              <Button size="sm" variant="ghost" title={t('payroll.export')}><Download size={16} /></Button>
            </>
          )}
          <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDeletePayrollRun(row.id)} title={t('common.delete')}><Trash size={16} /></Button>
        </div>
      )
    },
  ], [t, handleDeletePayrollRun])

  return {
    t, currentUser, currentUserRole,
    viewingPayroll, setViewingPayroll,
    showAnalytics, setShowAnalytics,
    showCalculator, setShowCalculator,
    showCreateDialog, setShowCreateDialog,
    showPAYEManager, setShowPAYEManager,
    showCreatePAYE, setShowCreatePAYE,
    selectedPayrollForPAYE, setSelectedPayrollForPAYE,
    calculatorGrossPay, setCalculatorGrossPay,
    calculatorResult, payrollConfig, activeTab, setActiveTab,
    payrollRuns, createPayrollRun,
    approvedTimesheets, pendingTimesheets, totalPendingValue,
    lastRun, pendingBatches,
    pendingPAYESubmissions, submittedPAYESubmissions,
    payrollColumns,
    handleCalculate, handlePayrollComplete, handleDeletePayrollRun,
  }
}
