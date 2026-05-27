import { CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  comments: string
  setComments: (v: string) => void
  onConfirm: () => void
}

export function ApproveDialog({ open, onOpenChange, comments, setComments, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve Payroll Batch</DialogTitle>
          <DialogDescription>You are about to approve this payroll batch. This action will move it to the next approval step.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="approve-comments">Comments (optional)</Label>
            <Textarea id="approve-comments" value={comments} onChange={e => setComments(e.target.value)} placeholder="Add any comments or notes..." rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onConfirm}><CheckCircle className="mr-2" />Approve</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
