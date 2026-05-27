import { useCallback } from 'react'
import type { Timesheet, Invoice, Expense } from '@/lib/types'
import type { MarginCalculation, MarginBreakdown } from './use-margin-analysis.types'

export function useMarginAnalysisPeriod(
  timesheets: Timesheet[],
  invoices: Invoice[],
  expenses: Expense[]
) {
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

    const revenue = periodInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0)
    const payrollCosts = periodTimesheets.reduce((sum, ts) => sum + (ts.amount || 0), 0)
    const expenseCosts = periodExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    const totalCosts = payrollCosts + expenseCosts
    const grossMargin = revenue - totalCosts
    const marginPercentage = revenue > 0 ? (grossMargin / revenue) * 100 : 0

    const breakdown: MarginBreakdown[] = [
      { category: 'Revenue', amount: revenue, percentage: 100 },
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

    breakdown.push({ category: 'Gross Margin', amount: grossMargin, percentage: marginPercentage })

    return {
      period: `${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`,
      revenue,
      costs: totalCosts,
      grossMargin,
      marginPercentage,
      breakdown
    }
  }, [invoices, timesheets, expenses])

  return { calculateMarginForPeriod }
}
