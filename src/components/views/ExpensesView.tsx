import { CheckCircle, XCircle, CurrencyDollar, ClockCounterClockwise } from '@phosphor-icons/react'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { ExpenseDetailDialog } from '@/components/ExpenseDetailDialog'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import { ExpenseCreateDialog } from '@/components/expenses/ExpenseCreateDialog'
import { ExpenseFilterBar } from '@/components/expenses/ExpenseFilterBar'
import { ExpenseTabsSection } from '@/components/expenses/ExpenseTabsSection'
import { useExpensesView } from '@/hooks/useExpensesView'
import { usePermissions } from '@/hooks/use-permissions'
import type { Expense } from '@/lib/types'

interface ExpensesViewProps {
  expenses: Expense[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateExpense: (data: { workerName: string; clientName: string; date: string; category: string; description: string; amount: number; billable: boolean }) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ExpensesView({ expenses, onCreateExpense, onApprove, onReject }: ExpensesViewProps) {
  const vm = useExpensesView(expenses, onCreateExpense)
  const { hasPermission } = usePermissions()

  return (
    <Stack spacing={6}>
      <PageHeader
        title={vm.t('expenses.title')}
        description={vm.t('expenses.subtitle')}
        actions={
          hasPermission('expenses.create') && (
            <ExpenseCreateDialog
              open={vm.isCreateDialogOpen}
              onOpenChange={vm.setIsCreateDialogOpen}
              formData={vm.formData}
              setFormData={vm.setFormData}
              onSubmit={vm.handleSubmitCreate}
              t={vm.t}
            />
          )
        }
      />

      <AdvancedSearch
        items={vm.expensesToFilter}
        fields={vm.expenseFields}
        onResultsChange={vm.handleResultsChange}
        placeholder={vm.t('expenses.searchPlaceholder')}
      />

      <Grid cols={4} gap={4}>
        <MetricCard label={vm.t('expenses.pendingApproval')} value={vm.pendingExpenses.length} description={vm.t('expenses.totalPending', { amount: vm.totalPendingAmount.toLocaleString() })} icon={<ClockCounterClockwise size={24} />} />
        <MetricCard label={vm.t('expenses.approved')} value={vm.approvedExpenses.length} description={vm.t('expenses.totalApproved', { amount: vm.totalApprovedAmount.toLocaleString() })} icon={<CheckCircle size={24} className="text-success" />} />
        <MetricCard label={vm.t('expenses.rejected')} value={expenses.filter(e => e.status === 'rejected').length} icon={<XCircle size={24} className="text-destructive" />} />
        <MetricCard label={vm.t('expenses.paid')} value={expenses.filter(e => e.status === 'paid').length} icon={<CurrencyDollar size={24} />} />
      </Grid>

      <ExpenseFilterBar
        statusFilter={vm.statusFilter}
        setStatusFilter={v => vm.setStatusFilter(v as any)}
        onExport={vm.handleExport}
        t={vm.t}
      />

      <ExpenseTabsSection
        expenses={expenses}
        filteredExpenses={vm.filteredExpenses}
        onApprove={onApprove}
        onReject={onReject}
        onViewDetails={vm.setViewingExpense}
        t={vm.t}
      />

      <ExpenseDetailDialog
        expense={vm.viewingExpense}
        open={vm.viewingExpense !== null}
        onOpenChange={open => { if (!open) vm.setViewingExpense(null) }}
        onApprove={onApprove}
        onReject={onReject}
      />
    </Stack>
  )
}
