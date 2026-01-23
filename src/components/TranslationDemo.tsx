import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/hooks/use-translation'
import { 
  Globe, 
  CheckCircle, 
  Warning, 
  XCircle,
  Info,
  Translate
} from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'

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
          <CardContent>
            <p className="text-muted-foreground">{t('errors.loadingFailed')}</p>
          </CardContent>
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
        <p className="text-muted-foreground mt-1">
          Comprehensive i18n with JSON-based translations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe size={20} />
            Current Language
          </CardTitle>
          <CardDescription>
            Active locale: <Badge variant="secondary">{locale}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {availableLocales.map((loc) => (
              <Button
                key={loc}
                variant={locale === loc ? 'default' : 'outline'}
                onClick={() => changeLocale(loc)}
                className="uppercase"
              >
                {loc}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Navigation Translations</CardTitle>
            <CardDescription>Menu items in current language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <TranslationItem label="Dashboard" translationKey="navigation.dashboard" />
              <TranslationItem label="Timesheets" translationKey="navigation.timesheets" />
              <TranslationItem label="Billing" translationKey="navigation.billing" />
              <TranslationItem label="Payroll" translationKey="navigation.payroll" />
              <TranslationItem label="Compliance" translationKey="navigation.compliance" />
              <TranslationItem label="Expenses" translationKey="navigation.expenses" />
              <TranslationItem label="Reports" translationKey="navigation.reports" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Actions</CardTitle>
            <CardDescription>Frequently used terms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <TranslationItem label="Search" translationKey="common.search" />
              <TranslationItem label="Filter" translationKey="common.filter" />
              <TranslationItem label="Export" translationKey="common.export" />
              <TranslationItem label="Save" translationKey="common.save" />
              <TranslationItem label="Cancel" translationKey="common.cancel" />
              <TranslationItem label="Submit" translationKey="common.submit" />
              <TranslationItem label="Delete" translationKey="common.delete" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Messages</CardTitle>
            <CardDescription>System statuses and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-success" />
                <span className="text-sm">{t('common.success')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Warning size={20} className="text-warning" />
                <span className="text-sm">{t('common.warning')}</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={20} className="text-destructive" />
                <span className="text-sm">{t('common.error')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Info size={20} className="text-info" />
                <span className="text-sm">{t('common.info')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timesheet Statuses</CardTitle>
            <CardDescription>Document lifecycle states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Draft</span>
                <Badge variant="secondary">{t('timesheets.status.draft')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Submitted</span>
                <Badge variant="secondary">{t('timesheets.status.submitted')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Approved</span>
                <Badge variant="secondary">{t('timesheets.status.approved')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rejected</span>
                <Badge variant="secondary">{t('timesheets.status.rejected')}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Processed</span>
                <Badge variant="secondary">{t('timesheets.status.processed')}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
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
              <p className="text-sm text-muted-foreground">
                {t('notifications.unreadCount', { count: 5 })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('notifications.unreadCount', { count: 12 })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('notifications.unreadCount', { count: 0 })}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Change from period example:</p>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {t('metrics.changeFromLastPeriod', { change: '+15' })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('metrics.changeFromLastPeriod', { change: '-8' })}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('metrics.changeFromLastPeriod', { change: '+3.5' })}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-2">Validation messages:</p>
            <div className="space-y-1">
              <p className="text-sm text-destructive">
                {t('validation.minLength', { min: 8 })}
              </p>
              <p className="text-sm text-destructive">
                {t('validation.maxLength', { max: 50 })}
              </p>
              <p className="text-sm text-destructive">
                {t('validation.minValue', { min: 0 })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-info/50 bg-info/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info size={20} className="text-info" />
            Usage Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-1">In any component:</p>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
              <code>{`import { useTranslation } from '@/hooks/use-translation'

function MyComponent() {
  const { t } = useTranslation()
  
  return <h1>{t('navigation.dashboard')}</h1>
}`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">With parameters:</p>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
              <code>{`const unreadText = t('notifications.unreadCount', { count: 5 })
const changeText = t('metrics.changeFromLastPeriod', { change: '+12' })`}</code>
            </pre>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Change language:</p>
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
              <code>{`const { changeLocale } = useTranslation()
changeLocale('es') // Switch to Spanish
changeLocale('fr') // Switch to French`}</code>
            </pre>
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm font-medium">Translation files location:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <code className="bg-muted px-1 py-0.5 rounded">/src/data/translations/en.json</code> - English</li>
              <li>• <code className="bg-muted px-1 py-0.5 rounded">/src/data/translations/es.json</code> - Spanish</li>
              <li>• <code className="bg-muted px-1 py-0.5 rounded">/src/data/translations/fr.json</code> - French</li>
            </ul>
          </div>

          <Separator />

          <div>
            <p className="text-sm font-medium mb-1">Features:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>✓ Persistent language preference (saved to KV store)</li>
              <li>✓ Automatic fallback to English if translation missing</li>
              <li>✓ Parameter interpolation with {`{{variable}}`} syntax</li>
              <li>✓ Nested translation keys with dot notation</li>
              <li>✓ Language switcher in header</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TranslationItem({ label, translationKey }: { label: string; translationKey: string }) {
  const { t } = useTranslation()
  
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{t(translationKey)}</span>
    </div>
  )
}
