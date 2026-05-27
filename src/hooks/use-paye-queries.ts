import { useCallback } from 'react'
import type { PAYESubmission, FPSData } from './use-paye-integration.types'

export function usePAYEQueries(
  submissions: PAYESubmission[],
  fpsData: FPSData[],
) {
  const generateRTIReport = useCallback((submissionId: string): string => {
    const submission = submissions.find(s => s.id === submissionId)
    if (!submission) return ''

    if (submission.type === 'FPS') {
      const fps = fpsData.find(f => f.submissionId === submissionId)
      if (!fps) return ''

      let report = `FULL PAYMENT SUBMISSION (FPS)\n`
      report += `${'='.repeat(60)}\n\n`
      report += `Employer Reference: ${fps.employerRef}\n`
      report += `Tax Year: ${fps.taxYear}\n`
      report += `Tax Month: ${fps.taxMonth}\n`
      report += `Payment Date: ${new Date(fps.paymentDate).toLocaleDateString()}\n`
      report += `Employees: ${fps.employees.length}\n\n`
      report += `SUMMARY\n`
      report += `${'-'.repeat(60)}\n`
      report += `Total Gross Pay: £${fps.totalPayment.toFixed(2)}\n`
      report += `Total Tax: £${fps.totalTax.toFixed(2)}\n`
      report += `Total Employee NI: £${fps.totalEmployeeNI.toFixed(2)}\n`
      report += `Total Employer NI: £${fps.totalEmployerNI.toFixed(2)}\n`
      report += `Total Student Loan: £${fps.totalStudentLoan.toFixed(2)}\n\n`
      report += `EMPLOYEES\n`
      report += `${'-'.repeat(60)}\n`
      fps.employees.forEach((emp, idx) => {
        report += `${idx + 1}. ${emp.firstName} ${emp.lastName}\n`
        report += `   NI Number: ${emp.niNumber}\n`
        report += `   Tax Code: ${emp.taxCode}\n`
        report += `   Gross Pay: £${emp.grossPay.toFixed(2)}\n`
        report += `   Tax: £${emp.incomeTax.toFixed(2)}\n`
        report += `   NI: £${emp.employeeNI.toFixed(2)}\n`
        report += `\n`
      })

      return report
    }

    return ''
  }, [submissions, fpsData])

  const getSubmissionStatus = useCallback(
    (submissionId: string): PAYESubmission | undefined =>
      submissions.find(s => s.id === submissionId),
    [submissions]
  )

  const getPendingSubmissions = useCallback(
    (): PAYESubmission[] =>
      submissions.filter(s => s.status === 'draft' || s.status === 'ready'),
    [submissions]
  )

  const getSubmittedSubmissions = useCallback(
    (): PAYESubmission[] =>
      submissions.filter(s => s.status === 'submitted' || s.status === 'accepted'),
    [submissions]
  )

  return { generateRTIReport, getSubmissionStatus, getPendingSubmissions, getSubmittedSubmissions }
}
