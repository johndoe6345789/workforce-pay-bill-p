import { useCallback } from 'react'
import type { Timesheet, Invoice } from '@/lib/types'
import type { ClientProfitability } from './use-margin-analysis.types'

export function useMarginAnalysisClients(
  timesheets: Timesheet[],
  invoices: Invoice[]
) {
  const analyzeClientProfitability = useCallback((
    startDate?: Date,
    endDate?: Date
  ): ClientProfitability[] => {
    const filteredInvoices = invoices.filter(inv => {
      if (inv.status === 'cancelled') return false
      if (!startDate && !endDate) return true
      const invDate = new Date(inv.issueDate)
      if (startDate && invDate < startDate) return false
      if (endDate && invDate > endDate) return false
      return true
    })

    const filteredTimesheets = timesheets.filter(ts => {
      if (ts.status !== 'approved') return false
      if (!startDate && !endDate) return true
      const tsDate = new Date(ts.weekEnding)
      if (startDate && tsDate < startDate) return false
      if (endDate && tsDate > endDate) return false
      return true
    })

    const clientData = new Map<string, { revenue: number; costs: number; invoiceCount: number }>()

    filteredInvoices.forEach(inv => {
      const existing = clientData.get(inv.clientName) || { revenue: 0, costs: 0, invoiceCount: 0 }
      clientData.set(inv.clientName, {
        revenue: existing.revenue + (inv.amount || 0),
        costs: existing.costs,
        invoiceCount: existing.invoiceCount + 1
      })
    })

    filteredTimesheets.forEach(ts => {
      const existing = clientData.get(ts.clientName) || { revenue: 0, costs: 0, invoiceCount: 0 }
      clientData.set(ts.clientName, {
        ...existing,
        costs: existing.costs + (ts.amount || 0)
      })
    })

    return Array.from(clientData.entries())
      .map(([clientName, data]) => ({
        clientName,
        revenue: data.revenue,
        costs: data.costs,
        margin: data.revenue - data.costs,
        marginPercentage:
          data.revenue > 0 ? ((data.revenue - data.costs) / data.revenue) * 100 : 0,
        invoiceCount: data.invoiceCount,
        avgInvoiceValue: data.invoiceCount > 0 ? data.revenue / data.invoiceCount : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [invoices, timesheets])

  return { analyzeClientProfitability }
}
