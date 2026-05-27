import { Badge } from '@/components/ui/badge'
import type { Expense } from '@/lib/types'

interface Props {
  expense: Expense
}

export function ExpenseSubmissionDetails({ expense }: Props) {
  return (
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
  )
}
