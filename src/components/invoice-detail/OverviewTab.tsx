import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building, CalendarBlank, CurrencyDollar, Download, Envelope, FileText } from '@phosphor-icons/react'
import type { Invoice } from '@/lib/types'
import { currencySymbol } from './currencySymbol'

interface Props {
  invoice: Invoice
  onSendInvoice?: (invoiceId: string) => void
}

export function OverviewTab({ invoice, onSendInvoice }: Props) {
  const sym = currencySymbol(invoice.currency)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Building size={16} /><span>Client</span></div>
          <p className="font-medium">{invoice.clientName}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CurrencyDollar size={16} /><span>Total Amount</span></div>
          <p className="font-semibold font-mono text-2xl">{sym}{invoice.amount.toLocaleString()}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CalendarBlank size={16} /><span>Issue Date</span></div>
          <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CalendarBlank size={16} /><span>Due Date</span></div>
          <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
          {invoice.status === 'overdue' && (
            <p className="text-xs text-destructive">
              {Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
            </p>
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><CurrencyDollar size={16} /><span>Currency</span></div>
          <p className="font-medium font-mono">{invoice.currency}</p>
        </div>
        {invoice.template && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm"><FileText size={16} /><span>Template</span></div>
            <Badge variant="outline">{invoice.template}</Badge>
          </div>
        )}
      </div>

      {invoice.placementDetails && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Permanent Placement Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-muted-foreground">Candidate</p><p className="font-medium">{invoice.placementDetails.candidateName}</p></div>
              <div><p className="text-muted-foreground">Position</p><p className="font-medium">{invoice.placementDetails.position}</p></div>
              <div><p className="text-muted-foreground">Start Date</p><p className="font-medium">{new Date(invoice.placementDetails.startDate).toLocaleDateString()}</p></div>
              <div><p className="text-muted-foreground">Salary</p><p className="font-mono font-medium">£{invoice.placementDetails.salary.toLocaleString()}</p></div>
              <div><p className="text-muted-foreground">Fee Percentage</p><p className="font-mono font-medium">{invoice.placementDetails.feePercentage}%</p></div>
              <div><p className="text-muted-foreground">Guarantee Period</p><p className="font-medium">{invoice.placementDetails.guaranteePeriod} days</p></div>
            </div>
          </div>
        </>
      )}

      {invoice.paymentTerms && (
        <><Separator /><div className="space-y-2"><h4 className="font-semibold text-sm">Payment Terms</h4><p className="text-sm text-muted-foreground">{invoice.paymentTerms}</p></div></>
      )}

      {invoice.notes && (
        <><Separator /><div className="space-y-2"><h4 className="font-semibold text-sm">Notes</h4><p className="text-sm text-muted-foreground">{invoice.notes}</p></div></>
      )}

      {invoice.relatedInvoiceId && (
        <><Separator /><div className="space-y-2"><h4 className="font-semibold text-sm">Related Invoice</h4><Badge variant="outline" className="font-mono">{invoice.relatedInvoiceId}</Badge></div></>
      )}

      <Separator />
      <div className="flex gap-2">
        {invoice.status === 'draft' && onSendInvoice && (
          <Button onClick={() => onSendInvoice(invoice.id)}><Envelope size={18} className="mr-2" />Send Invoice</Button>
        )}
        <Button variant="outline"><Download size={18} className="mr-2" />Download PDF</Button>
        <Button variant="outline"><FileText size={18} className="mr-2" />Preview</Button>
      </div>
    </div>
  )
}
