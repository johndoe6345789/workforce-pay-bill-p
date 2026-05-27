import { Plus, ChartBar, Calendar, CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { ScheduledReportCard } from '@/components/scheduled-reports/ScheduledReportCard'
import { ScheduledReportCreateDialog } from '@/components/scheduled-reports/ScheduledReportCreateDialog'
import { ScheduledReportHistoryDialog } from '@/components/scheduled-reports/ScheduledReportHistoryDialog'
import { useScheduledReportsManager } from '@/hooks/useScheduledReportsManager'

export function ScheduledReportsManager() {
  const vm = useScheduledReportsManager()

  return (
    <Stack spacing={6}>
      <PageHeader
        title="Scheduled Reports"
        description="Automate report generation and delivery"
        actions={<Button onClick={() => vm.setIsCreateDialogOpen(true)}><Plus className="mr-2" />Create Schedule</Button>}
      />

      <Grid cols={3} gap={4}>
        <MetricCard label="Active Schedules" value={vm.activeSchedules.toString()} icon={<Calendar />} />
        <MetricCard label="Total Executions" value={vm.totalExecutions.toString()} icon={<ChartBar />} />
        <MetricCard label="Success Rate" value={`${vm.successRate}%`} icon={<CheckCircle />} />
      </Grid>

      <Grid cols={2} gap={4}>
        {vm.schedules.map(schedule => (
          <ScheduledReportCard
            key={schedule.id}
            schedule={schedule}
            onRunNow={vm.handleRunNow}
            onPause={vm.handlePause}
            onResume={vm.handleResume}
            onDelete={vm.handleDelete}
            onShowHistory={vm.showHistory}
          />
        ))}
        {vm.schedules.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ChartBar size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">No scheduled reports yet. Create your first automated report schedule.</p>
              <Button onClick={() => vm.setIsCreateDialogOpen(true)}><Plus className="mr-2" />Create Schedule</Button>
            </CardContent>
          </Card>
        )}
      </Grid>

      <ScheduledReportCreateDialog
        open={vm.isCreateDialogOpen}
        onOpenChange={vm.setIsCreateDialogOpen}
        formData={vm.formData}
        setFormData={vm.setFormData}
        onCreate={vm.handleCreate}
      />

      <ScheduledReportHistoryDialog
        open={vm.isHistoryDialogOpen}
        onOpenChange={vm.setIsHistoryDialogOpen}
        schedule={vm.selectedSchedule}
        history={vm.history}
      />
    </Stack>
  )
}
