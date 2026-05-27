import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Receipt } from '@phosphor-icons/react'
import type { Invoice } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  poNumber: string
  availableInvoices: Invoice[]
  onLink: (invoiceId: string) => void
}

export function LinkInvoiceDialog({ open, onOpenChange, poNumber, availableInvoices, onLink }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Link Invoice to PO</DialogTitle>
          <DialogDescription>Select an invoice to link to {poNumber}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
          {availableInvoices.length > 0 ? (
            availableInvoices.map(invoice => (
              <Card key={invoice.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => onLink(invoice.id)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold font-mono">{invoice.invoiceNumber}</p>
                      <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold font-mono">{invoice.currency} {invoice.amount.toLocaleString()}</p>
                      <Badge variant="outline" className="text-xs">{invoice.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="p-8 text-center">
              <Receipt size={32} className="mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No available invoices for this client</p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
