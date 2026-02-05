import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  useScheduledReports, 
  type ReportType, 
  type ReportFrequency, 
  type ReportFormat,
  type ScheduledReport 
} from '@/hooks/use-scheduled-reports'
import {
  Calendar,
  Clock,
  Play,
  Pause,
  Trash,
  Plus,
  ChartBar,
  Download,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/ui/page-header'
import { Grid } from '@/components/ui/grid'
import { Stack } from '@/components/ui/stack'
import { MetricCard } from '@/components/ui/metric-card'
import { useTranslation } from '@/hooks/use-translation'
import { useAppSelector } from '@/store/hooks'
import { formatDistance } from 'date-fns'

const reportTypeLabels: Record<ReportType, string> = {
  'margin-analysis': 'Margin Analysis',
  'revenue-summary': 'Revenue Summary',
  'payroll-summary': 'Payroll Summary',
  'timesheet-summary': 'Timesheet Summary',
  'expense-summary': 'Expense Summary',
  'cash-flow': 'Cash Flow',
  'compliance-status': 'Compliance Status',
  'worker-utilization': 'Worker Utilization'
}

const frequencyLabels: Record<ReportFrequency, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly'
}

export function ScheduledReportsManager() {
  const { t } = useTranslation()
  const currentUser = useAppSelector(state => state.auth.user)
  
  const {
    schedules,
    executions,
    createSchedule,
    deleteSchedule,
    pauseSchedule,
    resumeSchedule,
    runScheduleNow,
    getExecutionHistory
  } = useScheduledReports()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledReport | null>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'margin-analysis' as ReportType,
    frequency: 'monthly' as ReportFrequency,
    format: 'csv' as ReportFormat,
    recipients: ''
  })

  const activeSchedules = schedules.filter(s => s.status === 'active').length
  const totalExecutions = executions.length
  const successRate = executions.length > 0
    ? (executions.filter(e => e.status === 'success').length / executions.length * 100).toFixed(1)
    : 0

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast.error('Report name is required')
      return
    }

    const recipientList = formData.recipients
      .split(',')
      .map(r => r.trim())
      .filter(r => r.length > 0)

    createSchedule({
      name: formData.name,
      description: formData.description || undefined,
      type: formData.type,
      frequency: formData.frequency,
      format: formData.format,
      status: 'active',
      recipients: recipientList,
      createdBy: currentUser?.email || 'unknown'
    })

    toast.success(`Scheduled report "${formData.name}" created`)
    setIsCreateDialogOpen(false)
    setFormData({
      name: '',
      description: '',
      type: 'margin-analysis',
      frequency: 'monthly',
      format: 'csv',
      recipients: ''
    })
  }

  const handleRunNow = async (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    if (!schedule) return

    toast.loading(`Running report "${schedule.name}"...`)
    const execution = await runScheduleNow(id)
    
    if (execution?.status === 'success') {
      toast.success(`Report "${schedule.name}" completed successfully`)
    } else {
      toast.error(`Report "${schedule.name}" failed: ${execution?.error || 'Unknown error'}`)
    }
  }

  const handlePause = (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    pauseSchedule(id)
    toast.info(`Report "${schedule?.name}" paused`)
  }

  const handleResume = (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    resumeSchedule(id)
    toast.success(`Report "${schedule?.name}" resumed`)
  }

  const handleDelete = (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    if (confirm(`Delete scheduled report "${schedule?.name}"?`)) {
      deleteSchedule(id)
      toast.success(`Report "${schedule?.name}" deleted`)
    }
  }

  const showHistory = (schedule: ScheduledReport) => {
    setSelectedSchedule(schedule)
    setIsHistoryDialogOpen(true)
  }

  const history = selectedSchedule ? getExecutionHistory(selectedSchedule.id) : []

  return (
    <Stack spacing={6}>
      <PageHeader
        title="Scheduled Reports"
        description="Automate report generation and delivery"
        actions={
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2" />
            Create Schedule
          </Button>
        }
      />

      <Grid cols={3} gap={4}>
        <MetricCard
          label="Active Schedules"
          value={activeSchedules.toString()}
          icon={<Calendar />}
        />
        <MetricCard
          label="Total Executions"
          value={totalExecutions.toString()}
          icon={<ChartBar />}
        />
        <MetricCard
          label="Success Rate"
          value={`${successRate}%`}
          icon={<CheckCircle />}
        />
      </Grid>

      <Grid cols={2} gap={4}>
        {schedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-lg">{schedule.name}</CardTitle>
                    <Badge variant={schedule.status === 'active' ? 'default' : 'secondary'}>
                      {schedule.status}
                    </Badge>
                  </div>
                  {schedule.description && (
                    <CardDescription className="text-sm">{schedule.description}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Stack spacing={4}>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">Type</div>
                    <div className="font-medium">{reportTypeLabels[schedule.type]}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Frequency</div>
                    <div className="font-medium">{frequencyLabels[schedule.frequency]}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Format</div>
                    <div className="font-medium uppercase">{schedule.format}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Run Count</div>
                    <div className="font-medium">{schedule.runCount}</div>
                  </div>
                </div>

                {schedule.lastRunDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock size={16} />
                    <span>
                      Last run: {formatDistance(new Date(schedule.lastRunDate), new Date(), { addSuffix: true })}
                    </span>
                    {schedule.lastRunStatus === 'success' ? (
                      <CheckCircle size={16} className="text-success" />
                    ) : (
                      <XCircle size={16} className="text-destructive" />
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>
                    Next run: {formatDistance(new Date(schedule.nextRunDate), new Date(), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunNow(schedule.id)}
                  >
                    <Play size={16} className="mr-1.5" />
                    Run Now
                  </Button>
                  
                  {schedule.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePause(schedule.id)}
                    >
                      <Pause size={16} className="mr-1.5" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResume(schedule.id)}
                    >
                      <Play size={16} className="mr-1.5" />
                      Resume
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => showHistory(schedule)}
                  >
                    <ClockIcon size={16} className="mr-1.5" />
                    History
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(schedule.id)}
                  >
                    <Trash size={16} className="mr-1.5" />
                    Delete
                  </Button>
                </div>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {schedules.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ChartBar size={48} className="text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center mb-4">
                No scheduled reports yet. Create your first automated report schedule.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2" />
                Create Schedule
              </Button>
            </CardContent>
          </Card>
        )}
      </Grid>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Scheduled Report</DialogTitle>
            <DialogDescription>
              Set up an automated report to run on a regular schedule
            </DialogDescription>
          </DialogHeader>

          <Stack spacing={4}>
            <div>
              <Label htmlFor="name">Report Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Monthly Revenue Report"
              />
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this report"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="type">Report Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as ReportType })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(reportTypeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as ReportFrequency })}
                >
                  <SelectTrigger id="frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => setFormData({ ...formData, format: value as ReportFormat })}
                >
                  <SelectTrigger id="format">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="recipients">Recipients (Optional)</Label>
              <Input
                id="recipients"
                value={formData.recipients}
                onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                placeholder="email1@example.com, email2@example.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Comma-separated email addresses
              </p>
            </div>
          </Stack>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Execution History</DialogTitle>
            <DialogDescription>
              {selectedSchedule?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto">
            <Stack spacing={2}>
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No execution history yet
                </p>
              ) : (
                history.map((execution) => (
                  <div
                    key={execution.id}
                    className="flex items-center justify-between p-3 border border-border rounded-md"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {execution.status === 'success' ? (
                          <CheckCircle size={20} className="text-success" />
                        ) : (
                          <XCircle size={20} className="text-destructive" />
                        )}
                        <span className="font-medium">
                          {new Date(execution.executedAt).toLocaleString()}
                        </span>
                        <Badge variant="outline" className="uppercase">
                          {execution.format}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {execution.recordCount} records
                        {execution.error && ` • Error: ${execution.error}`}
                      </div>
                    </div>
                    {execution.status === 'success' && (
                      <Download size={20} className="text-muted-foreground" />
                    )}
                  </div>
                ))
              )}
            </Stack>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHistoryDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Stack>
  )
}
