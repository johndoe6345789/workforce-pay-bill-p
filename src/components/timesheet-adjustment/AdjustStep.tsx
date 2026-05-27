import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Timesheet } from '@/lib/types'

interface Props {
  timesheet: Timesheet
  newHours: string
  setNewHours: (v: string) => void
  newRate: string
  setNewRate: (v: string) => void
  isValid: boolean
  originalAmount: number
  newAmount: number
  difference: number
  percentageChange: number
}

export function AdjustStep({ timesheet, newHours, setNewHours, newRate, setNewRate, isValid, originalAmount, newAmount, difference, percentageChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Adjust Values</CardTitle>
        <CardDescription>Enter new hours and/or rate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <Label className="text-muted-foreground text-xs">Original Hours</Label>
              <p className="font-semibold text-2xl font-mono">{timesheet.hours}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-hours">New Hours</Label>
              <Input id="new-hours" type="number" step="0.5" value={newHours} onChange={e => setNewHours(e.target.value)} className="text-lg font-mono" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <Label className="text-muted-foreground text-xs">Original Rate</Label>
              <p className="font-semibold text-2xl font-mono">£{(timesheet.rate || 0).toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-rate">New Rate (£/hr)</Label>
              <Input id="new-rate" type="number" step="0.01" value={newRate} onChange={e => setNewRate(e.target.value)} className="text-lg font-mono" />
            </div>
          </div>
        </div>
        {isValid && (
          <div className={cn('p-4 rounded-lg border-l-4', difference > 0 ? 'bg-warning/10 border-warning' : difference < 0 ? 'bg-destructive/10 border-destructive' : 'bg-success/10 border-success')}>
            <div className="grid grid-cols-3 gap-4">
              <div><Label className="text-muted-foreground text-xs">Original Amount</Label><p className="font-semibold font-mono">£{originalAmount.toFixed(2)}</p></div>
              <div><Label className="text-muted-foreground text-xs">New Amount</Label><p className="font-semibold font-mono">£{newAmount.toFixed(2)}</p></div>
              <div>
                <Label className="text-muted-foreground text-xs">Difference</Label>
                <p className={cn('font-semibold font-mono', difference > 0 ? 'text-warning' : difference < 0 ? 'text-destructive' : 'text-success')}>
                  {difference >= 0 ? '+' : ''}£{difference.toFixed(2)}
                  <span className="text-xs ml-1">({percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%)</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
