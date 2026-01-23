import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Plus,
  Download,
  Receipt,
  Envelope,
  ChartLine,
  Warning
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PermanentPlacementInvoice } from '@/components/PermanentPlacementInvoice'
import { CreditNoteGenerator } from '@/components/CreditNoteGenerator'
import { InvoiceDetailDialog } from '@/components/InvoiceDetailDialog'
import { AdvancedSearch, type FilterField } from '@/components/AdvancedSearch'
import { useInvoicing } from '@/hooks/use-invoicing'
import { toast } from 'sonner'
import type { Invoice, RateCard } from '@/lib/types'

interface BillingViewProps {
  invoices: Invoice[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  onSendInvoice: (invoiceId: string) => void
  onCreatePlacementInvoice: (invoice: Invoice) => void
  onCreateCreditNote: (creditNote: any, creditInvoice: Invoice) => void
  rateCards: RateCard[]
}

export function BillingView({ 
  invoices, 
  searchQuery, 
  setSearchQuery, 
  onSendInvoice, 
  onCreatePlacementInvoice, 
  onCreateCreditNote, 
  rateCards 
}: BillingViewProps) {
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [showAnalytics, setShowAnalytics] = useState(false)
  
  const {
    calculateInvoiceAging,
    getOverdueInvoices,
    calculateTotalRevenue,
    getInvoicesByStatus
  } = useInvoicing()
  
  useEffect(() => {
    setFilteredInvoices(invoices)
  }, [invoices])
  
  const handleResultsChange = useCallback((results: Invoice[]) => {
    setFilteredInvoices(results)
  }, [])

  const agingData = useMemo(() => calculateInvoiceAging(), [calculateInvoiceAging])
  const overdueInvoices = useMemo(() => getOverdueInvoices(), [getOverdueInvoices])
  const totalRevenue = useMemo(() => calculateTotalRevenue(), [calculateTotalRevenue])
  const draftInvoices = useMemo(() => getInvoicesByStatus('draft'), [getInvoicesByStatus])
  
  const invoiceFields: FilterField[] = [
    { name: 'invoiceNumber', label: 'Invoice Number', type: 'text' },
    { name: 'clientName', label: 'Client Name', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [
      { value: 'draft', label: 'Draft' },
      { value: 'sent', label: 'Sent' },
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' }
    ]},
    { name: 'amount', label: 'Amount', type: 'number' },
    { name: 'currency', label: 'Currency', type: 'select', options: [
      { value: 'GBP', label: 'GBP' },
      { value: 'USD', label: 'USD' },
      { value: 'EUR', label: 'EUR' }
    ]},
    { name: 'issueDate', label: 'Issue Date', type: 'date' },
    { name: 'dueDate', label: 'Due Date', type: 'date' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Billing & Invoicing</h2>
          <p className="text-muted-foreground mt-1">Manage invoices and track payments</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            <ChartLine size={18} className="mr-2" />
            {showAnalytics ? 'Hide' : 'Show'} Analytics
          </Button>
          <PermanentPlacementInvoice onCreateInvoice={onCreatePlacementInvoice} />
          <CreditNoteGenerator invoices={invoices} onCreateCreditNote={onCreateCreditNote} />
          <Button>
            <Plus size={18} className="mr-2" />
            Create Invoice
          </Button>
        </div>
      </div>

      {showAnalytics && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold font-mono">
                  £{totalRevenue.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Draft Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{draftInvoices.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Overdue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-semibold">{overdueInvoices.length}</div>
                  {overdueInvoices.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      <Warning size={12} className="mr-1" />
                      Action needed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-muted-foreground">Outstanding</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold font-mono">
                  £{(agingData.current + agingData.days30 + agingData.days60 + agingData.days90 + agingData.over90).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Invoice Aging Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Current</div>
                  <div className="font-semibold font-mono">£{agingData.current.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">1-30 Days</div>
                  <div className="font-semibold font-mono">£{agingData.days30.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">31-60 Days</div>
                  <div className="font-semibold font-mono text-warning">£{agingData.days60.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">61-90 Days</div>
                  <div className="font-semibold font-mono text-warning">£{agingData.days90.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">90+ Days</div>
                  <div className="font-semibold font-mono text-destructive">£{agingData.over90.toLocaleString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <AdvancedSearch
        items={invoices}
        fields={invoiceFields}
        onResultsChange={handleResultsChange}
        placeholder="Search invoices or use query language (e.g., status = overdue amount > 1000)"
      />

      <div className="flex items-center gap-4">
        <Button variant="outline">
          <Download size={18} className="mr-2" />
          Export
        </Button>
      </div>

      <div className="space-y-3">
        {filteredInvoices.map(invoice => (
          <Card key={invoice.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingInvoice(invoice)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Receipt size={20} className="text-primary" />
                    <h3 className="font-semibold text-lg font-mono">{invoice.invoiceNumber}</h3>
                    <Badge variant={invoice.status === 'paid' ? 'success' : invoice.status === 'overdue' ? 'destructive' : 'warning'}>
                      {invoice.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium">{invoice.clientName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issue Date</p>
                      <p className="font-medium">{new Date(invoice.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold font-mono text-lg">
                        {invoice.currency === 'GBP' ? '£' : '$'}{invoice.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Currency</p>
                      <p className="font-medium font-mono">{invoice.currency}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                  {invoice.status === 'draft' && (
                    <Button
                      size="sm"
                      onClick={() => onSendInvoice(invoice.id)}
                    >
                      <Envelope size={16} className="mr-2" />
                      Send
                    </Button>
                  )}
                  <Button size="sm" variant="outline">View</Button>
                  <Button size="sm" variant="outline">
                    <Download size={16} className="mr-2" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredInvoices.length === 0 && (
          <Card className="p-12 text-center">
            <Receipt size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No invoices found</h3>
            <p className="text-muted-foreground">Create your first invoice or adjust your search</p>
          </Card>
        )}
      </div>

      <InvoiceDetailDialog
        invoice={viewingInvoice}
        open={viewingInvoice !== null}
        onOpenChange={(open) => {
          if (!open) setViewingInvoice(null)
        }}
        onSendInvoice={onSendInvoice}
      />
    </div>
  )
}
