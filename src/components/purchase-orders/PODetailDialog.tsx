import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { PurchaseOrder, LinkedInvoice } from '@/lib/types'
import type { Invoice } from '@/lib/types'
import { LinkInvoiceDialog } from '@/components/purchase-orders/LinkInvoiceDialog'
import { LinkedInvoicesList } from '@/components/purchase-orders/LinkedInvoicesList'

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

            <LinkedInvoicesList
              linkedInvoices={selectedPO.linkedInvoices}
              currency={selectedPO.currency}
              fmt={fmt}
              onUnlink={handleUnlinkInvoice}
              onOpenLinkDialog={() => setIsLinkInvoiceOpen(true)}
            />

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

      <LinkInvoiceDialog
        open={isLinkInvoiceOpen}
        onOpenChange={setIsLinkInvoiceOpen}
        poNumber={selectedPO.poNumber}
        availableInvoices={availableInvoices}
        onLink={handleLinkInvoice}
      />
    </>
  )
}
