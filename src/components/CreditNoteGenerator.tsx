import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Receipt, ArrowCounterClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { Invoice, CreditNote } from '@/lib/types'

interface CreditNoteGeneratorProps {
  invoices: Invoice[]
  onCreateCreditNote: (creditNote: CreditNote, creditInvoice: Invoice) => void
}

export function CreditNoteGenerator({ invoices, onCreateCreditNote }: CreditNoteGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('')
  const [creditAmount, setCreditAmount] = useState('')
  const [reason, setReason] = useState('')

  const selectedInvoice = invoices.find(inv => inv.id === selectedInvoiceId)

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
      amount: amount,
      reason: reason,
      status: 'draft',
      currency: selectedInvoice.currency
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
      lineItems: [{
        id: `LI-${Date.now()}`,
        description: `Credit: ${reason}`,
        quantity: 1,
        rate: -amount,
        amount: -amount
      }]
    }

    onCreateCreditNote(creditNote, creditInvoice)
    toast.success(`Credit note ${creditNote.creditNoteNumber} created for ${creditInvoice.currency === 'GBP' ? '£' : '$'}${amount.toLocaleString()}`)
    
    setSelectedInvoiceId('')
    setCreditAmount('')
    setReason('')
    setIsOpen(false)
  }

  const eligibleInvoices = invoices.filter(inv => 
    inv.type !== 'credit-note' && 
    (inv.status === 'sent' || inv.status === 'paid')
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowCounterClockwise size={18} className="mr-2" />
          Create Credit Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Credit Note</DialogTitle>
          <DialogDescription>
            Create a credit note to adjust or reverse an invoice
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="cn-invoice">Original Invoice *</Label>
            <Select value={selectedInvoiceId} onValueChange={setSelectedInvoiceId}>
              <SelectTrigger id="cn-invoice">
                <SelectValue placeholder="Select an invoice" />
              </SelectTrigger>
              <SelectContent>
                {eligibleInvoices.map(invoice => (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    {invoice.invoiceNumber} - {invoice.clientName} - {invoice.currency === 'GBP' ? '£' : '$'}{invoice.amount.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedInvoice && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Invoice Number</p>
                    <p className="font-medium font-mono">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{selectedInvoice.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Original Amount</p>
                    <p className="font-semibold font-mono text-lg">
                      {selectedInvoice.currency === 'GBP' ? '£' : '$'}{selectedInvoice.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={selectedInvoice.status === 'paid' ? 'success' : 'warning'}>
                      {selectedInvoice.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="cn-amount">Credit Amount ({selectedInvoice?.currency || 'GBP'}) *</Label>
            <Input
              id="cn-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              disabled={!selectedInvoiceId}
            />
            {selectedInvoice && creditAmount && parseFloat(creditAmount) > selectedInvoice.amount && (
              <p className="text-xs text-destructive">Credit amount cannot exceed original invoice amount</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cn-reason">Reason for Credit *</Label>
            <Textarea
              id="cn-reason"
              placeholder="e.g., Timesheet adjustment, overpayment correction, service issue"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!selectedInvoiceId || !creditAmount || !reason}>
            Generate Credit Note
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
