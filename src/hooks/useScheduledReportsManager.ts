import { useState } from 'react'
import { toast } from 'sonner'
import { useScheduledReports, type ReportType, type ReportFrequency, type ReportFormat, type ScheduledReport } from '@/hooks/use-scheduled-reports'
import { useAppSelector } from '@/store/hooks'

export const REPORT_TYPE_LABELS: Record<ReportType, string> = {
  'margin-analysis': 'Margin Analysis', 'revenue-summary': 'Revenue Summary',
  'payroll-summary': 'Payroll Summary', 'timesheet-summary': 'Timesheet Summary',
  'expense-summary': 'Expense Summary', 'cash-flow': 'Cash Flow',
  'compliance-status': 'Compliance Status', 'worker-utilization': 'Worker Utilization',
}

export const FREQUENCY_LABELS: Record<ReportFrequency, string> = {
  daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly',
}

const DEFAULT_FORM = { name: '', description: '', type: 'margin-analysis' as ReportType, frequency: 'monthly' as ReportFrequency, format: 'csv' as ReportFormat, recipients: '' }

export function useScheduledReportsManager() {
  const currentUser = useAppSelector(state => state.auth.user)
  const { schedules, executions, createSchedule, deleteSchedule, pauseSchedule, resumeSchedule, runScheduleNow, getExecutionHistory } = useScheduledReports()

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledReport | null>(null)
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const activeSchedules = schedules.filter(s => s.status === 'active').length
  const totalExecutions = executions.length
  const successRate = executions.length > 0 ? (executions.filter(e => e.status === 'success').length / executions.length * 100).toFixed(1) : 0

  const handleCreate = () => {
    if (!formData.name.trim()) { toast.error('Report name is required'); return }
    createSchedule({
      name: formData.name, description: formData.description || undefined,
      type: formData.type, frequency: formData.frequency, format: formData.format, status: 'active',
      recipients: formData.recipients.split(',').map(r => r.trim()).filter(Boolean),
      createdBy: currentUser?.email || 'unknown',
    })
    toast.success(`Scheduled report "${formData.name}" created`)
    setIsCreateDialogOpen(false)
    setFormData(DEFAULT_FORM)
  }

  const handleRunNow = async (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    if (!schedule) return
    toast.loading(`Running report "${schedule.name}"...`)
    const execution = await runScheduleNow(id)
    if (execution?.status === 'success') toast.success(`Report "${schedule.name}" completed successfully`)
    else toast.error(`Report "${schedule.name}" failed: ${execution?.error || 'Unknown error'}`)
  }

  const handlePause = (id: string) => { pauseSchedule(id); toast.info(`Report "${schedules.find(s => s.id === id)?.name}" paused`) }
  const handleResume = (id: string) => { resumeSchedule(id); toast.success(`Report "${schedules.find(s => s.id === id)?.name}" resumed`) }
  const handleDelete = (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    if (confirm(`Delete scheduled report "${schedule?.name}"?`)) { deleteSchedule(id); toast.success(`Report "${schedule?.name}" deleted`) }
  }
  const showHistory = (schedule: ScheduledReport) => { setSelectedSchedule(schedule); setIsHistoryDialogOpen(true) }

  const history = selectedSchedule ? getExecutionHistory(selectedSchedule.id) : []

  return {
    schedules, activeSchedules, totalExecutions, successRate,
    isCreateDialogOpen, setIsCreateDialogOpen,
    selectedSchedule, isHistoryDialogOpen, setIsHistoryDialogOpen,
    formData, setFormData, history,
    handleCreate, handleRunNow, handlePause, handleResume, handleDelete, showHistory,
  }
}
