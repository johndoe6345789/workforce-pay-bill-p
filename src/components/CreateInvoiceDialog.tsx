import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Stack } from '@/components/ui/stack'
import { toast } from 'sonner'
import type { Invoice, InvoiceType } from '@/lib/types'

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientName: z.string().min(1, 'Client name is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  amount: z.string().min(1, 'Amount is required').refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  currency: z.string().min(1, 'Currency is required'),
  type: z.enum(['timesheet', 'permanent-placement', 'credit-note', 'adhoc']),
  paymentTerms: z.string().optional(),
  notes: z.string().optional(),
})

type InvoiceFormData = z.infer<typeof invoiceSchema>

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>
}

export function CreateInvoiceDialog({
  open,
  onOpenChange,
  onCreateInvoice,
}: CreateInvoiceDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InvoiceFormData>({
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

  const invoiceType = watch('type')

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true)
    try {
      const invoice: Omit<Invoice, 'id'> = {
        invoiceNumber: data.invoiceNumber,
        clientName: data.clientName,
        issueDate: data.issueDate,
        dueDate: data.dueDate,
        amount: parseFloat(data.amount),
        currency: data.currency,
        status: 'draft',
        type: data.type,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
      }

      await onCreateInvoice(invoice)
      toast.success('Invoice created successfully')
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to create invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>
            Generate a new invoice for client billing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  {...register('invoiceNumber')}
                  placeholder="INV-2024-001"
                />
                {errors.invoiceNumber && (
                  <p className="text-sm text-destructive mt-1">{errors.invoiceNumber.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="type">Invoice Type</Label>
                <Select
                  value={invoiceType}
                  onValueChange={(value) => setValue('type', value as InvoiceType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="timesheet">Timesheet</SelectItem>
                    <SelectItem value="permanent-placement">Permanent Placement</SelectItem>
                    <SelectItem value="adhoc">Ad-hoc</SelectItem>
                    <SelectItem value="credit-note">Credit Note</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-destructive mt-1">{errors.type.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                {...register('clientName')}
                placeholder="Enter client name"
              />
              {errors.clientName && (
                <p className="text-sm text-destructive mt-1">{errors.clientName.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  {...register('issueDate')}
                />
                {errors.issueDate && (
                  <p className="text-sm text-destructive mt-1">{errors.issueDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register('dueDate')}
                />
                {errors.dueDate && (
                  <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={watch('currency')}
                  onValueChange={(value) => setValue('currency', value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="AUD">AUD (A$)</SelectItem>
                    <SelectItem value="CAD">CAD (C$)</SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && (
                  <p className="text-sm text-destructive mt-1">{errors.currency.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                {...register('paymentTerms')}
                placeholder="Net 30 days"
              />
              {errors.paymentTerms && (
                <p className="text-sm text-destructive mt-1">{errors.paymentTerms.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Additional notes or instructions..."
                rows={3}
              />
              {errors.notes && (
                <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Invoice'}
              </Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
