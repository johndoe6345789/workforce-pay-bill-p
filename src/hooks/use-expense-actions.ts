import { toast } from 'sonner'
import type { Expense, ExpenseStatus, NewNotification } from '@/lib/types'

export function useExpenseActions(
  setExpenses: (updater: (current: Expense[]) => Expense[]) => void,
  addNotification: (notification: NewNotification) => void,
) {
  const handleCreateExpense = (data: {
    workerName: string
    clientName: string
    date: string
    category: string
    description: string
    amount: number
    billable: boolean
  }) => {
    const newExpense: Expense = {
      id: `EXP-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: data.workerName,
      clientName: data.clientName,
      date: data.date,
      category: data.category,
      description: data.description,
      amount: data.amount,
      currency: 'GBP',
      status: 'pending',
      submittedDate: new Date().toISOString(),
      billable: data.billable
    }
    setExpenses(current => [...current, newExpense])
    addNotification({
      type: 'expense',
      priority: 'low',
      title: 'New Expense Submitted',
      message: `${data.workerName} submitted a £${data.amount.toFixed(2)} expense`,
      relatedId: newExpense.id
    })
    toast.success('Expense created successfully')
  }

  const handleApproveExpense = (id: string) => {
    setExpenses(current =>
      current.map(e =>
        e.id === id
          ? { ...e, status: 'approved' as ExpenseStatus, approvedDate: new Date().toISOString() }
          : e
      )
    )
    toast.success('Expense approved')
  }

  const handleRejectExpense = (id: string) => {
    setExpenses(current =>
      current.map(e =>
        e.id === id
          ? { ...e, status: 'rejected' as ExpenseStatus }
          : e
      )
    )
    toast.error('Expense rejected')
  }

  return { handleCreateExpense, handleApproveExpense, handleRejectExpense }
}
