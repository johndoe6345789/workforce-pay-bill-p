import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, User, Building, CalendarBlank, CurrencyDollar, CheckCircle, XCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import type { Timesheet } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'

interface TimesheetDetailDialogProps {
  timesheet: Timesheet | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TimesheetDetailDialog({ timesheet, open, onOpenChange }: TimesheetDetailDialogProps) {
  const { t } = useTranslation()
  
  if (!timesheet) return null

  const statusConfig = {
    pending: { icon: ClockCounterClockwise, color: 'text-warning', bgColor: 'bg-warning/10' },
    approved: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
    processing: { icon: Clock, color: 'text-info', bgColor: 'bg-info/10' },
    'awaiting-client': { icon: Clock, color: 'text-warning', bgColor: 'bg-warning/10' },
    'awaiting-manager': { icon: Clock, color: 'text-warning', bgColor: 'bg-warning/10' }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', statusConfig[timesheet.status].bgColor)}>
              <StatusIcon size={24} className={statusConfig[timesheet.status].color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{t('timesheetDetailDialog.title')}</span>
                <Badge variant={timesheet.status === 'approved' ? 'success' : timesheet.status === 'rejected' ? 'destructive' : 'warning'}>
                  {timesheet.status}
                </Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {timesheet.id}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">{t('timesheetDetailDialog.overview')}</TabsTrigger>
              <TabsTrigger value="shifts">{t('timesheetDetailDialog.shiftsCount', { count: timesheet.shifts?.length || 0 })}</TabsTrigger>
              <TabsTrigger value="history">{t('timesheetDetailDialog.history')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <User size={16} />
                    <span>{t('timesheetDetailDialog.worker')}</span>
                  </div>
                  <p className="font-medium">{timesheet.workerName}</p>
                  <p className="text-xs text-muted-foreground">ID: {timesheet.workerId}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Building size={16} />
                    <span>{t('timesheetDetailDialog.client')}</span>
                  </div>
                  <p className="font-medium">{timesheet.clientName}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CalendarBlank size={16} />
                    <span>{t('timesheetDetailDialog.weekEnding')}</span>
                  </div>
                  <p className="font-medium">{new Date(timesheet.weekEnding).toLocaleDateString()}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock size={16} />
                    <span>{t('timesheetDetailDialog.totalHours')}</span>
                  </div>
                  <p className="font-medium font-mono text-lg">{timesheet.hours.toFixed(2)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CurrencyDollar size={16} />
                    <span>{t('timesheetDetailDialog.amount')}</span>
                  </div>
                  <p className="font-semibold font-mono text-lg">£{timesheet.amount.toFixed(2)}</p>
                </div>

                {timesheet.rate && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <CurrencyDollar size={16} />
                      <span>{t('timesheetDetailDialog.hourlyRate')}</span>
                    </div>
                    <p className="font-medium font-mono">£{timesheet.rate.toFixed(2)}/hr</p>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold text-sm">{t('timesheetDetailDialog.submissionDetails')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('timesheetDetailDialog.submittedDate')}</p>
                    <p className="font-medium">{new Date(timesheet.submittedDate).toLocaleString()}</p>
                  </div>
                  {timesheet.submissionMethod && (
                    <div>
                      <p className="text-muted-foreground">{t('timesheetDetailDialog.submissionMethod')}</p>
                      <Badge variant="outline">{timesheet.submissionMethod}</Badge>
                    </div>
                  )}
                  {timesheet.approvedDate && (
                    <div>
                      <p className="text-muted-foreground">{t('timesheetDetailDialog.approvedDate')}</p>
                      <p className="font-medium">{new Date(timesheet.approvedDate).toLocaleString()}</p>
                    </div>
                  )}
                  {timesheet.currentApprovalStep && (
                    <div>
                      <p className="text-muted-foreground">{t('timesheetDetailDialog.currentStep')}</p>
                      <Badge variant="outline">{timesheet.currentApprovalStep}</Badge>
                    </div>
                  )}
                </div>
              </div>

              {timesheet.adjustments && timesheet.adjustments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">{t('timesheetDetailDialog.adjustments')}</h4>
                    <div className="space-y-2">
                      {timesheet.adjustments.map((adj) => (
                        <div key={adj.id} className="bg-muted/30 rounded p-3 text-sm">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{adj.id}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {new Date(adj.adjustmentDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-muted-foreground">{t('timesheetDetailDialog.hours')}</p>
                              <p className="font-mono">
                                {adj.previousHours} → {adj.newHours}
                              </p>
                            </div>
                            {adj.previousRate && adj.newRate && (
                              <div>
                                <p className="text-muted-foreground">{t('timesheetDetailDialog.rate')}</p>
                                <p className="font-mono">
                                  £{adj.previousRate} → £{adj.newRate}
                                </p>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">{adj.reason}</p>
                          <p className="text-xs text-muted-foreground">{t('timesheetDetailDialog.adjustedBy')}: {adj.adjustedBy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {timesheet.validationErrors && timesheet.validationErrors.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-destructive">{t('timesheetDetailDialog.validationErrors')}</h4>
                    <div className="space-y-1">
                      {timesheet.validationErrors.map((error, idx) => (
                        <div key={idx} className="bg-destructive/10 text-destructive rounded p-2 text-sm">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="shifts" className="space-y-3 mt-4">
              {timesheet.shifts && timesheet.shifts.length > 0 ? (
                timesheet.shifts.map((shift) => (
                  <div key={shift.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={getShiftBadgeColor(shift.shiftType)}>
                          {t(`timesheetDetailDialog.shiftTypes.${shift.shiftType}`) || shift.shiftType}
                        </Badge>
                        <span className="font-medium">
                          {new Date(shift.date).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      {shift.rateMultiplier > 1.0 && (
                        <Badge variant="outline" className="font-mono">
                          {t('timesheetDetailDialog.rateMultiplier', { multiplier: shift.rateMultiplier })}
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('timesheetDetailDialog.startTime')}</p>
                        <p className="font-mono font-medium">{shift.startTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('timesheetDetailDialog.endTime')}</p>
                        <p className="font-mono font-medium">{shift.endTime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('timesheetDetailDialog.breakMinutes')}</p>
                        <p className="font-mono font-medium">{shift.breakMinutes}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('timesheetDetailDialog.hours')}</p>
                        <p className="font-mono font-medium">{shift.hours.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm pt-2 border-t border-border">
                      <div>
                        <p className="text-muted-foreground">{t('timesheetDetailDialog.rate')}</p>
                        <p className="font-mono font-medium">£{shift.rate.toFixed(2)}/hr</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('timesheetDetailDialog.dayOfWeek')}</p>
                        <p className="font-medium capitalize">{shift.dayOfWeek}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('timesheetDetailDialog.amount')}</p>
                        <p className="font-mono font-semibold text-base">£{shift.amount.toFixed(2)}</p>
                      </div>
                    </div>

                    {shift.notes && (
                      <div className="pt-2 border-t border-border">
                        <p className="text-muted-foreground text-sm">{t('timesheetDetailDialog.notes')}</p>
                        <p className="text-sm">{shift.notes}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock size={32} className="mx-auto mb-2 opacity-50" />
                  <p>{t('timesheetDetailDialog.noShiftDetails')}</p>
                  <p className="text-sm">{t('timesheetDetailDialog.simpleHourEntry')}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-3 mt-4">
              {timesheet.approvalHistory && timesheet.approvalHistory.length > 0 ? (
                <div className="space-y-3">
                  {timesheet.approvalHistory.map((entry, idx) => (
                    <div key={idx} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            entry.status === 'approved' ? 'success' : 
                            entry.status === 'rejected' ? 'destructive' : 
                            'outline'
                          }>
                            {entry.status}
                          </Badge>
                          <span className="font-medium capitalize">{entry.step} Approval</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          {t('timesheetDetailDialog.approverName')}: <span className="text-foreground">{entry.approverName}</span>
                        </p>
                        <p className="text-muted-foreground">
                          {t('timesheetDetailDialog.approverEmail')}: <span className="text-foreground font-mono text-xs">{entry.approverEmail}</span>
                        </p>
                        {entry.notes && (
                          <div className="mt-2 pt-2 border-t border-border">
                            <p className="text-muted-foreground">{t('timesheetDetailDialog.approvalNotes')}:</p>
                            <p className="text-foreground">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ClockCounterClockwise size={32} className="mx-auto mb-2 opacity-50" />
                  <p>{t('timesheetDetailDialog.noApprovalHistory')}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
