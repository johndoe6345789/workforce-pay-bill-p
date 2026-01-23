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
      setTimesheets(appData.timesheets)
      setInvoices(appData.invoices)
      setExpenses(appData.expenses)
      setComplianceDocs(appData.complianceDocs)
      setPayrollRuns(appData.payrollRuns)
      setWorkers(appData.workers)
      setRateCards(appData.rateCards)
      setClients(appData.clients)
      setHasInitialized(true)
    }

    initializeData()
  }, [hasInitialized, setTimesheets, setInvoices, setExpenses, setComplianceDocs, setPayrollRuns, setWorkers, setRateCards, setClients, setHasInitialized])
}
