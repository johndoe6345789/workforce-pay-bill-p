import { useState } from 'react'
import {
  Clock,
  ClockCounterClockwise,
  CheckCircle,
  XCircle,
  Receipt,
  CaretDown,
  Trash
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { usePermissions } from '@/hooks/use-permissions'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Timesheet } from '@/lib/types'

interface TimesheetCardProps {
  timesheet: Timesheet
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCreateInvoice: (id: string) => void
  onAdjust?: (timesheet: Timesheet) => void
  onViewDetails?: (timesheet: Timesheet) => void
  onDelete?: (id: string) => void
}

export function TimesheetCard({ 
  timesheet, 
  onApprove, 
  onReject, 
  onCreateInvoice, 
  onAdjust, 
  onViewDetails,
  onDelete 
}: TimesheetCardProps) {
  const { hasPermission } = usePermissions()
  const [showShifts, setShowShifts] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  const statusConfig = {
    pending: { icon: ClockCounterClockwise, color: 'text-warning' },
    approved: { icon: CheckCircle, color: 'text-success' },
    rejected: { icon: XCircle, color: 'text-destructive' },
    processing: { icon: Clock, color: 'text-info' }
  }

  const StatusIcon = statusConfig[timesheet.status].icon

  const getShiftBadgeColor = (shiftType: string) => {
    switch (shiftType) {
      case 'night': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'evening': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'weekend': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'holiday': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'overtime': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      case 'early-morning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const hasShifts = timesheet.shifts && timesheet.shifts.length > 0

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onViewDetails?.(timesheet)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="flex items-start gap-4">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[timesheet.status].color}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{timesheet.workerName}</h3>
                  <Badge variant={timesheet.status === 'approved' ? 'success' : timesheet.status === 'rejected' ? 'destructive' : 'warning'}>
                    {timesheet.status}
                  </Badge>
                  {hasShifts && (
                    <Badge variant="outline" className="text-xs">
                      {timesheet.shifts!.length} shifts
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Client</p>
                    <p className="font-medium">{timesheet.clientName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Week Ending</p>
                    <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Hours</p>
                    <p className="font-medium font-mono">{timesheet.hours.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium font-mono">£{timesheet.amount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Submitted {new Date(timesheet.submittedDate).toLocaleDateString()}
                  {timesheet.approvedDate && ` • Approved ${new Date(timesheet.approvedDate).toLocaleDateString()}`}
                </div>

                {hasShifts && (
                  <div className="mt-3">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowShifts(!showShifts)
                      }}
                      className="h-8 px-2 text-xs"
                    >
                      {showShifts ? 'Hide' : 'Show'} Shift Details
                      <CaretDown size={14} className={cn('ml-1 transition-transform', showShifts && 'rotate-180')} />
                    </Button>
                    
                    {showShifts && (
                      <div className="mt-3 space-y-2 pl-4 border-l-2 border-accent/30">
                        {timesheet.shifts!.map((shift) => (
                          <div key={shift.id} className="flex items-center justify-between text-xs bg-muted/30 rounded p-2">
                            <div className="flex items-center gap-3">
                              <span className="font-medium">
                                {new Date(shift.date).toLocaleDateString('en-GB', { 
                                  weekday: 'short', 
                                  day: 'numeric', 
                                  month: 'short' 
                                })}
                              </span>
                              <Badge className={getShiftBadgeColor(shift.shiftType)}>
                                {shift.shiftType}
                              </Badge>
                              <span className="font-mono text-muted-foreground">
                                {shift.startTime} - {shift.endTime}
                              </span>
                              {shift.rateMultiplier > 1.0 && (
                                <Badge variant="outline" className="text-xs">
                                  {shift.rateMultiplier}x
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono">{shift.hours.toFixed(2)}h</span>
                              <span className="font-mono font-semibold">£{shift.amount.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
            {timesheet.status === 'pending' && hasPermission('timesheets.approve') && (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onApprove(timesheet.id)}
                  style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => onReject(timesheet.id)}
                >
                  <XCircle size={16} className="mr-2" />
                  Reject
                </Button>
              </>
            )}
            {(timesheet.status === 'approved' || timesheet.status === 'pending') && onAdjust && hasPermission('timesheets.edit') && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onAdjust(timesheet)}
              >
                <ClockCounterClockwise size={16} className="mr-2" />
                Adjust
              </Button>
            )}
            {timesheet.status === 'approved' && hasPermission('invoices.create') && (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCreateInvoice(timesheet.id)}
              >
                <Receipt size={16} className="mr-2" />
                Create Invoice
              </Button>
            )}
            {onDelete && hasPermission('timesheets.delete') && (
              <Button 
                size="sm" 
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteDialog(true)
                }}
              >
                <Trash size={16} className="text-destructive" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Timesheet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this timesheet for {timesheet.workerName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(timesheet.id)
                setShowDeleteDialog(false)
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
