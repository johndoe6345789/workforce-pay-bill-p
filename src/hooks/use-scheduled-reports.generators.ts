import type { Invoice, PayrollRun, Timesheet, Expense } from '@/lib/types'

export function generateMarginAnalysis(invoices: Invoice[], payrollRuns: PayrollRun[]) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months.map((month, index) => {
    const monthRevenue = invoices
      .filter(inv => new Date(inv.issueDate).getMonth() === index)
      .reduce((sum, inv) => sum + inv.amount, 0)
    const monthCosts = payrollRuns
      .filter(pr => new Date(pr.periodEnding).getMonth() === index)
      .reduce((sum, pr) => sum + pr.totalAmount, 0)
    const margin = monthRevenue - monthCosts
    const marginPercentage = monthRevenue > 0 ? (margin / monthRevenue) * 100 : 0
    return { month, revenue: monthRevenue, costs: monthCosts, margin, marginPercentage: marginPercentage.toFixed(2) }
  })
}

export function generateRevenueSummary(invoices: Invoice[]) {
  return invoices.map(inv => ({
    invoiceNumber: inv.invoiceNumber,
    client: inv.clientName,
    amount: inv.amount,
    status: inv.status,
    issueDate: inv.issueDate,
    dueDate: inv.dueDate
  }))
}

export function generatePayrollSummary(payrollRuns: PayrollRun[]) {
  return payrollRuns.map(pr => ({
    payrollId: pr.id,
    periodEnding: pr.periodEnding,
    workerCount: pr.workersCount,
    totalAmount: pr.totalAmount,
    status: pr.status,
    processedDate: pr.processedDate
  }))
}

export function generateTimesheetSummary(timesheets: Timesheet[]) {
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

export function generateExpenseSummary(expenses: Expense[]) {
  return expenses.map(exp => ({
    workerName: exp.workerName,
    category: exp.category,
    amount: exp.amount,
    date: exp.date,
    status: exp.status,
    description: exp.description
  }))
}
export function generateCashFlow(invoices: Invoice[], payrollRuns: PayrollRun[], expenses: Expense[]) {
  const income = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const payrollCosts = payrollRuns.filter(pr => pr.status === 'completed').reduce((sum, pr) => sum + pr.totalAmount, 0)
  const expenseCosts = expenses.filter(exp => exp.status === 'approved').reduce((sum, exp) => sum + exp.amount, 0)
  const netCashFlow = income - payrollCosts - expenseCosts
  return [{ totalIncome: income, payrollExpenses: payrollCosts, otherExpenses: expenseCosts, totalExpenses: payrollCosts + expenseCosts, netCashFlow, generatedAt: new Date().toISOString() }]
}

export function generateWorkerUtilization(timesheets: Timesheet[]) {
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

export function generateComplianceStatus(timesheets: Timesheet[], invoices: Invoice[]) {
  const totalTimesheets = timesheets.length
  const approvedTimesheets = timesheets.filter(ts => ts.status === 'approved').length
  const totalInvoices = invoices.length
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length
  return [{
    timesheetComplianceRate: totalTimesheets > 0 ? ((approvedTimesheets / totalTimesheets) * 100).toFixed(2) + '%' : '0%',
    invoicePaymentRate: totalInvoices > 0 ? ((paidInvoices / totalInvoices) * 100).toFixed(2) + '%' : '0%',
    totalTimesheets, approvedTimesheets, pendingTimesheets: totalTimesheets - approvedTimesheets,
    totalInvoices, paidInvoices, unpaidInvoices: totalInvoices - paidInvoices,
    generatedAt: new Date().toISOString()
  }]
}
