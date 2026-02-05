import { useCallback, useEffect } from 'react'
import { useIndexedDBState } from './use-indexed-db-state'
import { useInvoicesCrud } from './use-invoices-crud'
import { usePayrollCrud } from './use-payroll-crud'
import { useTimesheetsCrud } from './use-timesheets-crud'
import { useExpensesCrud } from './use-expenses-crud'
import { useDataExport } from './use-data-export'

export type ReportType = 
  | 'margin-analysis'
  | 'revenue-summary'
  | 'payroll-summary'
  | 'timesheet-summary'
  | 'expense-summary'
  | 'cash-flow'
  | 'compliance-status'
  | 'worker-utilization'

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly'
export type ReportFormat = 'csv' | 'excel' | 'pdf' | 'json'
export type ReportStatus = 'active' | 'paused' | 'failed'

export interface ScheduledReport {
  id: string
  name: string
  description?: string
  type: ReportType
  frequency: ReportFrequency
  format: ReportFormat
  status: ReportStatus
  recipients: string[]
  filters?: Record<string, any>
  nextRunDate: string
  lastRunDate?: string
  lastRunStatus?: 'success' | 'failed'
  lastRunError?: string
  createdAt: string
  createdBy: string
  runCount: number
}

export interface ReportExecution {
  id: string
  scheduleId: string
  scheduleName: string
  reportType: ReportType
  executedAt: string
  status: 'success' | 'failed'
  format: ReportFormat
  recordCount: number
  fileSize?: number
  error?: string
  downloadUrl?: string
}

export function useScheduledReports() {
  const [schedules, setSchedules] = useIndexedDBState<ScheduledReport[]>(
    'scheduled-reports',
    []
  )
  const [executions, setExecutions] = useIndexedDBState<ReportExecution[]>(
    'report-executions',
    []
  )

  const { invoices } = useInvoicesCrud()
  const { payrollRuns } = usePayrollCrud()
  const { timesheets } = useTimesheetsCrud()
  const { expenses } = useExpensesCrud()
  const { exportToCSV, exportToExcel } = useDataExport()

  const generateReportData = useCallback((type: ReportType, filters?: Record<string, any>) => {
    switch (type) {
      case 'margin-analysis': {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months.map((month, index) => {
          const monthRevenue = invoices
            .filter(inv => {
              const invDate = new Date(inv.issueDate)
              return invDate.getMonth() === index
            })
            .reduce((sum, inv) => sum + inv.amount, 0)

          const monthCosts = payrollRuns
            .filter(pr => {
              const prDate = new Date(pr.periodEnding)
              return prDate.getMonth() === index
            })
            .reduce((sum, pr) => sum + pr.totalAmount, 0)

          const margin = monthRevenue - monthCosts
          const marginPercentage = monthRevenue > 0 ? (margin / monthRevenue) * 100 : 0

          return {
            month,
            revenue: monthRevenue,
            costs: monthCosts,
            margin,
            marginPercentage: marginPercentage.toFixed(2)
          }
        })
      }

      case 'revenue-summary': {
        return invoices.map(inv => ({
          invoiceNumber: inv.invoiceNumber,
          client: inv.clientName,
          amount: inv.amount,
          status: inv.status,
          issueDate: inv.issueDate,
          dueDate: inv.dueDate
        }))
      }

      case 'payroll-summary': {
        return payrollRuns.map(pr => ({
          payrollId: pr.id,
          periodEnding: pr.periodEnding,
          workerCount: pr.workersCount,
          totalAmount: pr.totalAmount,
          status: pr.status,
          processedDate: pr.processedDate
        }))
      }

      case 'timesheet-summary': {
        return timesheets.map(ts => ({
          workerName: ts.workerName,
          clientName: ts.clientName,
          weekEnding: ts.weekEnding,
          hours: ts.hours,
          status: ts.status,
          submittedDate: ts.submittedDate,
          amount: ts.amount
        }))
      }

      case 'expense-summary': {
        return expenses.map(exp => ({
          workerName: exp.workerName,
          category: exp.category,
          amount: exp.amount,
          date: exp.date,
          status: exp.status,
          description: exp.description
        }))
      }

      case 'cash-flow': {
        const income = invoices
          .filter(inv => inv.status === 'paid')
          .reduce((sum, inv) => sum + inv.amount, 0)
        
        const payrollCosts = payrollRuns
          .filter(pr => pr.status === 'completed')
          .reduce((sum, pr) => sum + pr.totalAmount, 0)
        
        const expenseCosts = expenses
          .filter(exp => exp.status === 'approved')
          .reduce((sum, exp) => sum + exp.amount, 0)
        
        const netCashFlow = income - payrollCosts - expenseCosts

        return [{
          totalIncome: income,
          payrollExpenses: payrollCosts,
          otherExpenses: expenseCosts,
          totalExpenses: payrollCosts + expenseCosts,
          netCashFlow,
          generatedAt: new Date().toISOString()
        }]
      }

      case 'worker-utilization': {
        const workerStats = new Map<string, { name: string, totalHours: number, timesheetCount: number }>()
        
        timesheets.forEach(ts => {
          const existing = workerStats.get(ts.workerId) || { name: ts.workerName, totalHours: 0, timesheetCount: 0 }
          existing.totalHours += ts.hours
          existing.timesheetCount += 1
          workerStats.set(ts.workerId, existing)
        })

        return Array.from(workerStats.values()).map(stats => ({
          workerName: stats.name,
          totalHours: stats.totalHours,
          timesheetCount: stats.timesheetCount,
          averageHoursPerWeek: (stats.totalHours / stats.timesheetCount).toFixed(2),
          utilizationRate: ((stats.totalHours / (stats.timesheetCount * 40)) * 100).toFixed(2) + '%'
        }))
      }

      case 'compliance-status': {
        const totalTimesheets = timesheets.length
        const approvedTimesheets = timesheets.filter(ts => ts.status === 'approved').length
        const totalInvoices = invoices.length
        const paidInvoices = invoices.filter(inv => inv.status === 'paid').length
        
        return [{
          timesheetComplianceRate: totalTimesheets > 0 ? ((approvedTimesheets / totalTimesheets) * 100).toFixed(2) + '%' : '0%',
          invoicePaymentRate: totalInvoices > 0 ? ((paidInvoices / totalInvoices) * 100).toFixed(2) + '%' : '0%',
          totalTimesheets,
          approvedTimesheets,
          pendingTimesheets: totalTimesheets - approvedTimesheets,
          totalInvoices,
          paidInvoices,
          unpaidInvoices: totalInvoices - paidInvoices,
          generatedAt: new Date().toISOString()
        }]
      }

      default:
        return []
    }
  }, [invoices, payrollRuns, timesheets, expenses])

  const executeReport = useCallback(async (schedule: ScheduledReport): Promise<ReportExecution> => {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    try {
      const data = generateReportData(schedule.type, schedule.filters)
      
      let exportResult
      const filename = `${schedule.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`
      
      if (schedule.format === 'csv') {
        exportResult = exportToCSV(data, { filename })
      } else if (schedule.format === 'excel') {
        exportResult = exportToExcel(data, { filename })
      } else if (schedule.format === 'json') {
        const jsonString = JSON.stringify(data, null, 2)
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        exportResult = true
      }

      const execution: ReportExecution = {
        id: executionId,
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        reportType: schedule.type,
        executedAt: new Date().toISOString(),
        status: 'success',
        format: schedule.format,
        recordCount: data.length
      }

      setExecutions(prev => [execution, ...prev].slice(0, 100))
      
      return execution
    } catch (error) {
      const execution: ReportExecution = {
        id: executionId,
        scheduleId: schedule.id,
        scheduleName: schedule.name,
        reportType: schedule.type,
        executedAt: new Date().toISOString(),
        status: 'failed',
        format: schedule.format,
        recordCount: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }

      setExecutions(prev => [execution, ...prev].slice(0, 100))
      
      return execution
    }
  }, [generateReportData, exportToCSV, exportToExcel, setExecutions])

  const calculateNextRunDate = useCallback((frequency: ReportFrequency, fromDate: Date = new Date()): string => {
    const next = new Date(fromDate)
    
    switch (frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1)
        break
      case 'weekly':
        next.setDate(next.getDate() + 7)
        break
      case 'monthly':
        next.setMonth(next.getMonth() + 1)
        break
      case 'quarterly':
        next.setMonth(next.getMonth() + 3)
        break
    }
    
    next.setHours(9, 0, 0, 0)
    return next.toISOString()
  }, [])

  const createSchedule = useCallback((data: Omit<ScheduledReport, 'id' | 'createdAt' | 'runCount' | 'nextRunDate'>) => {
    const newSchedule: ScheduledReport = {
      ...data,
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      runCount: 0,
      nextRunDate: calculateNextRunDate(data.frequency)
    }
    
    setSchedules(prev => [...prev, newSchedule])
    return newSchedule
  }, [setSchedules, calculateNextRunDate])

  const updateSchedule = useCallback((id: string, updates: Partial<ScheduledReport>) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, ...updates } : schedule
    ))
  }, [setSchedules])

  const deleteSchedule = useCallback((id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id))
  }, [setSchedules])

  const pauseSchedule = useCallback((id: string) => {
    updateSchedule(id, { status: 'paused' })
  }, [updateSchedule])

  const resumeSchedule = useCallback((id: string) => {
    updateSchedule(id, { status: 'active' })
  }, [updateSchedule])

  const runScheduleNow = useCallback(async (id: string) => {
    const schedule = schedules.find(s => s.id === id)
    if (!schedule) return

    const execution = await executeReport(schedule)
    
    updateSchedule(id, {
      lastRunDate: execution.executedAt,
      lastRunStatus: execution.status,
      lastRunError: execution.error,
      runCount: schedule.runCount + 1,
      nextRunDate: calculateNextRunDate(schedule.frequency)
    })

    return execution
  }, [schedules, executeReport, updateSchedule, calculateNextRunDate])

  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date()
      
      schedules.forEach(schedule => {
        if (schedule.status !== 'active') return
        
        const nextRun = new Date(schedule.nextRunDate)
        if (now >= nextRun) {
          runScheduleNow(schedule.id)
        }
      })
    }

    const interval = setInterval(checkSchedules, 60000)
    checkSchedules()

    return () => clearInterval(interval)
  }, [schedules, runScheduleNow])

  const getSchedulesByType = useCallback((type: ReportType) => {
    return schedules.filter(s => s.type === type)
  }, [schedules])

  const getExecutionHistory = useCallback((scheduleId: string) => {
    return executions.filter(e => e.scheduleId === scheduleId)
  }, [executions])

  return {
    schedules,
    executions,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    pauseSchedule,
    resumeSchedule,
    runScheduleNow,
    getSchedulesByType,
    getExecutionHistory
  }
}
