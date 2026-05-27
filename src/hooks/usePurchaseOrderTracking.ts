import { useState, useEffect, useMemo } from 'react'
import { usePurchaseOrdersCrud } from '@/hooks/use-purchase-orders-crud'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { useTranslation } from '@/hooks/use-translation'
import { useDataExport } from '@/hooks/use-data-export'
import { toast } from 'sonner'
import type { PurchaseOrder, LinkedInvoice } from '@/lib/types'

const EMPTY_FORM = {
  poNumber: '', clientName: '', clientId: '', expiryDate: '',
  totalValue: '', currency: 'GBP', notes: '', approvedBy: ''
}

export function usePurchaseOrderTracking() {
  const { t } = useTranslation()
  const { entities: purchaseOrders, create, update, remove } = usePurchaseOrdersCrud()
  const { invoices } = useInvoicesCrud()
  const { exportToExcel } = useDataExport()

  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLinkInvoiceOpen, setIsLinkInvoiceOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoadingState, setIsLoadingState] = useState(true)
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    if (purchaseOrders.length >= 0) setIsLoadingState(false)
  }, [purchaseOrders])

  useEffect(() => {
    purchaseOrders.forEach(po => {
      const now = new Date()
      const expiry = po.expiryDate ? new Date(po.expiryDate) : null
      const daysUntilExpiry = expiry
        ? Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : null

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
    const q = searchQuery.toLowerCase()
    const bySearch = purchaseOrders.filter(
      po => po.poNumber.toLowerCase().includes(q) || po.clientName.toLowerCase().includes(q)
    )
    return filterStatus === 'all' ? bySearch : bySearch.filter(po => po.status === filterStatus)
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
        ? active.reduce((sum, po) => sum + (po.utilisedValue / po.totalValue * 100), 0) / active.length
        : 0
    }
  }, [purchaseOrders])

  const availableInvoices = useMemo(() => {
    if (!selectedPO) return []
    const linkedIds = new Set(selectedPO.linkedInvoices.map(li => li.invoiceId))
    return invoices.filter(
      inv => !linkedIds.has(inv.id) && inv.clientName === selectedPO.clientName && inv.status !== 'cancelled'
    )
  }, [invoices, selectedPO])

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
      setFormData(EMPTY_FORM)
      setIsCreateOpen(false)
    } catch {
      toast.error(t('purchaseOrders.messages.createError'))
    }
  }

  const handleLinkInvoice = async (invoiceId: string) => {
    if (!selectedPO) return
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) { toast.error(t('purchaseOrders.messages.invoiceNotFound')); return }
    if (selectedPO.linkedInvoices.some(li => li.invoiceId === invoiceId)) {
      toast.error(t('purchaseOrders.messages.alreadyLinked')); return
    }
    if (invoice.amount > selectedPO.remainingValue) {
      toast.warning(t('purchaseOrders.messages.exceedsRemaining', {
        currency: invoice.currency, amount: invoice.amount, remaining: selectedPO.remainingValue
      }))
    }
    const linkedInvoice: LinkedInvoice = {
      invoiceId: invoice.id, invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount, linkedDate: new Date().toISOString(), linkedBy: 'Current User'
    }
    const patch = {
      linkedInvoices: [...selectedPO.linkedInvoices, linkedInvoice],
      utilisedValue: selectedPO.utilisedValue + invoice.amount,
      remainingValue: selectedPO.remainingValue - invoice.amount,
      lastModifiedDate: new Date().toISOString()
    }
    try {
      await update(selectedPO.id, patch)
      setSelectedPO({ ...selectedPO, ...patch })
      toast.success(t('purchaseOrders.messages.linkSuccess', { invoiceNumber: invoice.invoiceNumber, poNumber: selectedPO.poNumber }))
      setIsLinkInvoiceOpen(false)
    } catch {
      toast.error(t('purchaseOrders.messages.linkError'))
    }
  }

  const handleUnlinkInvoice = async (linkedInvoice: LinkedInvoice) => {
    if (!selectedPO) return
    const patch = {
      linkedInvoices: selectedPO.linkedInvoices.filter(li => li.invoiceId !== linkedInvoice.invoiceId),
      utilisedValue: selectedPO.utilisedValue - linkedInvoice.amount,
      remainingValue: selectedPO.remainingValue + linkedInvoice.amount,
      lastModifiedDate: new Date().toISOString()
    }
    try {
      await update(selectedPO.id, patch)
      setSelectedPO({ ...selectedPO, ...patch })
      toast.success(t('purchaseOrders.messages.unlinkSuccess', { invoiceNumber: linkedInvoice.invoiceNumber }))
    } catch {
      toast.error(t('purchaseOrders.messages.unlinkError'))
    }
  }

  const handleDelete = async (po: PurchaseOrder) => {
    if (po.linkedInvoices.length > 0) { toast.error(t('purchaseOrders.messages.cannotDeleteLinked')); return }
    try {
      await remove(po.id)
      toast.success(t('purchaseOrders.messages.deleteSuccess', { poNumber: po.poNumber }))
      if (selectedPO?.id === po.id) { setIsDetailOpen(false); setSelectedPO(null) }
    } catch {
      toast.error(t('purchaseOrders.messages.deleteError'))
    }
  }

  const handleViewDetails = (po: PurchaseOrder) => {
    setSelectedPO(po)
    setIsDetailOpen(true)
  }

  const handleExportPOs = () => {
    try {
      const exportData = filteredPOs.map(po => ({
        'PO Number': po.poNumber,
        'Client': po.clientName,
        'Status': po.status,
        'Issue Date': new Date(po.issueDate).toLocaleDateString(),
        'Expiry Date': po.expiryDate ? new Date(po.expiryDate).toLocaleDateString() : 'N/A',
        'Currency': po.currency,
        'Total Value': po.totalValue,
        'Utilised Value': po.utilisedValue,
        'Remaining Value': po.remainingValue,
        'Utilization %': ((po.utilisedValue / po.totalValue) * 100).toFixed(2),
        'Linked Invoices': po.linkedInvoices.length,
        'Created By': po.createdBy,
        'Created Date': new Date(po.createdDate).toLocaleDateString()
      }))
      exportToExcel(exportData, { filename: `purchase-orders-${new Date().toISOString().split('T')[0]}` })
      toast.success(t('purchaseOrders.messages.exportSuccess') || 'Purchase orders exported successfully')
    } catch {
      toast.error(t('purchaseOrders.messages.exportError') || 'Failed to export purchase orders')
    }
  }

  const getStatusColor = (status: PurchaseOrder['status']) => {
    const map: Record<string, string> = {
      active: 'bg-success/10 text-success-foreground border-success/30',
      'expiring-soon': 'bg-warning/10 text-warning-foreground border-warning/30',
      expired: 'bg-destructive/10 text-destructive-foreground border-destructive/30',
      fulfilled: 'bg-accent/10 text-accent-foreground border-accent/30',
      cancelled: 'bg-muted text-muted-foreground border-border',
    }
    return map[status] ?? 'bg-muted text-muted-foreground border-border'
  }

  return {
    purchaseOrders, t, metrics, filteredPOs, availableInvoices,
    searchQuery, setSearchQuery,
    isCreateOpen, setIsCreateOpen,
    isDetailOpen, setIsDetailOpen,
    isLinkInvoiceOpen, setIsLinkInvoiceOpen,
    selectedPO, setSelectedPO,
    filterStatus, setFilterStatus,
    isLoadingState,
    formData, setFormData,
    handleCreate, handleLinkInvoice, handleUnlinkInvoice,
    handleDelete, handleViewDetails, handleExportPOs, getStatusColor,
  }
}
