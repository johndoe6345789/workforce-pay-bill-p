import { cn } from '@/lib/utils'
import type { MarginAnalysis, ForecastData } from '@/lib/types'

interface Props {
  chartData: (MarginAnalysis | ForecastData)[]
  maxValue: number
}

export function ForecastChart({ chartData, maxValue }: Props) {
  return (
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
  )
}
