import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Invoice } from '@/lib/types'

interface Props {
  invoice: Invoice
  sym: string
}

export function SelectedInvoiceCard({ invoice, sym }: Props) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Invoice Number</p>
            <p className="font-medium font-mono">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Client</p>
            <p className="font-medium">{invoice.clientName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Original Amount</p>
            <p className="font-semibold font-mono text-lg">{sym}{invoice.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant={invoice.status === 'paid' ? 'success' : 'warning'}>
              {invoice.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
