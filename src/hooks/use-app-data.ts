import { useMemo } from 'react'
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

  const metrics: DashboardMetrics = useMemo(() => {
    const monthlyRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const monthlyPayroll = payrollRuns.reduce((sum, pr) => sum + (pr.totalAmount || (pr as any).totalGross || 0), 0)
    
    return {
      pendingTimesheets: timesheets.filter(t => t.status === 'pending').length,
      pendingApprovals: timesheets.filter(t => t.status === 'pending').length,
      overdueInvoices: invoices.filter(i => i.status === 'overdue').length,
      complianceAlerts: complianceDocs.filter(d => d.status === 'expiring' || d.status === 'expired').length,
      monthlyRevenue,
      monthlyPayroll,
      grossMargin: monthlyRevenue > 0 
        ? ((monthlyRevenue - monthlyPayroll) / monthlyRevenue) * 100 
        : 0,
      activeWorkers: workers.filter(w => w.status === 'active').length,
      pendingExpenses: expenses.filter(e => e.status === 'pending').length
    }
  }, [timesheets, invoices, payrollRuns, workers, complianceDocs, expenses])

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
