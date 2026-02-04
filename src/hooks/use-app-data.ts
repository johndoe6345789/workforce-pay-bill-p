import { useMemo } from 'react'
import { useIndexedDBLive } from '@/hooks/use-indexed-db-live'
import { STORES } from '@/lib/indexed-db'
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

export function useAppData(options?: { liveRefresh?: boolean; pollingInterval?: number }) {
  const liveRefreshEnabled = options?.liveRefresh !== false
  const pollingInterval = options?.pollingInterval || 2000

  const [timesheets = [], setTimesheets] = useIndexedDBLive<Timesheet[]>(
    STORES.TIMESHEETS, 
    [], 
    { enabled: liveRefreshEnabled, pollingInterval }
  )
  const [invoices = [], setInvoices] = useIndexedDBLive<Invoice[]>(
    STORES.INVOICES, 
    [], 
    { enabled: liveRefreshEnabled, pollingInterval }
  )
  const [payrollRuns = [], setPayrollRuns] = useIndexedDBLive<PayrollRun[]>(
    STORES.PAYROLL_RUNS, 
    [], 
    { enabled: liveRefreshEnabled, pollingInterval }
  )
  const [workers = [], setWorkers] = useIndexedDBLive<Worker[]>(
    STORES.WORKERS, 
    [], 
    { enabled: liveRefreshEnabled, pollingInterval }
  )
  const [complianceDocs = [], setComplianceDocs] = useIndexedDBLive<ComplianceDocument[]>(
    STORES.COMPLIANCE_DOCS, 
    [], 
    { enabled: liveRefreshEnabled, pollingInterval }
  )
  const [expenses = [], setExpenses] = useIndexedDBLive<Expense[]>(
    STORES.EXPENSES, 
    [], 
    { enabled: liveRefreshEnabled, pollingInterval }
  )
  const [rateCards = [], setRateCards] = useIndexedDBLive<RateCard[]>(
    STORES.RATE_CARDS, 
    [], 
    { enabled: liveRefreshEnabled, pollingInterval }
  )

  const metrics: DashboardMetrics = useMemo(() => {
    const monthlyRevenue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const monthlyPayroll = payrollRuns.reduce((sum, pr) => sum + (pr.totalAmount || 0), 0)
    
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
