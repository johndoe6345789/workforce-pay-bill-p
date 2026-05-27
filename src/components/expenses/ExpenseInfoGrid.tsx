import { Badge } from '@/components/ui/badge'
import { User, Building, Tag, CalendarBlank, CurrencyDollar } from '@phosphor-icons/react'
import type { Expense } from '@/lib/types'

const DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

interface Props {
  expense: Expense
  currencySymbol: string
}

export function ExpenseInfoGrid({ expense, currencySymbol: sym }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><User size={16} /><span>Worker</span></div>
        <p className="font-medium">{expense.workerName}</p>
        <p className="text-xs text-muted-foreground">ID: {expense.workerId}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><Building size={16} /><span>Client</span></div>
        <p className="font-medium">{expense.clientName}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><Tag size={16} /><span>Category</span></div>
        <Badge variant="outline">{expense.category}</Badge>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><CalendarBlank size={16} /><span>Expense Date</span></div>
        <p className="font-medium">{new Date(expense.date).toLocaleDateString('en-GB', DATE_FORMAT)}</p>
      </div>
      <div className="space-y-1 col-span-2">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><CurrencyDollar size={16} /><span>Amount</span></div>
        <p className="font-semibold font-mono text-3xl">{sym}{expense.amount.toFixed(2)}</p>
      </div>
    </div>
  )
}
