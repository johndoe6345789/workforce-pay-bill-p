import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Warning } from '@phosphor-icons/react'
import type { Timesheet } from '@/lib/types'

interface Props {
  timesheet: Timesheet
}

export function ReviewStep({ timesheet }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Review Original Timesheet</CardTitle>
        <CardDescription>Verify the details before making adjustments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-muted-foreground">Worker</Label><p className="font-medium">{timesheet.workerName}</p></div>
          <div><Label className="text-muted-foreground">Client</Label><p className="font-medium">{timesheet.clientName}</p></div>
          <div><Label className="text-muted-foreground">Week Ending</Label><p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p></div>
          <div>
            <Label className="text-muted-foreground">Status</Label>
            <Badge variant={timesheet.status === 'approved' ? 'success' : 'warning'}>{timesheet.status}</Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
          <div><Label className="text-muted-foreground">Hours</Label><p className="font-semibold text-lg font-mono">{timesheet.hours}</p></div>
          <div><Label className="text-muted-foreground">Rate</Label><p className="font-semibold text-lg font-mono">£{(timesheet.rate || 0).toFixed(2)}</p></div>
          <div><Label className="text-muted-foreground">Amount</Label><p className="font-semibold text-lg font-mono">£{timesheet.amount.toFixed(2)}</p></div>
        </div>
        {timesheet.adjustments && timesheet.adjustments.length > 0 && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Warning size={18} className="text-warning" />
              <p className="font-semibold text-sm">Previous Adjustments</p>
            </div>
            <div className="space-y-2">
              {timesheet.adjustments.map(adj => (
                <div key={adj.id} className="text-sm text-muted-foreground">
                  {new Date(adj.adjustmentDate).toLocaleDateString()}: {adj.reason}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
