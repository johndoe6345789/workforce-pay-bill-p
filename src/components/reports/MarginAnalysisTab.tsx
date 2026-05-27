import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { MarginAnalysis } from '@/lib/types'

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
          <div className="h-64 flex items-end justify-between gap-2">
            {marginAnalysis.map(data => {
              const revenueHeight = (data.revenue / maxValue) * 100
              const costsHeight = (data.costs / maxValue) * 100
              return (
                <div key={data.period} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center gap-1" style={{ height: '100%' }}>
                    <div className="flex flex-col justify-end w-full max-w-12">
                      <div
                        className="bg-accent rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                        style={{ height: `${revenueHeight}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                          £{data.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-end w-full max-w-12">
                      <div
                        className="bg-warning/60 rounded-t transition-all hover:opacity-80 cursor-pointer relative group"
                        style={{ height: `${costsHeight}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                          £{data.costs.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground">{data.period}</div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-accent rounded" /><span className="text-sm">{t('reports.revenue')}</span></div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 bg-warning/60 rounded" /><span className="text-sm">{t('reports.costs')}</span></div>
          </div>

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
