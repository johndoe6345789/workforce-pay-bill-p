import { useCallback, useState, useEffect } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import { useIndexedDBLive } from './use-indexed-db-live'
import { useInvoicesWrite } from './use-invoices-write'
import { useInvoicesBulk } from './use-invoices-bulk'
import type { Invoice } from '@/lib/types'

export function useInvoicesCrud(options?: {
  liveRefresh?: boolean
  pollingInterval?: number
}) {
  const liveRefreshEnabled = options?.liveRefresh !== false
  const pollingInterval = options?.pollingInterval ?? 1000
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const [invoices, setInvoices] = useIndexedDBLive<Invoice[]>(
    STORES.INVOICES,
    [],
    { enabled: liveRefreshEnabled, pollingInterval }
  )

  useEffect(() => { setLastUpdated(new Date()) }, [invoices])

  const { createInvoice, updateInvoice, deleteInvoice } =
    useInvoicesWrite(setInvoices)
  const { bulkCreateInvoices, bulkUpdateInvoices } =
    useInvoicesBulk(setInvoices)

  const getInvoiceById = useCallback(async (id: string) => {
    try {
      return await indexedDB.read<Invoice>(STORES.INVOICES, id)
    } catch (error) {
      console.error('Failed to get invoice:', error)
      throw error
    }
  }, [])

  const getInvoicesByClient = useCallback(async (clientId: string) => {
    try {
      return await indexedDB.readByIndex<Invoice>(
        STORES.INVOICES, 'clientId', clientId
      )
    } catch (error) {
      console.error('Failed to get invoices by client:', error)
      throw error
    }
  }, [])

  const getInvoicesByStatus = useCallback(async (status: string) => {
    try {
      return await indexedDB.readByIndex<Invoice>(
        STORES.INVOICES, 'status', status
      )
    } catch (error) {
      console.error('Failed to get invoices by status:', error)
      throw error
    }
  }, [])

  return {
    invoices,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceById,
    getInvoicesByClient,
    getInvoicesByStatus,
    bulkCreateInvoices,
    bulkUpdateInvoices,
    lastUpdated,
  }
}
