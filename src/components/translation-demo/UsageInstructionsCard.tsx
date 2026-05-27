import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Info } from '@phosphor-icons/react'
import { Separator } from '@/components/ui/separator'

export function UsageInstructionsCard() {
  return (
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
  )
}
