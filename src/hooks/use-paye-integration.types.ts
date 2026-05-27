export type {
  FPSData,
  FPSEmployee,
  EmployeeAddress,
  StarterDeclaration,
} from './use-paye-integration.employee-types'

import type { EmployeeAddress } from './use-paye-integration.employee-types'

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

export const DEFAULT_PAYE_CONFIG: PAYEConfig = {
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
