import { useState, useEffect } from 'react'
import { usePurchaseOrdersCrud } from '@/hooks/use-purchase-orders-crud'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { useTranslation } from '@/hooks/use-translation'
import type { PurchaseOrder } from '@/lib/types'
import { EMPTY_FORM, type POFormData } from './usePurchaseOrderTracking.types'
import { usePOMetrics } from './usePOMetrics'
import { usePOHandlers } from './usePOHandlers'

export function usePurchaseOrderTracking() {
  const { t } = useTranslation()
  const { entities: purchaseOrders, create, update, remove } = usePurchaseOrdersCrud()
  const { invoices } = useInvoicesCrud()

  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isLinkInvoiceOpen, setIsLinkInvoiceOpen] = useState(false)
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoadingState, setIsLoadingState] = useState(true)
  const [formData, setFormData] = useState<POFormData>({ ...EMPTY_FORM })

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

  const { filteredPOs, metrics, availableInvoices } = usePOMetrics({
    purchaseOrders, searchQuery, filterStatus, selectedPO, invoices
  })

  const handlers = usePOHandlers({
    t, filteredPOs, selectedPO, invoices, create, update, remove,
    setFormData, setIsCreateOpen, setIsDetailOpen, setIsLinkInvoiceOpen, setSelectedPO, formData
  })

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
    ...handlers,
  }
}
