import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Notepad, User, Building, CalendarBlank, CurrencyDollar, Camera, CheckCircle, XCircle, ClockCounterClockwise, Tag } from '@phosphor-icons/react'
import type { Expense } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ExpenseDetailDialogProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function ExpenseDetailDialog({ expense, open, onOpenChange, onApprove, onReject }: ExpenseDetailDialogProps) {
  if (!expense) return null

  const statusConfig = {
    pending: { icon: ClockCounterClockwise, color: 'text-warning', bgColor: 'bg-warning/10' },
    approved: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
    paid: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' }
  }

  const StatusIcon = statusConfig[expense.status].icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', statusConfig[expense.status].bgColor)}>
              <StatusIcon size={24} className={statusConfig[expense.status].color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Expense Details</span>
                <Badge variant={
                  expense.status === 'approved' || expense.status === 'paid' ? 'success' : 
                  expense.status === 'rejected' ? 'destructive' : 
                  'warning'
                }>
                  {expense.status}
                </Badge>
                {expense.billable && (
                  <Badge variant="outline">Billable</Badge>
                )}
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {expense.id}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User size={16} />
                  <span>Worker</span>
                </div>
                <p className="font-medium">{expense.workerName}</p>
                <p className="text-xs text-muted-foreground">ID: {expense.workerId}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building size={16} />
                  <span>Client</span>
                </div>
                <p className="font-medium">{expense.clientName}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Tag size={16} />
                  <span>Category</span>
                </div>
                <Badge variant="outline">{expense.category}</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CalendarBlank size={16} />
                  <span>Expense Date</span>
                </div>
                <p className="font-medium">{new Date(expense.date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <div className="space-y-1 col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CurrencyDollar size={16} />
                  <span>Amount</span>
                </div>
                <p className="font-semibold font-mono text-3xl">
                  {expense.currency === 'GBP' ? '£' : expense.currency === 'USD' ? '$' : '€'}
                  {expense.amount.toFixed(2)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Description</h4>
              <p className="text-sm text-muted-foreground">
                {expense.description || 'No description provided'}
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Submission Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Submitted Date</p>
                  <p className="font-medium">{new Date(expense.submittedDate).toLocaleString()}</p>
                </div>
                {expense.approvedDate && (
                  <div>
                    <p className="text-muted-foreground">Approved Date</p>
                    <p className="font-medium">{new Date(expense.approvedDate).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Currency</p>
                  <p className="font-mono font-medium">{expense.currency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Billable Status</p>
                  <Badge variant={expense.billable ? 'default' : 'outline'}>
                    {expense.billable ? 'Billable to Client' : 'Not Billable'}
                  </Badge>
                </div>
              </div>
            </div>

            {expense.receiptUrl && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Receipt</h4>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Camera size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Receipt available</p>
                    <Button variant="outline" size="sm">
                      View Receipt
                    </Button>
                  </div>
                </div>
              </>
            )}

            {!expense.receiptUrl && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Receipt</h4>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Camera size={32} className="mx-auto text-muted-foreground mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No receipt uploaded</p>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Expense Summary</h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expense Amount</span>
                  <span className="font-mono font-medium">
                    {expense.currency === 'GBP' ? '£' : expense.currency === 'USD' ? '$' : '€'}
                    {expense.amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="font-medium">{expense.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Billing</span>
                  <span className="font-medium">{expense.billable ? 'Client Billable' : 'Agency Cost'}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center pt-1">
                  <span className="font-semibold">Status</span>
                  <Badge variant={
                    expense.status === 'approved' || expense.status === 'paid' ? 'success' : 
                    expense.status === 'rejected' ? 'destructive' : 
                    'warning'
                  }>
                    {expense.status}
                  </Badge>
                </div>
              </div>
            </div>

            {expense.status === 'pending' && onApprove && onReject && (
              <>
                <Separator />
                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      onReject(expense.id)
                      onOpenChange(false)
                    }}
                  >
                    <XCircle size={18} className="mr-2" />
                    Reject
                  </Button>
                  <Button 
                    onClick={() => {
                      onApprove(expense.id)
                      onOpenChange(false)
                    }}
                    style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    Approve
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
