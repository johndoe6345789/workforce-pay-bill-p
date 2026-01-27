import { useState, useEffect, useMemo } from 'react'
import { usePurchaseOrdersCrud } from '@/hooks/use-purchase-orders-crud'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { useTranslation } from '@/hooks/use-translation'
import { 
  FileText, 
  Plus, 
  MagnifyingGlass, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Receipt, 
  Calendar,
  CurrencyDollar,
  TrendUp,
  Warning,
  LinkSimple,
  Trash,
  PencilSimple,
  Eye,
  X
} from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { PurchaseOrder, LinkedInvoice, Invoice } from '@/lib/types'

export function PurchaseOrderTracking() {
  const { t } = useTranslation()
  const { entities: purchaseOrders, create, update, remove } = usePurchaseOrdersCrud()
  const { invoices } = useInvoicesCrud()
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLinkInvoiceOpen, setIsLinkInvoiceOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isLoadingState, setIsLoadingState] = useState(true)
  
  const [formData, setFormData] = useState({
    poNumber: '',
    clientName: '',
    clientId: '',
    expiryDate: '',
    totalValue: '',
    currency: 'GBP',
    notes: '',
    approvedBy: ''
  })

  useEffect(() => {
    if (purchaseOrders.length >= 0) {
      setIsLoadingState(false)
    }
  }, [purchaseOrders])

  useEffect(() => {
    purchaseOrders.forEach(po => {
      const now = new Date()
      const expiry = po.expiryDate ? new Date(po.expiryDate) : null
      const daysUntilExpiry = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : null

      if (po.remainingValue <= 0 && po.status === 'active') {
        update(po.id, { status: 'fulfilled' })
      } else if (expiry && expiry < now && po.status === 'active') {
        update(po.id, { status: 'expired' })
      } else if (daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0 && po.status === 'active') {
        update(po.id, { status: 'expiring-soon' })
      }
    })
  }, [purchaseOrders, update])

  const filteredPOs = useMemo(() => {
    let filtered = purchaseOrders.filter(po =>
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (filterStatus !== 'all') {
      filtered = filtered.filter(po => po.status === filterStatus)
    }

    return filtered
  }, [purchaseOrders, searchQuery, filterStatus])

  const metrics = useMemo(() => {
    const active = purchaseOrders.filter(po => po.status === 'active' || po.status === 'expiring-soon')
    const expired = purchaseOrders.filter(po => po.status === 'expired')
    const expiringSoon = purchaseOrders.filter(po => po.status === 'expiring-soon')
    
    return {
      activeCount: active.length,
      totalValue: purchaseOrders.reduce((sum, po) => sum + po.totalValue, 0),
      remainingValue: active.reduce((sum, po) => sum + po.remainingValue, 0),
      utilisedValue: purchaseOrders.reduce((sum, po) => sum + po.utilisedValue, 0),
      expiredCount: expired.length,
      expiringSoonCount: expiringSoon.length,
      averageUtilization: active.length > 0 
        ? (active.reduce((sum, po) => sum + (po.utilisedValue / po.totalValue * 100), 0) / active.length) 
        : 0
    }
  }, [purchaseOrders])

  const handleCreate = async () => {
    if (!formData.poNumber || !formData.clientName || !formData.totalValue) {
      toast.error(t('purchaseOrders.createDialog.fillAllFields'))
      return
    }

    const totalValue = parseFloat(formData.totalValue)
    if (isNaN(totalValue) || totalValue <= 0) {
      toast.error(t('purchaseOrders.createDialog.invalidValue'))
      return
    }

    const newPO: PurchaseOrder = {
      id: `PO-${Date.now()}`,
      poNumber: formData.poNumber,
      clientId: formData.clientId || `CLIENT-${Date.now()}`,
      clientName: formData.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || undefined,
      totalValue,
      remainingValue: totalValue,
      utilisedValue: 0,
      status: 'active',
      currency: formData.currency,
      linkedInvoices: [],
      notes: formData.notes || undefined,
      approvedBy: formData.approvedBy || undefined,
      approvedDate: formData.approvedBy ? new Date().toISOString().split('T')[0] : undefined,
      createdBy: 'Current User',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString()
    }

    try {
      await create(newPO)
      toast.success(t('purchaseOrders.messages.createSuccess', { poNumber: newPO.poNumber }))
      
      setFormData({
        poNumber: '',
        clientName: '',
        clientId: '',
        expiryDate: '',
        totalValue: '',
        currency: 'GBP',
        notes: '',
        approvedBy: ''
      })
      setIsCreateOpen(false)
    } catch (error) {
      toast.error(t('purchaseOrders.messages.createError'))
      console.error(error)
    }
  }

  const handleLinkInvoice = async (invoiceId: string) => {
    if (!selectedPO) return

    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) {
      toast.error(t('purchaseOrders.messages.invoiceNotFound'))
      return
    }

    if (selectedPO.linkedInvoices.some(li => li.invoiceId === invoiceId)) {
      toast.error(t('purchaseOrders.messages.alreadyLinked'))
      return
    }

    if (invoice.amount > selectedPO.remainingValue) {
      toast.warning(t('purchaseOrders.messages.exceedsRemaining', { 
        currency: invoice.currency, 
        amount: invoice.amount, 
        remaining: selectedPO.remainingValue 
      }))
    }

    const linkedInvoice: LinkedInvoice = {
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      linkedDate: new Date().toISOString(),
      linkedBy: 'Current User'
    }

    const updatedPO: PurchaseOrder = {
      ...selectedPO,
      linkedInvoices: [...selectedPO.linkedInvoices, linkedInvoice],
      utilisedValue: selectedPO.utilisedValue + invoice.amount,
      remainingValue: selectedPO.remainingValue - invoice.amount,
      lastModifiedDate: new Date().toISOString()
    }

    try {
      await update(updatedPO.id, {
        linkedInvoices: [...selectedPO.linkedInvoices, linkedInvoice],
        utilisedValue: selectedPO.utilisedValue + invoice.amount,
        remainingValue: selectedPO.remainingValue - invoice.amount,
        lastModifiedDate: new Date().toISOString()
      })
      setSelectedPO(updatedPO)
      toast.success(t('purchaseOrders.messages.linkSuccess', { 
        invoiceNumber: invoice.invoiceNumber, 
        poNumber: selectedPO.poNumber 
      }))
      setIsLinkInvoiceOpen(false)
    } catch (error) {
      toast.error(t('purchaseOrders.messages.linkError'))
      console.error(error)
    }
  }

  const handleUnlinkInvoice = async (linkedInvoice: LinkedInvoice) => {
    if (!selectedPO) return

    const updatedPO: PurchaseOrder = {
      ...selectedPO,
      linkedInvoices: selectedPO.linkedInvoices.filter(li => li.invoiceId !== linkedInvoice.invoiceId),
      utilisedValue: selectedPO.utilisedValue - linkedInvoice.amount,
      remainingValue: selectedPO.remainingValue + linkedInvoice.amount,
      lastModifiedDate: new Date().toISOString()
    }

    try {
      await update(updatedPO.id, {
        linkedInvoices: selectedPO.linkedInvoices.filter(li => li.invoiceId !== linkedInvoice.invoiceId),
        utilisedValue: selectedPO.utilisedValue - linkedInvoice.amount,
        remainingValue: selectedPO.remainingValue + linkedInvoice.amount,
        lastModifiedDate: new Date().toISOString()
      })
      setSelectedPO(updatedPO)
      toast.success(t('purchaseOrders.messages.unlinkSuccess', { invoiceNumber: linkedInvoice.invoiceNumber }))
    } catch (error) {
      toast.error(t('purchaseOrders.messages.unlinkError'))
      console.error(error)
    }
  }

  const handleDelete = async (po: PurchaseOrder) => {
    if (po.linkedInvoices.length > 0) {
      toast.error(t('purchaseOrders.messages.cannotDeleteLinked'))
      return
    }

    try {
      await remove(po.id)
      toast.success(t('purchaseOrders.messages.deleteSuccess', { poNumber: po.poNumber }))
      if (selectedPO?.id === po.id) {
        setIsDetailOpen(false)
        setSelectedPO(null)
      }
    } catch (error) {
      toast.error(t('purchaseOrders.messages.deleteError'))
      console.error(error)
    }
  }

  const handleViewDetails = (po: PurchaseOrder) => {
    setSelectedPO(po)
    setIsDetailOpen(true)
  }

  const getStatusColor = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success-foreground border-success/30'
      case 'expiring-soon':
        return 'bg-warning/10 text-warning-foreground border-warning/30'
      case 'expired':
        return 'bg-destructive/10 text-destructive-foreground border-destructive/30'
      case 'fulfilled':
        return 'bg-accent/10 text-accent-foreground border-accent/30'
      case 'cancelled':
        return 'bg-muted text-muted-foreground border-border'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const availableInvoices = useMemo(() => {
    if (!selectedPO) return []
    const linkedIds = new Set(selectedPO.linkedInvoices.map(li => li.invoiceId))
    return invoices.filter(inv => 
      !linkedIds.has(inv.id) && 
      inv.clientName === selectedPO.clientName &&
      inv.status !== 'cancelled'
    )
  }, [invoices, selectedPO])

  if (isLoadingState) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('purchaseOrders.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('purchaseOrders.subtitle')}</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus size={18} className="mr-2" />
          {t('purchaseOrders.createPO')}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-success" />
              Active POs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeCount}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics.remainingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CurrencyDollar size={16} weight="fill" className="text-accent" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-mono">
              {metrics.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Across {purchaseOrders.length} PO{purchaseOrders.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendUp size={16} weight="fill" className="text-info" />
              Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {metrics.averageUtilization.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Average across active POs
            </p>
          </CardContent>
        </Card>

        <Card className={metrics.expiringSoonCount > 0 ? 'border-warning/50' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Warning size={16} weight="fill" className="text-warning" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.expiringSoonCount + metrics.expiredCount}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics.expiringSoonCount} expiring, {metrics.expiredCount} expired
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring-soon">Expiring Soon</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="fulfilled">Fulfilled</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({purchaseOrders.filter(po => po.status === 'active').length})
          </TabsTrigger>
          <TabsTrigger value="expiring-soon">
            Expiring Soon ({metrics.expiringSoonCount})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({metrics.expiredCount})
          </TabsTrigger>
          <TabsTrigger value="fulfilled">
            Fulfilled ({purchaseOrders.filter(po => po.status === 'fulfilled').length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({filteredPOs.length})
          </TabsTrigger>
        </TabsList>

        {(['active', 'expiring-soon', 'expired', 'fulfilled', 'all'] as const).map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-3">
            {(tab === 'all' 
              ? filteredPOs 
              : filteredPOs.filter(po => po.status === tab)
            ).map(po => (
              <PurchaseOrderCard 
                key={po.id} 
                purchaseOrder={po}
                onViewDetails={handleViewDetails}
                onDelete={handleDelete}
                getStatusColor={getStatusColor}
              />
            ))}
            {(tab === 'all' ? filteredPOs : filteredPOs.filter(po => po.status === tab)).length === 0 && (
              <Card className="p-12 text-center">
                <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No purchase orders found</h3>
                <p className="text-muted-foreground">
                  {tab === 'all' ? 'Create a new PO to get started' : `No ${tab} purchase orders`}
                </p>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Add a new purchase order from a client to track budget and invoice linking
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="po-number">PO Number *</Label>
              <Input
                id="po-number"
                value={formData.poNumber}
                onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
                placeholder="PO-2024-0001"
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
            <div className="space-y-2">
              <Label htmlFor="po-value">Total Value *</Label>
              <Input
                id="po-value"
                type="number"
                step="0.01"
                min="0"
                value={formData.totalValue}
                onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
                placeholder="50000.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="po-currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger id="po-currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                </SelectContent>
              </Select>
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
            <div className="space-y-2">
              <Label htmlFor="po-approved-by">Approved By</Label>
              <Input
                id="po-approved-by"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                placeholder="John Smith"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="po-notes">Notes</Label>
              <Textarea
                id="po-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional information about this purchase order..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Purchase Order</Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedPO && (
        <>
          <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="font-mono">{selectedPO.poNumber}</span>
                  <Badge className={getStatusColor(selectedPO.status)}>
                    {selectedPO.status}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Purchase order details and linked invoices
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Client</p>
                    <p className="font-semibold">{selectedPO.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Issue Date</p>
                    <p className="font-medium">{new Date(selectedPO.issueDate).toLocaleDateString()}</p>
                  </div>
                  {selectedPO.expiryDate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                      <p className="font-medium">{new Date(selectedPO.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Currency</p>
                    <p className="font-medium">{selectedPO.currency}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold font-mono">
                        {selectedPO.currency} {selectedPO.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Utilised</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold font-mono">
                        {selectedPO.currency} {selectedPO.utilisedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm text-muted-foreground">Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold font-mono">
                        {selectedPO.currency} {selectedPO.remainingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Linked Invoices ({selectedPO.linkedInvoices.length})</h3>
                    <Button size="sm" onClick={() => setIsLinkInvoiceOpen(true)}>
                      <LinkSimple size={16} className="mr-2" />
                      Link Invoice
                    </Button>
                  </div>
                  {selectedPO.linkedInvoices.length > 0 ? (
                    <div className="space-y-2">
                      {selectedPO.linkedInvoices.map(linkedInv => (
                        <Card key={linkedInv.invoiceId}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex-1 grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Invoice Number</p>
                                <p className="font-semibold font-mono">{linkedInv.invoiceNumber}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="font-semibold font-mono">
                                  {selectedPO.currency} {linkedInv.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Linked On</p>
                                <p className="font-medium">{new Date(linkedInv.linkedDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => handleUnlinkInvoice(linkedInv)}
                            >
                              <X size={16} />
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Receipt size={32} className="mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No invoices linked yet</p>
                    </Card>
                  )}
                </div>

                {selectedPO.notes && (
                  <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm">{selectedPO.notes}</p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Created: {new Date(selectedPO.createdDate).toLocaleString()} by {selectedPO.createdBy}</p>
                  <p>Last Modified: {new Date(selectedPO.lastModifiedDate).toLocaleString()}</p>
                  {selectedPO.approvedBy && selectedPO.approvedDate && (
                    <p>Approved: {new Date(selectedPO.approvedDate).toLocaleDateString()} by {selectedPO.approvedBy}</p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isLinkInvoiceOpen} onOpenChange={setIsLinkInvoiceOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link Invoice to PO</DialogTitle>
                <DialogDescription>
                  Select an invoice to link to {selectedPO.poNumber}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
                {availableInvoices.length > 0 ? (
                  availableInvoices.map(invoice => (
                    <Card key={invoice.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleLinkInvoice(invoice.id)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold font-mono">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold font-mono">{invoice.currency} {invoice.amount.toLocaleString()}</p>
                            <Badge variant="outline" className="text-xs">{invoice.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <Receipt size={32} className="mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No available invoices for this client</p>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder
  onViewDetails: (po: PurchaseOrder) => void
  onDelete: (po: PurchaseOrder) => void
  getStatusColor: (status: PurchaseOrder['status']) => string
}

function PurchaseOrderCard({ purchaseOrder, onViewDetails, onDelete, getStatusColor }: PurchaseOrderCardProps) {
  const statusConfig = {
    active: { icon: CheckCircle, color: 'text-success' },
    'expiring-soon': { icon: Warning, color: 'text-warning' },
    expired: { icon: XCircle, color: 'text-destructive' },
    fulfilled: { icon: CheckCircle, color: 'text-muted-foreground' },
    cancelled: { icon: XCircle, color: 'text-muted-foreground' }
  }

  const StatusIcon = statusConfig[purchaseOrder.status].icon
  const utilization = (purchaseOrder.utilisedValue / purchaseOrder.totalValue) * 100

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[purchaseOrder.status].color}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="font-semibold text-lg font-mono">{purchaseOrder.poNumber}</h3>
                  <Badge className={getStatusColor(purchaseOrder.status)}>
                    {purchaseOrder.status.replace('-', ' ')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
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
                    <p className="font-semibold font-mono">
                      {purchaseOrder.currency} {purchaseOrder.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Utilised</p>
                    <p className="font-semibold font-mono">
                      {purchaseOrder.currency} {purchaseOrder.utilisedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining</p>
                    <p className="font-semibold font-mono">
                      {purchaseOrder.currency} {purchaseOrder.remainingValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
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
              size="sm" 
              variant="outline" 
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
