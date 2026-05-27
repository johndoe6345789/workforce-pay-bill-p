import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import type { Invoice, CreditNote } from '@/lib/types'
import { currencySymbol } from '@/components/invoice-detail/currencySymbol'
import { useCreditNoteGenerator } from '@/hooks/useCreditNoteGenerator'

interface Props {
  invoices: Invoice[]
  onCreateCreditNote: (creditNote: CreditNote, creditInvoice: Invoice) => void
}

export function CreditNoteGenerator({ invoices, onCreateCreditNote }: Props) {
  const vm = useCreditNoteGenerator(invoices, onCreateCreditNote)
  const sym = vm.selectedInvoice ? currencySymbol(vm.selectedInvoice.currency) : '£'

  return (
    <Dialog open={vm.isOpen} onOpenChange={vm.setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><ArrowCounterClockwise size={18} className="mr-2" />Create Credit Note</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Credit Note</DialogTitle>
          <DialogDescription>Create a credit note to adjust or reverse an invoice</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cn-invoice">Original Invoice *</Label>
            <Select value={vm.selectedInvoiceId} onValueChange={vm.setSelectedInvoiceId}>
              <SelectTrigger id="cn-invoice"><SelectValue placeholder="Select an invoice" /></SelectTrigger>
              <SelectContent>
                {vm.eligibleInvoices.map(inv => (
                  <SelectItem key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} - {inv.clientName} - {currencySymbol(inv.currency)}{inv.amount.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {vm.selectedInvoice && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Invoice Number</p>
                    <p className="font-medium font-mono">{vm.selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{vm.selectedInvoice.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Original Amount</p>
                    <p className="font-semibold font-mono text-lg">{sym}{vm.selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={vm.selectedInvoice.status === 'paid' ? 'success' : 'warning'}>
                      {vm.selectedInvoice.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="cn-amount">Credit Amount ({vm.selectedInvoice?.currency ?? 'GBP'}) *</Label>
            <Input
              id="cn-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={vm.creditAmount}
              onChange={e => vm.setCreditAmount(e.target.value)}
              disabled={!vm.selectedInvoiceId}
            />
            {vm.selectedInvoice && vm.creditAmount && parseFloat(vm.creditAmount) > vm.selectedInvoice.amount && (
              <p className="text-xs text-destructive">Credit amount cannot exceed original invoice amount</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cn-reason">Reason for Credit *</Label>
            <Textarea
              id="cn-reason"
              placeholder="e.g., Timesheet adjustment, overpayment correction, service issue"
              value={vm.reason}
              onChange={e => vm.setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => vm.setIsOpen(false)}>Cancel</Button>
          <Button onClick={vm.handleSubmit} disabled={!vm.selectedInvoiceId || !vm.creditAmount || !vm.reason}>
            Generate Credit Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
