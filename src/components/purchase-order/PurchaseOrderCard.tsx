import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Receipt } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { PurchaseOrder } from '@/hooks/usePurchaseOrderManager'

const STATUS_CONFIG: Record<PurchaseOrder['status'], { Icon: React.ElementType; color: string }> = {
  active: { Icon: CheckCircle, color: 'text-success' },
  expired: { Icon: XCircle, color: 'text-destructive' },
  fulfilled: { Icon: CheckCircle, color: 'text-muted-foreground' },
  cancelled: { Icon: XCircle, color: 'text-muted-foreground' },
}

interface Props {
  purchaseOrder: PurchaseOrder
}

export function PurchaseOrderCard({ purchaseOrder }: Props) {
  const { Icon, color } = STATUS_CONFIG[purchaseOrder.status]
  const utilization = ((purchaseOrder.totalValue - purchaseOrder.remainingValue) / purchaseOrder.totalValue) * 100

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <Icon size={24} weight="fill" className={color} />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg font-mono">{purchaseOrder.poNumber}</h3>
                  <Badge variant={purchaseOrder.status === 'active' ? 'success' : purchaseOrder.status === 'expired' ? 'destructive' : 'secondary'}>
                    {purchaseOrder.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div><p className="text-muted-foreground">Client</p><p className="font-medium">{purchaseOrder.clientName}</p></div>
                  <div><p className="text-muted-foreground">Issue Date</p><p className="font-medium">{new Date(purchaseOrder.issueDate).toLocaleDateString()}</p></div>
                  <div><p className="text-muted-foreground">Total Value</p><p className="font-semibold font-mono">£{purchaseOrder.totalValue.toLocaleString()}</p></div>
                  <div><p className="text-muted-foreground">Remaining</p><p className="font-semibold font-mono">£{purchaseOrder.remainingValue.toLocaleString()}</p></div>
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className={cn('font-semibold font-mono', utilization > 90 ? 'text-warning' : 'text-success')}>
                      {utilization.toFixed(0)}%
                    </p>
                  </div>
                </div>
                {purchaseOrder.notes && <div className="mt-2 text-sm text-muted-foreground">{purchaseOrder.notes}</div>}
                <div className="mt-2 text-sm text-muted-foreground">
                  {purchaseOrder.linkedInvoices.length} invoice(s) linked
                  {purchaseOrder.expiryDate && ` • Expires ${new Date(purchaseOrder.expiryDate).toLocaleDateString()}`}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline"><Receipt size={16} className="mr-2" />Link Invoice</Button>
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
