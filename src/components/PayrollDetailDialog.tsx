import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { CurrencyDollar, CalendarBlank, Users, Download, CheckCircle, Warning, XCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import type { PayrollRun } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PayrollDetailDialogProps {
  payrollRun: PayrollRun | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayrollDetailDialog({ payrollRun, open, onOpenChange }: PayrollDetailDialogProps) {
  if (!payrollRun) return null

  const statusConfig = {
    scheduled: { 
      icon: ClockCounterClockwise, 
      color: 'text-info', 
      bgColor: 'bg-info/10',
      label: 'Scheduled'
    },
    processing: { 
      icon: ClockCounterClockwise, 
      color: 'text-warning', 
      bgColor: 'bg-warning/10',
      label: 'Processing'
    },
    completed: { 
      icon: CheckCircle, 
      color: 'text-success', 
      bgColor: 'bg-success/10',
      label: 'Completed'
    },
    failed: { 
      icon: XCircle, 
      color: 'text-destructive', 
      bgColor: 'bg-destructive/10',
      label: 'Failed'
    }
  }

  const StatusIcon = statusConfig[payrollRun.status].icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', statusConfig[payrollRun.status].bgColor)}>
              <StatusIcon size={24} weight="fill" className={statusConfig[payrollRun.status].color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Payroll Run</span>
                <Badge variant={
                  payrollRun.status === 'completed' ? 'success' : 
                  payrollRun.status === 'failed' ? 'destructive' : 
                  'outline'
                }>
                  {statusConfig[payrollRun.status].label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-normal">
                Period ending {new Date(payrollRun.periodEnding).toLocaleDateString()}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <CalendarBlank size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Period Ending</p>
                    <p className="font-semibold">
                      {new Date(payrollRun.periodEnding).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Users size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Workers Included</p>
                    <p className="font-semibold font-mono">{payrollRun.workersCount}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <CurrencyDollar size={20} className="text-success" weight="fill" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-semibold font-mono">
                      £{payrollRun.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {payrollRun.processedDate && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <CheckCircle size={20} className="text-success" weight="fill" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Processed Date</p>
                      <p className="font-semibold">
                        {new Date(payrollRun.processedDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Payroll Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Gross Pay</span>
                  <span className="font-mono font-semibold">£{payrollRun.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="text-sm">Average per Worker</span>
                  <span className="font-mono font-semibold">
                    £{(payrollRun.totalAmount / payrollRun.workersCount).toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {payrollRun.status === 'failed' && (
              <>
                <Separator />
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-start gap-3">
                    <Warning size={20} className="text-destructive mt-0.5" weight="fill" />
                    <div>
                      <h4 className="font-semibold text-destructive mb-1">Payroll Processing Failed</h4>
                      <p className="text-sm text-muted-foreground">
                        This payroll run encountered errors during processing. Please review the details and retry.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {payrollRun.status === 'completed' && (
              <>
                <Separator />
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={20} className="text-success mt-0.5" weight="fill" />
                    <div>
                      <h4 className="font-semibold text-success mb-1">Payroll Successfully Processed</h4>
                      <p className="text-sm text-muted-foreground">
                        All {payrollRun.workersCount} workers have been paid for the period ending{' '}
                        {new Date(payrollRun.periodEnding).toLocaleDateString()}.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {payrollRun.status === 'completed' && (
            <>
              <Button variant="outline">
                <Download size={16} className="mr-2" />
                Export Report
              </Button>
              <Button>
                <Download size={16} className="mr-2" />
                Download Payslips
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
