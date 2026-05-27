import { toast } from 'sonner'
import type { Timesheet, Invoice, InvoiceStatus, CreditNote } from '@/lib/types'

export function useInvoiceActions(
  timesheets: Timesheet[],
  setInvoices: (updater: (current: Invoice[]) => Invoice[]) => void,
) {
  const handleCreateInvoice = (timesheetId: string) => {
    const timesheet = timesheets.find(t => t.id === timesheetId)
    if (!timesheet) return

    setInvoices(currentInvoices => {
      const newInvoice: Invoice = {
        id: `INV-${Date.now()}`,
        invoiceNumber: `INV-${String(currentInvoices.length + 1).padStart(5, '0')}`,
        clientName: timesheet.clientName,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: timesheet.amount,
        status: 'draft',
        currency: 'GBP'
      }
      toast.success(`Invoice ${newInvoice.invoiceNumber} created`)
      return [...currentInvoices, newInvoice]
    })
  }

  const handleSendInvoice = (invoiceId: string) => {
    setInvoices(current =>
      current.map(inv =>
        inv.id === invoiceId
          ? { ...inv, status: 'sent' as InvoiceStatus }
          : inv
      )
    )
    toast.success('Invoice sent to client via email')
  }

  const handleCreatePlacementInvoice = (invoice: Invoice) => {
    setInvoices(current => [...current, invoice])
  }

  const handleCreateCreditNote = (_creditNote: CreditNote, creditInvoice: Invoice) => {
    setInvoices(current => [...current, creditInvoice])
  }

  return {
    handleCreateInvoice,
    handleSendInvoice,
    handleCreatePlacementInvoice,
    handleCreateCreditNote,
  }
}
