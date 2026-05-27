import type { Timesheet, Invoice, ComplianceDocument, Expense, NewNotification, AppActions } from '@/lib/types'
import { useTimesheetStateActions } from './use-timesheet-state-actions'
import { useTimesheetCreateActions } from './use-timesheet-create-actions'
import { useInvoiceActions } from './use-invoice-actions'
import { useComplianceActions } from './use-compliance-actions'
import { useExpenseActions } from './use-expense-actions'

export function useAppActions(
  timesheets: Timesheet[],
  setTimesheets: (updater: (current: Timesheet[]) => Timesheet[]) => void,
  _invoices: Invoice[],
  setInvoices: (updater: (current: Invoice[]) => Invoice[]) => void,
  setComplianceDocs: (updater: (current: ComplianceDocument[]) => ComplianceDocument[]) => void,
  setExpenses: (updater: (current: Expense[]) => Expense[]) => void,
  addNotification: (notification: NewNotification) => void
): AppActions {
  const timesheetState = useTimesheetStateActions(setTimesheets, addNotification)
  const timesheetCreate = useTimesheetCreateActions(setTimesheets)
  const invoiceActions = useInvoiceActions(timesheets, setInvoices)
  const complianceActions = useComplianceActions(setComplianceDocs, addNotification)
  const expenseActions = useExpenseActions(setExpenses, addNotification)

  return {
    ...timesheetState,
    ...timesheetCreate,
    ...invoiceActions,
    ...complianceActions,
    ...expenseActions,
  }
}
