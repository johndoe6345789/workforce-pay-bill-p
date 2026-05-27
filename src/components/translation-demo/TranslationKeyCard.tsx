import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/hooks/use-translation'

interface Item { label: string; translationKey: string }

interface Props { title: string; description: string; items: Item[] }

function TranslationItem({ label, translationKey }: Item) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{t(translationKey)}</span>
    </div>
  )
}

export function TranslationKeyCard({ title, description, items }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {items.map(item => <TranslationItem key={item.translationKey} {...item} />)}
        </div>
      </CardContent>
    </Card>
  )
}
