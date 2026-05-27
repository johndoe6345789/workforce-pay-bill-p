import { useState, useEffect, useMemo } from 'react'
import { useInvoicing } from '@/hooks/use-invoicing'
import { useInvoicesCrud } from '@/hooks/use-invoices-crud'
import { useTranslation } from '@/hooks/use-translation'
import { useBillingViewActions } from './useBillingViewActions'
import { useBillingViewColumns } from './useBillingViewColumns'
import type { Invoice } from '@/lib/types'
import type { UseBillingViewOptions } from './useBillingView.types'

export function useBillingView({ rateCards: _rateCards }: UseBillingViewOptions) {
  const { t } = useTranslation()
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const { invoices, createInvoice, updateInvoice, deleteInvoice, lastUpdated } =
    useInvoicesCrud({ liveRefresh: true, pollingInterval: 1000 })

  const { calculateInvoiceAging, getOverdueInvoices, calculateTotalRevenue, getInvoicesByStatus } =
    useInvoicing()

  useEffect(() => { setFilteredInvoices(invoices) }, [invoices])

  const actions = useBillingViewActions({
    updateInvoice,
    createInvoice,
    deleteInvoice,
    viewingInvoice,
    setViewingInvoice,
    setFilteredInvoices,
    t,
  })

  const { invoiceFields, invoiceColumns } = useBillingViewColumns({
    t,
    setViewingInvoice,
    handleSendInvoice: actions.handleSendInvoice,
    handleDeleteInvoice: actions.handleDeleteInvoice,
  })

  const agingData = useMemo(() => calculateInvoiceAging(), [calculateInvoiceAging])
  const overdueInvoices = useMemo(() => getOverdueInvoices(), [getOverdueInvoices])
  const totalRevenue = useMemo(() => calculateTotalRevenue(), [calculateTotalRevenue])
  const draftInvoices = useMemo(() => getInvoicesByStatus('draft'), [getInvoicesByStatus])

  return {
    t,
    invoices, createInvoice, lastUpdated,
    viewingInvoice, setViewingInvoice,
    filteredInvoices,
    showAnalytics, setShowAnalytics,
    showCreateDialog, setShowCreateDialog,
    ...actions,
    agingData, overdueInvoices, totalRevenue, draftInvoices,
    invoiceFields, invoiceColumns,
  }
}
