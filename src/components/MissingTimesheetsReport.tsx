import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Warning, ClockCounterClockwise, Download, Envelope } from '@phosphor-icons/react'
import { toast } from 'sonner'
import type { MissingTimesheetReport, Worker, Timesheet } from '@/lib/types'
import { cn } from '@/lib/utils'

interface MissingTimesheetsReportProps {
  workers: Worker[]
  timesheets: Timesheet[]
}

export function MissingTimesheetsReport({ workers, timesheets }: MissingTimesheetsReportProps) {
  const [missingReports, setMissingReports] = useState<MissingTimesheetReport[]>([])
  const [filterDays, setFilterDays] = useState<'all' | '7' | '14' | '30'>('all')
  const [sortBy, setSortBy] = useState<'overdue' | 'worker' | 'client'>('overdue')

  useEffect(() => {
    generateMissingReport()
  }, [workers, timesheets])

  const generateMissingReport = () => {
    const activeWorkers = workers.filter(w => w.status === 'active')
    const reports: MissingTimesheetReport[] = []
    const today = new Date()
    
    activeWorkers.forEach(worker => {
      const workerTimesheets = timesheets.filter(t => t.workerId === worker.id)
      
      if (workerTimesheets.length === 0) {
        reports.push({
          workerId: worker.id,
          workerName: worker.name,
          clientName: 'Unknown',
          expectedWeekEnding: getLastFriday(today).toISOString().split('T')[0],
          daysOverdue: getDaysSinceLastFriday(today)
        })
      } else {
        const lastSubmission = workerTimesheets.sort((a, b) => 
          new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
        )[0]
        
        const daysSinceLastSubmission = Math.floor(
          (today.getTime() - new Date(lastSubmission.submittedDate).getTime()) / (1000 * 60 * 60 * 24)
        )
        
        if (daysSinceLastSubmission > 7) {
          const expectedWeek = getLastFriday(today)
          reports.push({
            workerId: worker.id,
            workerName: worker.name,
            clientName: lastSubmission.clientName,
            expectedWeekEnding: expectedWeek.toISOString().split('T')[0],
            daysOverdue: getDaysSinceLastFriday(today),
            lastSubmissionDate: lastSubmission.submittedDate
          })
        }
      }
    })
    
    setMissingReports(reports)
  }

  const getLastFriday = (date: Date): Date => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day >= 5 ? day - 5 : day + 2
    d.setDate(d.getDate() - diff)
    return d
  }

  const getDaysSinceLastFriday = (date: Date): number => {
    const lastFriday = getLastFriday(date)
    return Math.floor((date.getTime() - lastFriday.getTime()) / (1000 * 60 * 60 * 24))
  }

  const filteredReports = missingReports.filter(report => {
    if (filterDays === 'all') return true
    const days = parseInt(filterDays)
    return report.daysOverdue <= days
  })

  const sortedReports = [...filteredReports].sort((a, b) => {
    switch (sortBy) {
      case 'overdue':
        return b.daysOverdue - a.daysOverdue
      case 'worker':
        return a.workerName.localeCompare(b.workerName)
      case 'client':
        return a.clientName.localeCompare(b.clientName)
      default:
        return 0
    }
  })

  const handleSendReminder = (workerId: string, workerName: string) => {
    toast.success(`Reminder email sent to ${workerName}`)
  }

  const handleExportReport = () => {
    const csv = [
      ['Worker Name', 'Client', 'Expected Week Ending', 'Days Overdue', 'Last Submission'],
      ...sortedReports.map(r => [
        r.workerName,
        r.clientName,
        new Date(r.expectedWeekEnding).toLocaleDateString(),
        r.daysOverdue.toString(),
        r.lastSubmissionDate ? new Date(r.lastSubmissionDate).toLocaleDateString() : 'Never'
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `missing-timesheets-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Report exported successfully')
  }

  const getSeverityColor = (daysOverdue: number): string => {
    if (daysOverdue >= 14) return 'text-destructive'
    if (daysOverdue >= 7) return 'text-warning'
    return 'text-info'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Missing Timesheets Report</h2>
          <p className="text-muted-foreground mt-1">Track outstanding timesheet submissions</p>
        </div>
        <Button onClick={handleExportReport} disabled={sortedReports.length === 0}>
          <Download size={18} className="mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-destructive/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Warning size={18} className="text-destructive" weight="fill" />
              Critical (14+ days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {missingReports.filter(r => r.daysOverdue >= 14).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ClockCounterClockwise size={18} className="text-warning" weight="fill" />
              Overdue (7-13 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {missingReports.filter(r => r.daysOverdue >= 7 && r.daysOverdue < 14).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Follow-up needed</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-info/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ClockCounterClockwise size={18} className="text-info" weight="fill" />
              Recent (0-6 days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {missingReports.filter(r => r.daysOverdue < 7).length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Within normal range</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filter by days:</span>
          <Select value={filterDays} onValueChange={(v) => setFilterDays(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="7">≤ 7 days</SelectItem>
              <SelectItem value="14">≤ 14 days</SelectItem>
              <SelectItem value="30">≤ 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overdue">Days Overdue</SelectItem>
              <SelectItem value="worker">Worker Name</SelectItem>
              <SelectItem value="client">Client Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedReports.length === 0 ? (
        <Card className="p-12 text-center">
          <ClockCounterClockwise size={48} className="mx-auto text-success mb-4" weight="fill" />
          <h3 className="text-lg font-semibold mb-2">All timesheets up to date!</h3>
          <p className="text-muted-foreground">No missing timesheets found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedReports.map(report => (
            <Card key={report.workerId} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-4">
                      <Warning 
                        size={24} 
                        weight="fill" 
                        className={getSeverityColor(report.daysOverdue)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{report.workerName}</h3>
                          <Badge 
                            variant={
                              report.daysOverdue >= 14 ? 'destructive' : 
                              report.daysOverdue >= 7 ? 'warning' : 
                              'default'
                            }
                          >
                            {report.daysOverdue} days overdue
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Client</p>
                            <p className="font-medium">{report.clientName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Expected Week Ending</p>
                            <p className="font-medium">
                              {new Date(report.expectedWeekEnding).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Submission</p>
                            <p className="font-medium">
                              {report.lastSubmissionDate 
                                ? new Date(report.lastSubmissionDate).toLocaleDateString()
                                : 'Never'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className={cn('font-semibold', getSeverityColor(report.daysOverdue))}>
                              {report.daysOverdue >= 14 ? 'Critical' : 
                               report.daysOverdue >= 7 ? 'Overdue' : 
                               'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm"
                      onClick={() => handleSendReminder(report.workerId, report.workerName)}
                    >
                      <Envelope size={16} className="mr-2" />
                      Send Reminder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
