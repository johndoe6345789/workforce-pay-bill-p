import { Download, Funnel, CheckCircle, XCircle, CurrencyDollar, CaretDown, ClockCounterClockwise } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { ExpenseDetailDialog } from '@/components/ExpenseDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { ExpenseCard } from '@/components/expenses/ExpenseCard'
import { ExpenseCreateDialog } from '@/components/expenses/ExpenseCreateDialog'
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

  const expenseFields: FilterField[] = [
    { name: 'workerName', label: vm.t('expenses.workerName'), type: 'text' },
    { name: 'clientName', label: vm.t('expenses.clientName'), type: 'text' },
    { name: 'status', label: vm.t('common.status'), type: 'select', options: [
      { value: 'pending', label: vm.t('expenses.status.pending') },
      { value: 'approved', label: vm.t('expenses.status.approved') },
      { value: 'rejected', label: vm.t('expenses.status.rejected') },
      { value: 'paid', label: vm.t('expenses.status.paid') }
    ]},
    { name: 'category', label: vm.t('expenses.category'), type: 'select', options: [
      { value: 'Travel', label: vm.t('expenses.categories.travel') },
      { value: 'Accommodation', label: vm.t('expenses.categories.accommodation') },
      { value: 'Meals', label: vm.t('expenses.categories.meals') },
      { value: 'Equipment', label: vm.t('expenses.categories.equipment') },
      { value: 'Training', label: vm.t('expenses.categories.training') },
      { value: 'Other', label: vm.t('expenses.categories.other') }
    ]},
    { name: 'amount', label: vm.t('expenses.amount'), type: 'number' },
    { name: 'date', label: vm.t('expenses.date'), type: 'date' },
    { name: 'billable', label: vm.t('expenses.billable'), type: 'select', options: [
      { value: 'true', label: vm.t('common.yes') },
      { value: 'false', label: vm.t('common.no') }
    ]}
  ]

  const tabStatuses = ['pending', 'approved', 'rejected', 'paid'] as const

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
        fields={expenseFields}
        onResultsChange={vm.handleResultsChange}
        placeholder={vm.t('expenses.searchPlaceholder')}
      />

      <Grid cols={4} gap={4}>
        <MetricCard label={vm.t('expenses.pendingApproval')} value={vm.pendingExpenses.length} description={vm.t('expenses.totalPending', { amount: vm.totalPendingAmount.toLocaleString() })} icon={<ClockCounterClockwise size={24} />} />
        <MetricCard label={vm.t('expenses.approved')} value={vm.approvedExpenses.length} description={vm.t('expenses.totalApproved', { amount: vm.totalApprovedAmount.toLocaleString() })} icon={<CheckCircle size={24} className="text-success" />} />
        <MetricCard label={vm.t('expenses.rejected')} value={expenses.filter(e => e.status === 'rejected').length} icon={<XCircle size={24} className="text-destructive" />} />
        <MetricCard label={vm.t('expenses.paid')} value={expenses.filter(e => e.status === 'paid').length} icon={<CurrencyDollar size={24} />} />
      </Grid>

      <Stack direction="horizontal" spacing={4} align="center">
        <Select value={vm.statusFilter} onValueChange={v => vm.setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2"><Funnel size={16} /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            {(['all', 'pending', 'approved', 'rejected', 'paid'] as const).map(s => (
              <SelectItem key={s} value={s}>{vm.t(`expenses.status.${s}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              {vm.t('common.export')}
              <CaretDown size={16} className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(['csv', 'xlsx', 'json'] as const).map(fmt => (
              <DropdownMenuItem key={fmt} onClick={() => vm.handleExport(fmt)}>
                {vm.t('common.exportAs', { format: fmt === 'xlsx' ? 'Excel' : fmt.toUpperCase() })}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </Stack>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          {tabStatuses.map(s => (
            <TabsTrigger key={s} value={s}>
              {vm.t(`expenses.tabs.${s}`)} ({expenses.filter(e => e.status === s).length})
            </TabsTrigger>
          ))}
        </TabsList>

        {tabStatuses.map(s => (
          <TabsContent key={s} value={s} className="space-y-4">
            {vm.filteredExpenses.filter(e => e.status === s).map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onApprove={s === 'pending' ? onApprove : undefined}
                onReject={s === 'pending' ? onReject : undefined}
                onViewDetails={vm.setViewingExpense}
              />
            ))}
            {s === 'pending' && vm.filteredExpenses.filter(e => e.status === 'pending').length === 0 && (
              <Card className="p-12 text-center">
                <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">{vm.t('expenses.allCaughtUp')}</h3>
                <p className="text-muted-foreground">{vm.t('expenses.noPendingExpenses')}</p>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

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
