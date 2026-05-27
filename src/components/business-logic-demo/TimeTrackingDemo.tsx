import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTimeTracking } from '@/hooks'

const SHIFT_EXAMPLES = [
  { label: '09:00 - 17:00', start: '09:00', end: '17:00', break: 30 },
  { label: '22:00 - 06:00', start: '22:00', end: '06:00', break: 60 },
  { label: '14:00 - 22:00', start: '14:00', end: '22:00', break: 0 },
]

export function TimeTrackingDemo() {
  const { shiftPremiums, calculateShiftHours } = useTimeTracking()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle>Shift Premiums</CardTitle><CardDescription>Automatic rate multipliers for different shift types</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {shiftPremiums.map(premium => (
              <div key={premium.shiftType} className="flex items-center justify-between p-3 border rounded-lg">
                <div><p className="font-medium capitalize">{premium.shiftType.replace('-', ' ')}</p><p className="text-sm text-muted-foreground">{premium.description}</p></div>
                <Badge variant={premium.multiplier > 1.5 ? 'default' : 'secondary'}>{premium.multiplier.toFixed(2)}x</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Shift Calculator</CardTitle><CardDescription>Calculate hours with break deduction</CardDescription></CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {SHIFT_EXAMPLES.map(ex => (
              <div key={ex.label}>
                <span className="text-sm font-medium">Example: {ex.label}</span>
                <p className="text-muted-foreground">{ex.break ? `${ex.break} min break` : 'No break'}</p>
                <p className="text-lg font-bold mt-1">{calculateShiftHours(ex.start, ex.end, ex.break).toFixed(2)} hours</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
