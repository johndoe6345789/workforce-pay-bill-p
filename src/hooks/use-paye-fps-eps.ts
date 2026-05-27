import { useCallback } from 'react'
import type { FPSEmployee, FPSData, EPSData, PAYEConfig } from './use-paye-integration.types'
import { calculateTaxYear, calculateTaxMonth } from './use-paye-integration.calc'

export function usePAYEFpsEps(
  payeConfig: PAYEConfig,
  setFpsData: (updater: (current: FPSData[]) => FPSData[]) => void,
  setEpsData: (updater: (current: EPSData[]) => EPSData[]) => void,
) {
  const createFPS = useCallback((
    payrollRunId: string,
    employees: FPSEmployee[],
    paymentDate: string
  ): FPSData => {
    const date = new Date(paymentDate)
    const taxYear = calculateTaxYear(date)
    const taxMonth = calculateTaxMonth(date)

    const totalPayment = employees.reduce((sum, e) => sum + e.grossPay, 0)
    const totalTax = employees.reduce((sum, e) => sum + e.incomeTax, 0)
    const totalEmployeeNI = employees.reduce((sum, e) => sum + e.employeeNI, 0)
    const totalEmployerNI = employees.reduce((sum, e) => sum + e.employerNI, 0)
    const totalStudentLoan = employees.reduce((sum, e) => sum + (e.studentLoan || 0), 0)

    const fps: FPSData = {
      id: `FPS-${Date.now()}`,
      submissionId: `SUB-FPS-${Date.now()}`,
      taxYear,
      taxMonth,
      paymentDate,
      employerRef: payeConfig.employerRef,
      accountsOfficeRef: payeConfig.accountsOfficeRef,
      employees,
      totalPayment,
      totalTax,
      totalEmployeeNI,
      totalEmployerNI,
      totalStudentLoan
    }

    setFpsData(current => [...(current || []), fps])
    return fps
  }, [payeConfig, setFpsData])

  const createEPS = useCallback((
    taxYear: string,
    taxMonth: number,
    data: Partial<EPSData>
  ): EPSData => {
    const eps: EPSData = {
      id: `EPS-${Date.now()}`,
      submissionId: `SUB-EPS-${Date.now()}`,
      taxYear,
      taxMonth,
      employerRef: payeConfig.employerRef,
      accountsOfficeRef: payeConfig.accountsOfficeRef,
      noPaymentForPeriod: data.noPaymentForPeriod || false,
      cisDeductionsSuffered: data.cisDeductionsSuffered || 0,
      statutorySickPay: data.statutorySickPay || 0,
      statutoryMaternityPay: data.statutoryMaternityPay || 0,
      statutoryPaternityPay: data.statutoryPaternityPay || 0,
      statutoryAdoptionPay: data.statutoryAdoptionPay || 0,
      employmentAllowance: payeConfig.employmentAllowance,
      apprenticeshipLevy: data.apprenticeshipLevy || 0,
      totalReclaimed: (data.cisDeductionsSuffered || 0) +
        (data.statutorySickPay || 0) +
        (data.statutoryMaternityPay || 0) +
        (data.statutoryPaternityPay || 0) +
        (data.statutoryAdoptionPay || 0)
    }

    setEpsData(current => [...(current || []), eps])
    return eps
  }, [payeConfig, setEpsData])

  return { createFPS, createEPS }
}
