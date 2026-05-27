import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Warning, ClockCounterClockwise } from '@phosphor-icons/react'
import type { MissingTimesheetReport } from '@/lib/types'
import type React from 'react'

interface SummaryCard {
  Icon: React.ElementType
  iconClass: string
  borderClass: string
  label: string
  min: number
  max?: number
  note: string
}

const SUMMARY_CARDS: SummaryCard[] = [
  { Icon: Warning, iconClass: 'text-destructive', borderClass: 'border-destructive/20', label: 'Critical (14+ days)', min: 14, note: 'Requires immediate action' },
  { Icon: ClockCounterClockwise, iconClass: 'text-warning', borderClass: 'border-warning/20', label: 'Overdue (7-13 days)', min: 7, max: 14, note: 'Follow-up needed' },
  { Icon: ClockCounterClockwise, iconClass: 'text-info', borderClass: 'border-info/20', label: 'Recent (0-6 days)', min: 0, max: 7, note: 'Within normal range' },
]

interface Props { reports: MissingTimesheetReport[] }

export function MissingTimesheetsSummary({ reports }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {SUMMARY_CARDS.map(({ Icon, iconClass, borderClass, label, min, max, note }) => {
        const count = reports.filter(r => r.daysOverdue >= min && (max === undefined || r.daysOverdue < max)).length
        return (
          <Card key={label} className={`border-l-4 ${borderClass}`}>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon size={18} className={iconClass} weight="fill" />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{count}</div>
              <p className="text-sm text-muted-foreground mt-1">{note}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
