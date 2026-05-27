import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Download } from '@phosphor-icons/react'
import type { PayrollRun } from '@/lib/types'
import { cn } from '@/lib/utils'
import { STATUS_CONFIG, BADGE_VARIANT, STATUS_ALERTS } from '@/data/payroll-detail-config'
import { PayrollInfoGrid } from '@/components/payroll/PayrollInfoGrid'
import { PayrollSummarySection } from '@/components/payroll/PayrollSummarySection'

interface Props {
  payrollRun: PayrollRun | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayrollDetailDialog({ payrollRun, open, onOpenChange }: Props) {
  if (!payrollRun) return null

  const cfg = STATUS_CONFIG[payrollRun.status] ?? STATUS_CONFIG.scheduled
  const { Icon, color, bgColor, label } = cfg
  const alert = STATUS_ALERTS[payrollRun.status]

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
            <PayrollInfoGrid payrollRun={payrollRun} />
            <Separator />
            <PayrollSummarySection
              totalAmount={payrollRun.totalAmount}
              workersCount={payrollRun.workersCount}
            />
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
