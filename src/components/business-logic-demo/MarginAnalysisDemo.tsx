import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useMarginAnalysis } from '@/hooks'

export function MarginAnalysisDemo() {
  const { analyzeClientProfitability } = useMarginAnalysis()
  const clients = analyzeClientProfitability().slice(0, 5)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Top Clients by Revenue</CardTitle><CardDescription>Client profitability analysis</CardDescription></CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <div className="space-y-4">
              {clients.map((client, index) => (
                <div key={client.clientName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{index + 1}.</span>
                      <span className="font-medium">{client.clientName}</span>
                    </div>
                    <Badge variant={client.marginPercentage > 20 ? 'default' : 'secondary'}>{client.marginPercentage.toFixed(1)}% margin</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Revenue:</span><p className="font-semibold">£{client.revenue.toLocaleString()}</p></div>
                    <div><span className="text-muted-foreground">Margin:</span><p className="font-semibold">£{client.margin.toLocaleString()}</p></div>
                    <div><span className="text-muted-foreground">Invoices:</span><p className="font-semibold">{client.invoiceCount}</p></div>
                  </div>
                  {index < clients.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No client data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
