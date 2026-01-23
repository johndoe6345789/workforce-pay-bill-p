# New Custom Hooks

This document describes the newly added custom hooks for WorkForce Pro platform.

## Business Logic Hooks

### `useRateCalculator()`
Calculate rates with premiums for overtime, night shifts, weekends, and holidays.

```tsx
const { calculateRate, calculateTotalAmount, calculateMargin } = useRateCalculator()

const breakdown = calculateRate({
  baseRate: 25,
  hours: 8,
  isNightShift: true,
  isWeekend: true,
  nightShiftMultiplier: 1.25,
  weekendMultiplier: 1.5
})
// Returns: { baseRate, overtimeRate, nightShiftPremium, weekendPremium, holidayPremium, totalRate }

const totalAmount = calculateTotalAmount({ baseRate: 25, hours: 40 })
const margin = calculateMargin(chargeRate, payRate)
```

### `useAuditLog()`
Track all user actions with full audit trail capability.

```tsx
const { auditLog, logAction, getLogsByEntity, getLogsByUser, clearLog } = useAuditLog()

await logAction('UPDATE', 'timesheet', 'TS-123', 
  { hours: { old: 40, new: 45 } },
  { reason: 'Client requested adjustment' }
)

const timesheetLogs = getLogsByEntity('timesheet', 'TS-123')
const userActions = getLogsByUser('user-id')
```

### `useRecurringSchedule()`
Manage recurring work schedules with patterns and time slots.

```tsx
const { schedules, addSchedule, generateInstances, getScheduleForDate } = useRecurringSchedule()

const schedule = addSchedule({
  name: 'Night Shift Pattern',
  pattern: 'weekly',
  startDate: '2024-01-01',
  daysOfWeek: [1, 2, 3, 4, 5], // Mon-Fri
  timeSlots: [
    { startTime: '22:00', endTime: '06:00', description: 'Night shift' }
  ]
})

const instances = generateInstances(schedule, startDate, endDate)
const todaySchedules = getScheduleForDate(new Date())
```

### `useComplianceCheck()`
Run compliance validation rules against data.

```tsx
const { 
  defaultRules, 
  runCheck, 
  runAllChecks, 
  getFailedChecks, 
  hasCriticalFailures 
} = useComplianceCheck()

const checks = runAllChecks(defaultRules, { 
  expiryDate: '2024-12-31',
  rate: 45,
  weeklyHours: 42
})

const failed = getFailedChecks(checks)
const critical = hasCriticalFailures(checks)
```

### `useApprovalWorkflow()`
Multi-step approval workflows for entities.

```tsx
const { 
  workflows, 
  createWorkflow, 
  approveStep, 
  rejectStep, 
  getCurrentStep 
} = useApprovalWorkflow()

const workflow = createWorkflow('timesheet', 'TS-123', ['Manager', 'Director', 'Finance'])

await approveStep(workflow.id, stepId, 'Approved - looks good')
await rejectStep(workflow.id, stepId, 'Hours exceed contract limit')

const currentStep = getCurrentStep(workflow)
```

### `useDataExport()`
Export data to various formats with customization.

```tsx
const { exportToCSV, exportToJSON, exportData } = useDataExport()

exportToCSV(timesheets, {
  filename: 'timesheets-export',
  columns: ['workerName', 'hours', 'amount'],
  includeHeaders: true
})

exportToJSON(invoices, { filename: 'invoices-2024' })

exportData(payrollRuns, { format: 'csv', filename: 'payroll' })
```

## Data Management Hooks

### `useHistory<T>(initialState, maxHistory?)`
Undo/redo functionality with state history.

```tsx
const { state, setState, undo, redo, canUndo, canRedo, clear } = useHistory(initialForm, 50)

setState({ ...state, hours: 45 }) // Creates history entry
undo() // Reverts to previous state
redo() // Moves forward
```

### `useSortableData<T>(data, defaultConfig?)`
Sort data by any field with direction control.

```tsx
const { sortedData, sortConfig, requestSort, clearSort } = useSortableData(invoices, {
  key: 'dueDate',
  direction: 'desc'
})

requestSort('amount') // Toggle sort on amount field
clearSort()
```

### `useFilterableData<T>(data)`
Advanced filtering with multiple operators.

```tsx
const { filteredData, filters, addFilter, removeFilter, clearFilters } = useFilterableData(timesheets)

addFilter({ field: 'status', operator: 'equals', value: 'pending' })
addFilter({ field: 'hours', operator: 'greaterThan', value: 40 })
addFilter({ field: 'workerName', operator: 'contains', value: 'John' })

removeFilter(0) // Remove first filter
clearFilters()
```

**Operators:** `equals`, `notEquals`, `contains`, `notContains`, `startsWith`, `endsWith`, `greaterThan`, `lessThan`, `greaterThanOrEqual`, `lessThanOrEqual`, `in`, `notIn`

### `useFormatter(defaultOptions?)`
Format numbers, currency, dates, and percentages.

```tsx
const { 
  formatCurrency, 
  formatNumber, 
  formatPercent, 
  formatDate, 
  formatTime,
  formatDateTime,
  formatValue 
} = useFormatter({ locale: 'en-GB', currency: 'GBP' })

formatCurrency(1250.50) // "£1,250.50"
formatNumber(1234.567, { decimals: 2 }) // "1,234.57"
formatPercent(15.5) // "15.5%"
formatDate(new Date(), { dateFormat: 'dd MMM yyyy' }) // "15 Jan 2024"
formatValue(1500, 'currency') // "£1,500.00"
```

### `useTemplateManager<T>(storageKey)`
Create and manage reusable templates.

```tsx
const { 
  templates, 
  createTemplate, 
  updateTemplate, 
  deleteTemplate,
  getTemplate,
  duplicateTemplate,
  applyTemplate 
} = useTemplateManager<InvoiceTemplate>('invoice-templates')

const template = createTemplate('Standard Invoice', {
  terms: 'Net 30',
  footer: 'Thank you for your business'
}, 'Standard template for all clients', 'Default')

const content = applyTemplate(template.id)
duplicateTemplate(template.id)
```

## Usage Examples

### Complete Rate Calculation Flow
```tsx
import { useRateCalculator, useComplianceCheck } from '@/hooks'

function TimesheetProcessor() {
  const { calculateTotalAmount, calculateMargin } = useRateCalculator()
  const { runAllChecks, defaultRules } = useComplianceCheck()
  
  const processTimesheet = (timesheet) => {
    // Calculate amounts
    const amount = calculateTotalAmount({
      baseRate: timesheet.rate,
      hours: timesheet.hours,
      isOvertime: timesheet.hours > 40
    })
    
    // Run compliance checks
    const checks = runAllChecks(defaultRules, {
      weeklyHours: timesheet.hours,
      rate: timesheet.rate
    })
    
    // Check margin
    const margin = calculateMargin(timesheet.chargeRate, timesheet.payRate)
    
    return { amount, checks, margin }
  }
  
  return <div>...</div>
}
```

### Approval Workflow with Audit Trail
```tsx
import { useApprovalWorkflow, useAuditLog } from '@/hooks'

function ApprovalManager() {
  const { createWorkflow, approveStep } = useApprovalWorkflow()
  const { logAction } = useAuditLog()
  
  const submitForApproval = async (timesheetId) => {
    const workflow = createWorkflow('timesheet', timesheetId, ['Manager', 'Finance'])
    
    await logAction('SUBMIT_APPROVAL', 'timesheet', timesheetId, undefined, {
      workflowId: workflow.id
    })
  }
  
  const approve = async (workflowId, stepId) => {
    await approveStep(workflowId, stepId, 'Approved')
    await logAction('APPROVE', 'workflow', workflowId)
  }
  
  return <div>...</div>
}
```

### Data Export with Filtering
```tsx
import { useFilterableData, useDataExport } from '@/hooks'

function ReportExporter() {
  const { filteredData, addFilter } = useFilterableData(timesheets)
  const { exportToCSV } = useDataExport()
  
  const exportFiltered = () => {
    addFilter({ field: 'status', operator: 'equals', value: 'approved' })
    
    exportToCSV(filteredData, {
      filename: 'approved-timesheets',
      columns: ['workerName', 'hours', 'amount', 'weekEnding']
    })
  }
  
  return <button onClick={exportFiltered}>Export Approved</button>
}
```
