import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, ChartLine, Lightning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { MarginAnalysis, ForecastData } from '@/lib/types'
import { ForecastChartLegend } from '@/components/reports/ForecastChartLegend'
import { ForecastCardsGrid } from '@/components/reports/ForecastCardsGrid'

interface Props {
  marginAnalysis: MarginAnalysis[]
  forecast: ForecastData[]
  maxValue: number
  selectedYear: string
  onExport: () => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ForecastingTab({ marginAnalysis, forecast, maxValue, selectedYear, onExport, t }: Props) {
  const chartData = [...marginAnalysis.slice(-2), ...forecast]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Lightning size={20} weight="fill" className="text-accent" />
              {t('reports.forecastingTitle')}
            </CardTitle>
            <CardDescription>{t('reports.forecastingDescription')}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onExport} disabled={forecast.length === 0}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {forecast.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ChartLine size={48} className="mx-auto mb-4 opacity-50" />
            <p>{t('reports.notEnoughData')}</p>
            <p className="text-sm mt-2">{t('reports.notEnoughDataDescription')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData.map((data, index) => {
                const isHistorical = index < 2
                const revenue = isHistorical ? (data as MarginAnalysis).revenue : (data as ForecastData).predictedRevenue
                const costs = isHistorical ? (data as MarginAnalysis).costs : (data as ForecastData).predictedCosts
                return (
                  <div key={data.period} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex justify-center gap-1" style={{ height: '100%' }}>
                      <div className="flex flex-col justify-end w-full max-w-12">
                        <div
                          className={cn('rounded-t transition-all hover:opacity-80 cursor-pointer relative group', isHistorical ? 'bg-accent' : 'bg-accent/40 border-2 border-dashed border-accent')}
                          style={{ height: `${(revenue / maxValue) * 100}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                            £{revenue.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-end w-full max-w-12">
                        <div
                          className={cn('rounded-t transition-all hover:opacity-80 cursor-pointer relative group', isHistorical ? 'bg-warning/60' : 'bg-warning/20 border-2 border-dashed border-warning')}
                          style={{ height: `${(costs / maxValue) * 100}%` }}
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                            £{costs.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground">{data.period}</div>
                    {!isHistorical && <div className="text-xs text-accent font-medium">{(data as ForecastData).confidence}%</div>}
                  </div>
                )
              })}
            </div>

            <ForecastChartLegend t={t} />
            <ForecastCardsGrid forecast={forecast} selectedYear={selectedYear} t={t} />

            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Lightning size={20} className="text-accent mt-0.5" weight="fill" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium mb-1">{t('reports.forecastMethodology')}</p>
                    <p className="text-muted-foreground">{t('reports.forecastMethodologyDescription')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
