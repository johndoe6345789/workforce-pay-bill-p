export type { ReportType, ReportFrequency, ReportFormat, ReportStatus, ScheduledReport, ReportExecution } from './use-scheduled-reports.types'
import { useCallback, useEffect } from 'react'
import { useIndexedDBState } from './use-indexed-db-state'
import { useInvoicesCrud } from './use-invoices-crud'
import { usePayrollCrud } from './use-payroll-crud'
import { useTimesheetsCrud } from './use-timesheets-crud'
import { useExpensesCrud } from './use-expenses-crud'
import { useDataExport } from './use-data-export'
import type { ScheduledReport, ReportExecution, ReportType } from './use-scheduled-reports.types'
import {
  generateMarginAnalysis, generateRevenueSummary, generatePayrollSummary,
  generateTimesheetSummary, generateExpenseSummary, generateCashFlow,
  generateWorkerUtilization, generateComplianceStatus,
} from './use-scheduled-reports.generators'
import { calculateNextRunDate } from './use-scheduled-reports.utils'
import { useReportExecute } from './use-report-execute'

export function useScheduledReports() {
  const [schedules, setSchedules] = useIndexedDBState<ScheduledReport[]>('scheduled-reports', [])
  const [executions, setExecutions] = useIndexedDBState<ReportExecution[]>('report-executions', [])
  const { invoices } = useInvoicesCrud()
  const { payrollRuns } = usePayrollCrud()
  const { timesheets } = useTimesheetsCrud()
  const { expenses } = useExpensesCrud()
  const { exportToCSV, exportToExcel } = useDataExport()

  const generateReportData = useCallback((type: ReportType, _filters?: Record<string, unknown>): unknown[] => {
    switch (type) {
      case 'margin-analysis': return generateMarginAnalysis(invoices, payrollRuns)
      case 'revenue-summary': return generateRevenueSummary(invoices)
      case 'payroll-summary': return generatePayrollSummary(payrollRuns)
      case 'timesheet-summary': return generateTimesheetSummary(timesheets)
      case 'expense-summary': return generateExpenseSummary(expenses)
      case 'cash-flow': return generateCashFlow(invoices, payrollRuns, expenses)
      case 'worker-utilization': return generateWorkerUtilization(timesheets)
      case 'compliance-status': return generateComplianceStatus(timesheets, invoices)
      default: return []
    }
  }, [invoices, payrollRuns, timesheets, expenses])

  const { executeReport } = useReportExecute(generateReportData, exportToCSV, exportToExcel, setExecutions)

  const updateSchedule = useCallback((id: string, updates: Partial<ScheduledReport>) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [setSchedules])

  const createSchedule = useCallback((data: Omit<ScheduledReport, 'id' | 'createdAt' | 'runCount' | 'nextRunDate'>) => {
    const newSchedule: ScheduledReport = {
      ...data,
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      runCount: 0,
      nextRunDate: calculateNextRunDate(data.frequency),
    }
    setSchedules(prev => [...prev, newSchedule])
    return newSchedule
  }, [setSchedules])

  const deleteSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(s => s.id !== id))
  }, [setSchedules])
  const pauseSchedule = useCallback((id: string) => updateSchedule(id, { status: 'paused' }), [updateSchedule])
  const resumeSchedule = useCallback((id: string) => updateSchedule(id, { status: 'active' }), [updateSchedule])

  const runScheduleNow = useCallback(async (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    if (!schedule) return
    const execution = await executeReport(schedule)
    updateSchedule(id, {
      lastRunDate: execution.executedAt,
      lastRunStatus: execution.status,
      lastRunError: execution.error,
      runCount: schedule.runCount + 1,
      nextRunDate: calculateNextRunDate(schedule.frequency),
    })
    return execution
  }, [schedules, executeReport, updateSchedule])

  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date()
      schedules.forEach(s => {
        if (s.status === 'active' && now >= new Date(s.nextRunDate)) {
          runScheduleNow(s.id)
        }
      })
    }
    const interval = setInterval(checkSchedules, 60000)
    checkSchedules()
    return () => clearInterval(interval)
  }, [schedules, runScheduleNow])

  const getSchedulesByType = useCallback((type: ReportType) => schedules.filter(s => s.type === type), [schedules])
  const getExecutionHistory = useCallback((scheduleId: string) => executions.filter(e => e.scheduleId === scheduleId), [executions])

  return { schedules, executions, createSchedule, updateSchedule, deleteSchedule, pauseSchedule, resumeSchedule, runScheduleNow, getSchedulesByType, getExecutionHistory }
}
