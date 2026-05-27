import { useState, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Invoice, InvoiceStatus } from '@/lib/types'
import { useInvoiceCreators } from './use-invoice-creators'
import { useInvoiceQueries } from './use-invoice-queries'

export type { InvoiceGenerationOptions, InvoiceAgingData } from './use-invoicing.types'

export function useInvoicing() {
  const [invoices = [], setInvoices] = useKV<Invoice[]>('invoices', [])
  const [isProcessing, setIsProcessing] = useState(false)

  const generateInvoiceNumber = useCallback((prefix: string = 'INV'): string => {
    const count = invoices.length + 1
    const timestamp = Date.now().toString().slice(-6)
    return `${prefix}-${String(count).padStart(5, '0')}-${timestamp}`
  }, [invoices.length])

  const saveInvoice = useCallback(async (invoice: Invoice) => {
    setIsProcessing(true)
    try {
      setInvoices(current => [...(current || []), invoice])
      return invoice
    } finally {
      setIsProcessing(false)
    }
  }, [setInvoices])

  const updateInvoiceStatus = useCallback(async (
    invoiceId: string,
    status: InvoiceStatus
  ) => {
    setInvoices(current =>
      (current || []).map(inv =>
        inv.id === invoiceId ? { ...inv, status } : inv
      )
    )
  }, [setInvoices])

  const creators = useInvoiceCreators(generateInvoiceNumber)
  const queries = useInvoiceQueries(invoices)

  return {
    invoices,
    isProcessing,
    generateInvoiceNumber,
    saveInvoice,
    updateInvoiceStatus,
    ...creators,
    ...queries
  }
}
