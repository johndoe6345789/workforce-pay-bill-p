import { Card, CardContent } from '@/components/ui/card'
import type { RateCard } from '@/lib/types'

const RATE_FIELDS = [
  { label: 'Standard', multiplier: (rc: RateCard) => 1 },
  { label: 'Overtime', multiplier: (rc: RateCard) => rc.overtimeMultiplier },
  { label: 'Weekend', multiplier: (rc: RateCard) => rc.weekendMultiplier },
  { label: 'Night', multiplier: (rc: RateCard) => rc.nightMultiplier },
  { label: 'Holiday', multiplier: (rc: RateCard) => rc.holidayMultiplier },
]

interface Props {
  rateCard: RateCard
}

export function RateCardSummary({ rateCard }: Props) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-3 text-sm">
          {RATE_FIELDS.map(({ label, multiplier }) => (
            <div key={label}>
              <p className="text-muted-foreground">{label}</p>
              <p className="font-semibold font-mono">£{(rateCard.standardRate * multiplier(rateCard)).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
