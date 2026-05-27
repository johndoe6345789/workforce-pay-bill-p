import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, CheckCircle, XCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import type { Timesheet } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/use-translation'
import { OverviewTab } from '@/components/timesheet-detail/OverviewTab'
import { ShiftsTab } from '@/components/timesheet-detail/ShiftsTab'
import { HistoryTab } from '@/components/timesheet-detail/HistoryTab'

interface TimesheetDetailDialogProps {
  timesheet: Timesheet | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_CONFIG: Record<string, { Icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { Icon: ClockCounterClockwise, color: 'text-warning', bgColor: 'bg-warning/10' },
  approved: { Icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
  rejected: { Icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  processing: { Icon: Clock, color: 'text-info', bgColor: 'bg-info/10' },
  'awaiting-client': { Icon: Clock, color: 'text-warning', bgColor: 'bg-warning/10' },
  'awaiting-manager': { Icon: Clock, color: 'text-warning', bgColor: 'bg-warning/10' },
}

export function TimesheetDetailDialog({ timesheet, open, onOpenChange }: TimesheetDetailDialogProps) {
  const { t } = useTranslation()

  if (!timesheet) return null

  const { Icon, color, bgColor } = STATUS_CONFIG[timesheet.status] ?? STATUS_CONFIG.pending
  const statusVariant = timesheet.status === 'approved' ? 'success' : timesheet.status === 'rejected' ? 'destructive' : 'warning'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', bgColor)}>
              <Icon size={24} className={color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>{t('timesheetDetailDialog.title')}</span>
                <Badge variant={statusVariant}>{timesheet.status}</Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">{timesheet.id}</p>
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
            <TabsContent value="overview" className="mt-4"><OverviewTab timesheet={timesheet} t={t} /></TabsContent>
            <TabsContent value="shifts" className="mt-4"><ShiftsTab timesheet={timesheet} t={t} /></TabsContent>
            <TabsContent value="history" className="mt-4"><HistoryTab timesheet={timesheet} t={t} /></TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
