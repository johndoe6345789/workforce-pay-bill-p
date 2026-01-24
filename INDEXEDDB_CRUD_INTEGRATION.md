# IndexedDB CRUD Integration Guide

## Overview

The application has been fully migrated from Spark KV to IndexedDB for all data persistence. All CRUD operations now use IndexedDB through specialized hooks that provide type-safe, optimized data access patterns.

## Architecture

### Storage Layer
- **IndexedDB Manager** (`src/lib/indexed-db.ts`): Core database operations
- **Object Stores**: Separate stores for each entity type
  - `timesheets` - Timesheet records
  - `invoices` - Invoice records
  - `payrollRuns` - Payroll run records
  - `workers` - Worker records
  - `complianceDocs` - Compliance document records
  - `expenses` - Expense records
  - `rateCards` - Rate card records
  - `sessions` - Session data
  - `appState` - Application state

### Hook Layer

#### Generic CRUD Hook
```typescript
import { useCRUD } from '@/hooks/use-crud'
import { STORES } from '@/lib/indexed-db'

// Generic usage
const { entities, create, read, update, remove, bulkCreate, bulkUpdate, query } = 
  useCRUD<MyEntity>(STORES.MY_STORE)
```

#### Entity-Specific Hooks
Each entity has a specialized CRUD hook with domain-specific methods:

**Timesheets**
```typescript
import { useTimesheetsCrud } from '@/hooks'

const {
  timesheets,
  createTimesheet,
  updateTimesheet,
  deleteTimesheet,
  getTimesheetById,
  getTimesheetsByWorker,
  getTimesheetsByStatus,
  bulkCreateTimesheets,
  bulkUpdateTimesheets
} = useTimesheetsCrud()
```

**Invoices**
```typescript
import { useInvoicesCrud } from '@/hooks'

const {
  invoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceById,
  getInvoicesByClient,
  getInvoicesByStatus,
  bulkCreateInvoices,
  bulkUpdateInvoices
} = useInvoicesCrud()
```

**Payroll**
```typescript
import { usePayrollCrud } from '@/hooks'

const {
  payrollRuns,
  createPayrollRun,
  updatePayrollRun,
  deletePayrollRun,
  getPayrollRunById,
  getPayrollRunsByStatus,
  bulkCreatePayrollRuns,
  bulkUpdatePayrollRuns
} = usePayrollCrud()
```

**Expenses**
```typescript
import { useExpensesCrud } from '@/hooks'

const {
  expenses,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseById,
  getExpensesByWorker,
  getExpensesByStatus,
  bulkCreateExpenses,
  bulkUpdateExpenses
} = useExpensesCrud()
```

**Compliance**
```typescript
import { useComplianceCrud } from '@/hooks'

const {
  complianceDocs,
  createComplianceDoc,
  updateComplianceDoc,
  deleteComplianceDoc,
  getComplianceDocById,
  getComplianceDocsByWorker,
  getComplianceDocsByStatus,
  bulkCreateComplianceDocs,
  bulkUpdateComplianceDocs
} = useComplianceCrud()
```

**Workers**
```typescript
import { useWorkersCrud } from '@/hooks'

const {
  workers,
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkerById,
  getWorkersByStatus,
  getWorkerByEmail,
  bulkCreateWorkers,
  bulkUpdateWorkers
} = useWorkersCrud()
```

## Usage Examples

### Creating a New Record
```typescript
const { createTimesheet } = useTimesheetsCrud()

const handleSubmit = async (data) => {
  try {
    const newTimesheet = await createTimesheet({
      workerName: data.workerName,
      clientName: data.clientName,
      weekEnding: data.weekEnding,
      totalHours: data.hours,
      status: 'pending',
      // ... other fields (id will be auto-generated)
    })
    
    toast.success('Timesheet created successfully')
  } catch (error) {
    toast.error('Failed to create timesheet')
  }
}
```

### Updating an Existing Record
```typescript
const { updateTimesheet } = useTimesheetsCrud()

const handleApprove = async (timesheetId: string) => {
  try {
    await updateTimesheet(timesheetId, {
      status: 'approved',
      approvedDate: new Date().toISOString()
    })
    
    toast.success('Timesheet approved')
  } catch (error) {
    toast.error('Failed to approve timesheet')
  }
}
```

### Deleting a Record
```typescript
const { deleteTimesheet } = useTimesheetsCrud()

const handleDelete = async (timesheetId: string) => {
  try {
    await deleteTimesheet(timesheetId)
    toast.success('Timesheet deleted')
  } catch (error) {
    toast.error('Failed to delete timesheet')
  }
}
```

### Querying by Index
```typescript
const { getTimesheetsByWorker, getTimesheetsByStatus } = useTimesheetsCrud()

// Get all timesheets for a specific worker
const workerTimesheets = await getTimesheetsByWorker('worker-123')

// Get all pending timesheets
const pendingTimesheets = await getTimesheetsByStatus('pending')
```

### Bulk Operations
```typescript
const { bulkCreateTimesheets, bulkUpdateTimesheets } = useTimesheetsCrud()

// Bulk import
const handleBulkImport = async (csvData: string) => {
  const parsedData = parseCSV(csvData)
  
  try {
    await bulkCreateTimesheets(parsedData)
    toast.success(`Imported ${parsedData.length} timesheets`)
  } catch (error) {
    toast.error('Bulk import failed')
  }
}

// Bulk approve
const handleBulkApprove = async (timesheetIds: string[]) => {
  const updates = timesheetIds.map(id => ({
    id,
    updates: {
      status: 'approved',
      approvedDate: new Date().toISOString()
    }
  }))
  
  try {
    await bulkUpdateTimesheets(updates)
    toast.success(`Approved ${timesheetIds.length} timesheets`)
  } catch (error) {
    toast.error('Bulk approval failed')
  }
}
```

## Integration with Views

### Timesheets View
The Timesheets view uses the CRUD hooks through the `useAppActions` hook which wraps CRUD operations with business logic and notifications.

### Billing View
The Billing view uses invoice CRUD hooks for creating, updating, and managing invoices.

### Payroll View
The Payroll view uses payroll CRUD hooks for processing payroll runs.

### Expenses View
The Expenses view uses expense CRUD hooks for managing worker expenses.

### Compliance View
The Compliance view uses compliance CRUD hooks for tracking compliance documents.

## Benefits of IndexedDB

1. **Offline Support**: Data persists even when offline
2. **Performance**: Fast indexed queries for large datasets
3. **Type Safety**: TypeScript integration ensures type safety
4. **Transactions**: Atomic operations prevent data corruption
5. **Indexing**: Efficient querying by multiple fields
6. **Storage Limits**: Much larger storage capacity than localStorage (typically 50MB+)

## Data Persistence Strategy

### Automatic Persistence
All data is automatically persisted to IndexedDB through the `useIndexedDBState` hook. Changes are written immediately.

### State Synchronization
The hooks maintain both in-memory state (React) and persistent state (IndexedDB) in sync.

### Data Recovery
On application load, all data is automatically restored from IndexedDB.

## Migration from Spark KV

All Spark KV usage has been removed. The application now exclusively uses IndexedDB for:
- Session management
- Entity storage (timesheets, invoices, payroll, etc.)
- Application state
- User preferences

## Performance Considerations

1. **Bulk Operations**: Use bulk methods for multiple operations to improve performance
2. **Indexed Queries**: Leverage indexes for fast lookups by common fields
3. **Lazy Loading**: Only load data when needed
4. **Caching**: The hooks maintain an in-memory cache for fast reads

## Error Handling

All CRUD operations include error handling. Errors are logged to the console and propagated to the caller for UI feedback.

```typescript
try {
  await createTimesheet(data)
  toast.success('Success')
} catch (error) {
  console.error('Operation failed:', error)
  toast.error('Failed to create timesheet')
}
```

## Testing

Test CRUD operations using the browser's IndexedDB inspector:
1. Open DevTools
2. Go to Application tab
3. Expand IndexedDB
4. Select WorkForceProDB
5. Inspect object stores and data

## Future Enhancements

- Add data export/import functionality
- Implement data synchronization with backend API
- Add versioning for schema migrations
- Implement conflict resolution for concurrent updates
- Add data compression for large datasets
