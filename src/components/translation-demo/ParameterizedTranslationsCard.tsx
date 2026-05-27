import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from '@/hooks/use-translation'
import { UNREAD_COUNTS, PERIOD_CHANGES, VALIDATION_EXAMPLES } from '@/data/translation-demo-data'

export function ParameterizedTranslationsCard() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameterized Translations</CardTitle>
        <CardDescription>Dynamic values in translations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2">Unread count example:</p>
          <div className="space-y-1">
            {UNREAD_COUNTS.map(count => (
              <p key={count} className="text-sm text-muted-foreground">{t('notifications.unreadCount', { count })}</p>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium mb-2">Change from period example:</p>
          <div className="space-y-1">
            {PERIOD_CHANGES.map(change => (
              <p key={change} className="text-sm text-muted-foreground">{t('metrics.changeFromLastPeriod', { change })}</p>
            ))}
          </div>
        </div>
        <Separator />
        <div>
          <p className="text-sm font-medium mb-2">Validation messages:</p>
          <div className="space-y-1">
            {VALIDATION_EXAMPLES.map(({ key, params }) => (
              <p key={key} className="text-sm text-destructive">{t(key, params)}</p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
