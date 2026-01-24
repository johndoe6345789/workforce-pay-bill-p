import { useEffect, useRef } from 'react'
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { STORES, indexedDB } from '@/lib/indexed-db'
import appData from '@/data/app-data.json'

export function useSampleData() {
  const [hasInitialized, setHasInitialized] = useIndexedDBState<boolean>('sample-data-initialized', false)
  const isInitializing = useRef(false)

  useEffect(() => {
    if (hasInitialized || isInitializing.current) return

    isInitializing.current = true
    
    const initializeData = async () => {
      try {
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
        
        await Promise.all([
          indexedDB.bulkCreate(STORES.TIMESHEETS, transformedTimesheets),
          indexedDB.bulkCreate(STORES.INVOICES, appData.invoices),
          indexedDB.bulkCreate(STORES.EXPENSES, appData.expenses),
          indexedDB.bulkCreate(STORES.COMPLIANCE_DOCS, appData.complianceDocs),
          indexedDB.bulkCreate(STORES.PAYROLL_RUNS, transformedPayrollRuns),
          indexedDB.bulkCreate(STORES.WORKERS, appData.workers),
          indexedDB.bulkCreate(STORES.RATE_CARDS, appData.rateCards),
          indexedDB.saveAppState('clients', appData.clients)
        ])
        
        setHasInitialized(true)
      } catch (error) {
        console.error('Failed to initialize sample data:', error)
        isInitializing.current = false
      }
    }

    initializeData()
  }, [hasInitialized, setHasInitialized])
}
