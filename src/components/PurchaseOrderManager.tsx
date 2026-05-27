import { FileText, MagnifyingGlass } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePurchaseOrderManager } from '@/hooks/usePurchaseOrderManager'
import { PurchaseOrderCard } from '@/components/purchase-order/PurchaseOrderCard'
import { CreatePODialog } from '@/components/purchase-order/CreatePODialog'

export function PurchaseOrderManager() {
  const vm = usePurchaseOrderManager()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground mt-1">Track and manage client purchase orders</p>
        </div>
        <CreatePODialog
          open={vm.isCreateOpen}
          onOpenChange={vm.setIsCreateOpen}
          form={vm.formData}
          patch={vm.patch}
          onSubmit={vm.handleCreate}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Active POs</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{vm.activePOs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">£{vm.activePOs.reduce((sum, po) => sum + po.remainingValue, 0).toLocaleString()} remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold font-mono">£{vm.purchaseOrders.reduce((sum, po) => sum + po.totalValue, 0).toLocaleString()}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-warning/20">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">Expired POs</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{vm.expiredPOs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by PO number or client..." value={vm.searchQuery} onChange={e => vm.setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({vm.activePOs.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({vm.expiredPOs.length})</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled ({vm.fulfilledCount})</TabsTrigger>
        </TabsList>

        {(['active', 'expired', 'fulfilled'] as const).map(status => {
          const docs = vm.filteredPOs.filter(po => po.status === status)
          return (
            <TabsContent key={status} value={status} className="space-y-3">
              {docs.map(po => <PurchaseOrderCard key={po.id} purchaseOrder={po} />)}
              {status === 'active' && docs.length === 0 && (
                <Card className="p-12 text-center">
                  <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No active purchase orders</h3>
                  <p className="text-muted-foreground">Create a new PO to get started</p>
                </Card>
              )}
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
