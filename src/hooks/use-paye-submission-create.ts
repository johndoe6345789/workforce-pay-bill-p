import { useCallback } from 'react'
import type { PAYESubmission, FPSData, PAYEConfig } from './use-paye-integration.types'
import { calculateTaxYear, calculateTaxMonth } from './use-paye-integration.calc'

export function usePAYESubmissionCreate(
  payeConfig: PAYEConfig,
  fpsData: FPSData[],
  setSubmissions: (updater: (current: PAYESubmission[]) => PAYESubmission[]) => void,
) {
  const createPAYESubmission = useCallback((
    type: PAYESubmission['type'],
    payrollRunId: string,
    fpsId?: string,
  ): PAYESubmission => {
    const now = new Date()
    const taxYear = calculateTaxYear(now)
    const taxMonth = calculateTaxMonth(now)

    let totalPayment = 0
    let totalTax = 0
    let totalNI = 0
    let employeesCount = 0

    if (type === 'FPS' && fpsId) {
      const fps = fpsData.find(f => f.id === fpsId)
      if (fps) {
        totalPayment = fps.totalPayment
        totalTax = fps.totalTax
        totalNI = fps.totalEmployeeNI + fps.totalEmployerNI
        employeesCount = fps.employees.length
      }
    }

    const submission: PAYESubmission = {
      id: `PAYE-${type}-${Date.now()}`,
      type,
      taxYear,
      taxMonth,
      status: 'draft',
      createdDate: now.toISOString(),
      payrollRunId,
      employerRef: payeConfig.employerRef,
      employeesCount,
      totalPayment,
      totalTax,
      totalNI
    }

    setSubmissions(current => [...(current || []), submission])
    return submission
  }, [payeConfig, fpsData, setSubmissions])

  return { createPAYESubmission }
}
