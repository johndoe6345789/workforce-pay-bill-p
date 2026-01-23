# Business Logic Hooks

Specialized hooks for WorkForce Pro platform business operations.

## Overview

These hooks encapsulate complex business logic for staffing and recruitment operations, including invoicing, payroll calculations, time tracking, margin analysis, and compliance tracking. They are designed to be composable, reusable, and production-ready.

## Hooks

### `useInvoicing`
Complete invoice lifecycle management with automated generation and aging analysis.

**Features:**
- Generate invoices from timesheets
- Create placement fee invoices
- Credit note generation
- Invoice aging analysis (30/60/90 days)
- Multi-currency support
- Tax calculations
- Payment terms management

**Key Functions:**
- `createInvoiceFromTimesheets()` - Batch invoice generation
- `createPlacementInvoice()` - Permanent placement fees
- `createCreditNote()` - Credit note with reason tracking
- `calculateInvoiceAging()` - Aged debt analysis
- `getOverdueInvoices()` - Outstanding payment tracking

---

### `usePayrollCalculations`
UK-compliant payroll calculations including tax, NI, pensions, and statutory payments.

**Features:**
- Income tax calculation (UK bands)
- National Insurance (employee & employer)
- Pension auto-enrollment
- Student loan deductions
- CIS deductions for contractors
- Statutory sick/maternity/paternity pay
- Holiday pay calculations
- Batch payroll processing

**Key Functions:**
- `calculatePayroll()` - Full payroll calculation for single worker
- `calculateBatchPayroll()` - Process multiple workers
- `processPayrollRun()` - Create payroll run record
- `calculateHolidayPay()` - Holiday accrual and payment
- `calculateCISDeduction()` - Construction Industry Scheme
- `calculateStatutoryPayments()` - SSP, SMP, SPP calculations

**Tax Configuration:**
```tsx
const payrollConfig = {
  taxYear: '2024/25',
  personalAllowance: 12570,
  taxBands: [
    { threshold: 0, rate: 0.20 },
    { threshold: 50270, rate: 0.40 },
    { threshold: 125140, rate: 0.45 }
  ],
  niRates: [...],
  employerNIRate: 0.138,
  pensionRate: 0.05
}
```

---

### `useTimeTracking`
Advanced time and shift management with automatic rate calculations and validation.

**Features:**
- Shift hour calculations with break deductions
- Automatic shift type detection (night/weekend/overtime)
- Rate multiplier application
- Working Time Directive validation
- Overtime calculation
- Shift pattern analysis
- Rate card integration
- Time rounding

**Shift Types & Premiums:**
- Standard (1.0x)
- Overtime (1.5x)
- Weekend (1.5x)
- Night shift (1.33x)
- Bank holiday (2.0x)
- Evening (1.25x)
- Early morning (1.25x)
- Split shift (1.15x)

**Key Functions:**
- `calculateShiftPay()` - Full shift calculation with premiums
- `validateTimesheet()` - WTD compliance checking
- `analyzeWorkingTime()` - Period analytics
- `createTimesheetFromShifts()` - Aggregate shift data
- `calculateOvertimeHours()` - Standard vs overtime split
- `findRateCard()` - Automatic rate card lookup

**Validation Rules:**
```tsx
const timePattern = {
  maxHoursPerDay: 12,
  maxHoursPerWeek: 48,
  maxConsecutiveDays: 6,
  minBreakMinutes: 30,
  minRestHours: 11
}
```

---

### `useMarginAnalysis`
Financial analytics for profitability, utilization, and forecasting.

**Features:**
- Gross margin calculation
- Client profitability analysis
- Worker utilization tracking
- Period-over-period comparison
- Break-even analysis
- Revenue forecasting (simple trend-based)
- Cost categorization

**Key Functions:**
- `calculateMarginForPeriod()` - Revenue vs costs with breakdown
- `analyzeClientProfitability()` - Per-client margin analysis
- `analyzeWorkerUtilization()` - Hours worked vs available
- `comparePeriods()` - Period comparison with % changes
- `calculateBreakEvenPoint()` - Fixed cost coverage
- `forecastRevenue()` - Trend-based projection

**Analysis Output:**
```tsx
interface MarginCalculation {
  period: string
  revenue: number
  costs: number
  grossMargin: number
  marginPercentage: number
  breakdown: MarginBreakdown[]
}

interface ClientProfitability {
  clientName: string
  revenue: number
  margin: number
  marginPercentage: number
  avgInvoiceValue: number
}

interface WorkerUtilization {
  workerName: string
  hoursWorked: number
  utilizationRate: number
  avgRate: number
}
```

---

### `useComplianceTracking`
Document expiry monitoring and worker eligibility management.

**Features:**
- Document expiry tracking
- Configurable compliance rules
- Worker eligibility checks
- Renewal alert generation
- Compliance scoring
- Dashboard metrics
- Bulk compliance checking

**Default Document Types:**
- Right to Work
- DBS Check
- Professional Qualification
- Health & Safety Training
- First Aid Certificate
- Driving License

**Key Functions:**
- `checkWorkerCompliance()` - Full compliance check with scoring
- `addComplianceDocument()` - Upload with auto-status
- `getComplianceDashboard()` - Overview metrics
- `getRenewalAlerts()` - Upcoming expiries
- `getNonCompliantWorkers()` - At-risk workers
- `canWorkerBeAssigned()` - Placement eligibility

**Compliance Rules:**
```tsx
interface ComplianceRule {
  documentType: string
  required: boolean
  expiryWarningDays: number
  renewalLeadDays: number
  applicableWorkerTypes?: string[]
}
```

## Usage Examples

### Complete Invoice Workflow
```tsx
function BillingComponent() {
  const { createInvoiceFromTimesheets, saveInvoice } = useInvoicing()
  const { timesheets } = useTimeTracking()

  const handleGenerateInvoices = async () => {
    const approvedTimesheets = timesheets.filter(ts => ts.status === 'approved')
    
    // Group by client
    const byClient = groupBy(approvedTimesheets, 'clientName')
    
    for (const [client, sheets] of Object.entries(byClient)) {
      const invoice = createInvoiceFromTimesheets(sheets, client, {
        applyTax: true,
        taxRate: 0.20,
        paymentTermsDays: 30
      })
      
      await saveInvoice(invoice)
    }
  }

  return <Button onClick={handleGenerateInvoices}>Generate Invoices</Button>
}
```

### Payroll Processing
```tsx
function PayrollProcessor() {
  const { calculateBatchPayroll, processPayrollRun } = usePayrollCalculations()
  const { timesheets } = useTimeTracking()

  const handleProcessPayroll = async () => {
    const approvedIds = timesheets
      .filter(ts => ts.status === 'approved')
      .map(ts => ts.id)
    
    const calculations = calculateBatchPayroll(approvedIds)
    
    // Review calculations
    calculations.forEach(calc => {
      console.log(`${calc.workerName}: £${calc.netPay} net`)
    })
    
    // Process
    const run = await processPayrollRun('2024-01-31', approvedIds)
    console.log(`Processed ${run.workersCount} workers`)
  }

  return <Button onClick={handleProcessPayroll}>Process Payroll</Button>
}
```

### Shift Entry with Validation
```tsx
function ShiftEntryForm() {
  const { calculateShiftPay, validateTimesheet, createTimesheetFromShifts } = useTimeTracking()
  const [shifts, setShifts] = useState<ShiftEntry[]>([])

  const handleAddShift = (shiftData) => {
    const calculatedShift = calculateShiftPay(shiftData, {
      baseRate: 15,
      applyPremiums: true,
      roundToNearest: 0.25
    })
    
    setShifts([...shifts, calculatedShift])
  }

  const handleSubmit = () => {
    const timesheet = createTimesheetFromShifts(
      workerId,
      workerName,
      clientName,
      shifts,
      weekEnding
    )
    
    const validation = validateTimesheet(timesheet)
    
    if (!validation.isValid) {
      alert(`Errors: ${validation.errors.join(', ')}`)
      return
    }
    
    if (validation.warnings.length > 0) {
      console.warn('Warnings:', validation.warnings)
    }
    
    // Submit timesheet
  }

  return (...)
}
```

### Compliance Dashboard
```tsx
function ComplianceDashboard() {
  const {
    getComplianceDashboard,
    getRenewalAlerts,
    getNonCompliantWorkers
  } = useComplianceTracking()

  const dashboard = getComplianceDashboard()
  const alerts = getRenewalAlerts(90)
  const nonCompliant = getNonCompliantWorkers()

  return (
    <div>
      <MetricCard
        title="Compliance Rate"
        value={`${dashboard.complianceRate.toFixed(1)}%`}
        subtitle={`${dashboard.compliantWorkers} of ${dashboard.totalWorkers} workers`}
      />
      
      <AlertsList>
        {alerts.filter(a => a.urgency === 'critical').map(alert => (
          <Alert key={alert.documentId} severity="error">
            {alert.workerName} - {alert.documentType} expired
          </Alert>
        ))}
      </AlertsList>
      
      <WorkerList workers={nonCompliant} />
    </div>
  )
}
```

## Integration Patterns

### Combined Workflow
```tsx
function TimesheetApprovalWorkflow() {
  const { timesheets } = useTimeTracking()
  const { createInvoiceFromTimesheets } = useInvoicing()
  const { calculateBatchPayroll } = usePayrollCalculations()
  const { checkWorkerCompliance } = useComplianceTracking()

  const handleApproveAndProcess = async (timesheetId: string) => {
    const timesheet = timesheets.find(ts => ts.id === timesheetId)
    
    // 1. Check compliance
    const compliance = checkWorkerCompliance(timesheet.workerId)
    if (!compliance.isCompliant) {
      throw new Error('Worker not compliant')
    }
    
    // 2. Approve timesheet
    approveTimesheet(timesheetId)
    
    // 3. Generate invoice
    const invoice = createInvoiceFromTimesheets([timesheet], timesheet.clientName)
    
    // 4. Calculate payroll impact
    const payroll = calculateBatchPayroll([timesheetId])
    
    return { invoice, payroll }
  }
}
```

## Best Practices

1. **Always validate before processing**
   ```tsx
   const validation = validateTimesheet(timesheet)
   if (!validation.isValid) return
   ```

2. **Use functional updates with useKV**
   ```tsx
   setInvoices(current => [...(current || []), newInvoice])
   ```

3. **Handle edge cases**
   ```tsx
   const margin = revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0
   ```

4. **Compose hooks for complex workflows**
   ```tsx
   const invoicing = useInvoicing()
   const payroll = usePayrollCalculations()
   const tracking = useTimeTracking()
   ```

5. **Memoize expensive calculations**
   - All hooks use `useCallback` and `useMemo` internally
   - Results are cached based on dependencies

## Performance Considerations

- **Batch operations** where possible (e.g., `calculateBatchPayroll`)
- **Filter early** to reduce data processing
- **Use indices** for lookups (Map/Set where appropriate)
- **Avoid recalculations** - hooks cache results

## Type Safety

All hooks are fully typed with TypeScript:
- Input validation through types
- Return type inference
- Generic types where appropriate
- Strict null checks

## Testing

Each hook can be tested independently:
```tsx
import { renderHook, act } from '@testing-library/react'
import { useInvoicing } from './use-invoicing'

test('generates invoice number', () => {
  const { result } = renderHook(() => useInvoicing())
  
  const invoiceNumber = result.current.generateInvoiceNumber()
  expect(invoiceNumber).toMatch(/^INV-\d{5}-\d{6}$/)
})
```

## Future Enhancements

- Real-time tax rate updates via API
- Machine learning for revenue forecasting
- Advanced compliance automation
- Multi-currency rate updates
- Automated invoice reconciliation
- Payment gateway integration
