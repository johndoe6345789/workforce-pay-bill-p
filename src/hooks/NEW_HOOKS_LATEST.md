# New Custom Hooks - Latest Additions

This document lists all newly added custom hooks to the library.

## Business Logic Hooks (Specialized)

### `useInvoicing`
Comprehensive invoicing hook with generation, aging analysis, and invoice management.

```tsx
const {
  invoices,
  isProcessing,
  generateInvoiceNumber,
  createInvoiceFromTimesheets,
  createPlacementInvoice,
  createCreditNote,
  saveInvoice,
  updateInvoiceStatus,
  calculateInvoiceAging,
  getInvoicesByClient,
  getInvoicesByStatus,
  getOverdueInvoices
} = useInvoicing()

// Create invoice from approved timesheets
const invoice = createInvoiceFromTimesheets(
  approvedTimesheets,
  'Client Name',
  { applyTax: true, taxRate: 0.20, paymentTermsDays: 30 }
)
await saveInvoice(invoice)

// Analyze invoice aging
const aging = calculateInvoiceAging()
console.log(`Overdue 90+ days: £${aging.over90}`)
```

### `usePayrollCalculations`
Full-featured payroll calculation hook with UK tax, NI, pension, and statutory payments.

```tsx
const {
  calculatePayroll,
  calculateBatchPayroll,
  calculateHolidayPay,
  processPayrollRun,
  calculateCISDeduction,
  calculateStatutoryPayments,
  payrollConfig
} = usePayrollCalculations()

// Calculate single worker payroll
const result = calculatePayroll('worker-123', 3000, 36000, true)
console.log(`Net pay: £${result.netPay}`)
console.log(`Employer cost: £${result.totalCost}`)

// Process batch payroll
const payrollRun = await processPayrollRun('2024-01-31', timesheetIds)

// Calculate holiday pay
const holiday = calculateHolidayPay('worker-123', startDate, endDate)
console.log(`Accrued: ${holiday.accruedHoliday} hours`)
```

### `useTimeTracking`
Advanced time tracking with shift calculations, validation, and analytics.

```tsx
const {
  calculateShiftHours,
  determineShiftType,
  calculateShiftPay,
  validateTimesheet,
  analyzeWorkingTime,
  createTimesheetFromShifts,
  calculateOvertimeHours,
  findRateCard
} = useTimeTracking()

// Calculate shift with premiums
const shift = calculateShiftPay({
  date: '2024-01-15',
  dayOfWeek: 'saturday',
  shiftType: 'weekend',
  startTime: '08:00',
  endTime: '16:00',
  breakMinutes: 30,
  hours: 0, // will be calculated
  rate: 0,  // will be calculated
  notes: 'Saturday shift'
}, { baseRate: 15, applyPremiums: true })

// Validate timesheet
const validation = validateTimesheet(timesheet)
if (!validation.isValid) {
  console.error('Errors:', validation.errors)
}

// Analyze working time
const analytics = analyzeWorkingTime('worker-123', startDate, endDate)
console.log(`Total: ${analytics.totalHours}h, Overtime: ${analytics.overtimeHours}h`)
```

### `useMarginAnalysis`
Business intelligence hook for margin calculation, profitability analysis, and forecasting.

```tsx
const {
  calculateMarginForPeriod,
  analyzeClientProfitability,
  analyzeWorkerUtilization,
  comparePeriods,
  calculateBreakEvenPoint,
  forecastRevenue
} = useMarginAnalysis()

// Calculate margin for a period
const margin = calculateMarginForPeriod(startDate, endDate, true)
console.log(`Margin: ${margin.marginPercentage.toFixed(2)}%`)

// Analyze client profitability
const clients = analyzeClientProfitability(startDate, endDate)
const topClient = clients[0]
console.log(`${topClient.clientName}: £${topClient.margin} margin`)

// Worker utilization
const workers = analyzeWorkerUtilization(startDate, endDate, 40)
workers.forEach(w => {
  console.log(`${w.workerName}: ${w.utilizationRate.toFixed(1)}% utilized`)
})

// Forecast revenue
const forecast = forecastRevenue(6, 3)
console.log('Next 3 months forecast:', forecast)
```

### `useComplianceTracking`
Compliance document tracking with expiry monitoring and worker eligibility checks.

```tsx
const {
  complianceDocs,
  complianceRules,
  checkWorkerCompliance,
  addComplianceDocument,
  updateDocumentExpiry,
  getComplianceDashboard,
  getRenewalAlerts,
  getNonCompliantWorkers,
  canWorkerBeAssigned
} = useComplianceTracking()

// Check worker compliance
const check = checkWorkerCompliance('worker-123')
if (!check.isCompliant) {
  console.log('Missing:', check.missingDocuments)
  console.log('Expired:', check.expiredDocuments.length)
}

// Get compliance dashboard
const dashboard = getComplianceDashboard()
console.log(`Compliance rate: ${dashboard.complianceRate.toFixed(1)}%`)

// Get renewal alerts
const alerts = getRenewalAlerts(90) // next 90 days
alerts.forEach(alert => {
  console.log(`${alert.workerName}: ${alert.documentType} expires in ${alert.daysUntilExpiry} days`)
})

// Check if worker can be assigned
if (canWorkerBeAssigned('worker-123')) {
  assignToPlacement(workerId, placementId)
}
```

## Data Fetching & State Management

### `useFetch`
Simple data fetching hook with loading, error states and refetch capability.

```tsx
const { data, loading, error, refetch } = useFetch<User[]>('/api/users', {
  onSuccess: (data) => console.log('Loaded:', data),
  onError: (error) => console.error('Failed:', error)
})
```

### `useMutation`
Hook for handling mutations with success/error callbacks and toast notifications.

```tsx
const { mutate, isLoading, isSuccess } = useMutation(
  async (data: CreateUserData) => createUser(data),
  {
    successMessage: 'User created successfully',
    onSuccess: () => refetchUsers()
  }
)
```

### `useAsyncAction`
Execute async operations with loading and error state management.

```tsx
const { execute, data, loading, error, reset } = useAsyncAction(fetchUserData)

await execute(userId)
```

### `useControllableState`
Create components that can work as both controlled and uncontrolled.

```tsx
const [value, setValue] = useControllableState({
  value: controlledValue,
  defaultValue: 'default',
  onChange: onValueChange
})
```

## UI & Interaction Hooks

### `useBreakpoint`
Get the current responsive breakpoint.

```tsx
const breakpoint = useBreakpoint() // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
const columns = useBreakpointValue({ xs: 1, md: 2, lg: 3 })
```

### `useMeasure`
Measure DOM element dimensions with ResizeObserver.

```tsx
const [ref, dimensions] = useMeasure()

return (
  <div ref={ref}>
    Width: {dimensions.width}px
  </div>
)
```

### `useFavorites`
Manage a list of favorite items with persistence.

```tsx
const { favorites, isFavorite, toggleFavorite, addFavorite } = useFavorites<Item>({
  storageKey: 'my-favorites'
})
```

### `useClipboardCopy`
Copy text to clipboard with success state.

```tsx
const { copied, copy } = useClipboardCopy({ timeout: 2000 })

<button onClick={() => copy('text to copy')}>
  {copied ? 'Copied!' : 'Copy'}
</button>
```

### `useLockBodyScroll`
Prevent body scrolling (useful for modals/drawers).

```tsx
useLockBodyScroll(isModalOpen)
```

### `useNetworkStatus`
Monitor online/offline status.

```tsx
const isOnline = useNetworkStatus()
```

## Advanced Hooks

### `useLocalStorageState`
Like useState but persisted in localStorage.

```tsx
const [theme, setTheme, removeTheme] = useLocalStorageState('theme', 'light')
```

### `useMounted`
Check if component is currently mounted.

```tsx
const isMounted = useMounted()

useEffect(() => {
  fetchData().then(data => {
    if (isMounted()) {
      setState(data)
    }
  })
}, [])
```

### `useMergeRefs`
Merge multiple refs into one.

```tsx
const mergedRef = useMergeRefs(ref1, ref2, ref3)
<div ref={mergedRef} />
```

### `useEvent`
Create stable callback references that always use latest values.

```tsx
const handleClick = useEvent(() => {
  // Always has access to latest state/props
  console.log(latestValue)
})
```

### `useUpdateEffect`
Like useEffect but skips the first render.

```tsx
useUpdateEffect(() => {
  // Only runs on updates, not initial mount
  console.log('Updated!')
}, [dependency])
```

### `useIsomorphicLayoutEffect`
Safe useLayoutEffect for SSR (falls back to useEffect on server).

```tsx
useIsomorphicLayoutEffect(() => {
  // Runs on client, safe for SSR
}, [])
```

## Usage Tips

1. **Prefer `useMutation` over raw async/await** for operations that modify data
2. **Use `useControllableState`** when building reusable form components
3. **Use `useBreakpoint`** for responsive logic instead of multiple media queries
4. **Use `useEvent`** for stable callbacks in performance-critical scenarios
5. **Use `useFavorites`** with the Spark KV store for persistence across sessions
