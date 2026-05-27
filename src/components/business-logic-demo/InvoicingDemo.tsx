import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useInvoicing } from '@/hooks'

export function InvoicingDemo() {
  const { invoices, calculateInvoiceAging, getOverdueInvoices, getInvoicesByStatus } = useInvoicing()
  const aging = calculateInvoiceAging()
  const overdue = getOverdueInvoices()
  const draft = getInvoicesByStatus('draft')
  const paid = getInvoicesByStatus('paid')

  const agingRows = [
    { label: 'Current', value: aging.current },
    { label: '1-30 days', value: aging.days30 },
    { label: '31-60 days', value: aging.days60 },
    { label: '61-90 days', value: aging.days90 },
    { label: '90+ days', value: aging.over90, destructive: true },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Total Invoices</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{invoices.length}</div><p className="text-xs text-muted-foreground mt-1">{draft.length} draft, {paid.length} paid</p></CardContent></Card>
      <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Current</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">£{aging.current.toLocaleString()}</div><p className="text-xs text-muted-foreground mt-1">Not yet due</p></CardContent></Card>
      <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">30 Days</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">£{aging.days30.toLocaleString()}</div><p className="text-xs text-muted-foreground mt-1">1-30 days overdue</p></CardContent></Card>
      <Card><CardHeader className="pb-3"><CardTitle className="text-sm font-medium">90+ Days</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-destructive">£{aging.over90.toLocaleString()}</div><p className="text-xs text-muted-foreground mt-1">{overdue.length} invoices</p></CardContent></Card>
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader><CardTitle>Invoice Aging Breakdown</CardTitle><CardDescription>Breakdown of outstanding invoices by age</CardDescription></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {agingRows.map((row, i) => (
              <div key={row.label}>
                <div className="flex items-center justify-between"><span className="text-sm">{row.label}</span><span className={`font-semibold${row.destructive ? ' text-destructive' : ''}`}>£{row.value.toLocaleString()}</span></div>
                {i < agingRows.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
