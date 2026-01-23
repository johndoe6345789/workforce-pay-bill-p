import { useKV } from '@github/spark/hooks'
import type { 
  Timesheet, 
  Invoice, 
  PayrollRun, 
  Worker, 
  ComplianceDocument,
  Expense,
  RateCard,
  DashboardMetrics
} from '@/lib/types'

export function useAppData() {
  const [timesheets = [], setTimesheets] = useKV<Timesheet[]>('timesheets', [])
  const [invoices = [], setInvoices] = useKV<Invoice[]>('invoices', [])
  const [payrollRuns = [], setPayrollRuns] = useKV<PayrollRun[]>('payroll-runs', [])
  const [workers = [], setWorkers] = useKV<Worker[]>('workers', [])
  const [complianceDocs = [], setComplianceDocs] = useKV<ComplianceDocument[]>('compliance-docs', [])
  const [expenses = [], setExpenses] = useKV<Expense[]>('expenses', [])
  const [rateCards = [], setRateCards] = useKV<RateCard[]>('rate-cards', [])

  const metrics: DashboardMetrics = {
    pendingTimesheets: timesheets.filter(t => t.status === 'pending').length,
    pendingApprovals: timesheets.filter(t => t.status === 'pending').length,
    overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
    complianceAlerts: complianceDocs.filter(d => d.status === 'expiring' || d.status === 'expired').length,
    monthlyRevenue: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
    monthlyPayroll: payrollRuns.reduce((sum, pr) => sum + (pr.totalAmount || (pr as any).totalGross || 0), 0),
    grossMargin: 0,
    activeWorkers: workers.filter(w => w.status === 'active').length,
    pendingExpenses: expenses.filter(e => e.status === 'pending').length
  }

  metrics.grossMargin = metrics.monthlyRevenue > 0 
    ? ((metrics.monthlyRevenue - metrics.monthlyPayroll) / metrics.monthlyRevenue) * 100 
    : 0

  return {
    timesheets,
    setTimesheets,
    invoices,
    setInvoices,
    payrollRuns,
    setPayrollRuns,
    workers,
    setWorkers,
    complianceDocs,
    setComplianceDocs,
    expenses,
    setExpenses,
    rateCards,
    setRateCards,
    metrics
  }
}
