import { useCallback } from 'react'
import { toast } from 'sonner'
import type { Invoice } from '@/lib/types'
import type { InvoiceActionsResult } from './useBillingView.types'

interface Deps {
  updateInvoice: (id: string, patch: Partial<Invoice>) => Promise<unknown>
  createInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<unknown>
  deleteInvoice: (id: string) => Promise<unknown>
  viewingInvoice: Invoice | null
  setViewingInvoice: (invoice: Invoice | null) => void
  setFilteredInvoices: (invoices: Invoice[]) => void
  t: (key: string) => string
}

export function useBillingViewActions({
  updateInvoice,
  createInvoice,
  deleteInvoice,
  viewingInvoice,
  setViewingInvoice,
  setFilteredInvoices,
  t,
}: Deps): InvoiceActionsResult {
  const handleResultsChange = useCallback(
    (results: Invoice[]) => { setFilteredInvoices(results) },
    [setFilteredInvoices]
  )

  const handleSendInvoice = useCallback(async (invoiceId: string) => {
    try {
      await updateInvoice(invoiceId, { status: 'sent' })
      toast.success(t('billing.invoiceSentSuccess'))
    } catch { toast.error(t('billing.invoiceSentError')) }
  }, [updateInvoice, t])

  const handleCreatePlacementInvoice = useCallback(
    async (invoice: Omit<Invoice, 'id'>) => {
      try {
        await createInvoice(invoice)
        toast.success(t('billing.placementInvoiceCreatedSuccess'))
      } catch { toast.error(t('billing.placementInvoiceCreatedError')) }
    },
    [createInvoice, t]
  )

  const handleCreateCreditNote = useCallback(
    async (
      creditNote: Omit<Invoice, 'id' | 'type' | 'relatedInvoiceId'>,
      creditInvoice: Invoice
    ) => {
      try {
        await createInvoice({ ...creditNote, type: 'credit', relatedInvoiceId: creditInvoice.id })
        toast.success(t('billing.creditNoteCreatedSuccess'))
      } catch { toast.error(t('billing.creditNoteCreatedError')) }
    },
    [createInvoice, t]
  )

  const handleDeleteInvoice = useCallback(async (invoiceId: string) => {
    try {
      await deleteInvoice(invoiceId)
      toast.success(t('billing.invoiceDeletedSuccess'))
      if (viewingInvoice?.id === invoiceId) setViewingInvoice(null)
    } catch { toast.error(t('billing.invoiceDeletedError')) }
  }, [deleteInvoice, viewingInvoice, setViewingInvoice, t])

  return {
    handleResultsChange,
    handleSendInvoice,
    handleCreatePlacementInvoice,
    handleCreateCreditNote,
    handleDeleteInvoice,
  }
}
