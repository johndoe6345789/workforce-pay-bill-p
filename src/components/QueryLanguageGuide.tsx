import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/hooks/use-translation'

export function QueryLanguageGuide() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t('queryGuide.title')}</h2>
        <p className="text-muted-foreground">
          {t('queryGuide.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.basicSyntax')}</CardTitle>
          <CardDescription>{t('queryGuide.basicSyntaxDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">
            field operator value
          </div>
          <p className="text-sm text-muted-foreground">
            {t('queryGuide.combiningFiltersDescription')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.operators')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 text-sm">{t('queryGuide.textOperators')}</h4>
              <div className="space-y-2">
                <OperatorRow operator=":" description={t('queryGuide.contains')} />
                <OperatorRow operator="=" description={t('queryGuide.equals')} />
                <OperatorRow operator="starts" description={t('queryGuide.startsWith')} />
                <OperatorRow operator="ends" description={t('queryGuide.endsWith')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">{t('queryGuide.numberOperators')}</h4>
              <div className="space-y-2">
                <OperatorRow operator="=" description={t('queryGuide.equals')} />
                <OperatorRow operator=">" description={t('queryGuide.greaterThan')} />
                <OperatorRow operator=">=" description={t('queryGuide.greaterThanOrEqual')} />
                <OperatorRow operator="<" description={t('queryGuide.lessThan')} />
                <OperatorRow operator="<=" description={t('queryGuide.lessThanOrEqual')} />
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-sm">{t('queryGuide.dateOperators')}</h4>
              <div className="space-y-2">
                <OperatorRow operator="before" description={t('queryGuide.before')} />
                <OperatorRow operator="after" description={t('queryGuide.after')} />
                <OperatorRow operator="between" description={t('queryGuide.between')} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.combiningFilters')}</CardTitle>
          <CardDescription>{t('queryGuide.combiningFiltersDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t('queryGuide.quotedValues')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('queryGuide.fieldNames')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.examples')}</CardTitle>
          <CardDescription>{t('queryGuide.examplesDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              {t('navigation.timesheets')}
              <Badge variant="outline">status, hours, amount</Badge>
            </h4>
            <div className="space-y-2">
              <ExampleQuery
                query="status = pending"
                description="Show only pending timesheets"
              />
              <ExampleQuery
                query="workerName : Smith hours > 40"
                description="Find Smith's timesheets over 40 hours"
              />
              <ExampleQuery
                query="status in pending,approved sort amount desc"
                description="Pending or approved, sorted by amount high to low"
              />
              <ExampleQuery
                query="clientName : Acme amount >= 1000"
                description="Acme Corp timesheets worth £1000 or more"
              />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              Invoices
              <Badge variant="outline">status, amount, currency</Badge>
            </h4>
            <div className="space-y-2">
              <ExampleQuery
                query="status = overdue"
                description="Show all overdue invoices"
              />
              <ExampleQuery
                query="amount > 5000 currency = GBP"
                description="High-value GBP invoices"
              />
              <ExampleQuery
                query="clientName : Tech status in sent,overdue"
                description="Unpaid invoices for Tech clients"
              />
              <ExampleQuery
                query="status = paid sort amount desc"
                description="Paid invoices, largest first"
              />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              Expenses
              <Badge variant="outline">category, billable, amount</Badge>
            </h4>
            <div className="space-y-2">
              <ExampleQuery
                query="category = Travel billable = true"
                description="Billable travel expenses"
              />
              <ExampleQuery
                query="status = pending amount > 100"
                description="Pending expenses over £100"
              />
              <ExampleQuery
                query="workerName : Johnson category in Travel,Accommodation"
                description="Johnson's travel and accommodation"
              />
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              Compliance
              <Badge variant="outline">status, documentType, daysUntilExpiry</Badge>
            </h4>
            <div className="space-y-2">
              <ExampleQuery
                query="status = expiring daysUntilExpiry < 30"
                description="Documents expiring within 30 days"
              />
              <ExampleQuery
                query="documentType : DBS status in expiring,expired"
                description="DBS checks that need attention"
              />
              <ExampleQuery
                query="workerName : Brown sort daysUntilExpiry asc"
                description="Brown's documents by expiry date"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-accent font-semibold">•</span>
            <p>Use quotes around values with spaces: <code className="bg-muted px-1 rounded">clientName = "Acme Corporation"</code></p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent font-semibold">•</span>
            <p>Combine multiple filters: all must match (AND logic)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent font-semibold">•</span>
            <p>Field names are case-sensitive, but values are not</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent font-semibold">•</span>
            <p>Use the Filter Builder button for a guided experience</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OperatorRow({ operator, description }: { operator: string; description: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <code className="bg-background px-2 py-1 rounded font-mono font-semibold min-w-[60px] text-center">
        {operator}
      </code>
      <span className="text-muted-foreground">{description}</span>
    </div>
  )
}

function ExampleQuery({ query, description }: { query: string; description: string }) {
  return (
    <div className="bg-muted/50 p-3 rounded-lg space-y-1">
      <code className="text-sm font-mono text-foreground">{query}</code>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
