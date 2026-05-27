import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CurrencyDollar, ArrowsClockwise, TrendUp, TrendDown, CheckCircle } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { CurrencyRate } from '@/lib/types'

interface Props {
  currency: CurrencyRate
  rateChange: number
  onUpdateRate: (code: string) => void
  onRemove: (code: string) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function CurrencyRateCard({ currency, rateChange, onUpdateRate, onRemove, t }: Props) {
  const isBase = currency.code === 'GBP'

  return (
    <Card className={cn(isBase && 'border-primary/50')}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <CurrencyDollar size={24} weight="fill" className="text-accent" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{currency.code}</h3>
                {isBase && <Badge variant="outline">{t('currency.baseCurrency')}</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">{currency.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">{t('currency.exchangeRate')}</div>
              <div className="font-mono font-semibold text-lg">1 {currency.code} = {currency.rateToGBP.toFixed(4)} GBP</div>
              {!isBase && (
                <div className={cn('flex items-center gap-1 text-xs mt-1', rateChange >= 0 ? 'text-success' : 'text-destructive')}>
                  {rateChange >= 0 ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
                  <span>{Math.abs(rateChange).toFixed(2)}% {t('currency.vsYesterday')}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">{t('currency.symbol')}</div>
              <div className="font-semibold text-2xl">{currency.symbol}</div>
            </div>
            <div className="flex gap-2">
              {!isBase ? (
                <>
                  <Button size="sm" variant="outline" onClick={() => onUpdateRate(currency.code)}><ArrowsClockwise size={16} /></Button>
                  <Button size="sm" variant="outline" onClick={() => onRemove(currency.code)}>{t('currency.remove')}</Button>
                </>
              ) : (
                <Button size="sm" variant="outline" disabled><CheckCircle size={16} className="mr-2" />{t('currency.active')}</Button>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">{t('currency.quickConversions')}</div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div><span className="text-muted-foreground">100 {currency.code}</span><span className="ml-2 font-mono font-medium">= £{(100 * currency.rateToGBP).toFixed(2)}</span></div>
            <div><span className="text-muted-foreground">1,000 {currency.code}</span><span className="ml-2 font-mono font-medium">= £{(1000 * currency.rateToGBP).toFixed(2)}</span></div>
            <div><span className="text-muted-foreground">£100</span><span className="ml-2 font-mono font-medium">= {currency.symbol}{(100 / currency.rateToGBP).toFixed(2)}</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
