import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import type { Invoice, InvoiceType } from '@/lib/types'

export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientName: z.string().min(1, 'Client name is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  amount: z.string().min(1, 'Amount is required').refine(v => !isNaN(parseFloat(v)) && parseFloat(v) > 0, { message: 'Amount must be a positive number' }),
  currency: z.string().min(1, 'Currency is required'),
  type: z.enum(['timesheet', 'permanent-placement', 'credit-note', 'adhoc']),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>

interface Options {
  onCreateInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>
  onOpenChange: (open: boolean) => void
}

export function useCreateInvoiceDialog({ onCreateInvoice, onOpenChange }: Options) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'GBP',
      type: 'timesheet',
      paymentTerms: 'Net 30 days',
    },
  })

  const invoiceType = form.watch('type')
  const currency = form.watch('currency')

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true)
    try {
      await onCreateInvoice({ invoiceNumber: data.invoiceNumber, clientName: data.clientName, issueDate: data.issueDate, dueDate: data.dueDate, amount: parseFloat(data.amount), currency: data.currency, status: 'draft', type: data.type, paymentTerms: data.paymentTerms, notes: data.notes })
      toast.success('Invoice created successfully')
      form.reset()
      onOpenChange(false)
    } catch {
      toast.error('Failed to create invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return { form, isSubmitting, invoiceType, currency, onSubmit: form.handleSubmit(onSubmit) }
}
