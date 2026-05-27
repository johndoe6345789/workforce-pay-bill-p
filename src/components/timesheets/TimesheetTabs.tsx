import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdvancedDataTable } from '@/components/AdvancedDataTable'
import type { Timesheet } from '@/lib/types'
import { useTimesheetColumns } from '@/hooks/useTimesheetColumns'

interface Props {
  filteredTimesheets: Timesheet[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onAdjust: (timesheet: Timesheet) => void
  onViewDetails: (timesheet: Timesheet) => void
  onDelete?: (id: string) => void
}

const pendingRowClass = (row: Timesheet) => {
  const r = row as any
  return r.validationErrors?.length > 0 ? 'bg-destructive/5' : r.validationWarnings?.length > 0 ? 'bg-warning/5' : ''
}

export function TimesheetTabs({ filteredTimesheets, onApprove, onReject, onCreateInvoice, onAdjust, onViewDetails, onDelete }: Props) {
  const columns = useTimesheetColumns({ onApprove, onReject, onCreateInvoice, onAdjust, onViewDetails, onDelete })

  const tabs = useMemo(() => [
    { value: 'pending',  data: filteredTimesheets.filter(t => t.status === 'pending'),  label: 'Pending',  emptyMessage: 'All caught up! No pending timesheets to review.', rowClassName: pendingRowClass },
    { value: 'approved', data: filteredTimesheets.filter(t => t.status === 'approved'), label: 'Approved', emptyMessage: 'No approved timesheets.' },
    { value: 'rejected', data: filteredTimesheets.filter(t => t.status === 'rejected'), label: 'Rejected', emptyMessage: 'No rejected timesheets.' },
  ], [filteredTimesheets])

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        {tabs.map(({ value, label, data }) => (
          <TabsTrigger key={value} value={value}>{label} ({data.length})</TabsTrigger>
        ))}
      </TabsList>

      {tabs.map(({ value, data, emptyMessage, rowClassName }) => (
        <TabsContent key={value} value={value}>
          <AdvancedDataTable
            data={data}
            columns={columns}
            rowKey="id"
            onRowClick={onViewDetails}
            rowClassName={rowClassName}
            emptyMessage={emptyMessage}
            showSearch
            showPagination
            initialPageSize={20}
          />
        </TabsContent>
      ))}
    </Tabs>
  )
}
