import { CheckCircle } from '@phosphor-icons/react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExpenseCard } from '@/components/expenses/ExpenseCard'
import type { Expense } from '@/lib/types'

const TAB_STATUSES = ['pending', 'approved', 'rejected', 'paid'] as const
type TabStatus = typeof TAB_STATUSES[number]

interface Props {
  expenses: Expense[]
  filteredExpenses: Expense[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewDetails: (expense: Expense) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ExpenseTabsSection({ expenses, filteredExpenses, onApprove, onReject, onViewDetails, t }: Props) {
  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        {TAB_STATUSES.map(s => (
          <TabsTrigger key={s} value={s}>
            {t(`expenses.tabs.${s}`)} ({expenses.filter(e => e.status === s).length})
          </TabsTrigger>
        ))}
      </TabsList>
      {TAB_STATUSES.map((s: TabStatus) => (
        <TabsContent key={s} value={s} className="space-y-4">
          {filteredExpenses.filter(e => e.status === s).map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              onApprove={s === 'pending' ? onApprove : undefined}
              onReject={s === 'pending' ? onReject : undefined}
              onViewDetails={onViewDetails}
            />
          ))}
          {s === 'pending' && filteredExpenses.filter(e => e.status === 'pending').length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('expenses.allCaughtUp')}</h3>
              <p className="text-muted-foreground">{t('expenses.noPendingExpenses')}</p>
            </Card>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}
