import { useCallback } from 'react'
import { indexedDB, STORES } from '@/lib/indexed-db'
import type { Invoice } from '@/lib/types'

type SetInvoices = (updater: (prev: Invoice[]) => Invoice[]) => void

export function useInvoicesWrite(setInvoices: SetInvoices) {
  const createInvoice = useCallback(
    async (invoice: Omit<Invoice, 'id'>) => {
      const newInvoice: Invoice = {
        ...invoice,
        id: `invoice-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }
      try {
        await indexedDB.create(STORES.INVOICES, newInvoice)
        setInvoices(current => [...current, newInvoice])
        return newInvoice
      } catch (error) {
        console.error('Failed to create invoice:', error)
        throw error
      }
    },
    [setInvoices]
  )

  const updateInvoice = useCallback(
    async (id: string, updates: Partial<Invoice>) => {
      try {
        const existing = await indexedDB.read<Invoice>(STORES.INVOICES, id)
        if (!existing) throw new Error('Invoice not found')
        const updated = { ...existing, ...updates }
        await indexedDB.update(STORES.INVOICES, updated)
        setInvoices(current => current.map(i => (i.id === id ? updated : i)))
        return updated
      } catch (error) {
        console.error('Failed to update invoice:', error)
        throw error
      }
    },
    [setInvoices]
  )

  const deleteInvoice = useCallback(
    async (id: string) => {
      try {
        await indexedDB.delete(STORES.INVOICES, id)
        setInvoices(current => current.filter(i => i.id !== id))
      } catch (error) {
        console.error('Failed to delete invoice:', error)
        throw error
      }
    },
    [setInvoices]
  )

  const bulkCreateInvoices = useCallback(
    async (invoicesData: Omit<Invoice, 'id'>[]) => {
      try {
        const newInvoices = invoicesData.map(data => ({
          ...data,
          id: `invoice-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        }))
        await indexedDB.bulkCreate(STORES.INVOICES, newInvoices)
        setInvoices(current => [...current, ...newInvoices])
        return newInvoices
      } catch (error) {
        console.error('Failed to bulk create invoices:', error)
        throw error
      }
    },
    [setInvoices]
  )

  const bulkUpdateInvoices = useCallback(
    async (updates: { id: string; updates: Partial<Invoice> }[]) => {
      try {
        const updatedInvoices = await Promise.all(
          updates.map(async ({ id, updates: data }) => {
            const existing = await indexedDB.read<Invoice>(STORES.INVOICES, id)
            if (!existing) throw new Error(`Invoice ${id} not found`)
            return { ...existing, ...data }
          })
        )
        await indexedDB.bulkUpdate(STORES.INVOICES, updatedInvoices)
        setInvoices(current =>
          current.map(i => updatedInvoices.find(u => u.id === i.id) ?? i)
        )
        return updatedInvoices
      } catch (error) {
        console.error('Failed to bulk update invoices:', error)
        throw error
      }
    },
    [setInvoices]
  )

  return {
    createInvoice,
    updateInvoice,
    deleteInvoice,
    bulkCreateInvoices,
    bulkUpdateInvoices,
  }
}
