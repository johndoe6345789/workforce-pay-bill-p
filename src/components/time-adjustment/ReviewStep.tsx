import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, WarningCircle } from '@phosphor-icons/react'
import { ADJUSTMENT_REASONS } from '@/hooks/useTimeAdjustmentWizard'

interface Timesheet { hoursWorked: number; rate: number }
interface Calculations { originalTotal: number; newHours: number; newRate: number; newTotal: number; difference: number; requiresApproval: boolean }

interface Props {
  timesheet: Timesheet
  adjustmentType: 'time' | 'rate' | 'both'
  adjustmentReason: string
  notes: string
  calculations: Calculations
}

export function ReviewStep({ timesheet, adjustmentType, adjustmentReason, notes, calculations }: Props) {
  const { originalTotal, newHours, newRate, newTotal, difference, requiresApproval } = calculations
  const showHours = adjustmentType === 'time' || adjustmentType === 'both'
  const showRate = adjustmentType === 'rate' || adjustmentType === 'both'
  const reasonLabel = ADJUSTMENT_REASONS.find(r => r.value === adjustmentReason)?.label

  return (
    <div className="space-y-4">
      <Alert className={requiresApproval ? 'border-warning' : 'border-success'}>
        {requiresApproval ? <WarningCircle className="text-warning" /> : <CheckCircle className="text-success" />}
        <AlertDescription>
          <div className="font-medium">{requiresApproval ? 'Approval Required' : 'No Approval Required'}</div>
          <div className="text-sm mt-1">
            {requiresApproval
              ? 'This adjustment exceeds threshold limits and will require manager approval before being applied.'
              : 'This adjustment is within acceptable limits and will be applied immediately.'}
          </div>
        </AlertDescription>
      </Alert>

      <Card className="p-4 space-y-3">
        <div className="font-medium">Adjustment Summary</div>
        <Separator />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Adjustment Type</div>
            <div className="font-medium capitalize">{adjustmentType === 'both' ? 'Time & Rate' : adjustmentType}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Reason</div>
            <div className="font-medium">{reasonLabel}</div>
          </div>
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          {showHours && (
            <div className="flex justify-between">
              <span>Hours:</span>
              <span className="font-medium">
                {timesheet.hoursWorked}h → {newHours}h
                <Badge variant="outline" className="ml-2">{newHours > timesheet.hoursWorked ? '+' : ''}{(newHours - timesheet.hoursWorked).toFixed(2)}h</Badge>
              </span>
            </div>
          )}
          {showRate && (
            <div className="flex justify-between">
              <span>Rate:</span>
              <span className="font-medium">
                £{timesheet.rate.toFixed(2)}/h → £{newRate.toFixed(2)}/h
                <Badge variant="outline" className="ml-2">{newRate > timesheet.rate ? '+' : ''}£{(newRate - timesheet.rate).toFixed(2)}</Badge>
              </span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex justify-between text-sm font-medium">
          <span>Total Impact:</span>
          <span className={difference >= 0 ? 'text-success' : 'text-destructive'}>
            £{originalTotal.toFixed(2)} → £{newTotal.toFixed(2)}
            <Badge variant={difference >= 0 ? 'default' : 'destructive'} className="ml-2">{difference >= 0 ? '+' : ''}£{difference.toFixed(2)}</Badge>
          </span>
        </div>
        {notes && (
          <>
            <Separator />
            <div className="space-y-1">
              <div className="text-muted-foreground text-xs">Notes:</div>
              <div className="text-sm">{notes}</div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
