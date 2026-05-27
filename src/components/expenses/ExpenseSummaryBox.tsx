import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Expense } from '@/lib/types'

const BADGE_VARIANT: Record<string, 'success' | 'destructive' | 'warning'> = {
  approved: 'success',
  paid:     'success',
  rejected: 'destructive',
  pending:  'warning',
}

interface Props {
  expense: Expense
  currencySymbol: string
}

export function ExpenseSummaryBox({ expense, currencySymbol: sym }: Props) {
  return (
    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Expense Amount</span>
        <span className="font-mono font-medium">{sym}{expense.amount.toFixed(2)}</span>
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
        <Badge variant={BADGE_VARIANT[expense.status] ?? 'warning'}>{expense.status}</Badge>
      </div>
    </div>
  )
}
