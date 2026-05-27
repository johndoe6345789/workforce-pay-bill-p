import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Camera, CheckCircle, XCircle } from '@phosphor-icons/react'
import type { Expense } from '@/lib/types'
import { cn } from '@/lib/utils'
import { currencySymbol } from '@/components/invoice-detail/currencySymbol'
import { ExpenseInfoGrid } from '@/components/expenses/ExpenseInfoGrid'
import { ExpenseSummaryBox } from '@/components/expenses/ExpenseSummaryBox'
import { ExpenseSubmissionDetails } from '@/components/expenses/ExpenseSubmissionDetails'
import { STATUS_CONFIG, BADGE_VARIANT } from '@/data/expense-detail-config'

interface Props {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function ExpenseDetailDialog({ expense, open, onOpenChange, onApprove, onReject }: Props) {
  if (!expense) return null

  const { Icon, color, bgColor } = STATUS_CONFIG[expense.status] ?? STATUS_CONFIG.pending
  const sym = currencySymbol(expense.currency)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', bgColor)}><Icon size={24} className={color} /></div>
            <div>
              <div className="flex items-center gap-2">
                <span>Expense Details</span>
                <Badge variant={BADGE_VARIANT[expense.status] ?? 'warning'}>{expense.status}</Badge>
                {expense.billable && <Badge variant="outline">Billable</Badge>}
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">{expense.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <ExpenseInfoGrid expense={expense} currencySymbol={sym} />
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Description</h4>
              <p className="text-sm text-muted-foreground">{expense.description || 'No description provided'}</p>
            </div>
            <Separator />
            <ExpenseSubmissionDetails expense={expense} />
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Receipt</h4>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Camera size={32} className={cn('mx-auto text-muted-foreground mb-2', !expense.receiptUrl && 'opacity-50')} />
                {expense.receiptUrl ? (
                  <><p className="text-sm text-muted-foreground mb-3">Receipt available</p><Button variant="outline" size="sm">View Receipt</Button></>
                ) : (
                  <p className="text-sm text-muted-foreground">No receipt uploaded</p>
                )}
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Expense Summary</h4>
              <ExpenseSummaryBox expense={expense} currencySymbol={sym} />
            </div>
            {expense.status === 'pending' && onApprove && onReject && (
              <>
                <Separator />
                <div className="flex gap-2 justify-end">
                  <Button variant="destructive" onClick={() => { onReject(expense.id); onOpenChange(false) }}>
                    <XCircle size={18} className="mr-2" />Reject
                  </Button>
                  <Button onClick={() => { onApprove(expense.id); onOpenChange(false) }} style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
                    <CheckCircle size={18} className="mr-2" />Approve
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
