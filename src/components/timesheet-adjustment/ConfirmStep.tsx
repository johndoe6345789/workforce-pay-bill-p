import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { CurrencyDollar } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { Timesheet } from '@/lib/types'

interface Props {
  timesheet: Timesheet
  newHours: string
  newRate: string
  reason: string
  originalAmount: number
  newAmount: number
  difference: number
  issueCredit: boolean
}

export function ConfirmStep({ timesheet, newHours, newRate, reason, originalAmount, newAmount, difference, issueCredit }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Confirm Adjustment</CardTitle>
        <CardDescription>Review and confirm the changes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-semibold">Before</h4>
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Hours:</span><span className="font-mono">{timesheet.hours}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rate:</span><span className="font-mono">£{(timesheet.rate || 0).toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t"><span>Amount:</span><span className="font-mono">£{originalAmount.toFixed(2)}</span></div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold">After</h4>
            <div className="p-4 bg-accent/10 rounded-lg space-y-2">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Hours:</span><span className="font-mono">{newHours}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Rate:</span><span className="font-mono">£{parseFloat(newRate).toFixed(2)}</span></div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t"><span>Amount:</span><span className="font-mono">£{newAmount.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <Label className="text-muted-foreground text-xs">Reason</Label>
          <p className="text-sm mt-1">{reason}</p>
        </div>
        {difference !== 0 && (
          <div className={cn('p-4 rounded-lg', difference > 0 ? 'bg-warning/10' : 'bg-destructive/10')}>
            <div className="flex items-start gap-3">
              <CurrencyDollar size={20} className={difference > 0 ? 'text-warning' : 'text-destructive'} />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{difference > 0 ? 'Additional Invoice Required' : 'Credit Note Required'}</p>
                <p className="text-sm text-muted-foreground">
                  {difference > 0
                    ? `An additional invoice for £${difference.toFixed(2)} will be generated and sent to the client.`
                    : `A credit note for £${Math.abs(difference).toFixed(2)} will be generated ${issueCredit ? 'automatically' : 'for manual review'}.`
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
