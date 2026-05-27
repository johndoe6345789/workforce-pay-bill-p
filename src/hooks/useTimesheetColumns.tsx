import { useMemo } from 'react'
import { CheckCircle, XCircle, Receipt, Pencil, Eye, Trash } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { TableColumn } from '@/hooks/use-advanced-table'
import type { Timesheet } from '@/lib/types'

const STATUS_BADGE_VARIANT: Record<string, 'success' | 'destructive' | 'warning'> = {
  approved: 'success',
  rejected: 'destructive',
}

interface Callbacks {
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onAdjust: (ts: Timesheet) => void
  onViewDetails: (ts: Timesheet) => void
  onDelete?: (id: string) => void
}

export function useTimesheetColumns(cbs: Callbacks): TableColumn<Timesheet>[] {
  return useMemo(() => [
    { key: 'workerName', label: 'Worker', sortable: true },
    { key: 'clientName', label: 'Client', sortable: true },
    {
      key: 'weekEnding', label: 'Week Ending', sortable: true,
      render: (v) => new Date(v as string).toLocaleDateString(),
    },
    { key: 'hours', label: 'Hours', sortable: true, render: (v) => `${v}h` },
    {
      key: 'rate', label: 'Rate', sortable: true,
      render: (v) => v ? `£${(v as number).toFixed(2)}` : '—',
    },
    {
      key: 'amount', label: 'Amount', sortable: true,
      render: (v) => `£${(v as number).toLocaleString()}`,
    },
    {
      key: 'status', label: 'Status', sortable: true,
      render: (v) => (
        <Badge variant={STATUS_BADGE_VARIANT[v as string] ?? 'warning'}>{v as string}</Badge>
      ),
    },
    {
      key: 'id', label: 'Actions', sortable: false,
      render: (_, row) => (
        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
          <Button size="sm" variant="ghost" onClick={() => cbs.onViewDetails(row)} title="View Details">
            <Eye size={16} />
          </Button>
          {row.status === 'pending' && (
            <>
              <Button size="sm" variant="ghost" className="text-success hover:text-success" onClick={() => cbs.onApprove(row.id)} title="Approve">
                <CheckCircle size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => cbs.onReject(row.id)} title="Reject">
                <XCircle size={16} />
              </Button>
            </>
          )}
          {row.status === 'approved' && (
            <Button size="sm" variant="ghost" className="text-primary hover:text-primary" onClick={() => cbs.onCreateInvoice(row.id)} title="Create Invoice">
              <Receipt size={16} />
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={() => cbs.onAdjust(row)} title="Adjust">
            <Pencil size={16} />
          </Button>
          {cbs.onDelete && (
            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => cbs.onDelete!(row.id)} title="Delete">
              <Trash size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ], [cbs.onApprove, cbs.onReject, cbs.onCreateInvoice, cbs.onAdjust, cbs.onViewDetails, cbs.onDelete])
}
