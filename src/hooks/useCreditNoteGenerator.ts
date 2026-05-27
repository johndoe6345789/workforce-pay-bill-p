import { useState } from 'react'
import { toast } from 'sonner'
import type { Invoice, CreditNote } from '@/lib/types'
import { currencySymbol } from '@/components/invoice-detail/currencySymbol'

export function useCreditNoteGenerator(invoices: Invoice[], onCreateCreditNote: (cn: CreditNote, inv: Invoice) => void) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('')
  const [creditAmount, setCreditAmount] = useState('')
  const [reason, setReason] = useState('')

  const eligibleInvoices = invoices.filter(inv => inv.type !== 'credit-note' && (inv.status === 'sent' || inv.status === 'paid'))
  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId)

  const reset = () => { setSelectedInvoiceId(''); setCreditAmount(''); setReason('') }

  const handleSubmit = () => {
    if (!selectedInvoiceId || !creditAmount || !reason) {
      toast.error('Please fill in all fields')
      return
    }
    if (!selectedInvoice) return

    const amount = parseFloat(creditAmount)
    if (amount > selectedInvoice.amount) {
      toast.error('Credit amount cannot exceed original invoice amount')
      return
    }

    const creditNote: CreditNote = {
      id: `CN-${Date.now()}`,
      creditNoteNumber: `CN-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`,
      originalInvoiceId: selectedInvoiceId,
      originalInvoiceNumber: selectedInvoice.invoiceNumber,
      clientName: selectedInvoice.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      amount,
      reason,
      status: 'draft',
      currency: selectedInvoice.currency,
    }

    const creditInvoice: Invoice = {
      id: creditNote.id,
      invoiceNumber: creditNote.creditNoteNumber,
      clientName: selectedInvoice.clientName,
      issueDate: creditNote.issueDate,
      dueDate: creditNote.issueDate,
      amount: -amount,
      status: 'credit',
      currency: selectedInvoice.currency,
      type: 'credit-note',
      relatedInvoiceId: selectedInvoiceId,
      notes: `Credit note for ${selectedInvoice.invoiceNumber}: ${reason}`,
      lineItems: [{ id: `LI-${Date.now()}`, description: `Credit: ${reason}`, quantity: 1, rate: -amount, amount: -amount }],
    }

    onCreateCreditNote(creditNote, creditInvoice)
    toast.success(`Credit note ${creditNote.creditNoteNumber} created for ${currencySymbol(selectedInvoice.currency)}${amount.toLocaleString()}`)
    reset()
    setIsOpen(false)
  }

  return { isOpen, setIsOpen, selectedInvoiceId, setSelectedInvoiceId, creditAmount, setCreditAmount, reason, setReason, eligibleInvoices, selectedInvoice, handleSubmit }
}
