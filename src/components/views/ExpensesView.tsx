import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Plus,
  Download,
  Funnel,
  CheckCircle,
  ClockCounterClockwise,
  XCircle,
  Camera,
  CurrencyDollar,
  CaretDown
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { toast } from 'sonner'
import { ExpenseDetailDialog } from '@/components/ExpenseDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { usePermissions } from '@/hooks/use-permissions'
import { useTranslation } from '@/hooks/use-translation'
import { useDataExport } from '@/hooks/use-data-export'
import type { Expense, ExpenseStatus } from '@/lib/types'

interface ExpensesViewProps {
  expenses: Expense[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onCreateExpense: (data: {
    workerName: string
    clientName: string
    date: string
    category: string
    description: string
    amount: number
    billable: boolean
  }) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
}

export function ExpensesView({
  expenses,
  searchQuery,
  setSearchQuery,
  onCreateExpense,
  onApprove,
  onReject
}: ExpensesViewProps) {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()
  const { exportData } = useDataExport()
  const [statusFilter, setStatusFilter] = useState<'all' | ExpenseStatus>('all')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null)
  
  const expensesToFilter = useMemo(() => {
    return expenses.filter(e => {
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter
      return matchesStatus
    })
  }, [expenses, statusFilter])
  
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])
  
  useEffect(() => {
    setFilteredExpenses(expensesToFilter)
  }, [expensesToFilter])
  
  const handleResultsChange = useCallback((results: Expense[]) => {
    setFilteredExpenses(results)
  }, [])
  
  const handleExport = useCallback((format: 'csv' | 'json' | 'xlsx') => {
    try {
      const exportData_ = filteredExpenses.map(expense => ({
        workerName: expense.workerName,
        clientName: expense.clientName,
        date: expense.date,
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency,
        status: expense.status,
        billable: expense.billable,
        submittedDate: expense.submittedDate,
        approvedDate: expense.approvedDate || ''
      }))
      
      exportData(exportData_, {
        filename: `expenses-${new Date().toISOString().split('T')[0]}`,
        format,
      })
      
      toast.success(t('common.exportSuccess', { format: format.toUpperCase() }))
    } catch (error) {
      toast.error(t('common.exportError'))
    }
  }, [filteredExpenses, exportData, t])

  const pendingExpenses = useMemo(() => 
    expenses.filter(e => e.status === 'pending'),
    [expenses]
  )

  const approvedExpenses = useMemo(() => 
    expenses.filter(e => e.status === 'approved'),
    [expenses]
  )

  const totalPendingAmount = useMemo(() =>
    pendingExpenses.reduce((sum, e) => sum + e.amount, 0),
    [pendingExpenses]
  )

  const totalApprovedAmount = useMemo(() =>
    approvedExpenses.reduce((sum, e) => sum + e.amount, 0),
    [approvedExpenses]
  )

  const [formData, setFormData] = useState({
    workerName: '',
    clientName: '',
    date: '',
    category: '',
    description: '',
    amount: '',
    billable: true
  })

  const expenseFields: FilterField[] = [
    { name: 'workerName', label: t('expenses.workerName'), type: 'text' },
    { name: 'clientName', label: t('expenses.clientName'), type: 'text' },
    { name: 'status', label: t('common.status'), type: 'select', options: [
      { value: 'pending', label: t('expenses.status.pending') },
      { value: 'approved', label: t('expenses.status.approved') },
      { value: 'rejected', label: t('expenses.status.rejected') },
      { value: 'paid', label: t('expenses.status.paid') }
    ]},
    { name: 'category', label: t('expenses.category'), type: 'select', options: [
      { value: 'Travel', label: t('expenses.categories.travel') },
      { value: 'Accommodation', label: t('expenses.categories.accommodation') },
      { value: 'Meals', label: t('expenses.categories.meals') },
      { value: 'Equipment', label: t('expenses.categories.equipment') },
      { value: 'Training', label: t('expenses.categories.training') },
      { value: 'Other', label: t('expenses.categories.other') }
    ]},
    { name: 'amount', label: t('expenses.amount'), type: 'number' },
    { name: 'date', label: t('expenses.date'), type: 'date' },
    { name: 'billable', label: t('expenses.billable'), type: 'select', options: [
      { value: 'true', label: t('common.yes') },
      { value: 'false', label: t('common.no') }
    ]}
  ]

  const handleSubmitCreate = () => {
    if (!formData.workerName || !formData.clientName || !formData.date || !formData.category || !formData.amount) {
      toast.error(t('expenses.createDialog.fillAllFields'))
      return
    }

    onCreateExpense({
      workerName: formData.workerName,
      clientName: formData.clientName,
      date: formData.date,
      category: formData.category,
      description: formData.description,
      amount: parseFloat(formData.amount),
      billable: formData.billable
    })

    setFormData({
      workerName: '',
      clientName: '',
      date: '',
      category: '',
      description: '',
      amount: '',
      billable: true
    })
    setIsCreateDialogOpen(false)
  }

  return (
    <Stack spacing={6}>
      <PageHeader
        title={t('expenses.title')}
        description={t('expenses.subtitle')}
        actions={
          hasPermission('expenses.create') && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={18} className="mr-2" />
                  {t('expenses.createExpense')}
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t('expenses.createDialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('expenses.createDialog.description')}
                </DialogDescription>
              </DialogHeader>
              <Grid cols={2} gap={4} className="py-4">
                <div className="space-y-2">
                  <Label htmlFor="exp-worker">{t('expenses.createDialog.workerNameLabel')}</Label>
                  <Input
                    id="exp-worker"
                    placeholder={t('expenses.createDialog.workerNamePlaceholder')}
                    value={formData.workerName}
                    onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-client">{t('expenses.createDialog.clientNameLabel')}</Label>
                  <Input
                    id="exp-client"
                    placeholder={t('expenses.createDialog.clientNamePlaceholder')}
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-date">{t('expenses.createDialog.expenseDateLabel')}</Label>
                  <Input
                    id="exp-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-category">{t('expenses.createDialog.categoryLabel')}</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="exp-category">
                      <SelectValue placeholder={t('expenses.createDialog.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Travel">{t('expenses.categories.travel')}</SelectItem>
                      <SelectItem value="Accommodation">{t('expenses.categories.accommodation')}</SelectItem>
                      <SelectItem value="Meals">{t('expenses.categories.meals')}</SelectItem>
                      <SelectItem value="Equipment">{t('expenses.categories.equipment')}</SelectItem>
                      <SelectItem value="Training">{t('expenses.categories.training')}</SelectItem>
                      <SelectItem value="Other">{t('expenses.categories.other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="exp-description">{t('expenses.createDialog.descriptionLabel')}</Label>
                  <Textarea
                    id="exp-description"
                    placeholder={t('expenses.createDialog.descriptionPlaceholder')}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exp-amount">{t('expenses.createDialog.amountLabel')}</Label>
                  <Input
                    id="exp-amount"
                    type="number"
                    step="0.01"
                    placeholder={t('expenses.createDialog.amountPlaceholder')}
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.billable}
                      onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{t('expenses.createDialog.billableLabel')}</span>
                  </label>
                </div>
              </Grid>
              <Stack direction="horizontal" spacing={2} justify="end">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>{t('expenses.createDialog.cancel')}</Button>
                <Button onClick={handleSubmitCreate}>{t('expenses.createDialog.create')}</Button>
              </Stack>
            </DialogContent>
          </Dialog>
          )
        }
      />

      <AdvancedSearch
        items={expensesToFilter}
        fields={expenseFields}
        onResultsChange={handleResultsChange}
        placeholder={t('expenses.searchPlaceholder')}
      />

      <Grid cols={4} gap={4}>
        <MetricCard
          label={t('expenses.pendingApproval')}
          value={pendingExpenses.length}
          description={t('expenses.totalPending', { amount: totalPendingAmount.toLocaleString() })}
          icon={<ClockCounterClockwise size={24} />}
        />
        <MetricCard
          label={t('expenses.approved')}
          value={approvedExpenses.length}
          description={t('expenses.totalApproved', { amount: totalApprovedAmount.toLocaleString() })}
          icon={<CheckCircle size={24} className="text-success" />}
        />
        <MetricCard
          label={t('expenses.rejected')}
          value={expenses.filter(e => e.status === 'rejected').length}
          icon={<XCircle size={24} className="text-destructive" />}
        />
        <MetricCard
          label={t('expenses.paid')}
          value={expenses.filter(e => e.status === 'paid').length}
          icon={<CurrencyDollar size={24} />}
        />
      </Grid>

      <Stack direction="horizontal" spacing={4} align="center">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Funnel size={16} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('expenses.status.all')}</SelectItem>
            <SelectItem value="pending">{t('expenses.status.pending')}</SelectItem>
            <SelectItem value="approved">{t('expenses.status.approved')}</SelectItem>
            <SelectItem value="rejected">{t('expenses.status.rejected')}</SelectItem>
            <SelectItem value="paid">{t('expenses.status.paid')}</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download size={18} className="mr-2" />
              {t('common.export')}
              <CaretDown size={16} className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              {t('common.exportAs', { format: 'CSV' })}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('xlsx')}>
              {t('common.exportAs', { format: 'Excel' })}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              {t('common.exportAs', { format: 'JSON' })}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Stack>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            {t('expenses.tabs.pending')} ({expenses.filter(e => e.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            {t('expenses.tabs.approved')} ({expenses.filter(e => e.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            {t('expenses.tabs.rejected')} ({expenses.filter(e => e.status === 'rejected').length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            {t('expenses.tabs.paid')} ({expenses.filter(e => e.status === 'paid').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'pending')
            .map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                onApprove={onApprove}
                onReject={onReject}
                onViewDetails={setViewingExpense}
              />
            ))}
          {filteredExpenses.filter(e => e.status === 'pending').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('expenses.allCaughtUp')}</h3>
              <p className="text-muted-foreground">{t('expenses.noPendingExpenses')}</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'approved')
            .map(expense => (
              <ExpenseCard key={expense.id} expense={expense} onViewDetails={setViewingExpense} />
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'rejected')
            .map(expense => (
              <ExpenseCard key={expense.id} expense={expense} onViewDetails={setViewingExpense} />
            ))}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          {filteredExpenses
            .filter(e => e.status === 'paid')
            .map(expense => (
              <ExpenseCard key={expense.id} expense={expense} onViewDetails={setViewingExpense} />
            ))}
        </TabsContent>
      </Tabs>

      <ExpenseDetailDialog
        expense={viewingExpense}
        open={viewingExpense !== null}
        onOpenChange={(open) => {
          if (!open) setViewingExpense(null)
        }}
        onApprove={onApprove}
        onReject={onReject}
      />
    </Stack>
  )
}

interface ExpenseCardProps {
  expense: Expense
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onViewDetails?: (expense: Expense) => void
}

function ExpenseCard({ expense, onApprove, onReject, onViewDetails }: ExpenseCardProps) {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()
  const statusConfig = {
    pending: { icon: ClockCounterClockwise, color: 'text-warning' },
    approved: { icon: CheckCircle, color: 'text-success' },
    rejected: { icon: XCircle, color: 'text-destructive' },
    paid: { icon: CheckCircle, color: 'text-success' }
  }

  const StatusIcon = statusConfig[expense.status].icon

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails?.(expense)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <Stack spacing={3} className="flex-1">
            <Stack direction="horizontal" spacing={4} align="start">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[expense.status].color}
              />
              <div className="flex-1">
                <Stack direction="horizontal" spacing={3} align="center" className="mb-2">
                  <h3 className="font-semibold text-lg">{expense.workerName}</h3>
                  <Badge variant={expense.status === 'approved' || expense.status === 'paid' ? 'success' : expense.status === 'rejected' ? 'destructive' : 'warning'}>
                    {t(`expenses.status.${expense.status}`)}
                  </Badge>
                  {expense.billable && (
                    <Badge variant="outline">{t('expenses.billable')}</Badge>
                  )}
                </Stack>
                <Grid cols={5} gap={4} className="text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('expenses.card.client')}</p>
                    <p className="font-medium">{expense.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenses.card.category')}</p>
                    <p className="font-medium">{expense.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenses.card.date')}</p>
                    <p className="font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenses.card.amount')}</p>
                    <p className="font-semibold font-mono text-lg">£{expense.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('expenses.card.currency')}</p>
                    <p className="font-medium font-mono">{expense.currency}</p>
                  </div>
                </Grid>
                {expense.description && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {expense.description}
                  </div>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  {t('expenses.card.submitted', { date: new Date(expense.submittedDate).toLocaleDateString() })}
                </div>
              </div>
            </Stack>
          </Stack>
          
          <Stack direction="horizontal" spacing={2} className="ml-4" onClick={(e) => e.stopPropagation()}>
            {expense.status === 'pending' && onApprove && onReject && hasPermission('expenses.approve') && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onApprove(expense.id)}
                  style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  {t('expenses.approve')}
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onReject(expense.id)}
                >
                  <XCircle size={16} className="mr-2" />
                  {t('expenses.reject')}
                </Button>
              </>
            )}
            {expense.receiptUrl && (
              <Button size="sm" variant="outline">
                <Camera size={16} className="mr-2" />
                {t('expenses.viewReceipt')}
              </Button>
            )}
          </Stack>
        </div>
      </CardContent>
    </Card>
  )
}
