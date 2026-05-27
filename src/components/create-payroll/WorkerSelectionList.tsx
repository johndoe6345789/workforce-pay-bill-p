import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { Timesheet, Worker } from '@/lib/types'

interface Props {
  eligibleWorkers: Worker[]
  approvedTimesheets: Timesheet[]
  selectedWorkers: Set<string>
  onToggle: (workerId: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}

export function WorkerSelectionList({ eligibleWorkers, approvedTimesheets, selectedWorkers, onToggle, onSelectAll, onDeselectAll }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label>Select Workers</Label>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={onSelectAll}>Select All</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDeselectAll}>Clear</Button>
        </div>
      </div>
      <div className="border rounded-lg max-h-64 overflow-y-auto">
        {eligibleWorkers.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">No eligible workers found for this period</div>
        ) : (
          <div className="divide-y">
            {eligibleWorkers.map(worker => {
              const workerTimesheets = approvedTimesheets.filter(ts => ts.workerId === worker.id)
              const workerAmount = workerTimesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0)
              return (
                <div key={worker.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer" onClick={() => onToggle(worker.id)}>
                  <Checkbox checked={selectedWorkers.has(worker.id)} onCheckedChange={() => onToggle(worker.id)} />
                  <div className="flex-1">
                    <div className="font-medium">{worker.name}</div>
                    <div className="text-sm text-muted-foreground">{workerTimesheets.length} timesheet{workerTimesheets.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">£{workerAmount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</div>
                    <Badge variant="outline" className="text-xs">{worker.type}</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
