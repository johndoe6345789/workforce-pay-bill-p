import type { MarginAnalysis } from '@/lib/types'

interface Props {
  marginAnalysis: MarginAnalysis[]
  maxValue: number
  t: (key: string) => string
}

export function MarginAnalysisChart({ marginAnalysis, maxValue, t }: Props) {
  return (
    <>
      <div className="h-64 flex items-end justify-between gap-2">
        {marginAnalysis.map(data => {
          const revenueHeight = (data.revenue / maxValue) * 100
          const costsHeight = (data.costs / maxValue) * 100
          return (
            <div key={data.period} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex justify-center gap-1" style={{ height: '100%' }}>
                <div className="flex flex-col justify-end w-full max-w-12">
                  <div className="bg-accent rounded-t transition-all hover:opacity-80 cursor-pointer relative group" style={{ height: `${revenueHeight}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover border border-border rounded px-2 py-1 text-xs whitespace-nowrap pointer-events-none z-10">
                      £{data.revenue.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-end w-full max-w-12">
                  <div className="bg-warning/60 rounded-t transition-all hover:opacity-80 cursor-pointer relative group" style={{ height: `${costsHeight}%` }}>
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
    </>
  )
}
