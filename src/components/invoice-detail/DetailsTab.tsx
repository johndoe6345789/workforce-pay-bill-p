import { Badge } from '@/components/ui/badge'
import type { Invoice } from '@/lib/types'
import { currencySymbol } from './currencySymbol'

const LONG_DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

interface Props {
  invoice: Invoice
}

export function DetailsTab({ invoice }: Props) {
  const sym = currencySymbol(invoice.currency)
  const daysUntilDue = Math.floor((new Date(invoice.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="space-y-3">
      <div className="border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3">Invoice Information</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-muted-foreground">Invoice ID</p><p className="font-mono">{invoice.id}</p></div>
          <div><p className="text-muted-foreground">Invoice Number</p><p className="font-mono font-medium">{invoice.invoiceNumber}</p></div>
          <div><p className="text-muted-foreground">Invoice Type</p><p className="capitalize">{invoice.type || 'timesheet'}</p></div>
          <div>
            <p className="text-muted-foreground">Status</p>
            <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'destructive' : 'outline'}>
              {invoice.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3">Dates</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-muted-foreground">Issue Date</p><p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString('en-GB', LONG_DATE_FORMAT)}</p></div>
          <div><p className="text-muted-foreground">Due Date</p><p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-GB', LONG_DATE_FORMAT)}</p></div>
          <div><p className="text-muted-foreground">Days Until Due</p><p className="font-mono">{daysUntilDue} days</p></div>
        </div>
      </div>

      <div className="border border-border rounded-lg p-4">
        <h4 className="font-semibold text-sm mb-3">Financial Details</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-muted-foreground">Currency</p><p className="font-mono font-medium">{invoice.currency}</p></div>
          <div><p className="text-muted-foreground">Total Amount</p><p className="font-mono font-semibold text-lg">{sym}{invoice.amount.toLocaleString()}</p></div>
        </div>
      </div>

      {invoice.template && (
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-semibold text-sm mb-3">Template</h4>
          <Badge variant="outline">{invoice.template}</Badge>
        </div>
      )}
    </div>
  )
}
