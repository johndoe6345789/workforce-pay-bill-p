# JSON Data Structure

All UI data is now loaded from JSON files, making the application data-driven and easily configurable without code changes.

## Data Source

**Primary Data File**: `/src/data/app-data.json`

This file contains all sample data for the application, including:
- Timesheets
- Invoices
- Payroll Runs
- Workers
- Compliance Documents
- Expenses
- Rate Cards
- Clients

## How It Works

### 1. Data Loading Flow

```
app-data.json → use-sample-data hook → KV Storage → use-app-data hook → Components
```

1. **app-data.json** - Static JSON file with initial/seed data
2. **use-sample-data** - Loads JSON data into KV storage on first run
3. **use-app-data** - Reads from KV storage and provides reactive state
4. **Components** - Use the reactive data from use-app-data

### 2. Initial Data Load

When the application first loads (or when KV storage is empty), the `useSampleData` hook:
- Checks if data has been initialized (`sample-data-initialized` flag)
- If not initialized, loads data from `app-data.json`
- Populates KV storage with all data entities
- Sets the initialization flag to prevent re-loading

### 3. Persistent Storage

All data is stored in KV storage, which persists between sessions. This means:
- User modifications are preserved
- Data survives page refreshes
- Each user has their own data instance

## Data Schema

### Timesheets

```typescript
{
  id: string              // Unique timesheet ID
  workerId: string        // Reference to worker
  workerName: string      // Worker's name
  clientName: string      // Client company name
  weekEnding: string      // ISO date string
  totalHours: number      // Total hours worked
  regularHours: number    // Standard hours
  overtimeHours: number   // Overtime hours
  status: string          // "pending" | "approved" | "disputed"
  rate: number            // Hourly rate
  total: number           // Total amount
  submittedDate: string   // ISO date-time string
  approvedDate?: string   // Optional approval date
  shifts: Shift[]         // Array of shift details
}

Shift: {
  date: string            // ISO date string
  start: string           // Time "HH:MM"
  end: string             // Time "HH:MM"
  hours: number           // Hours worked
  type: string            // "regular" | "night" | "weekend" | "overtime"
}
```

### Invoices

```typescript
{
  id: string              // Unique invoice ID
  clientName: string      // Client company name
  amount: number          // Net amount
  vat: number             // VAT/Tax amount
  total: number           // Gross total
  status: string          // "paid" | "pending" | "overdue" | "draft"
  dueDate: string         // ISO date string
  invoiceDate: string     // ISO date string
  paidDate?: string       // Optional payment date
  items: InvoiceItem[]    // Line items
}

InvoiceItem: {
  description: string     // Item description
  quantity: number        // Quantity
  rate: number            // Unit rate
  amount: number          // Total amount
}
```

### Payroll Runs

```typescript
{
  id: string              // Unique payroll run ID
  periodEnding: string    // ISO date string
  status: string          // "completed" | "pending" | "processing"
  totalGross: number      // Total gross pay
  totalNet: number        // Total net pay
  totalTax: number        // Total tax withheld
  totalNI: number         // Total National Insurance
  processedDate?: string  // Optional processing date
  paymentDate?: string    // Optional payment date
  workerCount: number     // Number of workers
  entries: PayrollEntry[] // Individual worker entries
}

PayrollEntry: {
  workerId: string        // Reference to worker
  workerName: string      // Worker's name
  gross: number           // Gross pay
  net: number             // Net pay
  tax: number             // Tax withheld
  ni: number              // National Insurance
}
```

### Workers

```typescript
{
  id: string              // Unique worker ID
  name: string            // Full name
  email: string           // Email address
  phone: string           // Phone number
  status: string          // "active" | "inactive" | "onboarding"
  role: string            // Job role/title
  startDate: string       // ISO date string
  paymentType: string     // "Limited Company" | "PAYE" | "CIS"
  currentClient: string   // Current client assignment
}
```

### Compliance Documents

```typescript
{
  id: string              // Unique document ID
  workerId: string        // Reference to worker
  workerName: string      // Worker's name
  documentType: string    // Document type name
  status: string          // "valid" | "expiring" | "expired"
  expiryDate: string      // ISO date string
  uploadDate: string      // ISO date string
  verifiedDate: string    // ISO date string
}
```

### Expenses

```typescript
{
  id: string              // Unique expense ID
  workerId: string        // Reference to worker
  workerName: string      // Worker's name
  category: string        // "Travel" | "Accommodation" | "Meals" | "Equipment"
  amount: number          // Expense amount
  date: string            // ISO date string
  status: string          // "approved" | "pending" | "rejected"
  description: string     // Expense description
  receiptAttached: boolean// Receipt attachment status
  approvedDate?: string   // Optional approval date
  rejectedDate?: string   // Optional rejection date
  rejectionReason?: string// Optional rejection reason
}
```

### Rate Cards

```typescript
{
  id: string              // Unique rate card ID
  role: string            // Job role/title
  clientName: string      // Client company name
  payRate: number         // Hourly pay rate
  chargeRate: number      // Hourly charge rate
  margin: number          // Margin amount
  marginPercent: number   // Margin percentage
  currency: string        // Currency code (e.g., "GBP")
  validFrom: string       // ISO date string
  validUntil: string      // ISO date string
  overtimeMultiplier: number    // Overtime rate multiplier
  weekendMultiplier: number     // Weekend rate multiplier
  nightMultiplier?: number      // Optional night shift multiplier
}
```

### Clients

```typescript
{
  id: string              // Unique client ID
  name: string            // Company name
  industry: string        // Industry sector
  status: string          // "active" | "inactive" | "suspended"
  creditLimit: number     // Credit limit
  outstandingBalance: number    // Current outstanding balance
  paymentTerms: number    // Payment terms in days
  activeWorkers: number   // Number of active workers
  address: string         // Full address
}
```

## Hooks

### useJsonData()

Direct access to JSON data (read-only).

```typescript
import { useJsonData } from '@/hooks'

function MyComponent() {
  const { data, isLoading, error } = useJsonData()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{data.workers.length} workers</div>
}
```

### useSampleData()

Initializes KV storage with JSON data (runs automatically on app start).

```typescript
import { useSampleData } from '@/hooks'

function App() {
  useSampleData() // Call once at app root
  // ...
}
```

### useAppData()

Reactive access to data with setters (recommended for components).

```typescript
import { useAppData } from '@/hooks'

function MyComponent() {
  const { timesheets, setTimesheets, workers, metrics } = useAppData()
  
  // Use data
  console.log(timesheets.length)
  
  // Update data
  setTimesheets(prev => [...prev, newTimesheet])
}
```

## Modifying Data

### Option 1: Edit JSON File (Recommended for Bulk Changes)

1. Edit `/src/data/app-data.json`
2. Clear KV storage (or set `sample-data-initialized` to `false`)
3. Refresh the application

### Option 2: Programmatic Updates (Recommended for User Actions)

```typescript
const { timesheets, setTimesheets } = useAppData()

// Add new timesheet
setTimesheets(current => [...current, newTimesheet])

// Update timesheet
setTimesheets(current =>
  current.map(ts =>
    ts.id === id ? { ...ts, status: 'approved' } : ts
  )
)

// Delete timesheet
setTimesheets(current => current.filter(ts => ts.id !== id))
```

## Adding New Data Entities

To add new data entities:

1. **Add to JSON file** (`/src/data/app-data.json`)
   ```json
   {
     "timesheets": [...],
     "newEntity": [
       { "id": "1", "name": "Example" }
     ]
   }
   ```

2. **Add TypeScript interface** (`/src/hooks/use-json-data.ts`)
   ```typescript
   export interface NewEntity {
     id: string
     name: string
   }
   
   export interface AppData {
     timesheets: Timesheet[]
     newEntity: NewEntity[]
   }
   ```

3. **Initialize in use-sample-data**
   ```typescript
   const [, setNewEntity] = useKV<NewEntity[]>('new-entity', [])
   
   setNewEntity(appData.newEntity)
   ```

4. **Expose in use-app-data**
   ```typescript
   const [newEntity = [], setNewEntity] = useKV<NewEntity[]>('new-entity', [])
   
   return {
     newEntity,
     setNewEntity,
     // ...
   }
   ```

## Benefits

- **Centralized Data**: All sample data in one place
- **Easy Configuration**: Modify JSON instead of code
- **Type Safety**: Full TypeScript support
- **Persistence**: Data survives page refreshes
- **Reactive**: Automatic UI updates
- **Testable**: Easy to swap data for testing
- **Scalable**: Add new entities without code changes

## Future Enhancements

- Support for multiple JSON files (e.g., `timesheets.json`, `invoices.json`)
- Remote JSON loading from API
- Data validation on load
- Migration scripts for schema changes
- Import/export functionality
- Data versioning
