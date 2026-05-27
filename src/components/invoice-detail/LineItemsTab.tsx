import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Receipt } from '@phosphor-icons/react'
import type { Invoice } from '@/lib/types'
import { currencySymbol } from './currencySymbol'

interface Props {
  invoice: Invoice
}

export function LineItemsTab({ invoice }: Props) {
  const sym = currencySymbol(invoice.currency)

  if (!invoice.lineItems || invoice.lineItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Receipt size={32} className="mx-auto mb-2 opacity-50" />
        <p>No line items available</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {invoice.lineItems.map(item => (
          <div key={item.id} className="border border-border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-medium">{item.description}</p>
                {item.timesheetId && <Badge variant="outline" className="mt-1 font-mono text-xs">Timesheet: {item.timesheetId}</Badge>}
              </div>
              <p className="font-semibold font-mono text-lg">{sym}{item.amount.toFixed(2)}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t border-border">
              <div><p className="text-muted-foreground">Quantity</p><p className="font-mono font-medium">{item.quantity}</p></div>
              <div><p className="text-muted-foreground">Rate</p><p className="font-mono font-medium">{sym}{item.rate.toFixed(2)}</p></div>
              <div><p className="text-muted-foreground">Subtotal</p><p className="font-mono font-medium">{sym}{item.amount.toFixed(2)}</p></div>
            </div>
          </div>
        ))}
      </div>
      <Separator />
      <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
        <span className="font-semibold">Total</span>
        <span className="font-bold font-mono text-2xl">{sym}{invoice.amount.toFixed(2)}</span>
      </div>
    </div>
  )
}
