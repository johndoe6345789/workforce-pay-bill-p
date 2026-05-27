import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { CheckCircle, ClockCounterClockwise, XCircle, Camera } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'
import { usePermissions } from '@/hooks/use-permissions'
import type { Expense } from '@/lib/types'

const STATUS_CONFIG = {
  pending: { icon: ClockCounterClockwise, color: 'text-warning' },
  approved: { icon: CheckCircle, color: 'text-success' },
  rejected: { icon: XCircle, color: 'text-destructive' },
  paid: { icon: CheckCircle, color: 'text-success' },
} as const

interface Props {
  expense: Expense
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onViewDetails?: (expense: Expense) => void
}

export function ExpenseCard({ expense, onApprove, onReject, onViewDetails }: Props) {
  const { t } = useTranslation()
  const { hasPermission } = usePermissions()
  const config = STATUS_CONFIG[expense.status] ?? STATUS_CONFIG.pending
  const StatusIcon = config.icon

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails?.(expense)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <Stack spacing={3} className="flex-1">
            <Stack direction="horizontal" spacing={4} align="start">
              <StatusIcon size={24} weight="fill" className={config.color} />
              <div className="flex-1">
                <Stack direction="horizontal" spacing={3} align="center" className="mb-2">
                  <h3 className="font-semibold text-lg">{expense.workerName}</h3>
                  <Badge variant={expense.status === 'approved' || expense.status === 'paid' ? 'success' : expense.status === 'rejected' ? 'destructive' : 'warning'}>
                    {t(`expenses.status.${expense.status}`)}
                  </Badge>
                  {expense.billable && <Badge variant="outline">{t('expenses.billable')}</Badge>}
                </Stack>
                <Grid cols={5} gap={4} className="text-sm">
                  {[
                    { label: t('expenses.card.client'), value: expense.clientName },
                    { label: t('expenses.card.category'), value: expense.category },
                    { label: t('expenses.card.date'), value: new Date(expense.date).toLocaleDateString() },
                    { label: t('expenses.card.amount'), value: `£${expense.amount.toFixed(2)}`, mono: true, lg: true },
                    { label: t('expenses.card.currency'), value: expense.currency, mono: true },
                  ].map(({ label, value, mono, lg }) => (
                    <div key={label}>
                      <p className="text-muted-foreground">{label}</p>
                      <p className={`font-medium${mono ? ' font-mono' : ''}${lg ? ' text-lg font-semibold' : ''}`}>{value}</p>
                    </div>
                  ))}
                </Grid>
                {expense.description && <div className="mt-2 text-sm text-muted-foreground">{expense.description}</div>}
                <div className="mt-2 text-sm text-muted-foreground">
                  {t('expenses.card.submitted', { date: new Date(expense.submittedDate).toLocaleDateString() })}
                </div>
              </div>
            </Stack>
          </Stack>
          <Stack direction="horizontal" spacing={2} className="ml-4" onClick={e => e.stopPropagation()}>
            {expense.status === 'pending' && onApprove && onReject && hasPermission('expenses.approve') && (
              <>
                <Button size="sm" onClick={() => onApprove(expense.id)} style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
                  <CheckCircle size={16} className="mr-2" />{t('expenses.approve')}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onReject(expense.id)}>
                  <XCircle size={16} className="mr-2" />{t('expenses.reject')}
                </Button>
              </>
            )}
            {expense.receiptUrl && (
              <Button size="sm" variant="outline">
                <Camera size={16} className="mr-2" />{t('expenses.viewReceipt')}
              </Button>
            )}
          </Stack>
        </div>
      </CardContent>
    </Card>
  )
}
