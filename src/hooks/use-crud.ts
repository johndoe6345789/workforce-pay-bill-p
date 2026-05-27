import { type BaseEntity } from '@/lib/indexed-db'
import { useIndexedDBState } from './use-indexed-db-state'
import { useCrudSingle } from './use-crud-single'
import { useCrudBulk } from './use-crud-bulk'

export function useCRUD<T extends BaseEntity>(storeName: string) {
  const [entities, setEntities] = useIndexedDBState<T[]>(storeName, [])

  const { create, read, readAll, readByIndex, update, remove, query } =
    useCrudSingle<T>(storeName, setEntities)

  const { bulkCreate, bulkUpdate } = useCrudBulk<T>(storeName, setEntities)

  return {
    entities,
    create,
    read,
    readAll,
    readByIndex,
    update,
    remove,
    bulkCreate,
    bulkUpdate,
    query,
  }
}

export { useTimesheetsCrud } from './use-timesheets-crud'
export { useInvoicesCrud } from './use-invoices-crud'
export { usePayrollCrud } from './use-payroll-crud'
export { useExpensesCrud } from './use-expenses-crud'
export { useComplianceCrud } from './use-compliance-crud'
export { useWorkersCrud } from './use-workers-crud'
