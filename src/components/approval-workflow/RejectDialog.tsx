import { XCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  rejectionReason: string
  setRejectionReason: (v: string) => void
  onConfirm: () => void
}

export function RejectDialog({ open, onOpenChange, rejectionReason, setRejectionReason, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Payroll Batch</DialogTitle>
          <DialogDescription>Please provide a reason for rejecting this payroll batch. This will stop the approval workflow.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
            <Textarea id="rejection-reason" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} placeholder="Explain why this batch is being rejected..." rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}><XCircle className="mr-2" />Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
