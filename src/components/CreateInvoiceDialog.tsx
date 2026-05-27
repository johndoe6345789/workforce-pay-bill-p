import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Stack } from '@/components/ui/stack'
import type { Invoice, InvoiceType } from '@/lib/types'
import { useCreateInvoiceDialog } from '@/hooks/useCreateInvoiceDialog'
import { INVOICE_TYPES, CURRENCIES } from '@/data/invoice-config'

interface Props { open: boolean; onOpenChange: (open: boolean) => void; onCreateInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void> }

export function CreateInvoiceDialog({ open, onOpenChange, onCreateInvoice }: Props) {
  const vm = useCreateInvoiceDialog({ onCreateInvoice, onOpenChange })
  const { register, formState: { errors }, setValue } = vm.form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>Generate a new invoice for client billing</DialogDescription>
        </DialogHeader>
        <form onSubmit={vm.onSubmit}>
          <Stack>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input id="invoiceNumber" {...register('invoiceNumber')} placeholder="INV-2024-001" />
                {errors.invoiceNumber && <p className="text-sm text-destructive mt-1">{errors.invoiceNumber.message}</p>}
              </div>
              <div>
                <Label htmlFor="type">Invoice Type</Label>
                <Select value={vm.invoiceType} onValueChange={v => setValue('type', v as InvoiceType)}>
                  <SelectTrigger id="type"><SelectValue /></SelectTrigger>
                  <SelectContent>{INVOICE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
                {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input id="clientName" {...register('clientName')} placeholder="Enter client name" />
              {errors.clientName && <p className="text-sm text-destructive mt-1">{errors.clientName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input id="issueDate" type="date" {...register('issueDate')} />
                {errors.issueDate && <p className="text-sm text-destructive mt-1">{errors.issueDate.message}</p>}
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" {...register('dueDate')} />
                {errors.dueDate && <p className="text-sm text-destructive mt-1">{errors.dueDate.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" step="0.01" {...register('amount')} placeholder="0.00" />
                {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={vm.currency} onValueChange={v => setValue('currency', v)}>
                  <SelectTrigger id="currency"><SelectValue /></SelectTrigger>
                  <SelectContent>{CURRENCIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
                {errors.currency && <p className="text-sm text-destructive mt-1">{errors.currency.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input id="paymentTerms" {...register('paymentTerms')} placeholder="Net 30 days" />
              {errors.paymentTerms && <p className="text-sm text-destructive mt-1">{errors.paymentTerms.message}</p>}
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register('notes')} placeholder="Additional notes or instructions..." rows={3} />
              {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={vm.isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={vm.isSubmitting}>{vm.isSubmitting ? 'Creating...' : 'Create Invoice'}</Button>
            </div>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  )
}
