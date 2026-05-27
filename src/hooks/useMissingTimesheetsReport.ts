import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { MissingTimesheetReport, Worker, Timesheet } from '@/lib/types'

export type FilterDays = 'all' | '7' | '14' | '30'
export type SortBy = 'overdue' | 'worker' | 'client'

export type Severity = 'critical' | 'overdue' | 'pending'

export const SEVERITY_CONFIG: Record<Severity, { label: string; badgeVariant: string; colorClass: string }> = {
  critical: { label: 'Critical', badgeVariant: 'destructive', colorClass: 'text-destructive' },
  overdue: { label: 'Overdue', badgeVariant: 'warning', colorClass: 'text-warning' },
  pending: { label: 'Pending', badgeVariant: 'default', colorClass: 'text-info' },
}

export function getSeverity(daysOverdue: number): Severity {
  if (daysOverdue >= 14) return 'critical'
  if (daysOverdue >= 7) return 'overdue'
  return 'pending'
}

function getLastFriday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day >= 5 ? day - 5 : day + 2
  d.setDate(d.getDate() - diff)
  return d
}

function getDaysSinceLastFriday(date: Date): number {
  return Math.floor((date.getTime() - getLastFriday(date).getTime()) / (1000 * 60 * 60 * 24))
}

export function useMissingTimesheetsReport(workers: Worker[], timesheets: Timesheet[]) {
  const [missingReports, setMissingReports] = useState<MissingTimesheetReport[]>([])
  const [filterDays, setFilterDays] = useState<FilterDays>('all')
  const [sortBy, setSortBy] = useState<SortBy>('overdue')

  useEffect(() => {
    const today = new Date()
    const activeWorkers = workers.filter(w => w.status === 'active')
    const reports: MissingTimesheetReport[] = []

    activeWorkers.forEach(worker => {
      const workerTimesheets = timesheets.filter(t => t.workerId === worker.id)
      if (workerTimesheets.length === 0) {
        reports.push({ workerId: worker.id, workerName: worker.name, clientName: 'Unknown', expectedWeekEnding: getLastFriday(today).toISOString().split('T')[0], daysOverdue: getDaysSinceLastFriday(today) })
      } else {
        const lastSubmission = [...workerTimesheets].sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())[0]
        const daysSince = Math.floor((today.getTime() - new Date(lastSubmission.submittedDate).getTime()) / (1000 * 60 * 60 * 24))
        if (daysSince > 7) {
          reports.push({ workerId: worker.id, workerName: worker.name, clientName: lastSubmission.clientName, expectedWeekEnding: getLastFriday(today).toISOString().split('T')[0], daysOverdue: getDaysSinceLastFriday(today), lastSubmissionDate: lastSubmission.submittedDate })
        }
      }
    })

    setMissingReports(reports)
  }, [workers, timesheets])

  const filteredReports = missingReports.filter(r => filterDays === 'all' || r.daysOverdue <= parseInt(filterDays))

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'overdue') return b.daysOverdue - a.daysOverdue
    if (sortBy === 'worker') return a.workerName.localeCompare(b.workerName)
    return a.clientName.localeCompare(b.clientName)
  })

  const handleSendReminder = (_workerId: string, workerName: string) => {
    toast.success(`Reminder email sent to ${workerName}`)
  }

  const handleExportReport = () => {
    const csv = [
      ['Worker Name', 'Client', 'Expected Week Ending', 'Days Overdue', 'Last Submission'],
      ...sortedReports.map(r => [r.workerName, r.clientName, new Date(r.expectedWeekEnding).toLocaleDateString(), r.daysOverdue.toString(), r.lastSubmissionDate ? new Date(r.lastSubmissionDate).toLocaleDateString() : 'Never'])
    ].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `missing-timesheets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Report exported successfully')
  }

  return { missingReports, sortedReports, filterDays, setFilterDays, sortBy, setSortBy, handleSendReminder, handleExportReport }
}
