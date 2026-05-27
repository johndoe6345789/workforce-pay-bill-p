import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from '@phosphor-icons/react'

interface Timesheet { hoursWorked: number; rate: number }
interface Calculations { originalTotal: number; newTotal: number; difference: number; percentageChange: string }

interface Props {
  timesheet: Timesheet
  adjustmentType: 'time' | 'rate' | 'both'
  adjustedHours: string
  setAdjustedHours: (v: string) => void
  adjustedRate: string
  setAdjustedRate: (v: string) => void
  calculations: Calculations
}

export function ValuesStep({ timesheet, adjustmentType, adjustedHours, setAdjustedHours, adjustedRate, setAdjustedRate, calculations }: Props) {
  const { originalTotal, newTotal, difference, percentageChange } = calculations
  const showHours = adjustmentType === 'time' || adjustmentType === 'both'
  const showRate = adjustmentType === 'rate' || adjustmentType === 'both'

  return (
    <div className="space-y-4">
      {showHours && (
        <div className="space-y-2">
          <Label htmlFor="adjusted-hours">Adjusted Hours</Label>
          <Input id="adjusted-hours" type="number" step="0.25" min="0" placeholder={timesheet.hoursWorked.toString()} value={adjustedHours} onChange={e => setAdjustedHours(e.target.value)} />
          <div className="text-xs text-muted-foreground">
            Original: {timesheet.hoursWorked}h
            {adjustedHours && (
              <span className={parseFloat(adjustedHours) > timesheet.hoursWorked ? 'text-success' : 'text-warning'}>
                {' '}→ {adjustedHours}h ({parseFloat(adjustedHours) > timesheet.hoursWorked ? '+' : ''}{(parseFloat(adjustedHours) - timesheet.hoursWorked).toFixed(2)}h)
              </span>
            )}
          </div>
        </div>
      )}

      {showRate && (
        <div className="space-y-2">
          <Label htmlFor="adjusted-rate">Adjusted Rate (£/hour)</Label>
          <Input id="adjusted-rate" type="number" step="0.01" min="0" placeholder={timesheet.rate.toString()} value={adjustedRate} onChange={e => setAdjustedRate(e.target.value)} />
          <div className="text-xs text-muted-foreground">
            Original: £{timesheet.rate.toFixed(2)}/h
            {adjustedRate && (
              <span className={parseFloat(adjustedRate) > timesheet.rate ? 'text-success' : 'text-warning'}>
                {' '}→ £{parseFloat(adjustedRate).toFixed(2)}/h ({parseFloat(adjustedRate) > timesheet.rate ? '+' : ''}£{(parseFloat(adjustedRate) - timesheet.rate).toFixed(2)})
              </span>
            )}
          </div>
        </div>
      )}

      {(adjustedHours || adjustedRate) && (
        <Alert>
          <Info />
          <AlertDescription>
            <div className="space-y-1">
              <div className="font-medium">Impact Summary</div>
              <div className="text-sm">Original Total: £{originalTotal.toFixed(2)}</div>
              <div className="text-sm">New Total: £{newTotal.toFixed(2)}</div>
              <div className={`text-sm font-medium ${difference >= 0 ? 'text-success' : 'text-destructive'}`}>
                Difference: {difference >= 0 ? '+' : ''}£{difference.toFixed(2)} ({difference >= 0 ? '+' : ''}{percentageChange}%)
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
