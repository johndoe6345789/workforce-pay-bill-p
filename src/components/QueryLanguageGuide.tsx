import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/hooks/use-translation'
import { OPERATOR_GROUPS, EXAMPLE_SECTIONS, PRO_TIPS } from '@/data/query-language-guide-data'

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
        <CardHeader><CardTitle>{t('queryGuide.operators')}</CardTitle></CardHeader>
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
        <CardHeader><CardTitle className="text-lg">Pro Tips</CardTitle></CardHeader>
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
