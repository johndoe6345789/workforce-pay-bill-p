import { useMemo } from 'react'
import type { PurchaseOrder } from '@/lib/types'
import type { POMetrics } from './usePurchaseOrderTracking.types'

interface UsePOMetricsParams {
  purchaseOrders: PurchaseOrder[]
  searchQuery: string
  filterStatus: string
  selectedPO: PurchaseOrder | null
  invoices: Array<{ id: string; clientName: string; status: string }>
}

interface UsePOMetricsReturn {
  filteredPOs: PurchaseOrder[]
  metrics: POMetrics
  availableInvoices: Array<{ id: string; clientName: string; status: string }>
}

export function usePOMetrics({
  purchaseOrders,
  searchQuery,
  filterStatus,
  selectedPO,
  invoices,
}: UsePOMetricsParams): UsePOMetricsReturn {
  const filteredPOs = useMemo(() => {
    const q = searchQuery.toLowerCase()
    const bySearch = purchaseOrders.filter(
      po => po.poNumber.toLowerCase().includes(q) || po.clientName.toLowerCase().includes(q)
    )
    return filterStatus === 'all' ? bySearch : bySearch.filter(po => po.status === filterStatus)
  }, [purchaseOrders, searchQuery, filterStatus])

  const metrics = useMemo<POMetrics>(() => {
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

  return { filteredPOs, metrics, availableInvoices }
}
