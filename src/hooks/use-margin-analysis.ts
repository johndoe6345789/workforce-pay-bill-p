import { useState, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Timesheet, Invoice, Expense } from '@/lib/types'

interface MarginCalculation {
  period: string
  revenue: number
  costs: number
  grossMargin: number
  marginPercentage: number
  breakdown: MarginBreakdown[]
}

interface MarginBreakdown {
  category: string
  amount: number
  percentage: number
}

interface ClientProfitability {
  clientName: string
  revenue: number
  costs: number
  margin: number
  marginPercentage: number
  invoiceCount: number
  avgInvoiceValue: number
}

interface WorkerUtilization {
  workerId: string
  workerName: string
  hoursWorked: number
  availableHours: number
  utilizationRate: number
  revenue: number
  avgRate: number
}

interface PeriodComparison {
  current: MarginCalculation
  previous: MarginCalculation
  revenueChange: number
  revenueChangePercentage: number
  marginChange: number
  marginChangePercentage: number
}

export function useMarginAnalysis() {
  const [timesheets = []] = useKV<Timesheet[]>('timesheets', [])
  const [invoices = []] = useKV<Invoice[]>('invoices', [])
  const [expenses = []] = useKV<Expense[]>('expenses', [])

  const calculateMarginForPeriod = useCallback((
    startDate: Date,
    endDate: Date,
    includeExpenses: boolean = true
  ): MarginCalculation => {
    const periodInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.issueDate)
      return invDate >= startDate && invDate <= endDate && inv.status !== 'cancelled'
    })

    const periodTimesheets = timesheets.filter(ts => {
      const tsDate = new Date(ts.weekEnding)
      return tsDate >= startDate && tsDate <= endDate && ts.status === 'approved'
    })

    const periodExpenses = includeExpenses
      ? expenses.filter(exp => {
          const expDate = new Date(exp.date)
          return expDate >= startDate && expDate <= endDate && exp.status === 'approved'
        })
      : []

    const revenue = periodInvoices.reduce((sum, inv) => sum + inv.amount, 0)
    const payrollCosts = periodTimesheets.reduce((sum, ts) => sum + ts.amount, 0)
    const expenseCosts = periodExpenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalCosts = payrollCosts + expenseCosts

    const grossMargin = revenue - totalCosts
    const marginPercentage = revenue > 0 ? (grossMargin / revenue) * 100 : 0

    const breakdown: MarginBreakdown[] = [
      {
        category: 'Revenue',
        amount: revenue,
        percentage: 100
      },
      {
        category: 'Payroll Costs',
        amount: payrollCosts,
        percentage: revenue > 0 ? (payrollCosts / revenue) * 100 : 0
      }
    ]

    if (includeExpenses && expenseCosts > 0) {
      breakdown.push({
        category: 'Expenses',
        amount: expenseCosts,
        percentage: revenue > 0 ? (expenseCosts / revenue) * 100 : 0
      })
    }

    breakdown.push({
      category: 'Gross Margin',
      amount: grossMargin,
      percentage: marginPercentage
    })

    return {
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      revenue,
      costs: totalCosts,
      grossMargin,
      marginPercentage,
      breakdown
    }
  }, [invoices, timesheets, expenses])

  const analyzeClientProfitability = useCallback((
    startDate?: Date,
    endDate?: Date
  ): ClientProfitability[] => {
    const filteredInvoices = invoices.filter(inv => {
      if (inv.status === 'cancelled') return false
      if (!startDate && !endDate) return true
      
      const invDate = new Date(inv.issueDate)
      if (startDate && invDate < startDate) return false
      if (endDate && invDate > endDate) return false
      return true
    })

    const filteredTimesheets = timesheets.filter(ts => {
      if (ts.status !== 'approved') return false
      if (!startDate && !endDate) return true
      
      const tsDate = new Date(ts.weekEnding)
      if (startDate && tsDate < startDate) return false
      if (endDate && tsDate > endDate) return false
      return true
    })

    const clientData = new Map<string, { revenue: number; costs: number; invoiceCount: number }>()

    filteredInvoices.forEach(inv => {
      const existing = clientData.get(inv.clientName) || { revenue: 0, costs: 0, invoiceCount: 0 }
      clientData.set(inv.clientName, {
        revenue: existing.revenue + inv.amount,
        costs: existing.costs,
        invoiceCount: existing.invoiceCount + 1
      })
    })

    filteredTimesheets.forEach(ts => {
      const existing = clientData.get(ts.clientName) || { revenue: 0, costs: 0, invoiceCount: 0 }
      clientData.set(ts.clientName, {
        ...existing,
        costs: existing.costs + ts.amount
      })
    })

    return Array.from(clientData.entries())
      .map(([clientName, data]) => ({
        clientName,
        revenue: data.revenue,
        costs: data.costs,
        margin: data.revenue - data.costs,
        marginPercentage: data.revenue > 0 ? ((data.revenue - data.costs) / data.revenue) * 100 : 0,
        invoiceCount: data.invoiceCount,
        avgInvoiceValue: data.invoiceCount > 0 ? data.revenue / data.invoiceCount : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
  }, [invoices, timesheets])

  const analyzeWorkerUtilization = useCallback((
    startDate: Date,
    endDate: Date,
    standardWorkWeekHours: number = 40
  ): WorkerUtilization[] => {
    const periodTimesheets = timesheets.filter(ts => {
      const tsDate = new Date(ts.weekEnding)
      return tsDate >= startDate && tsDate <= endDate && ts.status === 'approved'
    })

    const workerData = new Map<string, { name: string; hours: number; revenue: number }>()

    periodTimesheets.forEach(ts => {
      const existing = workerData.get(ts.workerId) || { name: ts.workerName, hours: 0, revenue: 0 }
      workerData.set(ts.workerId, {
        name: existing.name,
        hours: existing.hours + ts.hours,
        revenue: existing.revenue + ts.amount
      })
    })

    const weeksInPeriod = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))
    const availableHours = weeksInPeriod * standardWorkWeekHours

    return Array.from(workerData.entries())
      .map(([workerId, data]) => ({
        workerId,
        workerName: data.name,
        hoursWorked: data.hours,
        availableHours,
        utilizationRate: (data.hours / availableHours) * 100,
        revenue: data.revenue,
        avgRate: data.hours > 0 ? data.revenue / data.hours : 0
      }))
      .sort((a, b) => b.utilizationRate - a.utilizationRate)
  }, [timesheets])

  const comparePeriods = useCallback((
    currentStart: Date,
    currentEnd: Date,
    previousStart: Date,
    previousEnd: Date
  ): PeriodComparison => {
    const current = calculateMarginForPeriod(currentStart, currentEnd)
    const previous = calculateMarginForPeriod(previousStart, previousEnd)

    const revenueChange = current.revenue - previous.revenue
    const revenueChangePercentage = previous.revenue > 0
      ? (revenueChange / previous.revenue) * 100
      : 0

    const marginChange = current.grossMargin - previous.grossMargin
    const marginChangePercentage = previous.grossMargin > 0
      ? (marginChange / previous.grossMargin) * 100
      : 0

    return {
      current,
      previous,
      revenueChange,
      revenueChangePercentage,
      marginChange,
      marginChangePercentage
    }
  }, [calculateMarginForPeriod])

  const calculateBreakEvenPoint = useCallback((
    fixedCosts: number,
    avgMarginPercentage: number
  ): number => {
    if (avgMarginPercentage <= 0) return 0
    return fixedCosts / (avgMarginPercentage / 100)
  }, [])

  const forecastRevenue = useCallback((
    historicalMonths: number = 6,
    forecastMonths: number = 3
  ): number[] => {
    const now = new Date()
    const monthlyRevenue: number[] = []

    for (let i = historicalMonths - 1; i >= 0; i--) {
      const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const margin = calculateMarginForPeriod(startDate, endDate)
      monthlyRevenue.push(margin.revenue)
    }

    const avgRevenue = monthlyRevenue.reduce((sum, rev) => sum + rev, 0) / monthlyRevenue.length

    const trend = monthlyRevenue.length > 1
      ? (monthlyRevenue[monthlyRevenue.length - 1] - monthlyRevenue[0]) / monthlyRevenue.length
      : 0

    const forecast: number[] = []
    for (let i = 1; i <= forecastMonths; i++) {
      forecast.push(avgRevenue + (trend * i))
    }

    return forecast
  }, [calculateMarginForPeriod])

  return {
    calculateMarginForPeriod,
    analyzeClientProfitability,
    analyzeWorkerUtilization,
    comparePeriods,
    calculateBreakEvenPoint,
    forecastRevenue
  }
}
