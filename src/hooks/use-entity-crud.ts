import { useCRUD } from './use-crud'
import { STORES } from '@/lib/indexed-db'
import type { 
  Timesheet, 
  Invoice, 
  PayrollRun, 
  Worker, 
  ComplianceDocument,
  Expense,
  RateCard,
  PurchaseOrder
} from '@/lib/types'

export function useTimesheetsCRUD() {
  return useCRUD<Timesheet>(STORES.TIMESHEETS)
}

export function useInvoicesCRUD() {
  return useCRUD<Invoice>(STORES.INVOICES)
}

export function usePayrollRunsCRUD() {
  return useCRUD<PayrollRun>(STORES.PAYROLL_RUNS)
}

export function useWorkersCRUD() {
  return useCRUD<Worker>(STORES.WORKERS)
}

export function useComplianceDocsCRUD() {
  return useCRUD<ComplianceDocument>(STORES.COMPLIANCE_DOCS)
}

export function useExpensesCRUD() {
  return useCRUD<Expense>(STORES.EXPENSES)
}

export function useRateCardsCRUD() {
  return useCRUD<RateCard>(STORES.RATE_CARDS)
}

export function usePurchaseOrdersCRUD() {
  return useCRUD<PurchaseOrder>(STORES.PURCHASE_ORDERS)
}

export { useTimesheetsCrud } from './use-timesheets-crud'
export { useInvoicesCrud } from './use-invoices-crud'
export { usePayrollCrud } from './use-payroll-crud'
export { useExpensesCrud } from './use-expenses-crud'
export { useComplianceCrud } from './use-compliance-crud'
export { useWorkersCrud } from './use-workers-crud'
export { usePurchaseOrdersCrud } from './use-purchase-orders-crud'

