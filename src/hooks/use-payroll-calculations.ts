import { useState, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'
import type { Timesheet, PayrollRun, Worker } from '@/lib/types'

interface TaxBand {
  threshold: number
  rate: number
}

interface NIContribution {
  threshold: number
  rate: number
  upperThreshold?: number
}

interface PayrollCalculationResult {
  workerId: string
  workerName: string
  grossPay: number
  incomeTax: number
  nationalInsurance: number
  pensionContribution: number
  studentLoan?: number
  netPay: number
  employerNI: number
  totalCost: number
  breakdown: PayrollBreakdown[]
}

interface PayrollBreakdown {
  description: string
  amount: number
  type: 'earning' | 'deduction' | 'employer-cost'
}

interface PayrollConfig {
  taxYear: string
  personalAllowance: number
  taxBands: TaxBand[]
  niRates: NIContribution[]
  employerNIRate: number
  pensionRate: number
  autoEnrollmentThreshold: number
  studentLoanThreshold?: number
  studentLoanRate?: number
}

interface HolidayPayCalculation {
  workerId: string
  workerName: string
  eligibleHours: number
  holidayAccrualRate: number
  accruedHoliday: number
  usedHoliday: number
  remainingHoliday: number
  holidayPayRate: number
  totalHolidayPay: number
}

const DEFAULT_PAYROLL_CONFIG: PayrollConfig = {
  taxYear: '2024/25',
  personalAllowance: 12570,
  taxBands: [
    { threshold: 0, rate: 0.20 },
    { threshold: 50270, rate: 0.40 },
    { threshold: 125140, rate: 0.45 }
  ],
  niRates: [
    { threshold: 12570, rate: 0.12, upperThreshold: 50270 },
    { threshold: 50270, rate: 0.02 }
  ],
  employerNIRate: 0.138,
  pensionRate: 0.05,
  autoEnrollmentThreshold: 10000,
  studentLoanThreshold: 27295,
  studentLoanRate: 0.09
}

export function usePayrollCalculations(config: Partial<PayrollConfig> = {}) {
  const [timesheets = []] = useKV<Timesheet[]>('timesheets', [])
  const [workers = []] = useKV<Worker[]>('workers', [])
  const [payrollRuns = [], setPayrollRuns] = useKV<PayrollRun[]>('payroll-runs', [])
  const [isProcessing, setIsProcessing] = useState(false)

  const payrollConfig = useMemo(
    () => ({ ...DEFAULT_PAYROLL_CONFIG, ...config }),
    [config]
  )

  const calculateIncomeTax = useCallback((grossPay: number, annualGross: number): number => {
    const taxableIncome = Math.max(0, annualGross - payrollConfig.personalAllowance)
    let tax = 0

    for (let i = 0; i < payrollConfig.taxBands.length; i++) {
      const band = payrollConfig.taxBands[i]
      const nextBand = payrollConfig.taxBands[i + 1]
      
      if (taxableIncome > band.threshold) {
        const taxableInBand = nextBand
          ? Math.min(taxableIncome, nextBand.threshold) - band.threshold
          : taxableIncome - band.threshold
        
        tax += taxableInBand * band.rate
      }
    }

    return (tax / annualGross) * grossPay
  }, [payrollConfig])

  const calculateNationalInsurance = useCallback((grossPay: number, annualGross: number): number => {
    let ni = 0

    for (const rate of payrollConfig.niRates) {
      if (annualGross > rate.threshold) {
        const niableInBand = rate.upperThreshold
          ? Math.min(annualGross, rate.upperThreshold) - rate.threshold
          : annualGross - rate.threshold
        
        ni += niableInBand * rate.rate
      }
    }

    return (ni / annualGross) * grossPay
  }, [payrollConfig])

  const calculateEmployerNI = useCallback((grossPay: number, annualGross: number): number => {
    const niableIncome = Math.max(0, annualGross - payrollConfig.niRates[0].threshold)
    const annualEmployerNI = niableIncome * payrollConfig.employerNIRate
    return (annualEmployerNI / annualGross) * grossPay
  }, [payrollConfig])

  const calculatePensionContribution = useCallback((grossPay: number, annualGross: number): number => {
    if (annualGross < payrollConfig.autoEnrollmentThreshold) return 0
    return grossPay * payrollConfig.pensionRate
  }, [payrollConfig])

  const calculateStudentLoan = useCallback((grossPay: number, annualGross: number): number => {
    if (!payrollConfig.studentLoanThreshold || !payrollConfig.studentLoanRate) return 0
    if (annualGross <= payrollConfig.studentLoanThreshold) return 0
    
    const repayableIncome = annualGross - payrollConfig.studentLoanThreshold
    return (repayableIncome * payrollConfig.studentLoanRate / annualGross) * grossPay
  }, [payrollConfig])

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
    const totalCost = grossPay + employerNI + pensionContribution

    const breakdown: PayrollBreakdown[] = [
      { description: 'Gross Pay', amount: grossPay, type: 'earning' },
      { description: 'Income Tax', amount: -incomeTax, type: 'deduction' },
      { description: 'National Insurance', amount: -nationalInsurance, type: 'deduction' },
      { description: 'Pension Contribution', amount: -pensionContribution, type: 'deduction' }
    ]

    if (studentLoan > 0) {
      breakdown.push({ description: 'Student Loan', amount: -studentLoan, type: 'deduction' })
    }

    breakdown.push(
      { description: 'Net Pay', amount: netPay, type: 'earning' },
      { description: 'Employer NI', amount: employerNI, type: 'employer-cost' }
    )

    return {
      workerId,
      workerName: worker?.name || 'Unknown',
      grossPay,
      incomeTax,
      nationalInsurance,
      pensionContribution,
      studentLoan: studentLoan > 0 ? studentLoan : undefined,
      netPay,
      employerNI,
      totalCost,
      breakdown
    }
  }, [workers, calculateIncomeTax, calculateNationalInsurance, calculatePensionContribution, calculateStudentLoan, calculateEmployerNI])

  const calculateBatchPayroll = useCallback((
    timesheetIds: string[]
  ): PayrollCalculationResult[] => {
    const relevantTimesheets = timesheets.filter(ts => 
      timesheetIds.includes(ts.id) && ts.status === 'approved'
    )

    const workerTotals = relevantTimesheets.reduce((acc, ts) => {
      if (!acc[ts.workerId]) {
        acc[ts.workerId] = { grossPay: 0, workerName: ts.workerName }
      }
      acc[ts.workerId].grossPay += ts.amount
      return acc
    }, {} as Record<string, { grossPay: number; workerName: string }>)

    return Object.entries(workerTotals).map(([workerId, data]) =>
      calculatePayroll(workerId, data.grossPay)
    )
  }, [timesheets, calculatePayroll])

  const calculateHolidayPay = useCallback((
    workerId: string,
    startDate: Date,
    endDate: Date,
    holidayAccrualRate: number = 0.1207
  ): HolidayPayCalculation => {
    const worker = workers.find(w => w.id === workerId)
    const workerTimesheets = timesheets.filter(ts => {
      if (ts.workerId !== workerId) return false
      const tsDate = new Date(ts.weekEnding)
      return tsDate >= startDate && tsDate <= endDate
    })

    const eligibleHours = workerTimesheets.reduce((sum, ts) => sum + ts.hours, 0)
    const accruedHoliday = eligibleHours * holidayAccrualRate

    const avgRate = workerTimesheets.length > 0
      ? workerTimesheets.reduce((sum, ts) => sum + (ts.rate || 0), 0) / workerTimesheets.length
      : 0

    const totalHolidayPay = accruedHoliday * avgRate

    return {
      workerId,
      workerName: worker?.name || 'Unknown',
      eligibleHours,
      holidayAccrualRate,
      accruedHoliday,
      usedHoliday: 0,
      remainingHoliday: accruedHoliday,
      holidayPayRate: avgRate,
      totalHolidayPay
    }
  }, [workers, timesheets])

  const processPayrollRun = useCallback(async (
    periodEnding: string,
    timesheetIds: string[]
  ): Promise<PayrollRun> => {
    setIsProcessing(true)
    try {
      const calculations = calculateBatchPayroll(timesheetIds)
      const totalAmount = calculations.reduce((sum, calc) => sum + calc.netPay, 0)

      const payrollRun: PayrollRun = {
        id: `PR-${Date.now()}`,
        periodEnding,
        workersCount: calculations.length,
        totalAmount,
        status: 'completed',
        processedDate: new Date().toISOString()
      }

      setPayrollRuns(current => [...(current || []), payrollRun])
      return payrollRun
    } finally {
      setIsProcessing(false)
    }
  }, [calculateBatchPayroll, setPayrollRuns])

  const calculateCISDeduction = useCallback((grossPay: number, cisRate: number = 0.20): number => {
    return grossPay * cisRate
  }, [])

  const calculateStatutoryPayments = useCallback((
    weeklyRate: number,
    weeks: number,
    type: 'sick' | 'maternity' | 'paternity'
  ): number => {
    const rates = {
      sick: 116.75,
      maternity: 184.03,
      paternity: 184.03
    }

    const weeklyAmount = Math.min(weeklyRate * 0.9, rates[type])
    return weeklyAmount * weeks
  }, [])

  return {
    payrollConfig,
    isProcessing,
    calculatePayroll,
    calculateBatchPayroll,
    calculateHolidayPay,
    processPayrollRun,
    calculateCISDeduction,
    calculateStatutoryPayments,
    calculateIncomeTax,
    calculateNationalInsurance,
    calculateEmployerNI,
    payrollRuns
  }
}
