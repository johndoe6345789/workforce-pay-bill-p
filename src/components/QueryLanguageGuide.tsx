import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/hooks/use-translation'

const OPERATOR_GROUPS: { titleKey: string; items: { op: string; descKey: string }[] }[] = [
  {
    titleKey: 'queryGuide.textOperators',
    items: [
      { op: ':',      descKey: 'queryGuide.contains' },
      { op: '=',      descKey: 'queryGuide.equals' },
      { op: 'starts', descKey: 'queryGuide.startsWith' },
      { op: 'ends',   descKey: 'queryGuide.endsWith' },
    ],
  },
  {
    titleKey: 'queryGuide.numberOperators',
    items: [
      { op: '=',  descKey: 'queryGuide.equals' },
      { op: '>',  descKey: 'queryGuide.greaterThan' },
      { op: '>=', descKey: 'queryGuide.greaterThanOrEqual' },
      { op: '<',  descKey: 'queryGuide.lessThan' },
      { op: '<=', descKey: 'queryGuide.lessThanOrEqual' },
    ],
  },
  {
    titleKey: 'queryGuide.dateOperators',
    items: [
      { op: 'before',  descKey: 'queryGuide.before' },
      { op: 'after',   descKey: 'queryGuide.after' },
      { op: 'between', descKey: 'queryGuide.between' },
    ],
  },
]

const EXAMPLE_SECTIONS: { title: string; badge: string; examples: { query: string; description: string }[] }[] = [
  {
    title: 'navigation.timesheets',
    badge: 'status, hours, amount',
    examples: [
      { query: 'status = pending',                              description: 'Show only pending timesheets' },
      { query: 'workerName : Smith hours > 40',                description: "Find Smith's timesheets over 40 hours" },
      { query: 'status in pending,approved sort amount desc',   description: 'Pending or approved, sorted by amount high to low' },
      { query: 'clientName : Acme amount >= 1000',             description: 'Acme Corp timesheets worth £1000 or more' },
    ],
  },
  {
    title: 'Invoices',
    badge: 'status, amount, currency',
    examples: [
      { query: 'status = overdue',                            description: 'Show all overdue invoices' },
      { query: 'amount > 5000 currency = GBP',               description: 'High-value GBP invoices' },
      { query: 'clientName : Tech status in sent,overdue',   description: 'Unpaid invoices for Tech clients' },
      { query: 'status = paid sort amount desc',             description: 'Paid invoices, largest first' },
    ],
  },
  {
    title: 'Expenses',
    badge: 'category, billable, amount',
    examples: [
      { query: 'category = Travel billable = true',                        description: 'Billable travel expenses' },
      { query: 'status = pending amount > 100',                            description: 'Pending expenses over £100' },
      { query: 'workerName : Johnson category in Travel,Accommodation',    description: "Johnson's travel and accommodation" },
    ],
  },
  {
    title: 'Compliance',
    badge: 'status, documentType, daysUntilExpiry',
    examples: [
      { query: 'status = expiring daysUntilExpiry < 30',             description: 'Documents expiring within 30 days' },
      { query: 'documentType : DBS status in expiring,expired',      description: 'DBS checks that need attention' },
      { query: 'workerName : Brown sort daysUntilExpiry asc',        description: "Brown's documents by expiry date" },
    ],
  },
]

const PRO_TIPS = [
  <>Use quotes around values with spaces: <code className="bg-muted px-1 rounded">clientName = "Acme Corporation"</code></>,
  'Combine multiple filters: all must match (AND logic)',
  'Field names are case-sensitive, but values are not',
  'Use the Filter Builder button for a guided experience',
]

export function QueryLanguageGuide() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t('queryGuide.title')}</h2>
        <p className="text-muted-foreground">{t('queryGuide.subtitle')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.basicSyntax')}</CardTitle>
          <CardDescription>{t('queryGuide.basicSyntaxDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg font-mono text-sm">field operator value</div>
          <p className="text-sm text-muted-foreground">{t('queryGuide.combiningFiltersDescription')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.operators')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OPERATOR_GROUPS.map(({ titleKey, items }) => (
              <div key={titleKey}>
                <h4 className="font-semibold mb-2 text-sm">{t(titleKey)}</h4>
                <div className="space-y-2">
                  {items.map(({ op, descKey }) => (
                    <div key={op + descKey} className="flex items-center gap-3 text-sm">
                      <code className="bg-background px-2 py-1 rounded font-mono font-semibold min-w-[60px] text-center">{op}</code>
                      <span className="text-muted-foreground">{t(descKey)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.combiningFilters')}</CardTitle>
          <CardDescription>{t('queryGuide.combiningFiltersDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{t('queryGuide.quotedValues')}</p>
          <p className="text-sm text-muted-foreground">{t('queryGuide.fieldNames')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('queryGuide.examples')}</CardTitle>
          <CardDescription>{t('queryGuide.examplesDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {EXAMPLE_SECTIONS.map(({ title, badge, examples }, i) => (
            <div key={title}>
              {i > 0 && <Separator className="mb-6" />}
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                {title.startsWith('navigation.') ? t(title) : title}
                <Badge variant="outline">{badge}</Badge>
              </h4>
              <div className="space-y-2">
                {examples.map(({ query, description }) => (
                  <div key={query} className="bg-muted/50 p-3 rounded-lg space-y-1">
                    <code className="text-sm font-mono text-foreground">{query}</code>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {PRO_TIPS.map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-accent font-semibold">•</span>
              <p>{tip}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
