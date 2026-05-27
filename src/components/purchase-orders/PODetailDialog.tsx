import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Receipt, LinkSimple, X } from '@phosphor-icons/react'
import type { PurchaseOrder, LinkedInvoice } from '@/lib/types'
import type { Invoice } from '@/lib/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPO: PurchaseOrder
  availableInvoices: Invoice[]
  isLinkInvoiceOpen: boolean
  setIsLinkInvoiceOpen: (open: boolean) => void
  handleUnlinkInvoice: (li: LinkedInvoice) => void
  handleLinkInvoice: (invoiceId: string) => void
  getStatusColor: (status: PurchaseOrder['status']) => string
}

export function PODetailDialog({
  open, onOpenChange, selectedPO, availableInvoices,
  isLinkInvoiceOpen, setIsLinkInvoiceOpen,
  handleUnlinkInvoice, handleLinkInvoice, getStatusColor
}: Props) {
  const fmt = (n: number) => n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="font-mono">{selectedPO.poNumber}</span>
              <Badge className={getStatusColor(selectedPO.status)}>{selectedPO.status}</Badge>
            </DialogTitle>
            <DialogDescription>Purchase order details and linked invoices</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div><p className="text-sm text-muted-foreground">Client</p><p className="font-semibold">{selectedPO.clientName}</p></div>
              <div><p className="text-sm text-muted-foreground">Issue Date</p><p className="font-medium">{new Date(selectedPO.issueDate).toLocaleDateString()}</p></div>
              {selectedPO.expiryDate && (
                <div><p className="text-sm text-muted-foreground">Expiry Date</p><p className="font-medium">{new Date(selectedPO.expiryDate).toLocaleDateString()}</p></div>
              )}
              <div><p className="text-sm text-muted-foreground">Currency</p><p className="font-medium">{selectedPO.currency}</p></div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Value', value: `${selectedPO.currency} ${fmt(selectedPO.totalValue)}` },
                { label: 'Utilised', value: `${selectedPO.currency} ${fmt(selectedPO.utilisedValue)}` },
                { label: 'Remaining', value: `${selectedPO.currency} ${fmt(selectedPO.remainingValue)}` },
              ].map(({ label, value }) => (
                <Card key={label}>
                  <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">{label}</CardTitle></CardHeader>
                  <CardContent><p className="text-2xl font-bold font-mono">{value}</p></CardContent>
                </Card>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Linked Invoices ({selectedPO.linkedInvoices.length})</h3>
                <Button size="sm" onClick={() => setIsLinkInvoiceOpen(true)}>
                  <LinkSimple size={16} className="mr-2" />
                  Link Invoice
                </Button>
              </div>
              {selectedPO.linkedInvoices.length > 0 ? (
                <div className="space-y-2">
                  {selectedPO.linkedInvoices.map(li => (
                    <Card key={li.invoiceId}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex-1 grid grid-cols-3 gap-4">
                          <div><p className="text-sm text-muted-foreground">Invoice Number</p><p className="font-semibold font-mono">{li.invoiceNumber}</p></div>
                          <div><p className="text-sm text-muted-foreground">Amount</p><p className="font-semibold font-mono">{selectedPO.currency} {fmt(li.amount)}</p></div>
                          <div><p className="text-sm text-muted-foreground">Linked On</p><p className="font-medium">{new Date(li.linkedDate).toLocaleDateString()}</p></div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleUnlinkInvoice(li)}><X size={16} /></Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Receipt size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No invoices linked yet</p>
                </Card>
              )}
            </div>

            {selectedPO.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <Card><CardContent className="p-4"><p className="text-sm">{selectedPO.notes}</p></CardContent></Card>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p>Created: {new Date(selectedPO.createdDate).toLocaleString()} by {selectedPO.createdBy}</p>
              <p>Last Modified: {new Date(selectedPO.lastModifiedDate).toLocaleString()}</p>
              {selectedPO.approvedBy && selectedPO.approvedDate && (
                <p>Approved: {new Date(selectedPO.approvedDate).toLocaleDateString()} by {selectedPO.approvedBy}</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLinkInvoiceOpen} onOpenChange={setIsLinkInvoiceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Invoice to PO</DialogTitle>
            <DialogDescription>Select an invoice to link to {selectedPO.poNumber}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4 max-h-96 overflow-y-auto">
            {availableInvoices.length > 0 ? (
              availableInvoices.map(invoice => (
                <Card key={invoice.id} className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => handleLinkInvoice(invoice.id)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div><p className="font-semibold font-mono">{invoice.invoiceNumber}</p><p className="text-sm text-muted-foreground">{invoice.clientName}</p></div>
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
    </>
  )
}
