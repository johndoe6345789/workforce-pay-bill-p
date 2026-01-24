import { CheckCircle, XCircle, Clock, UserCircle } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import type { ApprovalStep, ParallelApproval } from '@/hooks/use-approval-workflow'

interface ParallelApprovalStepViewProps {
  step: ApprovalStep
  onApprove?: (approverId: string, comments?: string) => void
  onReject?: (approverId: string, comments?: string) => void
  currentUserId?: string
  readOnly?: boolean
}

export function ParallelApprovalStepView({
  step,
  onApprove,
  onReject,
  currentUserId,
  readOnly = false
}: ParallelApprovalStepViewProps) {
  const [comments, setComments] = useState<Record<string, string>>({})
  const [activeApproverId, setActiveApproverId] = useState<string | null>(null)

  if (!step.isParallel || !step.parallelApprovals) {
    return null
  }

  const approvedCount = step.parallelApprovals.filter(pa => pa.status === 'approved').length
  const rejectedCount = step.parallelApprovals.filter(pa => pa.status === 'rejected').length
  const pendingCount = step.parallelApprovals.filter(pa => pa.status === 'pending').length
  const totalCount = step.parallelApprovals.length
  const progress = (approvedCount / totalCount) * 100

  const requiredApprovals = step.parallelApprovals.filter(pa => pa.isRequired)
  const requiredApprovedCount = requiredApprovals.filter(pa => pa.status === 'approved').length
  const allRequiredApproved = requiredApprovedCount === requiredApprovals.length

  const getStatusIcon = (status: ParallelApproval['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} weight="fill" className="text-success" />
      case 'rejected':
        return <XCircle size={20} weight="fill" className="text-destructive" />
      default:
        return <Clock size={20} className="text-muted-foreground" />
    }
  }

  const getApprovalModeDescription = () => {
    switch (step.parallelApprovalMode) {
      case 'all':
        return 'All approvers must approve'
      case 'any':
        return 'At least one approver must approve'
      case 'majority':
        return 'More than half must approve'
      default:
        return ''
    }
  }

  const handleApprove = (approverId: string) => {
    if (onApprove) {
      onApprove(approverId, comments[approverId])
      setComments(prev => {
        const updated = { ...prev }
        delete updated[approverId]
        return updated
      })
      setActiveApproverId(null)
    }
  }

  const handleReject = (approverId: string) => {
    if (onReject) {
      onReject(approverId, comments[approverId])
      setComments(prev => {
        const updated = { ...prev }
        delete updated[approverId]
        return updated
      })
      setActiveApproverId(null)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-base">Parallel Approval Progress</CardTitle>
            <p className="text-sm text-muted-foreground">{getApprovalModeDescription()}</p>
          </div>
          <Badge variant={step.status === 'approved' ? 'default' : 'secondary'}>
            {step.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium">
              {approvedCount} / {totalCount} Approved
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-success/10 rounded-md">
            <div className="text-2xl font-semibold text-success">{approvedCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Approved</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-md">
            <div className="text-2xl font-semibold text-muted-foreground">{pendingCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Pending</div>
          </div>
          <div className="text-center p-3 bg-destructive/10 rounded-md">
            <div className="text-2xl font-semibold text-destructive">{rejectedCount}</div>
            <div className="text-xs text-muted-foreground mt-1">Rejected</div>
          </div>
        </div>

        {requiredApprovals.length > 0 && (
          <div className="p-3 bg-info/10 border border-info/20 rounded-md">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="destructive" className="text-xs">Required</Badge>
              <span className="text-muted-foreground">
                {requiredApprovedCount} / {requiredApprovals.length} required approvals completed
              </span>
              {allRequiredApproved && <CheckCircle size={16} weight="fill" className="text-success ml-auto" />}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Approvers</h4>
          {step.parallelApprovals.map((approval) => {
            const isActive = activeApproverId === approval.id
            const canTakeAction = !readOnly && currentUserId === approval.approverId && approval.status === 'pending'

            return (
              <Card key={approval.id} className={`${isActive ? 'ring-2 ring-ring' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">{getStatusIcon(approval.status)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{approval.approverName}</span>
                        <Badge variant="outline" className="text-xs">
                          {approval.approverRole}
                        </Badge>
                        {approval.isRequired && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                      </div>
                      
                      {approval.status !== 'pending' && (
                        <div className="mt-2 text-xs text-muted-foreground space-y-1">
                          <div>
                            {approval.status === 'approved' ? 'Approved' : 'Rejected'} on{' '}
                            {new Date(approval.approvedDate || approval.rejectedDate || '').toLocaleString()}
                          </div>
                          {approval.comments && (
                            <div className="mt-1 p-2 bg-muted rounded text-foreground">
                              {approval.comments}
                            </div>
                          )}
                        </div>
                      )}

                      {canTakeAction && (
                        <div className="mt-3 space-y-2">
                          {isActive ? (
                            <>
                              <div className="space-y-2">
                                <Label htmlFor={`comments-${approval.id}`} className="text-xs">
                                  Comments (Optional)
                                </Label>
                                <Textarea
                                  id={`comments-${approval.id}`}
                                  placeholder="Add your comments here..."
                                  value={comments[approval.id] || ''}
                                  onChange={(e) =>
                                    setComments(prev => ({ ...prev, [approval.id]: e.target.value }))
                                  }
                                  rows={3}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(approval.id)}
                                  className="flex-1"
                                >
                                  <CheckCircle className="mr-2" size={16} />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(approval.id)}
                                  className="flex-1"
                                >
                                  <XCircle className="mr-2" size={16} />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setActiveApproverId(null)
                                    setComments(prev => {
                                      const updated = { ...prev }
                                      delete updated[approval.id]
                                      return updated
                                    })
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setActiveApproverId(approval.id)}
                            >
                              Take Action
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
