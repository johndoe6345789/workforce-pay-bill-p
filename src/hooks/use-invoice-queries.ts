import { useCallback } from 'react'
import type { Invoice, InvoiceStatus, InvoiceType } from '@/lib/types'
import type { InvoiceAgingData } from './use-invoicing.types'

export function useInvoiceQueries(invoices: Invoice[]) {
  const calculateInvoiceAging = useCallback((): InvoiceAgingData => {
    const now = new Date()
    const aging: InvoiceAgingData = {
      current: 0,
      days30: 0,
      days60: 0,
      days90: 0,
      over90: 0
    }

    invoices.forEach(invoice => {
      if (invoice.status === 'paid' || invoice.status === 'cancelled') return

      const dueDate = new Date(invoice.dueDate)
      const daysOverdue = Math.floor(
        (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysOverdue <= 0) {
        aging.current += invoice.amount
      } else if (daysOverdue <= 30) {
        aging.days30 += invoice.amount
      } else if (daysOverdue <= 60) {
        aging.days60 += invoice.amount
      } else if (daysOverdue <= 90) {
        aging.days90 += invoice.amount
      } else {
        aging.over90 += invoice.amount
      }
    })

    return aging
  }, [invoices])

  const getInvoicesByClient = useCallback(
    (clientName: string): Invoice[] =>
      invoices.filter(inv => inv.clientName === clientName),
    [invoices]
  )

  const getInvoicesByStatus = useCallback(
    (status: InvoiceStatus): Invoice[] =>
      invoices.filter(inv => inv.status === status),
    [invoices]
  )

  const getInvoicesByType = useCallback(
    (type: InvoiceType): Invoice[] =>
      invoices.filter(inv => inv.type === type),
    [invoices]
  )

  const calculateTotalRevenue = useCallback(
    (startDate?: Date, endDate?: Date): number =>
      invoices
        .filter(inv => {
          if (inv.status === 'cancelled') return false
          if (!startDate && !endDate) return true
          const invDate = new Date(inv.issueDate)
          if (startDate && invDate < startDate) return false
          if (endDate && invDate > endDate) return false
          return true
        })
        .reduce((sum, inv) => sum + inv.amount, 0),
    [invoices]
  )

  const getOverdueInvoices = useCallback((): Invoice[] => {
    const now = new Date()
    return invoices.filter(inv => {
      if (inv.status === 'paid' || inv.status === 'cancelled') return false
      return new Date(inv.dueDate) < now
    })
  }, [invoices])

  return {
    calculateInvoiceAging,
    getInvoicesByClient,
    getInvoicesByStatus,
    getInvoicesByType,
    calculateTotalRevenue,
    getOverdueInvoices
  }
}
