import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export interface PurchaseOrder {
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

const DEFAULT_FORM = {
  poNumber: '',
  clientName: '',
  expiryDate: '',
  totalValue: '',
  notes: '',
}

export type POForm = typeof DEFAULT_FORM

export function usePurchaseOrderManager() {
  const [purchaseOrders = [], setPurchaseOrders] = useKV<PurchaseOrder[]>('purchase-orders', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState<POForm>(DEFAULT_FORM)

  const patch = (updates: Partial<POForm>) => setFormData({ ...formData, ...updates })

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
      notes: formData.notes || undefined,
    }
    setPurchaseOrders(current => [...(current || []), newPO])
    toast.success(`Purchase Order ${newPO.poNumber} created`)
    setFormData(DEFAULT_FORM)
    setIsCreateOpen(false)
  }

  const activePOs = purchaseOrders.filter(po => po.status === 'active')
  const expiredPOs = purchaseOrders.filter(po => po.status === 'expired')
  const fulfilledCount = purchaseOrders.filter(po => po.status === 'fulfilled').length

  return {
    purchaseOrders,
    filteredPOs,
    searchQuery, setSearchQuery,
    isCreateOpen, setIsCreateOpen,
    formData, patch,
    handleCreate,
    activePOs,
    expiredPOs,
    fulfilledCount,
  }
}
