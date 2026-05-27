import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowUp, ArrowDown } from '@phosphor-icons/react'

type Color = 'success' | 'primary' | 'accent'

interface Props {
  title: string
  description: string
  value: string
  changePercent: number
  color: Color
  progressValue?: number
}

export function DashboardFinancialCard({ title, description, value, changePercent, color, progressValue }: Props) {
  const isPositive = changePercent >= 0
  const TrendIcon = isPositive ? ArrowUp : ArrowDown
  const colorClass = `text-${color}`
  const badgeClass = `${colorClass} border-${color}/30 bg-${color}/10`

  return (
    <Card className={`border-l-4 border-l-${color}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge variant="outline" className={badgeClass}>
            <TrendIcon size={12} weight="bold" className="mr-1" />
            {Math.abs(changePercent)}%
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold tracking-tight font-mono ${colorClass}`}>{value}</div>
        {progressValue !== undefined && <Progress value={progressValue} className="mt-3 h-2" />}
      </CardContent>
    </Card>
  )
}
