import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText } from '@phosphor-icons/react'
import { PurchaseOrderCard } from '@/components/purchase-orders/PurchaseOrderCard'
import type { PurchaseOrder } from '@/lib/types'

interface Metrics { expiringSoonCount: number; expiredCount: number }

interface Props {
  filteredPOs: PurchaseOrder[]
  purchaseOrders: PurchaseOrder[]
  metrics: Metrics
  onViewDetails: (po: PurchaseOrder) => void
  onDelete: (po: PurchaseOrder) => void
  getStatusColor: (status: PurchaseOrder['status']) => string
}

const TABS = ['active', 'expiring-soon', 'expired', 'fulfilled', 'all'] as const
type Tab = typeof TABS[number]

const TAB_LABELS: Record<Tab, string> = {
  'active': 'Active',
  'expiring-soon': 'Expiring Soon',
  'expired': 'Expired',
  'fulfilled': 'Fulfilled',
  'all': 'All',
}

export function POTabs({ filteredPOs, purchaseOrders, metrics, onViewDetails, onDelete, getStatusColor }: Props) {
  const tabCount = (tab: Tab) => {
    if (tab === 'all') return filteredPOs.length
    if (tab === 'expiring-soon') return metrics.expiringSoonCount
    if (tab === 'expired') return metrics.expiredCount
    return purchaseOrders.filter(p => p.status === tab).length
  }

  return (
    <Tabs defaultValue="active" className="space-y-4">
      <TabsList>
        {TABS.map(tab => (
          <TabsTrigger key={tab} value={tab}>
            {TAB_LABELS[tab]} ({tabCount(tab)})
          </TabsTrigger>
        ))}
      </TabsList>
      {TABS.map(tab => {
        const items = tab === 'all' ? filteredPOs : filteredPOs.filter(po => po.status === tab)
        return (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {items.map(po => (
              <PurchaseOrderCard
                key={po.id}
                purchaseOrder={po}
                onViewDetails={onViewDetails}
                onDelete={onDelete}
                getStatusColor={getStatusColor}
              />
            ))}
            {items.length === 0 && (
              <Card className="p-12 text-center">
                <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No purchase orders found</h3>
                <p className="text-muted-foreground">
                  {tab === 'all' ? 'Create a new PO to get started' : `No ${tab} purchase orders`}
                </p>
              </Card>
            )}
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
