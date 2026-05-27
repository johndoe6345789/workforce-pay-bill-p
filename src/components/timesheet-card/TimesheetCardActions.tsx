import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, ClockCounterClockwise, Receipt, Trash } from '@phosphor-icons/react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { usePermissions } from '@/hooks/use-permissions'
import type { Timesheet } from '@/lib/types'

interface Props {
  timesheet: Timesheet
  showDeleteDialog: boolean
  setShowDeleteDialog: (v: boolean) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onAdjust?: (ts: Timesheet) => void
  onDelete?: (id: string) => void
}

export function TimesheetCardActions({ timesheet, showDeleteDialog, setShowDeleteDialog, onApprove, onReject, onCreateInvoice, onAdjust, onDelete }: Props) {
  const { hasPermission } = usePermissions()
  const status = timesheet.status

  return (
    <>
      <div className="flex gap-2 ml-4" onClick={e => e.stopPropagation()}>
        {status === 'pending' && hasPermission('timesheets.approve') && (
          <>
            <Button size="sm" onClick={() => onApprove(timesheet.id)} style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}>
              <CheckCircle size={16} className="mr-2" />Approve
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onReject(timesheet.id)}>
              <XCircle size={16} className="mr-2" />Reject
            </Button>
          </>
        )}
        {(status === 'approved' || status === 'pending') && onAdjust && hasPermission('timesheets.edit') && (
          <Button size="sm" variant="outline" onClick={() => onAdjust(timesheet)}>
            <ClockCounterClockwise size={16} className="mr-2" />Adjust
          </Button>
        )}
        {status === 'approved' && hasPermission('invoices.create') && (
          <Button size="sm" variant="outline" onClick={() => onCreateInvoice(timesheet.id)}>
            <Receipt size={16} className="mr-2" />Create Invoice
          </Button>
        )}
        {onDelete && hasPermission('timesheets.delete') && (
          <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); setShowDeleteDialog(true) }}>
            <Trash size={16} className="text-destructive" />
          </Button>
        )}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={e => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timesheet</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this timesheet for {timesheet.workerName}? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { onDelete?.(timesheet.id); setShowDeleteDialog(false) }} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
