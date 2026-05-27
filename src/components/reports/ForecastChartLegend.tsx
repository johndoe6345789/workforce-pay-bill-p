import { cn } from '@/lib/utils'

const LEGEND_ITEMS = [
  { color: 'bg-accent',                                           labelKey: 'reports.actualRevenue' },
  { color: 'bg-accent/40 border-2 border-dashed border-accent',  labelKey: 'reports.predictedRevenue' },
  { color: 'bg-warning/60',                                       labelKey: 'reports.actualCosts' },
  { color: 'bg-warning/20 border-2 border-dashed border-warning', labelKey: 'reports.predictedCosts' },
]

interface Props {
  t: (key: string) => string
}

export function ForecastChartLegend({ t }: Props) {
  return (
    <div className="flex items-center justify-center gap-6 pt-4 border-t border-border flex-wrap">
      {LEGEND_ITEMS.map(({ color, labelKey }) => (
        <div key={labelKey} className="flex items-center gap-2">
          <div className={cn('w-4 h-4 rounded', color)} />
          <span className="text-sm">{t(labelKey)}</span>
        </div>
      ))}
    </div>
  )
}
