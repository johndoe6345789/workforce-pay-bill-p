import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Receipt, Building, CalendarBlank, CurrencyDollar, Download, Envelope, FileText } from '@phosphor-icons/react'
import type { Invoice } from '@/lib/types'
import { cn } from '@/lib/utils'

interface InvoiceDetailDialogProps {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSendInvoice?: (invoiceId: string) => void
}

export function InvoiceDetailDialog({ invoice, open, onOpenChange, onSendInvoice }: InvoiceDetailDialogProps) {
  if (!invoice) return null

  const statusConfig = {
    draft: { color: 'text-muted-foreground', bgColor: 'bg-muted' },
    sent: { color: 'text-info', bgColor: 'bg-info/10' },
    paid: { color: 'text-success', bgColor: 'bg-success/10' },
    overdue: { color: 'text-destructive', bgColor: 'bg-destructive/10' },
    credit: { color: 'text-warning', bgColor: 'bg-warning/10' },
    cancelled: { color: 'text-muted-foreground', bgColor: 'bg-muted' }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', statusConfig[invoice.status].bgColor)}>
              <Receipt size={24} className={statusConfig[invoice.status].color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono">{invoice.invoiceNumber}</span>
                <Badge variant={
                  invoice.status === 'paid' ? 'success' : 
                  invoice.status === 'overdue' ? 'destructive' : 
                  'outline'
                }>
                  {invoice.status}
                </Badge>
                {invoice.type && invoice.type !== 'timesheet' && (
                  <Badge variant="outline" className="capitalize">
                    {invoice.type.replace('-', ' ')}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {invoice.id}
              </p>
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

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Building size={16} />
                    <span>Client</span>
                  </div>
                  <p className="font-medium">{invoice.clientName}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CurrencyDollar size={16} />
                    <span>Total Amount</span>
                  </div>
                  <p className="font-semibold font-mono text-2xl">
                    {invoice.currency === 'GBP' ? '£' : invoice.currency === 'USD' ? '$' : '€'}
                    {invoice.amount.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CalendarBlank size={16} />
                    <span>Issue Date</span>
                  </div>
                  <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CalendarBlank size={16} />
                    <span>Due Date</span>
                  </div>
                  <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                  {invoice.status === 'overdue' && (
                    <p className="text-xs text-destructive">
                      {Math.floor((Date.now() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CurrencyDollar size={16} />
                    <span>Currency</span>
                  </div>
                  <p className="font-medium font-mono">{invoice.currency}</p>
                </div>

                {invoice.template && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <FileText size={16} />
                      <span>Template</span>
                    </div>
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
                      <div>
                        <p className="text-muted-foreground">Candidate</p>
                        <p className="font-medium">{invoice.placementDetails.candidateName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Position</p>
                        <p className="font-medium">{invoice.placementDetails.position}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Start Date</p>
                        <p className="font-medium">{new Date(invoice.placementDetails.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Salary</p>
                        <p className="font-mono font-medium">£{invoice.placementDetails.salary.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fee Percentage</p>
                        <p className="font-mono font-medium">{invoice.placementDetails.feePercentage}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Guarantee Period</p>
                        <p className="font-medium">{invoice.placementDetails.guaranteePeriod} days</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {invoice.paymentTerms && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Payment Terms</h4>
                    <p className="text-sm text-muted-foreground">{invoice.paymentTerms}</p>
                  </div>
                </>
              )}

              {invoice.notes && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Notes</h4>
                    <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                  </div>
                </>
              )}

              {invoice.relatedInvoiceId && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Related Invoice</h4>
                    <Badge variant="outline" className="font-mono">{invoice.relatedInvoiceId}</Badge>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex gap-2">
                {invoice.status === 'draft' && onSendInvoice && (
                  <Button onClick={() => onSendInvoice(invoice.id)}>
                    <Envelope size={18} className="mr-2" />
                    Send Invoice
                  </Button>
                )}
                <Button variant="outline">
                  <Download size={18} className="mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline">
                  <FileText size={18} className="mr-2" />
                  Preview
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="line-items" className="space-y-3 mt-4">
              {invoice.lineItems && invoice.lineItems.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {invoice.lineItems.map((item) => (
                      <div key={item.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-medium">{item.description}</p>
                            {item.timesheetId && (
                              <Badge variant="outline" className="mt-1 font-mono text-xs">
                                Timesheet: {item.timesheetId}
                              </Badge>
                            )}
                          </div>
                          <p className="font-semibold font-mono text-lg">
                            {invoice.currency === 'GBP' ? '£' : invoice.currency === 'USD' ? '$' : '€'}
                            {item.amount.toFixed(2)}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t border-border">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-mono font-medium">{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Rate</p>
                            <p className="font-mono font-medium">
                              {invoice.currency === 'GBP' ? '£' : invoice.currency === 'USD' ? '$' : '€'}
                              {item.rate.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Subtotal</p>
                            <p className="font-mono font-medium">
                              {invoice.currency === 'GBP' ? '£' : invoice.currency === 'USD' ? '$' : '€'}
                              {item.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold font-mono text-2xl">
                      {invoice.currency === 'GBP' ? '£' : invoice.currency === 'USD' ? '$' : '€'}
                      {invoice.amount.toFixed(2)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Receipt size={32} className="mx-auto mb-2 opacity-50" />
                  <p>No line items available</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3">Invoice Information</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Invoice ID</p>
                      <p className="font-mono">{invoice.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Invoice Number</p>
                      <p className="font-mono font-medium">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Invoice Type</p>
                      <p className="capitalize">{invoice.type || 'timesheet'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant={
                        invoice.status === 'paid' ? 'success' : 
                        invoice.status === 'overdue' ? 'destructive' : 
                        'outline'
                      }>
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3">Dates</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Days Until Due</p>
                      <p className="font-mono">
                        {Math.floor((new Date(invoice.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3">Financial Details</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Currency</p>
                      <p className="font-mono font-medium">{invoice.currency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Amount</p>
                      <p className="font-mono font-semibold text-lg">
                        {invoice.currency === 'GBP' ? '£' : invoice.currency === 'USD' ? '$' : '€'}
                        {invoice.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {invoice.template && (
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-3">Template</h4>
                    <Badge variant="outline">{invoice.template}</Badge>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
