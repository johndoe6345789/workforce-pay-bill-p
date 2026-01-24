# IndexedDB CRUD Operations

This application uses IndexedDB for all data persistence and CRUD (Create, Read, Update, Delete) operations. This provides better performance, offline support, and structured data management compared to simple key-value storage.

## Architecture

### Database Structure
- **Database Name**: `WorkForceProDB`
- **Version**: 2
- **Stores**:
  - `sessions` - User session data
  - `appState` - General application state
  - `timesheets` - Timesheet entities
  - `invoices` - Invoice entities
  - `payrollRuns` - Payroll run entities
  - `workers` - Worker entities
  - `complianceDocs` - Compliance document entities
  - `expenses` - Expense entities
  - `rateCards` - Rate card entities

### Indexes
Each entity store has relevant indexes for efficient querying:
- **timesheets**: `workerId`, `status`, `weekEnding`
- **invoices**: `clientId`, `status`, `invoiceDate`
- **payrollRuns**: `status`, `periodEnding`
- **workers**: `status`, `email`
- **complianceDocs**: `workerId`, `status`, `expiryDate`
- **expenses**: `workerId`, `status`, `date`
- **rateCards**: `clientId`, `role`

## Usage

### Low-Level API (Direct IndexedDB Access)

```typescript
import { indexedDB, STORES } from '@/lib/indexed-db'

// Create
const newTimesheet = { id: 'ts-001', workerId: 'w-123', hours: 40, status: 'pending' }
await indexedDB.create(STORES.TIMESHEETS, newTimesheet)

// Read one
const timesheet = await indexedDB.read(STORES.TIMESHEETS, 'ts-001')

// Read all
const allTimesheets = await indexedDB.readAll(STORES.TIMESHEETS)

// Read by index
const pendingTimesheets = await indexedDB.readByIndex(STORES.TIMESHEETS, 'status', 'pending')

// Update
timesheet.status = 'approved'
await indexedDB.update(STORES.TIMESHEETS, timesheet)

// Delete
await indexedDB.delete(STORES.TIMESHEETS, 'ts-001')

// Delete all
await indexedDB.deleteAll(STORES.TIMESHEETS)

// Bulk operations
await indexedDB.bulkCreate(STORES.TIMESHEETS, [timesheet1, timesheet2, timesheet3])
await indexedDB.bulkUpdate(STORES.TIMESHEETS, [updatedTimesheet1, updatedTimesheet2])

// Query with predicate
const highValueTimesheets = await indexedDB.query(
  STORES.TIMESHEETS,
  (ts) => ts.hours > 40
)
```

### React Hook API (Recommended)

#### Generic CRUD Hook

```typescript
import { useCRUD } from '@/hooks/use-crud'
import { STORES } from '@/lib/indexed-db'

function MyComponent() {
  const {
    data,           // Current data in state
    isLoading,      // Loading state
    error,          // Error state
    create,         // Create entity
    read,           // Read single entity
    readAll,        // Read all entities
    readByIndex,    // Read by index
    update,         // Update entity
    remove,         // Delete entity
    removeAll,      // Delete all entities
    bulkCreate,     // Bulk create
    bulkUpdate,     // Bulk update
    query,          // Query with predicate
    refresh,        // Refresh data
  } = useCRUD<Timesheet>(STORES.TIMESHEETS)

  // Usage examples
  const handleCreate = async () => {
    await create({ id: 'ts-001', workerId: 'w-123', hours: 40 })
  }

  const handleUpdate = async (id: string) => {
    const timesheet = await read(id)
    if (timesheet) {
      await update({ ...timesheet, status: 'approved' })
    }
  }

  const handleDelete = async (id: string) => {
    await remove(id)
  }

  const handleSearch = async () => {
    const results = await query((ts) => ts.hours > 40)
    console.log(results)
  }

  useEffect(() => {
    readAll() // Load initial data
  }, [])

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <Alert>{error.message}</Alert>}
      {data.map(item => <Card key={item.id}>{item.name}</Card>)}
    </div>
  )
}
```

#### Entity-Specific CRUD Hooks

Pre-configured hooks for each entity type:

```typescript
import { 
  useTimesheetsCRUD,
  useInvoicesCRUD,
  usePayrollRunsCRUD,
  useWorkersCRUD,
  useComplianceDocsCRUD,
  useExpensesCRUD,
  useRateCardsCRUD
} from '@/hooks/use-entity-crud'

function TimesheetsView() {
  const timesheets = useTimesheetsCRUD()
  
  useEffect(() => {
    timesheets.readAll()
  }, [])

  const handleApprove = async (id: string) => {
    const timesheet = await timesheets.read(id)
    if (timesheet) {
      await timesheets.update({ ...timesheet, status: 'approved' })
    }
  }

  return (
    <div>
      {timesheets.data.map(ts => (
        <TimesheetCard 
          key={ts.id} 
          timesheet={ts} 
          onApprove={() => handleApprove(ts.id)} 
        />
      ))}
    </div>
  )
}
```

#### IndexedDB State Hook (for backwards compatibility)

Automatically detects entity stores and uses appropriate storage:

```typescript
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { STORES } from '@/lib/indexed-db'

function MyComponent() {
  // For entity stores: uses IndexedDB entity storage
  const [timesheets, setTimesheets] = useIndexedDBState<Timesheet[]>(
    STORES.TIMESHEETS, 
    []
  )

  // For non-entity data: uses appState storage
  const [preferences, setPreferences] = useIndexedDBState(
    'user-preferences',
    { theme: 'light' }
  )

  // Update always uses functional form for safety
  const addTimesheet = (newTimesheet: Timesheet) => {
    setTimesheets(current => [...current, newTimesheet])
  }
}
```

## Migration from KV Storage

The application has been migrated from KV storage to IndexedDB. Key changes:

1. **`use-app-data` hook**: Now uses `useIndexedDBState` instead of `useKV`
2. **Data persistence**: All entity data is stored in dedicated IndexedDB stores
3. **Performance**: Bulk operations and indexed queries provide better performance
4. **Querying**: Native support for filtering and querying via indexes

### Before (KV Storage)
```typescript
const [timesheets, setTimesheets] = useKV<Timesheet[]>('timesheets', [])
```

### After (IndexedDB)
```typescript
const [timesheets, setTimesheets] = useIndexedDBState<Timesheet[]>(STORES.TIMESHEETS, [])
// OR
const timesheets = useTimesheetsCRUD()
```

## Best Practices

1. **Always use functional updates** when modifying arrays/objects:
   ```typescript
   // ✅ Good
   setTimesheets(current => [...current, newItem])
   
   // ❌ Bad (stale closure)
   setTimesheets([...timesheets, newItem])
   ```

2. **Use entity-specific hooks** for typed operations:
   ```typescript
   const timesheets = useTimesheetsCRUD()
   ```

3. **Leverage indexes** for efficient queries:
   ```typescript
   const pendingItems = await readByIndex('status', 'pending')
   ```

4. **Handle errors appropriately**:
   ```typescript
   try {
     await timesheets.create(newTimesheet)
   } catch (error) {
     toast.error('Failed to create timesheet')
   }
   ```

5. **Use bulk operations** for multiple items:
   ```typescript
   await timesheets.bulkCreate([item1, item2, item3])
   ```

## Benefits

- ✅ **Structured storage**: Proper relational-style data organization
- ✅ **Indexed queries**: Fast lookups by common fields
- ✅ **Bulk operations**: Efficient batch processing
- ✅ **Type safety**: Full TypeScript support
- ✅ **Offline support**: Works without network connection
- ✅ **Performance**: Better than key-value for complex data
- ✅ **Transactional**: ACID guarantees for data integrity
- ✅ **Observable**: React hooks provide reactive updates

## Debugging

Open browser DevTools → Application → IndexedDB → WorkForceProDB to inspect data directly.
