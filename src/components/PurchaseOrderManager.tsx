import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { FileText, Plus, MagnifyingGlass, CheckCircle, Clock, XCircle, Receipt } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PurchaseOrder {
  id: string
  poNumber: string
  clientName: string
  issueDate: string
  expiryDate?: string
  totalValue: number
  remainingValue: number
  status: 'active' | 'expired' | 'fulfilled' | 'cancelled'
  currency: string
  linkedInvoices: string[]
  notes?: string
}

export function PurchaseOrderManager() {
  const [purchaseOrders = [], setPurchaseOrders] = useKV<PurchaseOrder[]>('purchase-orders', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    poNumber: '',
    clientName: '',
    expiryDate: '',
    totalValue: '',
    notes: ''
  })

  const filteredPOs = purchaseOrders.filter(po =>
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = () => {
    if (!formData.poNumber || !formData.clientName || !formData.totalValue) {
      toast.error('Please fill in all required fields')
      return
    }

    const newPO: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      poNumber: formData.poNumber,
      clientName: formData.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || undefined,
      totalValue: parseFloat(formData.totalValue),
      remainingValue: parseFloat(formData.totalValue),
      status: 'active',
      currency: 'GBP',
      linkedInvoices: [],
      notes: formData.notes || undefined
    }

    setPurchaseOrders(current => [...(current || []), newPO])
    toast.success(`Purchase Order ${newPO.poNumber} created`)
    
    setFormData({
      poNumber: '',
      clientName: '',
      expiryDate: '',
      totalValue: '',
      notes: ''
    })
    setIsCreateOpen(false)
  }

  const activePOs = purchaseOrders.filter(po => po.status === 'active')
  const expiredPOs = purchaseOrders.filter(po => po.status === 'expired')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Purchase Orders</h2>
          <p className="text-muted-foreground mt-1">Track and manage client purchase orders</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={18} className="mr-2" />
              Create PO
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Purchase Order</DialogTitle>
              <DialogDescription>
                Add a new purchase order from a client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="po-number">PO Number *</Label>
                <Input
                  id="po-number"
                  value={formData.poNumber}
                  onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                  placeholder="PO-12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="po-client">Client Name *</Label>
                <Input
                  id="po-client"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="po-value">Total Value (£) *</Label>
                  <Input
                    id="po-value"
                    type="number"
                    step="0.01"
                    value={formData.totalValue}
                    onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                    placeholder="10000.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po-expiry">Expiry Date</Label>
                  <Input
                    id="po-expiry"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="po-notes">Notes</Label>
                <Input
                  id="po-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional information..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create Purchase Order</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Active POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{activePOs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">
              £{activePOs.reduce((sum, po) => sum + po.remainingValue, 0).toLocaleString()} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono">
              £{purchaseOrders.reduce((sum, po) => sum + po.totalValue, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Expired POs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{expiredPOs.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <MagnifyingGlass 
          size={18} 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" 
        />
        <Input
          placeholder="Search by PO number or client..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active ({activePOs.length})</TabsTrigger>
          <TabsTrigger value="expired">Expired ({expiredPOs.length})</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled ({purchaseOrders.filter(po => po.status === 'fulfilled').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {filteredPOs.filter(po => po.status === 'active').map(po => (
            <PurchaseOrderCard key={po.id} purchaseOrder={po} />
          ))}
          {filteredPOs.filter(po => po.status === 'active').length === 0 && (
            <Card className="p-12 text-center">
              <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active purchase orders</h3>
              <p className="text-muted-foreground">Create a new PO to get started</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="expired" className="space-y-3">
          {filteredPOs.filter(po => po.status === 'expired').map(po => (
            <PurchaseOrderCard key={po.id} purchaseOrder={po} />
          ))}
        </TabsContent>

        <TabsContent value="fulfilled" className="space-y-3">
          {filteredPOs.filter(po => po.status === 'fulfilled').map(po => (
            <PurchaseOrderCard key={po.id} purchaseOrder={po} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PurchaseOrderCard({ purchaseOrder }: { purchaseOrder: PurchaseOrder }) {
  const statusConfig = {
    active: { icon: CheckCircle, color: 'text-success' },
    expired: { icon: XCircle, color: 'text-destructive' },
    fulfilled: { icon: CheckCircle, color: 'text-muted-foreground' },
    cancelled: { icon: XCircle, color: 'text-muted-foreground' }
  }

  const StatusIcon = statusConfig[purchaseOrder.status].icon
  const utilization = ((purchaseOrder.totalValue - purchaseOrder.remainingValue) / purchaseOrder.totalValue) * 100

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[purchaseOrder.status].color}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg font-mono">{purchaseOrder.poNumber}</h3>
                  <Badge variant={purchaseOrder.status === 'active' ? 'success' : purchaseOrder.status === 'expired' ? 'destructive' : 'secondary'}>
                    {purchaseOrder.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{purchaseOrder.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{new Date(purchaseOrder.issueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-semibold font-mono">£{purchaseOrder.totalValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-semibold font-mono">£{purchaseOrder.remainingValue.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className={cn(
                      'font-semibold font-mono',
                      utilization > 90 ? 'text-warning' : 'text-success'
                    )}>
                      {utilization.toFixed(0)}%
                    </p>
                  </div>
                </div>
                {purchaseOrder.notes && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    {purchaseOrder.notes}
                  </div>
                )}
                <div className="mt-2 text-sm text-muted-foreground">
                  {purchaseOrder.linkedInvoices.length} invoice(s) linked
                  {purchaseOrder.expiryDate && ` • Expires ${new Date(purchaseOrder.expiryDate).toLocaleDateString()}`}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4">
            <Button size="sm" variant="outline">
              <Receipt size={16} className="mr-2" />
              Link Invoice
            </Button>
            <Button size="sm" variant="outline">View Details</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
