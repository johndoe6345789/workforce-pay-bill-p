import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { CheckCircle } from '@phosphor-icons/react'
import { TimesheetCard } from '@/components/TimesheetCard'
import type { Timesheet } from '@/lib/types'

interface TimesheetTabsProps {
  filteredTimesheets: Timesheet[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onAdjust: (timesheet: Timesheet) => void
  onViewDetails: (timesheet: Timesheet) => void
  onDelete?: (id: string) => void
}

export function TimesheetTabs({
  filteredTimesheets,
  onApprove,
  onReject,
  onCreateInvoice,
  onAdjust,
  onViewDetails,
  onDelete
}: TimesheetTabsProps) {
  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">
          Pending ({filteredTimesheets.filter(t => t.status === 'pending').length})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved ({filteredTimesheets.filter(t => t.status === 'approved').length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejected ({filteredTimesheets.filter(t => t.status === 'rejected').length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        {filteredTimesheets
          .filter(t => t.status === 'pending')
          .map(timesheet => (
            <TimesheetCard
              key={timesheet.id}
              timesheet={timesheet}
              onApprove={onApprove}
              onReject={onReject}
              onCreateInvoice={onCreateInvoice}
              onAdjust={onAdjust}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
            />
          ))}
        {filteredTimesheets.filter(t => t.status === 'pending').length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending timesheets to review</p>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="approved" className="space-y-4">
        {filteredTimesheets
          .filter(t => t.status === 'approved')
          .map(timesheet => (
            <TimesheetCard
              key={timesheet.id}
              timesheet={timesheet}
              onApprove={onApprove}
              onReject={onReject}
              onCreateInvoice={onCreateInvoice}
              onAdjust={onAdjust}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
            />
          ))}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4">
        {filteredTimesheets
          .filter(t => t.status === 'rejected')
          .map(timesheet => (
            <TimesheetCard
              key={timesheet.id}
              timesheet={timesheet}
              onApprove={onApprove}
              onReject={onReject}
              onCreateInvoice={onCreateInvoice}
              onAdjust={onAdjust}
              onViewDetails={onViewDetails}
              onDelete={onDelete}
            />
          ))}
      </TabsContent>
    </Tabs>
  )
}
