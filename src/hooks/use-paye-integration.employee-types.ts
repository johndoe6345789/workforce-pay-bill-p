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
