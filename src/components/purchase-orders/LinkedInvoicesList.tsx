import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Receipt, LinkSimple, X } from '@phosphor-icons/react'
import type { LinkedInvoice } from '@/lib/types'

interface Props {
  linkedInvoices: LinkedInvoice[]
  currency: string
  fmt: (n: number) => string
  onUnlink: (li: LinkedInvoice) => void
  onOpenLinkDialog: () => void
}

export function LinkedInvoicesList({ linkedInvoices, currency, fmt, onUnlink, onOpenLinkDialog }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Linked Invoices ({linkedInvoices.length})</h3>
        <Button size="sm" onClick={onOpenLinkDialog}>
          <LinkSimple size={16} className="mr-2" />
          Link Invoice
        </Button>
      </div>
      {linkedInvoices.length > 0 ? (
        <div className="space-y-2">
          {linkedInvoices.map(li => (
            <Card key={li.invoiceId}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 grid grid-cols-3 gap-4">
                  <div><p className="text-sm text-muted-foreground">Invoice Number</p><p className="font-semibold font-mono">{li.invoiceNumber}</p></div>
                  <div><p className="text-sm text-muted-foreground">Amount</p><p className="font-semibold font-mono">{currency} {fmt(li.amount)}</p></div>
                  <div><p className="text-sm text-muted-foreground">Linked On</p><p className="font-medium">{new Date(li.linkedDate).toLocaleDateString()}</p></div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => onUnlink(li)}><X size={16} /></Button>
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
  )
}
