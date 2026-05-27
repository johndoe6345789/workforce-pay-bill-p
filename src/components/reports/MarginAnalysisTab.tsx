import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { MarginAnalysis } from '@/lib/types'
import { MarginAnalysisChart } from '@/components/reports/MarginAnalysisChart'

interface Props {
  marginAnalysis: MarginAnalysis[]
  maxValue: number
  selectedYear: string
  onExport: () => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function MarginAnalysisTab({ marginAnalysis, maxValue, selectedYear, onExport, t }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t('reports.marginAnalysisTitle')}</CardTitle>
            <CardDescription>{t('reports.marginAnalysisDescription', { year: selectedYear })}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <MarginAnalysisChart marginAnalysis={marginAnalysis} maxValue={maxValue} t={t} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            {marginAnalysis.slice(-3).map(data => (
              <Card key={data.period}>
                <CardHeader className="pb-2"><CardTitle className="text-sm">{data.period} {selectedYear}</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('reports.revenue')}</span>
                    <span className="font-mono font-medium">£{data.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('reports.costs')}</span>
                    <span className="font-mono font-medium">£{data.costs.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-border">
                    <span className="text-muted-foreground font-medium">{t('reports.margin')}</span>
                    <div className="text-right">
                      <div className="font-mono font-semibold">£{data.margin.toLocaleString()}</div>
                      <div className={cn(
                        'text-xs font-medium',
                        data.marginPercentage >= 25 ? 'text-success' : data.marginPercentage >= 15 ? 'text-warning' : 'text-destructive'
                      )}>{data.marginPercentage.toFixed(1)}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
