import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/hooks/use-translation'
import { Globe, XCircle, Translate } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'
import { TranslationKeyCard } from '@/components/translation-demo/TranslationKeyCard'
import { StatusMessagesCard } from '@/components/translation-demo/StatusMessagesCard'
import { UsageInstructionsCard } from '@/components/translation-demo/UsageInstructionsCard'

const NAV_ITEMS = [
  { label: 'Dashboard', translationKey: 'navigation.dashboard' },
  { label: 'Timesheets', translationKey: 'navigation.timesheets' },
  { label: 'Billing', translationKey: 'navigation.billing' },
  { label: 'Payroll', translationKey: 'navigation.payroll' },
  { label: 'Compliance', translationKey: 'navigation.compliance' },
  { label: 'Expenses', translationKey: 'navigation.expenses' },
  { label: 'Reports', translationKey: 'navigation.reports' },
]

const COMMON_ITEMS = [
  { label: 'Search', translationKey: 'common.search' },
  { label: 'Filter', translationKey: 'common.filter' },
  { label: 'Export', translationKey: 'common.export' },
  { label: 'Save', translationKey: 'common.save' },
  { label: 'Cancel', translationKey: 'common.cancel' },
  { label: 'Submit', translationKey: 'common.submit' },
  { label: 'Delete', translationKey: 'common.delete' },
]

const UNREAD_COUNTS = [5, 12, 0]
const PERIOD_CHANGES = ['+15', '-8', '+3.5']
const VALIDATION_EXAMPLES = [
  { key: 'validation.minLength', params: { min: 8 } },
  { key: 'validation.maxLength', params: { max: 50 } },
  { key: 'validation.minValue', params: { min: 0 } },
]

export function TranslationDemo() {
  const { t, locale, changeLocale, availableLocales, isLoading, error } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <XCircle size={24} className="text-destructive" />
              <CardTitle>{t('common.error')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent><p className="text-muted-foreground">{t('errors.loadingFailed')}</p></CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight flex items-center gap-3">
          <Translate size={32} weight="duotone" className="text-primary" />
          Translation System Demo
        </h2>
        <p className="text-muted-foreground mt-1">Comprehensive i18n with JSON-based translations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe size={20} />Current Language</CardTitle>
          <CardDescription>Active locale: <Badge variant="secondary">{locale}</Badge></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {availableLocales.map(loc => (
              <Button key={loc} variant={locale === loc ? 'default' : 'outline'} onClick={() => changeLocale(loc)} className="uppercase">{loc}</Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TranslationKeyCard title="Navigation Translations" description="Menu items in current language" items={NAV_ITEMS} />
        <TranslationKeyCard title="Common Actions" description="Frequently used terms" items={COMMON_ITEMS} />
        <StatusMessagesCard />
      </div>

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

      <UsageInstructionsCard />
    </div>
  )
}
