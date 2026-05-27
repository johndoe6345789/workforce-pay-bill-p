export interface TaxBand {
  threshold: number
  rate: number
}

export interface NIContribution {
  threshold: number
  rate: number
  upperThreshold?: number
}

export interface PayrollCalculationResult {
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

export interface PayrollBreakdown {
  description: string
  amount: number
  type: 'earning' | 'deduction' | 'employer-cost'
}

export interface PayrollConfig {
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

export interface HolidayPayCalculation {
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

export const DEFAULT_PAYROLL_CONFIG: PayrollConfig = {
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
