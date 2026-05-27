import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import type { DashboardCard } from '@/hooks/use-dashboard-config'

interface Props { card: DashboardCard; value: number }

export function FinancialCard({ card, value }: Props) {
  const { t } = useTranslation()
  const formatted = card.format === 'currency'
    ? `${card.currencySymbol || ''}${value.toLocaleString()}`
    : card.format === 'percentage'
      ? `${value.toFixed(card.decimals || 0)}%`
      : value.toLocaleString()

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">{t(card.titleKey)}</CardTitle>
        {card.descriptionKey && <CardDescription>{t(card.descriptionKey)}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold font-mono">{formatted}</div>
        {card.trend?.enabled && (
          <div className={cn('flex items-center gap-1 mt-2 text-sm', card.trend.color)}>
            {card.trend.direction === 'up' ? <ArrowUp size={16} weight="bold" /> : <ArrowDown size={16} weight="bold" />}
            <span>{t(card.trend.textKey, card.trend.textParams)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
