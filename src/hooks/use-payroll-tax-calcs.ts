import { useCallback } from 'react'
import type { PayrollConfig } from './use-payroll-calculations.types'

export function usePAYETaxCalcs(payrollConfig: PayrollConfig) {
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

  return { calculateIncomeTax, calculateNationalInsurance, calculateEmployerNI, calculatePensionContribution, calculateStudentLoan }
}
