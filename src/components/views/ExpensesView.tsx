import { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Plus,
  Download,
  Funnel,
  CheckCircle,
  ClockCounterClockwise,
  XCircle,
  Camera
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
import { toast } from 'sonner'
import { ExpenseDetailDialog } from '@/components/ExpenseDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
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
    { name: 'workerName', label: 'Worker Name', type: 'text' },
    { name: 'clientName', label: 'Client Name', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'pending', label: 'Pending' },
      { value: 'approved', label: 'Approved' },
      { value: 'rejected', label: 'Rejected' },
      { value: 'paid', label: 'Paid' }
    ]},
    { name: 'category', label: 'Category', type: 'select', options: [
      { value: 'Travel', label: 'Travel' },
      { value: 'Accommodation', label: 'Accommodation' },
      { value: 'Meals', label: 'Meals' },
      { value: 'Equipment', label: 'Equipment' },
      { value: 'Training', label: 'Training' },
      { value: 'Other', label: 'Other' }
    ]},
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'date', label: 'Date', type: 'date' },
    { name: 'billable', label: 'Billable', type: 'select', options: [
      { value: 'true', label: 'Yes' },
      { value: 'false', label: 'No' }
    ]}
  ]

  const handleSubmitCreate = () => {
    if (!formData.workerName || !formData.clientName || !formData.date || !formData.category || !formData.amount) {
      toast.error('Please fill in all required fields')
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Expense Management</h2>
          <p className="text-muted-foreground mt-1">Manage worker expenses and reimbursements</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" />
              Create Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Expense</DialogTitle>
              <DialogDescription>
                Enter expense details for worker reimbursement or client billing
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="exp-worker">Worker Name</Label>
                <Input
                  id="exp-worker"
                  placeholder="Enter worker name"
                  value={formData.workerName}
                  onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-client">Client Name</Label>
                <Input
                  id="exp-client"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-date">Expense Date</Label>
                <Input
                  id="exp-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="exp-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Accommodation">Accommodation</SelectItem>
                    <SelectItem value="Meals">Meals</SelectItem>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="exp-description">Description</Label>
                <Textarea
                  id="exp-description"
                  placeholder="Describe the expense"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exp-amount">Amount (£)</Label>
                <Input
                  id="exp-amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
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
                  <span className="text-sm">Billable to client</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmitCreate}>Create Expense</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <AdvancedSearch
        items={expensesToFilter}
        fields={expenseFields}
        onResultsChange={handleResultsChange}
        placeholder="Search expenses or use query language (e.g., category = Travel billable = true)"
      />

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-40">
            <div className="flex items-center gap-2">
              <Funnel size={16} />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({expenses.filter(e => e.status === 'pending').length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({expenses.filter(e => e.status === 'approved').length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({expenses.filter(e => e.status === 'rejected').length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Paid ({expenses.filter(e => e.status === 'paid').length})
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
              <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
              <p className="text-muted-foreground">No pending expenses to review</p>
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
    </div>
  )
}

interface ExpenseCardProps {
  expense: Expense
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onViewDetails?: (expense: Expense) => void
}

function ExpenseCard({ expense, onApprove, onReject, onViewDetails }: ExpenseCardProps) {
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
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[expense.status].color}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{expense.workerName}</h3>
                  <Badge variant={expense.status === 'approved' || expense.status === 'paid' ? 'success' : expense.status === 'rejected' ? 'destructive' : 'warning'}>
                    {expense.status}
                  </Badge>
                  {expense.billable && (
                    <Badge variant="outline">Billable</Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{expense.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">{expense.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold font-mono text-lg">£{expense.amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium font-mono">{expense.currency}</p>
                  </div>
                </div>
                {expense.description && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {expense.description}
                  </div>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  Submitted {new Date(expense.submittedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
            {expense.status === 'pending' && onApprove && onReject && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onApprove(expense.id)}
                  style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onReject(expense.id)}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
              </>
            )}
            {expense.receiptUrl && (
              <Button size="sm" variant="outline">
                <Camera size={16} className="mr-2" />
                View Receipt
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
