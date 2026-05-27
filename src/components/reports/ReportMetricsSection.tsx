import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface Props {
  metrics: string[]
  availableMetrics: string[]
  onToggle: (metric: string) => void
}

export function ReportMetricsSection({ metrics, availableMetrics, onToggle }: Props) {
  return (
    <div className="space-y-3">
      <Label>Metrics to Include</Label>
      <div className="space-y-2">
        {availableMetrics.map(metric => (
          <div key={metric} className="flex items-center space-x-2">
            <Checkbox
              id={metric}
              checked={metrics.includes(metric)}
              onCheckedChange={() => onToggle(metric)}
            />
            <label htmlFor={metric} className="text-sm font-medium capitalize cursor-pointer">
              {metric}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
