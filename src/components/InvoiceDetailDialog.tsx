import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Receipt } from '@phosphor-icons/react'
import type { Invoice } from '@/lib/types'
import { cn } from '@/lib/utils'
import { OverviewTab } from '@/components/invoice-detail/OverviewTab'
import { LineItemsTab } from '@/components/invoice-detail/LineItemsTab'
import { DetailsTab } from '@/components/invoice-detail/DetailsTab'

interface InvoiceDetailDialogProps {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSendInvoice?: (invoiceId: string) => void
}

const STATUS_STYLE: Record<string, { color: string; bgColor: string }> = {
  draft: { color: 'text-muted-foreground', bgColor: 'bg-muted' },
  sent: { color: 'text-info', bgColor: 'bg-info/10' },
  paid: { color: 'text-success', bgColor: 'bg-success/10' },
  overdue: { color: 'text-destructive', bgColor: 'bg-destructive/10' },
  credit: { color: 'text-warning', bgColor: 'bg-warning/10' },
  cancelled: { color: 'text-muted-foreground', bgColor: 'bg-muted' },
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange, onSendInvoice }: InvoiceDetailDialogProps) {
  if (!invoice) return null

  const style = STATUS_STYLE[invoice.status] ?? STATUS_STYLE.draft
  const statusVariant = invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'destructive' : 'outline'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', style.bgColor)}>
              <Receipt size={24} className={style.color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono">{invoice.invoiceNumber}</span>
                <Badge variant={statusVariant}>{invoice.status}</Badge>
                {invoice.type && invoice.type !== 'timesheet' && (
                  <Badge variant="outline" className="capitalize">{invoice.type.replace('-', ' ')}</Badge>
                )}
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">{invoice.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="line-items">Line Items ({invoice.lineItems?.length || 0})</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <OverviewTab invoice={invoice} onSendInvoice={onSendInvoice} />
            </TabsContent>
            <TabsContent value="line-items" className="mt-4">
              <LineItemsTab invoice={invoice} />
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <DetailsTab invoice={invoice} />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
