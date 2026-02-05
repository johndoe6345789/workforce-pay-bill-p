import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Receipt, Pencil, Eye, Trash, Warning } from '@phosphor-icons/react'
import { AdvancedDataTable } from '@/components/AdvancedDataTable'
import { TableColumn } from '@/hooks/use-advanced-table'
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
  const pendingTimesheets = useMemo(() => 
    filteredTimesheets.filter(t => t.status === 'pending'),
    [filteredTimesheets]
  )

  const approvedTimesheets = useMemo(() => 
    filteredTimesheets.filter(t => t.status === 'approved'),
    [filteredTimesheets]
  )

  const rejectedTimesheets = useMemo(() => 
    filteredTimesheets.filter(t => t.status === 'rejected'),
    [filteredTimesheets]
  )

  const columns: TableColumn<Timesheet>[] = useMemo(() => [
    {
      key: 'workerName',
      label: 'Worker',
      sortable: true,
    },
    {
      key: 'clientName',
      label: 'Client',
      sortable: true,
    },
    {
      key: 'weekEnding',
      label: 'Week Ending',
      sortable: true,
      render: (value) => new Date(value as string).toLocaleDateString()
    },
    {
      key: 'hours',
      label: 'Hours',
      sortable: true,
      render: (value) => `${value}h`
    },
    {
      key: 'rate',
      label: 'Rate',
      sortable: true,
      render: (value) => value ? `£${(value as number).toFixed(2)}` : '—'
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value) => `£${(value as number).toLocaleString()}`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <Badge variant={
          value === 'approved' ? 'success' : 
          value === 'rejected' ? 'destructive' : 
          'warning'
        }>
          {value as string}
        </Badge>
      )
    },
    {
      key: 'id',
      label: 'Actions',
      sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(row)}
            title="View Details"
          >
            <Eye size={16} />
          </Button>
          {row.status === 'pending' && (
            <>
              <Button
                size="sm"
                variant="ghost"
                className="text-success hover:text-success"
                onClick={() => onApprove(row.id)}
                title="Approve"
              >
                <CheckCircle size={16} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => onReject(row.id)}
                title="Reject"
              >
                <XCircle size={16} />
              </Button>
            </>
          )}
          {row.status === 'approved' && (
            <Button
              size="sm"
              variant="ghost"
              className="text-primary hover:text-primary"
              onClick={() => onCreateInvoice(row.id)}
              title="Create Invoice"
            >
              <Receipt size={16} />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAdjust(row)}
            title="Adjust"
          >
            <Pencil size={16} />
          </Button>
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => onDelete(row.id)}
              title="Delete"
            >
              <Trash size={16} />
            </Button>
          )}
        </div>
      )
    }
  ], [onApprove, onReject, onCreateInvoice, onAdjust, onViewDetails, onDelete])

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">
          Pending ({pendingTimesheets.length})
        </TabsTrigger>
        <TabsTrigger value="approved">
          Approved ({approvedTimesheets.length})
        </TabsTrigger>
        <TabsTrigger value="rejected">
          Rejected ({rejectedTimesheets.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pending">
        <AdvancedDataTable
          data={pendingTimesheets}
          columns={columns}
          rowKey="id"
          onRowClick={onViewDetails}
          rowClassName={(row: Timesheet) => {
            const hasErrors = (row as any).validationErrors?.length > 0
            const hasWarnings = (row as any).validationWarnings?.length > 0
            return hasErrors ? 'bg-destructive/5' : hasWarnings ? 'bg-warning/5' : ''
          }}
          emptyMessage="All caught up! No pending timesheets to review."
          showSearch={true}
          showPagination={true}
          initialPageSize={20}
        />
      </TabsContent>

      <TabsContent value="approved">
        <AdvancedDataTable
          data={approvedTimesheets}
          columns={columns}
          rowKey="id"
          onRowClick={onViewDetails}
          emptyMessage="No approved timesheets."
          showSearch={true}
          showPagination={true}
          initialPageSize={20}
        />
      </TabsContent>

      <TabsContent value="rejected">
        <AdvancedDataTable
          data={rejectedTimesheets}
          columns={columns}
          rowKey="id"
          onRowClick={onViewDetails}
          emptyMessage="No rejected timesheets."
          showSearch={true}
          showPagination={true}
          initialPageSize={20}
        />
      </TabsContent>
    </Tabs>
  )
}
