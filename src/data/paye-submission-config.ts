import { usePAYEIntegration } from '@/hooks/use-paye-integration'

export const INCLUSIONS = [
  'Employee payment details (gross pay, tax, NI)',
  'Employer NI contributions',
  'Student loan deductions (if applicable)',
  'Pension contributions',
]

export const EMPLOYER_FIELDS: { label: string; key: keyof ReturnType<typeof usePAYEIntegration>['payeConfig'] }[] = [
  { label: 'Employer Reference',        key: 'employerRef' },
  { label: 'Accounts Office Reference', key: 'accountsOfficeRef' },
  { label: 'Company Name',              key: 'companyName' },
  { label: 'Contact',                   key: 'contactEmail' },
]
