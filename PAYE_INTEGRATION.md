# PAYE Payroll Integration

## Overview

The PAYE (Pay As You Earn) integration provides comprehensive Real Time Information (RTI) reporting capabilities for HMRC compliance. This system enables businesses to submit Full Payment Submissions (FPS), Employer Payment Summaries (EPS), and other statutory returns directly from completed payroll runs.

## Features

### Real Time Information (RTI) Submissions

The system supports all standard HMRC RTI submission types:

- **FPS (Full Payment Submission)**: Reports employee payments, tax, and National Insurance deductions
- **EPS (Employer Payment Summary)**: Reports statutory payments, CIS deductions, and allowances
- **EAS (Earlier Year Update)**: Corrects previous year submissions
- **NVR (NINO Verification Request)**: Requests verification of National Insurance numbers

### Validation & Compliance

Comprehensive validation ensures all submissions meet HMRC requirements:

- National Insurance number format validation
- Tax code format validation  
- Employee details completeness checks
- Payment calculation validation
- Address and postcode validation
- Warning detection for potential issues

### Submission Management

Full lifecycle management of PAYE submissions:

- Draft creation and editing
- Pre-submission validation
- HMRC submission simulation
- Status tracking (draft → ready → submitted → accepted/rejected)
- HMRC reference tracking
- Resubmission and correction workflows

## Components

### PAYEManager

Main interface for managing PAYE RTI submissions.

**Location**: `/src/components/PAYEManager.tsx`

**Features**:
- View pending and submitted returns
- Validate submissions before sending
- Submit to HMRC
- Download RTI reports
- View validation errors and warnings
- Track HMRC acceptance status

**Usage**:
```tsx
<PAYEManager
  payrollRunId={payrollRun.id}
  open={showManager}
  onOpenChange={setShowManager}
/>
```

### CreatePAYESubmissionDialog

Dialog for creating new PAYE submissions from payroll runs.

**Location**: `/src/components/CreatePAYESubmissionDialog.tsx`

**Features**:
- Generate FPS from completed payroll
- Configure payment date
- Review employer details
- Preview submission contents

**Usage**:
```tsx
<CreatePAYESubmissionDialog
  payrollRunId={payrollRun.id}
  open={showDialog}
  onOpenChange={setShowDialog}
  onSuccess={() => {
    // Handle successful creation
  }}
/>
```

## Hooks

### usePAYEIntegration

Core hook providing PAYE functionality.

**Location**: `/src/hooks/use-paye-integration.ts`

**Key Functions**:

#### createFPS
Creates a Full Payment Submission with employee payment data.

```tsx
const fps = createFPS(
  payrollRunId,
  employees,
  paymentDate
)
```

**Parameters**:
- `payrollRunId`: ID of the payroll run
- `employees`: Array of FPSEmployee objects
- `paymentDate`: ISO date string for payment date

**Returns**: `FPSData` object

#### createEPS
Creates an Employer Payment Summary for statutory payments and deductions.

```tsx
const eps = createEPS(
  taxYear,
  taxMonth,
  {
    statutorySickPay: 1500,
    cisDeductionsSuffered: 2000,
    employmentAllowance: true
  }
)
```

#### validateSubmission
Validates a submission before sending to HMRC.

```tsx
const result = await validateSubmission(submissionId)

if (result.isValid) {
  // Proceed with submission
} else {
  // Show errors
  console.log(result.errors)
}
```

**Returns**: `RTIValidationResult` with:
- `isValid`: Boolean indicating if validation passed
- `errors`: Array of validation errors
- `warnings`: Array of validation warnings  
- `canSubmit`: Boolean indicating if submission is allowed

#### submitToHMRC
Submits a validated return to HMRC.

```tsx
const result = await submitToHMRC(submissionId)

if (result.success) {
  console.log('HMRC Reference:', result.hmrcReference)
} else {
  console.log('Errors:', result.errors)
}
```

**Returns**: Object with:
- `success`: Boolean
- `hmrcReference`: HMRC tracking reference (if successful)
- `errors`: Array of errors (if failed)

#### generateRTIReport
Generates a human-readable RTI report for download.

```tsx
const report = generateRTIReport(submissionId)
// Returns formatted text report
```

#### calculateApprenticeshipLevy
Calculates apprenticeship levy for annual payroll.

```tsx
const levy = calculateApprenticeshipLevy(totalAnnualPayroll)
// Returns levy amount in £
```

## Data Structures

### FPSEmployee

Complete employee payment record for FPS submissions:

```typescript
interface FPSEmployee {
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
```

### PAYESubmission

Tracks the status of an RTI submission:

```typescript
interface PAYESubmission {
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
```

### PAYEConfig

Employer configuration for PAYE submissions:

```typescript
interface PAYEConfig {
  employerRef: string              // e.g., '123/AB45678'
  accountsOfficeRef: string         // e.g., '123PA00045678'
  companyName: string
  companyAddress: EmployeeAddress
  contactName: string
  contactPhone: string
  contactEmail: string
  apprenticeshipLevy: boolean
  employmentAllowance: boolean
}
```

## Integration Workflow

### 1. Complete Payroll Run

First, process a standard payroll run with all employee payments calculated.

### 2. Create PAYE Submission

From a completed payroll run, create an FPS submission:

```tsx
// Click "Create PAYE" button on completed payroll run
<Button onClick={() => {
  setSelectedPayrollForPAYE(run.id)
  setShowCreatePAYE(true)
}}>
  <FileText size={16} />
  Create PAYE
</Button>
```

### 3. Validate Submission

Before sending to HMRC, validate the submission:

```tsx
const validation = await validateSubmission(submission.id)

if (!validation.isValid) {
  // Show errors to user
  validation.errors.forEach(error => {
    console.error(`${error.code}: ${error.message}`)
  })
}
```

### 4. Submit to HMRC

Once validated, submit to HMRC:

```tsx
const result = await submitToHMRC(submission.id)

if (result.success) {
  toast.success(`Submitted to HMRC: ${result.hmrcReference}`)
} else {
  toast.error('Submission failed')
}
```

### 5. Track Acceptance

Monitor submission status and HMRC acceptance:

```tsx
const submission = getSubmissionStatus(submissionId)

switch (submission.status) {
  case 'submitted':
    // Waiting for HMRC response
    break
  case 'accepted':
    // Successfully processed by HMRC
    console.log('Accepted:', submission.acceptedDate)
    break
  case 'rejected':
    // Review and correct errors
    console.log('Errors:', submission.errors)
    break
}
```

## Validation Rules

The system enforces the following validation rules:

### Required Fields
- Employee first name and last name
- Valid National Insurance number (format: AB123456C)
- Valid tax code (e.g., 1257L, BR, 0T)
- Date of birth
- Complete address with postcode
- Payment amounts (gross, tax, NI)

### Format Validation
- **NI Number**: 2 letters, 6 digits, 1 letter (excluding certain letters)
- **Tax Code**: Valid HMRC tax code format
- **Postcode**: UK postcode format

### Business Rules
- Gross pay must not be negative
- Tax must not be negative
- Taxable gross pay should not exceed total gross pay
- Student loan deductions require loan plan type
- Employee NI calculated correctly for NI category

### Warnings (Non-blocking)
- Taxable gross exceeds total gross
- Missing student loan plan when deductions present
- Irregular payment patterns
- Missing optional fields

## Error Handling

The system provides detailed error information:

```typescript
interface PAYEError {
  code: string          // Error code (e.g., 'INVALID_NI')
  message: string       // Human-readable message
  field?: string        // Field name if applicable
  severity: 'error' | 'warning'
}
```

Common error codes:
- `INVALID_NI`: National Insurance number format invalid
- `INVALID_TAX_CODE`: Tax code format invalid
- `MISSING_FIRST_NAME`: First name required
- `MISSING_LAST_NAME`: Last name required
- `MISSING_DOB`: Date of birth required
- `MISSING_POSTCODE`: Postcode required
- `NEGATIVE_PAY`: Gross pay cannot be negative
- `NEGATIVE_TAX`: Tax cannot be negative

## Tax Year Calculations

The system automatically calculates tax year and tax month:

```typescript
// Tax year runs April to April
const taxYear = calculateTaxYear(new Date())
// Returns: "2024/25" if date is between Apr 2024 - Mar 2025

// Tax month is 1-12 starting from April
const taxMonth = calculateTaxMonth(new Date())
// Returns: 1 for April, 2 for May, etc.
```

## Reporting

### RTI Reports

Generate detailed RTI reports for record-keeping:

```typescript
const report = generateRTIReport(submissionId)
```

Report includes:
- Employer reference and tax year
- Tax month and payment date
- Employee count
- Summary totals (gross pay, tax, NI, student loans)
- Individual employee breakdowns

Example output:
```
FULL PAYMENT SUBMISSION (FPS)
============================================================

Employer Reference: 123/AB45678
Tax Year: 2024/25
Tax Month: 10
Payment Date: 31/01/2025
Employees: 25

SUMMARY
------------------------------------------------------------
Total Gross Pay: £87,500.00
Total Tax: £14,250.00
Total Employee NI: £8,890.00
Total Employer NI: £10,750.00
Total Student Loan: £1,250.00

EMPLOYEES
------------------------------------------------------------
1. Sarah Johnson
   NI Number: AB123456C
   Tax Code: 1257L
   Gross Pay: £3,500.00
   Tax: £477.50
   NI: £354.60
...
```

## Best Practices

### 1. Validate Before Submission
Always validate submissions before sending to HMRC to catch errors early.

### 2. Keep Records
Download and store RTI reports for audit purposes.

### 3. Monitor Submissions
Regularly check submission status and HMRC responses.

### 4. Handle Corrections
If a submission is rejected, review errors, make corrections, and resubmit.

### 5. Timely Submissions
Submit FPS on or before payment date to comply with RTI requirements.

### 6. Data Accuracy
Ensure employee data is up-to-date before generating PAYE submissions.

### 7. Test Thoroughly
Use the validation features to test submissions before live use.

## Future Enhancements

Planned improvements include:

- [ ] Direct Government Gateway integration
- [ ] Automatic HMRC response polling
- [ ] Bulk employee data import
- [ ] Historical submission archive
- [ ] Advanced error correction workflows
- [ ] Integration with payroll calculation hook
- [ ] P45 and P60 generation
- [ ] CIS subcontractor returns
- [ ] Gender pay gap reporting
- [ ] Auto-enrolment pension integration

## Related Documentation

- [Payroll Calculations](/src/hooks/use-payroll-calculations.ts)
- [Payroll Batch Processing](./PAYROLL_BATCH_PROCESSING.md)
- [Approval Workflows](./WORKFLOW_TEMPLATES.md)
- [HMRC RTI Specification](https://www.gov.uk/government/collections/real-time-information-online-internet-submissions)

## Support

For issues or questions about PAYE integration:

1. Check validation errors for specific guidance
2. Review HMRC RTI documentation
3. Consult with payroll compliance specialist
4. Contact HMRC employer helpline: 0300 200 3200

---

*Last Updated: January 2025*
*Version: 1.0*
