import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { ParallelApproval } from '@/hooks/use-approval-workflow'

const STATUS_ICON: Record<ParallelApproval['status'], React.ReactNode> = {
  approved: <CheckCircle size={20} weight="fill" className="text-success" />,
  rejected: <XCircle   size={20} weight="fill" className="text-destructive" />,
  pending:  <Clock      size={20}               className="text-muted-foreground" />,
}

interface Props {
  approval: ParallelApproval
  isActive: boolean
  canTakeAction: boolean
  comment: string
  onSetActive: () => void
  onCommentChange: (value: string) => void
  onApprove: () => void
  onReject: () => void
  onCancel: () => void
}

export function ApproverCard({ approval, isActive, canTakeAction, comment, onSetActive, onCommentChange, onApprove, onReject, onCancel }: Props) {
  return (
    <Card className={isActive ? 'ring-2 ring-ring' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="pt-0.5">{STATUS_ICON[approval.status] ?? STATUS_ICON.pending}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-sm">{approval.approverName}</span>
              <Badge variant="outline" className="text-xs">{approval.approverRole}</Badge>
              {approval.isRequired && <Badge variant="destructive" className="text-xs">Required</Badge>}
            </div>

            {approval.status !== 'pending' && (
              <div className="mt-2 text-xs text-muted-foreground space-y-1">
                <div>
                  {approval.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                  {new Date(approval.approvedDate || approval.rejectedDate || '').toLocaleString()}
                </div>
                {approval.comments && (
                  <div className="mt-1 p-2 bg-muted rounded text-foreground">{approval.comments}</div>
                )}
              </div>
            )}

            {canTakeAction && (
              <div className="mt-3 space-y-2">
                {isActive ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor={`comments-${approval.id}`} className="text-xs">Comments (Optional)</Label>
                      <Textarea
                        id={`comments-${approval.id}`}
                        placeholder="Add your comments here..."
                        value={comment}
                        onChange={e => onCommentChange(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={onApprove} className="flex-1">
                        <CheckCircle className="mr-2" size={16} />Approve
                      </Button>
                      <Button size="sm" variant="destructive" onClick={onReject} className="flex-1">
                        <XCircle className="mr-2" size={16} />Reject
                      </Button>
                      <Button size="sm" variant="outline" onClick={onCancel}>Cancel</Button>
                    </div>
                  </>
                ) : (
                  <Button size="sm" variant="outline" onClick={onSetActive}>Take Action</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
