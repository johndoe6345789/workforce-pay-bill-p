import { useState, useCallback, useMemo } from 'react'
import { useKV } from '@github/spark/hooks'

export interface PAYESubmission {
  id: string
  type: 'FPS' | 'EPS' | 'EAS' | 'NVR'
  taxYear: string
  taxMonth: number
  status: 'draft' | 'ready' | 'submitted' | 'accepted' | 'rejected' | 'corrected'
  createdDate: string
  submittedDate?: string
  acceptedDate?: string
  payrollRunId: string
  employerRef: string
  employeesCount: number
  totalPayment: number
  totalTax: number
  totalNI: number
  hmrcReference?: string
  errors?: PAYEError[]
  warnings?: PAYEWarning[]
}

export interface PAYEError {
  code: string
  message: string
  field?: string
  severity: 'error' | 'warning'
}

export interface PAYEWarning {
  code: string
  message: string
  field?: string
}

export interface FPSData {
  id: string
  submissionId: string
  taxYear: string
  taxMonth: number
  paymentDate: string
  employerRef: string
  accountsOfficeRef: string
  employees: FPSEmployee[]
  totalPayment: number
  totalTax: number
  totalEmployeeNI: number
  totalEmployerNI: number
  totalStudentLoan: number
}

export interface FPSEmployee {
  workerId: string
  employeeRef: string
  niNumber: string
  title: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'M' | 'F' | 'X'
  address: EmployeeAddress
  taxCode: string
  niCategory: string
  grossPay: number
  taxableGrossPay: number
  incomeTax: number
  employeeNI: number
  employerNI: number
  studentLoan?: number
  studentLoanPlan?: 'Plan1' | 'Plan2' | 'Plan4' | 'PostGrad'
  pensionContribution?: number
  paymentMethod: 'BACS' | 'Cheque' | 'Cash'
  payFrequency: 'Weekly' | 'Fortnightly' | 'FourWeekly' | 'Monthly'
  hoursWorked?: number
  irregularPayment?: boolean
  leavingDate?: string
  starterDeclaration?: StarterDeclaration
}

export interface EmployeeAddress {
  line1: string
  line2?: string
  line3?: string
  line4?: string
  postcode: string
  country?: string
}

export interface StarterDeclaration {
  statementA?: boolean
  statementB?: boolean
  statementC?: boolean
  studentLoanDeduction?: boolean
  postGradLoanDeduction?: boolean
}

export interface EPSData {
  id: string
  submissionId: string
  taxYear: string
  taxMonth: number
  employerRef: string
  accountsOfficeRef: string
  noPaymentForPeriod?: boolean
  cisDeductionsSuffered?: number
  statutorySickPay?: number
  statutoryMaternityPay?: number
  statutoryPaternityPay?: number
  statutoryAdoptionPay?: number
  employmentAllowance?: boolean
  apprenticeshipLevy?: number
  totalReclaimed: number
}

export interface RTIValidationResult {
  isValid: boolean
  errors: PAYEError[]
  warnings: PAYEWarning[]
  canSubmit: boolean
}

export interface PAYEConfig {
  employerRef: string
  accountsOfficeRef: string
  companyName: string
  companyAddress: EmployeeAddress
  contactName: string
  contactPhone: string
  contactEmail: string
  apprenticeshipLevy: boolean
  employmentAllowance: boolean
}

const DEFAULT_PAYE_CONFIG: PAYEConfig = {
  employerRef: '123/AB45678',
  accountsOfficeRef: '123PA00045678',
  companyName: 'WorkForce Pro Ltd',
  companyAddress: {
    line1: '100 Business Park',
    line2: 'Innovation Way',
    line3: 'London',
    postcode: 'EC1A 1BB',
    country: 'England'
  },
  contactName: 'Payroll Manager',
  contactPhone: '020 1234 5678',
  contactEmail: 'payroll@workforcepro.com',
  apprenticeshipLevy: true,
  employmentAllowance: false
}

export function usePAYEIntegration(config: Partial<PAYEConfig> = {}) {
  const [submissions = [], setSubmissions] = useKV<PAYESubmission[]>('paye-submissions', [])
  const [fpsData = [], setFpsData] = useKV<FPSData[]>('paye-fps-data', [])
  const [epsData = [], setEpsData] = useKV<EPSData[]>('paye-eps-data', [])
  const [isValidating, setIsValidating] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const payeConfig = useMemo(
    () => ({ ...DEFAULT_PAYE_CONFIG, ...config }),
    [config]
  )

  const calculateTaxMonth = useCallback((date: Date): number => {
    const month = date.getMonth() + 1
    const taxMonth = month >= 4 ? month - 3 : month + 9
    return taxMonth
  }, [])

  const calculateTaxYear = useCallback((date: Date): string => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    if (month >= 4) {
      return `${year}/${year + 1}`
    }
    return `${year - 1}/${year}`
  }, [])

  const validateNINumber = useCallback((niNumber: string): boolean => {
    const niRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/
    return niRegex.test(niNumber)
  }, [])

  const validateTaxCode = useCallback((taxCode: string): boolean => {
    const taxCodeRegex = /^([1-9][0-9]{0,5}[LMNPTY]|BR|0T|NT|D[0-8]|K[1-9][0-9]{0,5})$/
    return taxCodeRegex.test(taxCode)
  }, [])

  const validateFPSData = useCallback((fps: Partial<FPSEmployee>): RTIValidationResult => {
    const errors: PAYEError[] = []
    const warnings: PAYEWarning[] = []

    if (!fps.niNumber || !validateNINumber(fps.niNumber)) {
      errors.push({
        code: 'INVALID_NI',
        message: 'Invalid National Insurance number format',
        field: 'niNumber',
        severity: 'error'
      })
    }

    if (!fps.taxCode || !validateTaxCode(fps.taxCode)) {
      errors.push({
        code: 'INVALID_TAX_CODE',
        message: 'Invalid tax code format',
        field: 'taxCode',
        severity: 'error'
      })
    }

    if (!fps.firstName || fps.firstName.length < 1) {
      errors.push({
        code: 'MISSING_FIRST_NAME',
        message: 'First name is required',
        field: 'firstName',
        severity: 'error'
      })
    }

    if (!fps.lastName || fps.lastName.length < 1) {
      errors.push({
        code: 'MISSING_LAST_NAME',
        message: 'Last name is required',
        field: 'lastName',
        severity: 'error'
      })
    }

    if (!fps.dateOfBirth) {
      errors.push({
        code: 'MISSING_DOB',
        message: 'Date of birth is required',
        field: 'dateOfBirth',
        severity: 'error'
      })
    }

    if (!fps.address?.postcode) {
      errors.push({
        code: 'MISSING_POSTCODE',
        message: 'Postcode is required',
        field: 'postcode',
        severity: 'error'
      })
    }

    if (fps.grossPay && fps.grossPay < 0) {
      errors.push({
        code: 'NEGATIVE_PAY',
        message: 'Gross pay cannot be negative',
        field: 'grossPay',
        severity: 'error'
      })
    }

    if (fps.incomeTax && fps.incomeTax < 0) {
      errors.push({
        code: 'NEGATIVE_TAX',
        message: 'Income tax cannot be negative',
        field: 'incomeTax',
        severity: 'error'
      })
    }

    if (fps.grossPay && fps.taxableGrossPay && fps.taxableGrossPay > fps.grossPay) {
      warnings.push({
        code: 'TAXABLE_EXCEEDS_GROSS',
        message: 'Taxable gross pay exceeds total gross pay',
        field: 'taxableGrossPay'
      })
    }

    if (fps.studentLoan && !fps.studentLoanPlan) {
      warnings.push({
        code: 'MISSING_LOAN_PLAN',
        message: 'Student loan plan type should be specified when deductions are present',
        field: 'studentLoanPlan'
      })
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      canSubmit: errors.length === 0
    }
  }, [validateNINumber, validateTaxCode])

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
  }, [payeConfig, calculateTaxYear, calculateTaxMonth, setFpsData])

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

  const validateSubmission = useCallback(async (
    submissionId: string
  ): Promise<RTIValidationResult> => {
    setIsValidating(true)
    try {
      const submission = submissions.find(s => s.id === submissionId)
      if (!submission) {
        return {
          isValid: false,
          errors: [{
            code: 'SUBMISSION_NOT_FOUND',
            message: 'Submission not found',
            severity: 'error'
          }],
          warnings: [],
          canSubmit: false
        }
      }

      if (submission.type === 'FPS') {
        const fps = fpsData.find(f => f.submissionId === submissionId)
        if (!fps) {
          return {
            isValid: false,
            errors: [{
              code: 'FPS_DATA_NOT_FOUND',
              message: 'FPS data not found',
              severity: 'error'
            }],
            warnings: [],
            canSubmit: false
          }
        }

        const allErrors: PAYEError[] = []
        const allWarnings: PAYEWarning[] = []

        for (const employee of fps.employees) {
          const validation = validateFPSData(employee)
          allErrors.push(...validation.errors)
          allWarnings.push(...validation.warnings)
        }

        return {
          isValid: allErrors.length === 0,
          errors: allErrors,
          warnings: allWarnings,
          canSubmit: allErrors.length === 0
        }
      }

      return {
        isValid: true,
        errors: [],
        warnings: [],
        canSubmit: true
      }
    } finally {
      setIsValidating(false)
    }
  }, [submissions, fpsData, validateFPSData])

  const submitToHMRC = useCallback(async (
    submissionId: string
  ): Promise<{ success: boolean; hmrcReference?: string; errors?: PAYEError[] }> => {
    setIsSubmitting(true)
    try {
      const validation = await validateSubmission(submissionId)
      
      if (!validation.canSubmit) {
        return {
          success: false,
          errors: validation.errors
        }
      }

      await new Promise(resolve => setTimeout(resolve, 2000))

      const hmrcReference = `HMRC-${Date.now()}`
      
      setSubmissions(current =>
        (current || []).map(sub =>
          sub.id === submissionId
            ? {
                ...sub,
                status: 'submitted',
                submittedDate: new Date().toISOString(),
                hmrcReference,
                errors: validation.errors.length > 0 ? validation.errors : undefined,
                warnings: validation.warnings.length > 0 ? validation.warnings : undefined
              }
            : sub
        )
      )

      setTimeout(() => {
        setSubmissions(current =>
          (current || []).map(sub =>
            sub.id === submissionId
              ? {
                  ...sub,
                  status: 'accepted',
                  acceptedDate: new Date().toISOString()
                }
              : sub
          )
        )
      }, 3000)

      return {
        success: true,
        hmrcReference
      }
    } catch (error) {
      return {
        success: false,
        errors: [{
          code: 'SUBMISSION_FAILED',
          message: error instanceof Error ? error.message : 'Unknown error',
          severity: 'error'
        }]
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [validateSubmission, setSubmissions])

  const createPAYESubmission = useCallback((
    type: PAYESubmission['type'],
    payrollRunId: string,
    fpsId?: string,
    epsId?: string
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
  }, [payeConfig, calculateTaxYear, calculateTaxMonth, fpsData, setSubmissions])

  const calculateApprenticeshipLevy = useCallback((totalPayroll: number): number => {
    const allowance = 15000
    const levyRate = 0.005
    
    if (totalPayroll <= 3000000) return 0
    
    const levy = (totalPayroll * levyRate) - allowance
    return Math.max(0, levy)
  }, [])

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

  const getSubmissionStatus = useCallback((submissionId: string): PAYESubmission | undefined => {
    return submissions.find(s => s.id === submissionId)
  }, [submissions])

  const getPendingSubmissions = useCallback((): PAYESubmission[] => {
    return submissions.filter(s => s.status === 'draft' || s.status === 'ready')
  }, [submissions])

  const getSubmittedSubmissions = useCallback((): PAYESubmission[] => {
    return submissions.filter(s => s.status === 'submitted' || s.status === 'accepted')
  }, [submissions])

  return {
    payeConfig,
    submissions,
    fpsData,
    epsData,
    isValidating,
    isSubmitting,
    createFPS,
    createEPS,
    validateFPSData,
    validateSubmission,
    submitToHMRC,
    createPAYESubmission,
    calculateApprenticeshipLevy,
    generateRTIReport,
    getSubmissionStatus,
    getPendingSubmissions,
    getSubmittedSubmissions,
    calculateTaxMonth,
    calculateTaxYear
  }
}
