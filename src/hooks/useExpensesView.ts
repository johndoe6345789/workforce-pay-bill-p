import { useState, useMemo, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useTranslation } from '@/hooks/use-translation'
import { useDataExport } from '@/hooks/use-data-export'
import type { Expense, ExpenseStatus } from '@/lib/types'
import type { FilterField } from '@/components/AdvancedSearch'

const EMPTY_FORM = { workerName: '', clientName: '', date: '', category: '', description: '', amount: '', billable: true }

interface CreateExpenseData {
  workerName: string; clientName: string; date: string; category: string
  description: string; amount: number; billable: boolean
}

export function useExpensesView(expenses: Expense[], onCreateExpense: (data: CreateExpenseData) => void) {
  const { t } = useTranslation()
  const { exportData } = useDataExport()

  const [statusFilter, setStatusFilter] = useState<'all' | ExpenseStatus>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null)
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  const [formData, setFormData] = useState(EMPTY_FORM)

  const expenseFields: FilterField[] = useMemo(() => [
    { name: 'workerName', label: t('expenses.workerName'), type: 'text' },
    { name: 'clientName', label: t('expenses.clientName'), type: 'text' },
    { name: 'status', label: t('common.status'), type: 'select', options: [
      { value: 'pending', label: t('expenses.status.pending') },
      { value: 'approved', label: t('expenses.status.approved') },
      { value: 'rejected', label: t('expenses.status.rejected') },
      { value: 'paid', label: t('expenses.status.paid') },
    ]},
    { name: 'category', label: t('expenses.category'), type: 'select', options: [
      { value: 'Travel', label: t('expenses.categories.travel') },
      { value: 'Accommodation', label: t('expenses.categories.accommodation') },
      { value: 'Meals', label: t('expenses.categories.meals') },
      { value: 'Equipment', label: t('expenses.categories.equipment') },
      { value: 'Training', label: t('expenses.categories.training') },
      { value: 'Other', label: t('expenses.categories.other') },
    ]},
    { name: 'amount', label: t('expenses.amount'), type: 'number' },
    { name: 'date', label: t('expenses.date'), type: 'date' },
    { name: 'billable', label: t('expenses.billable'), type: 'select', options: [
      { value: 'true', label: t('common.yes') },
      { value: 'false', label: t('common.no') },
    ]},
  ], [t])

  const expensesToFilter = useMemo(() => expenses.filter(e => statusFilter === 'all' || e.status === statusFilter), [expenses, statusFilter])
  useEffect(() => { setFilteredExpenses(expensesToFilter) }, [expensesToFilter])
  const handleResultsChange = useCallback((results: Expense[]) => { setFilteredExpenses(results) }, [])

  const pendingExpenses = useMemo(() => expenses.filter(e => e.status === 'pending'), [expenses])
  const approvedExpenses = useMemo(() => expenses.filter(e => e.status === 'approved'), [expenses])
  const totalPendingAmount = useMemo(() => pendingExpenses.reduce((sum, e) => sum + e.amount, 0), [pendingExpenses])
  const totalApprovedAmount = useMemo(() => approvedExpenses.reduce((sum, e) => sum + e.amount, 0), [approvedExpenses])

  const handleExport = useCallback((format: 'csv' | 'json' | 'xlsx') => {
    try {
      exportData(filteredExpenses.map(e => ({ workerName: e.workerName, clientName: e.clientName, date: e.date, category: e.category, description: e.description, amount: e.amount, currency: e.currency, status: e.status, billable: e.billable, submittedDate: e.submittedDate, approvedDate: e.approvedDate || '' })), { filename: `expenses-${new Date().toISOString().split('T')[0]}`, format })
      toast.success(t('common.exportSuccess', { format: format.toUpperCase() }))
    } catch { toast.error(t('common.exportError')) }
  }, [filteredExpenses, exportData, t])

  const handleSubmitCreate = () => {
    if (!formData.workerName || !formData.clientName || !formData.date || !formData.category || !formData.amount) {
      toast.error(t('expenses.createDialog.fillAllFields')); return
    }
    onCreateExpense({ workerName: formData.workerName, clientName: formData.clientName, date: formData.date, category: formData.category, description: formData.description, amount: parseFloat(formData.amount), billable: formData.billable })
    setFormData(EMPTY_FORM)
    setIsCreateDialogOpen(false)
  }

  return {
    t, statusFilter, setStatusFilter,
    isCreateDialogOpen, setIsCreateDialogOpen,
    viewingExpense, setViewingExpense,
    filteredExpenses, expensesToFilter,
    formData, setFormData,
    pendingExpenses, approvedExpenses, totalPendingAmount, totalApprovedAmount,
    handleResultsChange, handleExport, handleSubmitCreate,
    expenseFields,
  }
}
