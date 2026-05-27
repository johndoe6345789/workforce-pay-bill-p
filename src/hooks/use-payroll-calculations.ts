import { useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Timesheet, PayrollRun, Worker } from '@/lib/types'
import { DEFAULT_PAYROLL_CONFIG } from './use-payroll-calculations.types'
import type { PayrollConfig, PayrollCalculationResult, PayrollBreakdown } from './use-payroll-calculations.types'
import { usePAYETaxCalcs } from './use-payroll-tax-calcs'
import { usePAYEHolidayCalc } from './use-payroll-holiday-calc'
import { usePAYEStatutoryCalcs } from './use-payroll-statutory-calcs'
import { usePAYEProcessRun } from './use-payroll-process-run'

export type { PayrollConfig, PayrollCalculationResult, PayrollBreakdown } from './use-payroll-calculations.types'
export type { HolidayPayCalculation } from './use-payroll-calculations.types'

export function usePayrollCalculations(config: Partial<PayrollConfig> = {}) {
  const [timesheets = []] = useKV<Timesheet[]>('timesheets', [])
  const [workers = []] = useKV<Worker[]>('workers', [])
  const [payrollRuns = [], setPayrollRuns] = useKV<PayrollRun[]>('payroll-runs', [])

  const payrollConfig = useMemo(() => ({ ...DEFAULT_PAYROLL_CONFIG, ...config }), [config])

  const { calculateIncomeTax, calculateNationalInsurance, calculateEmployerNI, calculatePensionContribution, calculateStudentLoan } = usePAYETaxCalcs(payrollConfig)
  const { calculateHolidayPay } = usePAYEHolidayCalc(workers, timesheets)
  const { calculateCISDeduction, calculateStatutoryPayments } = usePAYEStatutoryCalcs()

  const calculatePayroll = useCallback((
    workerId: string,
    grossPay: number,
    annualGross?: number,
    includeStudentLoan: boolean = false
  ): PayrollCalculationResult => {
    const worker = workers.find(w => w.id === workerId)
    const estimatedAnnual = annualGross || grossPay * 12
    const incomeTax = calculateIncomeTax(grossPay, estimatedAnnual)
    const nationalInsurance = calculateNationalInsurance(grossPay, estimatedAnnual)
    const pensionContribution = calculatePensionContribution(grossPay, estimatedAnnual)
    const studentLoan = includeStudentLoan ? calculateStudentLoan(grossPay, estimatedAnnual) : 0
    const employerNI = calculateEmployerNI(grossPay, estimatedAnnual)
    const netPay = grossPay - incomeTax - nationalInsurance - pensionContribution - studentLoan
    const breakdown: PayrollBreakdown[] = [
      { description: 'Gross Pay', amount: grossPay, type: 'earning' },
      { description: 'Income Tax', amount: -incomeTax, type: 'deduction' },
      { description: 'National Insurance', amount: -nationalInsurance, type: 'deduction' },
      { description: 'Pension Contribution', amount: -pensionContribution, type: 'deduction' },
      ...(studentLoan > 0 ? [{ description: 'Student Loan', amount: -studentLoan, type: 'deduction' as const }] : []),
      { description: 'Net Pay', amount: netPay, type: 'earning' },
      { description: 'Employer NI', amount: employerNI, type: 'employer-cost' }
    ]
    return { workerId, workerName: worker?.name || 'Unknown', grossPay, incomeTax, nationalInsurance, pensionContribution, studentLoan: studentLoan > 0 ? studentLoan : undefined, netPay, employerNI, totalCost: grossPay + employerNI + pensionContribution, breakdown }
  }, [workers, calculateIncomeTax, calculateNationalInsurance, calculatePensionContribution, calculateStudentLoan, calculateEmployerNI])

  const calculateBatchPayroll = useCallback((timesheetIds: string[]): PayrollCalculationResult[] => {
    const workerTotals = timesheets
      .filter(ts => timesheetIds.includes(ts.id) && ts.status === 'approved')
      .reduce((acc, ts) => {
        if (!acc[ts.workerId]) acc[ts.workerId] = { grossPay: 0, workerName: ts.workerName }
        acc[ts.workerId].grossPay += (ts.amount || 0)
        return acc
      }, {} as Record<string, { grossPay: number; workerName: string }>)
    return Object.entries(workerTotals).map(([workerId, data]) => calculatePayroll(workerId, data.grossPay))
  }, [timesheets, calculatePayroll])

  const { isProcessing, processPayrollRun } = usePAYEProcessRun(calculateBatchPayroll, setPayrollRuns)

  return {
    payrollConfig, isProcessing, payrollRuns,
    calculatePayroll, calculateBatchPayroll, calculateHolidayPay, processPayrollRun,
    calculateCISDeduction, calculateStatutoryPayments,
    calculateIncomeTax, calculateNationalInsurance, calculateEmployerNI,
  }
}
