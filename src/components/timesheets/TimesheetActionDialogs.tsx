import { TimesheetDetailDialog } from '@/components/TimesheetDetailDialog'
import { TimeAndRateAdjustmentWizard, type TimeAndRateAdjustment } from '@/components/TimeAndRateAdjustmentWizard'
import type { Timesheet } from '@/lib/types'

interface Props {
  viewingTimesheet: Timesheet | null
  setViewingTimesheet: (t: Timesheet | null) => void
  selectedTimesheet: Timesheet | null
  setSelectedTimesheet: (t: Timesheet | null) => void
  onAdjustSubmit: (adj: TimeAndRateAdjustment) => Promise<void>
}

export function TimesheetActionDialogs({
  viewingTimesheet, setViewingTimesheet,
  selectedTimesheet, setSelectedTimesheet,
  onAdjustSubmit,
}: Props) {
  return (
    <>
      <TimesheetDetailDialog
        timesheet={viewingTimesheet}
        open={viewingTimesheet !== null}
        onOpenChange={open => { if (!open) setViewingTimesheet(null) }}
      />
      {selectedTimesheet && (
        <TimeAndRateAdjustmentWizard
          timesheet={{ id: selectedTimesheet.id, workerId: selectedTimesheet.workerId, workerName: selectedTimesheet.workerName, clientName: selectedTimesheet.clientName, hoursWorked: selectedTimesheet.hours, rate: selectedTimesheet.rate || 0, status: selectedTimesheet.status }}
          open={selectedTimesheet !== null}
          onOpenChange={open => { if (!open) setSelectedTimesheet(null) }}
          onSubmit={onAdjustSubmit}
        />
      )}
    </>
  )
}
