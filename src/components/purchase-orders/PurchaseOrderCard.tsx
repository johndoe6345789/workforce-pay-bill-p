import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Warning, XCircle, Receipt, Calendar, Eye, Trash } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { PurchaseOrder } from '@/lib/types'

const STATUS_CONFIG = {
  active: { icon: CheckCircle, color: 'text-success' },
  'expiring-soon': { icon: Warning, color: 'text-warning' },
  expired: { icon: XCircle, color: 'text-destructive' },
  fulfilled: { icon: CheckCircle, color: 'text-muted-foreground' },
  cancelled: { icon: XCircle, color: 'text-muted-foreground' },
} as const

interface Props {
  purchaseOrder: PurchaseOrder
  onViewDetails: (po: PurchaseOrder) => void
  onDelete: (po: PurchaseOrder) => void
  getStatusColor: (status: PurchaseOrder['status']) => string
}

export function PurchaseOrderCard({ purchaseOrder, onViewDetails, onDelete, getStatusColor }: Props) {
  const config = STATUS_CONFIG[purchaseOrder.status] ?? STATUS_CONFIG.cancelled
  const StatusIcon = config.icon
  const utilization = (purchaseOrder.utilisedValue / purchaseOrder.totalValue) * 100
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <StatusIcon size={24} weight="fill" className={config.color} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="font-semibold text-lg font-mono">{purchaseOrder.poNumber}</h3>
                  <Badge className={getStatusColor(purchaseOrder.status)}>
                    {purchaseOrder.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
                  {[
                    { label: 'Client', value: purchaseOrder.clientName },
                    { label: 'Issue Date', value: new Date(purchaseOrder.issueDate).toLocaleDateString() },
                    { label: 'Total Value', value: `${purchaseOrder.currency} ${fmt(purchaseOrder.totalValue)}`, mono: true },
                    { label: 'Utilised', value: `${purchaseOrder.currency} ${fmt(purchaseOrder.utilisedValue)}`, mono: true },
                    { label: 'Remaining', value: `${purchaseOrder.currency} ${fmt(purchaseOrder.remainingValue)}`, mono: true },
                  ].map(({ label, value, mono }) => (
                    <div key={label}>
                      <p className="text-muted-foreground">{label}</p>
                      <p className={cn('font-medium', mono && 'font-mono font-semibold')}>{value}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className={cn(
                      'font-semibold font-mono',
                      utilization > 90 ? 'text-warning' : utilization > 75 ? 'text-info' : 'text-success'
                    )}>
                      {utilization.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Receipt size={14} />
                    {purchaseOrder.linkedInvoices.length} invoice{purchaseOrder.linkedInvoices.length !== 1 ? 's' : ''} linked
                  </span>
                  {purchaseOrder.expiryDate && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Expires {new Date(purchaseOrder.expiryDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onViewDetails(purchaseOrder)}>
              <Eye size={16} className="mr-2" />
              View Details
            </Button>
            <Button
              size="sm" variant="outline"
              onClick={() => onDelete(purchaseOrder)}
              disabled={purchaseOrder.linkedInvoices.length > 0}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
