import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { CurrencyDollar, CalendarBlank, Users, Download, CheckCircle, Warning, XCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import type { PayrollRun } from '@/lib/types'
import { cn } from '@/lib/utils'
import type React from 'react'

interface Props {
  payrollRun: PayrollRun | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_CONFIG: Record<string, { Icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  scheduled:  { Icon: ClockCounterClockwise, color: 'text-info',        bgColor: 'bg-info/10',        label: 'Scheduled' },
  processing: { Icon: ClockCounterClockwise, color: 'text-warning',     bgColor: 'bg-warning/10',     label: 'Processing' },
  completed:  { Icon: CheckCircle,           color: 'text-success',     bgColor: 'bg-success/10',     label: 'Completed' },
  failed:     { Icon: XCircle,               color: 'text-destructive',  bgColor: 'bg-destructive/10', label: 'Failed' },
}

const BADGE_VARIANT: Record<string, 'success' | 'destructive' | 'outline'> = {
  completed: 'success',
  failed:    'destructive',
}

const STATUS_ALERTS: Record<string, { Icon: React.ElementType; iconClass: string; borderClass: string; bgClass: string; title: string; titleClass: string; message: (r: PayrollRun) => string }> = {
  failed: {
    Icon: Warning, iconClass: 'text-destructive', borderClass: 'border-destructive/20', bgClass: 'bg-destructive/10',
    title: 'Payroll Processing Failed', titleClass: 'text-destructive',
    message: () => 'This payroll run encountered errors during processing. Please review the details and retry.',
  },
  completed: {
    Icon: CheckCircle, iconClass: 'text-success', borderClass: 'border-success/20', bgClass: 'bg-success/10',
    title: 'Payroll Successfully Processed', titleClass: 'text-success',
    message: r => `All ${r.workersCount} workers have been paid for the period ending ${new Date(r.periodEnding).toLocaleDateString()}.`,
  },
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }

export function PayrollDetailDialog({ payrollRun, open, onOpenChange }: Props) {
  if (!payrollRun) return null

  const cfg = STATUS_CONFIG[payrollRun.status] ?? STATUS_CONFIG.scheduled
  const { Icon, color, bgColor, label } = cfg
  const alert = STATUS_ALERTS[payrollRun.status]

  const INFO_CELLS: { Icon: React.ElementType; iconBg: string; iconColor: string; label: string; value: React.ReactNode }[] = [
    { Icon: CalendarBlank, iconBg: 'bg-accent/10', iconColor: 'text-accent', label: 'Period Ending',
      value: <p className="font-semibold">{new Date(payrollRun.periodEnding).toLocaleDateString('en-GB', DATE_FORMAT)}</p> },
    { Icon: Users, iconBg: 'bg-accent/10', iconColor: 'text-accent', label: 'Workers Included',
      value: <p className="font-semibold font-mono">{payrollRun.workersCount}</p> },
    { Icon: CurrencyDollar, iconBg: 'bg-success/10', iconColor: 'text-success', label: 'Total Amount',
      value: <p className="text-2xl font-semibold font-mono">£{payrollRun.totalAmount.toLocaleString()}</p> },
    ...(payrollRun.processedDate ? [{
      Icon: CheckCircle, iconBg: 'bg-accent/10', iconColor: 'text-success', label: 'Processed Date',
      value: <p className="font-semibold">{new Date(payrollRun.processedDate).toLocaleDateString('en-GB', DATE_FORMAT)}</p>,
    }] : []),
  ]

  const SUMMARY_ROWS = [
    { label: 'Gross Pay', value: `£${payrollRun.totalAmount.toLocaleString()}` },
    { label: 'Average per Worker', value: `£${(payrollRun.totalAmount / payrollRun.workersCount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', bgColor)}>
              <Icon size={24} weight="fill" className={color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Payroll Run</span>
                <Badge variant={BADGE_VARIANT[payrollRun.status] ?? 'outline'}>{label}</Badge>
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
              {INFO_CELLS.map(({ Icon: CellIcon, iconBg, iconColor, label: cellLabel, value }) => (
                <div key={cellLabel} className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', iconBg)}>
                    <CellIcon size={20} weight="fill" className={iconColor} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{cellLabel}</p>
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Payroll Summary</h3>
              <div className="space-y-2">
                {SUMMARY_ROWS.map(({ label: rowLabel, value }) => (
                  <div key={rowLabel} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">{rowLabel}</span>
                    <span className="font-mono font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {alert && (
              <>
                <Separator />
                <div className={cn('p-4 rounded-lg border', alert.bgClass, alert.borderClass)}>
                  <div className="flex items-start gap-3">
                    <alert.Icon size={20} weight="fill" className={cn(alert.iconClass, 'mt-0.5')} />
                    <div>
                      <h4 className={cn('font-semibold mb-1', alert.titleClass)}>{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.message(payrollRun)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {payrollRun.status === 'completed' && (
            <>
              <Button variant="outline"><Download size={16} className="mr-2" />Export Report</Button>
              <Button><Download size={16} className="mr-2" />Download Payslips</Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
