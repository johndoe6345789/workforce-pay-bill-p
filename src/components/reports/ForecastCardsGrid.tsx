import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightning } from '@phosphor-icons/react'
import type { ForecastData } from '@/lib/types'

interface Props {
  forecast: ForecastData[]
  selectedYear: string
  t: (key: string) => string
}

export function ForecastCardsGrid({ forecast, selectedYear, t }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
      {forecast.map(data => {
        const margin = data.predictedRevenue - data.predictedCosts
        const marginPercentage = (margin / data.predictedRevenue) * 100
        return (
          <Card key={data.period} className="border-dashed border-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{data.period} {selectedYear}</CardTitle>
                <div className="flex items-center gap-1 text-xs text-accent font-medium">
                  <Lightning size={12} weight="fill" />{data.confidence}%
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('reports.predictedRevenue')}</span>
                <span className="font-mono font-medium">£{data.predictedRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('reports.predictedCosts')}</span>
                <span className="font-mono font-medium">£{data.predictedCosts.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground font-medium">{t('reports.estMargin')}</span>
                <div className="text-right">
                  <div className="font-mono font-semibold">£{margin.toLocaleString()}</div>
                  <div className="text-xs font-medium text-accent">{marginPercentage.toFixed(1)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
