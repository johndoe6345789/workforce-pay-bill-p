import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, ChartLine, Lightning } from '@phosphor-icons/react'
import type { MarginAnalysis, ForecastData } from '@/lib/types'
import { ForecastChartLegend } from '@/components/reports/ForecastChartLegend'
import { ForecastCardsGrid } from '@/components/reports/ForecastCardsGrid'
import { ForecastChart } from '@/components/reports/ForecastChart'

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
            <ForecastChart chartData={chartData} maxValue={maxValue} />

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
