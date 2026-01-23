import { useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import appData from '@/data/app-data.json'

export function useSampleData() {
  const [hasInitialized, setHasInitialized] = useKV<boolean>('sample-data-initialized', false)
  const [, setTimesheets] = useKV<any[]>('timesheets', [])
  const [, setInvoices] = useKV<any[]>('invoices', [])
  const [, setExpenses] = useKV<any[]>('expenses', [])
  const [, setComplianceDocs] = useKV<any[]>('compliance-docs', [])
  const [, setPayrollRuns] = useKV<any[]>('payroll-runs', [])
  const [, setWorkers] = useKV<any[]>('workers', [])
  const [, setRateCards] = useKV<any[]>('rate-cards', [])
  const [, setClients] = useKV<any[]>('clients', [])

  useEffect(() => {
    if (hasInitialized) return

    const initializeData = async () => {
      const transformedTimesheets = appData.timesheets.map((ts: any) => ({
        ...ts,
        hours: ts.totalHours || ts.hours || 0,
        amount: ts.total || ts.amount || 0
      }))
      
      const transformedPayrollRuns = appData.payrollRuns.map((pr: any) => ({
        ...pr,
        totalAmount: pr.totalGross || pr.totalAmount || 0,
        workersCount: pr.workerCount || pr.workersCount || 0
      }))
      
      setTimesheets(transformedTimesheets)
      setInvoices(appData.invoices)
      setExpenses(appData.expenses)
      setComplianceDocs(appData.complianceDocs)
      setPayrollRuns(transformedPayrollRuns)
      setWorkers(appData.workers)
      setRateCards(appData.rateCards)
      setClients(appData.clients)
      setHasInitialized(true)
    }

    initializeData()
  }, [hasInitialized, setTimesheets, setInvoices, setExpenses, setComplianceDocs, setPayrollRuns, setWorkers, setRateCards, setClients, setHasInitialized])
}
