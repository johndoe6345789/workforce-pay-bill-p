import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, ArrowRight, CalendarBlank, CurrencyDollar, Users } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { BatchStatusBadge } from './BatchStatusBadge'
import type { PayrollBatch } from '@/hooks/use-payroll-batch'

interface Props { batch: PayrollBatch; progress: string | null; onClick: () => void }

export function BatchCard({ batch, progress, onClick }: Props) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardContent className="pt-4" onClick={onClick}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-medium">{batch.id}</div>
            <div className="text-sm text-muted-foreground">{format(new Date(batch.createdAt), 'PPp')}</div>
          </div>
          <BatchStatusBadge status={batch.status} />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-3">
          <div><div className="text-xs text-muted-foreground mb-1">Period</div><div className="flex items-center gap-1 text-sm"><CalendarBlank size={14} className="text-muted-foreground" /><span>{batch.periodStart}</span></div></div>
          <div><div className="text-xs text-muted-foreground mb-1">Workers</div><div className="flex items-center gap-1 text-sm"><Users size={14} className="text-muted-foreground" /><span>{batch.totalWorkers}</span></div></div>
          <div><div className="text-xs text-muted-foreground mb-1">Amount</div><div className="flex items-center gap-1 text-sm"><CurrencyDollar size={14} className="text-muted-foreground" /><span>£{batch.totalAmount.toLocaleString()}</span></div></div>
          <div><div className="text-xs text-muted-foreground mb-1">Progress</div><div className="text-sm">{progress || 'N/A'}</div></div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="text-sm text-muted-foreground">Created by {batch.createdBy}</div>
          <Button variant="ghost" size="sm"><Eye className="mr-2" />View Details<ArrowRight className="ml-2" /></Button>
        </div>
      </CardContent>
    </Card>
  )
}
