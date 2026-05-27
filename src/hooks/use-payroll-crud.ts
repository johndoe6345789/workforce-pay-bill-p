import { STORES } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import { usePayrollCrudSingle } from './use-payroll-crud-single'
import { usePayrollCrudBulk } from './use-payroll-crud-bulk'
import type { PayrollRun } from '@/lib/types'

export function usePayrollCrud() {
  const [payrollRuns, setPayrollRuns] = useIndexedDBState<PayrollRun[]>(STORES.PAYROLL_RUNS, [])

  const {
    createPayrollRun,
    updatePayrollRun,
    deletePayrollRun,
    getPayrollRunById,
    getPayrollRunsByStatus,
  } = usePayrollCrudSingle(setPayrollRuns)

  const { bulkCreatePayrollRuns, bulkUpdatePayrollRuns } = usePayrollCrudBulk(setPayrollRuns)

  return {
    payrollRuns,
    createPayrollRun,
    updatePayrollRun,
    deletePayrollRun,
    getPayrollRunById,
    getPayrollRunsByStatus,
    bulkCreatePayrollRuns,
    bulkUpdatePayrollRuns,
  }
}
