import type { FPSEmployee } from '@/hooks/use-paye-integration'

export const MOCK_PAYE_EMPLOYEES: FPSEmployee[] = [
  {
    workerId: 'W-001', employeeRef: 'EMP001', niNumber: 'AB123456C',
    title: 'Ms', firstName: 'Sarah', lastName: 'Johnson',
    dateOfBirth: '1985-03-15', gender: 'F',
    address: { line1: '123 Main Street', line2: 'Apartment 4B', line3: 'London', postcode: 'SW1A 1AA', country: 'England' },
    taxCode: '1257L', niCategory: 'A',
    grossPay: 3500.0, taxableGrossPay: 3500.0, incomeTax: 477.5,
    employeeNI: 354.6, employerNI: 429.2, studentLoan: 0,
    pensionContribution: 175.0, paymentMethod: 'BACS', payFrequency: 'Monthly', hoursWorked: 160,
  },
  {
    workerId: 'W-002', employeeRef: 'EMP002', niNumber: 'CD234567D',
    title: 'Mr', firstName: 'Michael', lastName: 'Chen',
    dateOfBirth: '1990-07-22', gender: 'M',
    address: { line1: '456 Oak Avenue', line3: 'Manchester', postcode: 'M1 1AA', country: 'England' },
    taxCode: '1257L', niCategory: 'A',
    grossPay: 4200.0, taxableGrossPay: 4200.0, incomeTax: 617.5,
    employeeNI: 438.6, employerNI: 531.2, studentLoan: 65.34, studentLoanPlan: 'Plan2',
    pensionContribution: 210.0, paymentMethod: 'BACS', payFrequency: 'Monthly', hoursWorked: 175,
  },
  {
    workerId: 'W-003', employeeRef: 'EMP003', niNumber: 'EF345678E',
    title: 'Ms', firstName: 'Emma', lastName: 'Wilson',
    dateOfBirth: '1988-11-08', gender: 'F',
    address: { line1: '789 High Street', line2: 'Flat 12', line3: 'Birmingham', postcode: 'B1 1AA', country: 'England' },
    taxCode: '1257L', niCategory: 'A',
    grossPay: 3800.0, taxableGrossPay: 3800.0, incomeTax: 537.5,
    employeeNI: 390.6, employerNI: 473.2, pensionContribution: 190.0,
    paymentMethod: 'BACS', payFrequency: 'Monthly', hoursWorked: 168,
  },
]
