import type { FPSEmployee, PAYEError, PAYEWarning } from './use-paye-integration.types'

export function validateNINumber(niNumber: string): boolean {
  const niRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/
  return niRegex.test(niNumber)
}

export function validateTaxCode(taxCode: string): boolean {
  const taxCodeRegex = /^([1-9][0-9]{0,5}[LMNPTY]|BR|0T|NT|D[0-8]|K[1-9][0-9]{0,5})$/
  return taxCodeRegex.test(taxCode)
}

export function collectFPSErrors(fps: Partial<FPSEmployee>): PAYEError[] {
  const errors: PAYEError[] = []

  if (!fps.niNumber || !validateNINumber(fps.niNumber))
    errors.push({ code: 'INVALID_NI', message: 'Invalid National Insurance number format', field: 'niNumber', severity: 'error' })

  if (!fps.taxCode || !validateTaxCode(fps.taxCode))
    errors.push({ code: 'INVALID_TAX_CODE', message: 'Invalid tax code format', field: 'taxCode', severity: 'error' })

  if (!fps.firstName || fps.firstName.length < 1)
    errors.push({ code: 'MISSING_FIRST_NAME', message: 'First name is required', field: 'firstName', severity: 'error' })

  if (!fps.lastName || fps.lastName.length < 1)
    errors.push({ code: 'MISSING_LAST_NAME', message: 'Last name is required', field: 'lastName', severity: 'error' })

  if (!fps.dateOfBirth)
    errors.push({ code: 'MISSING_DOB', message: 'Date of birth is required', field: 'dateOfBirth', severity: 'error' })

  if (!fps.address?.postcode)
    errors.push({ code: 'MISSING_POSTCODE', message: 'Postcode is required', field: 'postcode', severity: 'error' })

  if (fps.grossPay !== undefined && fps.grossPay < 0)
    errors.push({ code: 'NEGATIVE_PAY', message: 'Gross pay cannot be negative', field: 'grossPay', severity: 'error' })

  if (fps.incomeTax !== undefined && fps.incomeTax < 0)
    errors.push({ code: 'NEGATIVE_TAX', message: 'Income tax cannot be negative', field: 'incomeTax', severity: 'error' })

  return errors
}

export function collectFPSWarnings(fps: Partial<FPSEmployee>): PAYEWarning[] {
  const warnings: PAYEWarning[] = []

  if (fps.grossPay && fps.taxableGrossPay && fps.taxableGrossPay > fps.grossPay)
    warnings.push({ code: 'TAXABLE_EXCEEDS_GROSS', message: 'Taxable gross pay exceeds total gross pay', field: 'taxableGrossPay' })

  if (fps.studentLoan && !fps.studentLoanPlan)
    warnings.push({ code: 'MISSING_LOAN_PLAN', message: 'Student loan plan type should be specified when deductions are present', field: 'studentLoanPlan' })

  return warnings
}
