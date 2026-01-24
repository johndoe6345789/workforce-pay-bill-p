# IndexedDB Migration Complete

## Overview
The application has been successfully migrated from Spark KV to IndexedDB for all data persistence needs. This provides better performance, larger storage capacity, and more robust data management capabilities.

## What Changed

### Core Infrastructure
- **IndexedDB Manager** (`src/lib/indexed-db.ts`): Robust IndexedDB wrapper with full CRUD operations
- **useIndexedDBState Hook** (`src/hooks/use-indexed-db-state.ts`): React hook for reactive IndexedDB state management
- **Database Version**: Upgraded to v3 to support the migration

### Migrated Hooks

All hooks that previously used `useKV` from `@github/spark/hooks` now use `useIndexedDBState`:

1. **use-notifications.ts** - Notification storage
2. **use-session-timeout-preferences.ts** - Session timeout preferences
3. **use-translation.ts** - Locale preferences
4. **use-locale-init.ts** - Locale initialization
5. **use-sample-data.ts** - Sample data initialization (now uses direct IndexedDB operations)
6. **use-favorites.ts** - User favorites
7. **use-app-data.ts** - All application entity data (timesheets, invoices, payroll, etc.)

### Storage Architecture

#### Entity Stores (Object Stores)
The following object stores are used for structured business entities:
- `timesheets` - Timesheet records with indexes on workerId, status, weekEnding
- `invoices` - Invoice records with indexes on clientId, status, invoiceDate
- `payrollRuns` - Payroll run records with indexes on status, periodEnding
- `workers` - Worker records with indexes on status, email
- `complianceDocs` - Compliance documents with indexes on workerId, status, expiryDate
- `expenses` - Expense records with indexes on workerId, status, date
- `rateCards` - Rate card records with indexes on clientId, role
- `sessions` - Session management with indexes on userId, lastActivityTimestamp

#### App State Store
The `appState` object store is used for key-value pairs:
- User preferences (locale, session timeout settings)
- UI state
- Notifications
- Favorites
- Any other non-entity data

## Migration Benefits

### Performance
- **Indexed Queries**: Fast lookups using IndexedDB indexes
- **Bulk Operations**: Efficient batch creates and updates
- **Asynchronous**: Non-blocking I/O operations

### Storage
- **Capacity**: Much larger storage limits than Spark KV
- **Structured Data**: Proper schema with indexes for complex queries
- **Transactions**: ACID-compliant database operations

### Developer Experience
- **Type Safety**: Full TypeScript support
- **React Integration**: Seamless integration with React state management
- **Error Handling**: Comprehensive error handling and recovery

## API Reference

### useIndexedDBState Hook

```typescript
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'

// Basic usage (for app state)
const [value, setValue, deleteValue] = useIndexedDBState<string>('my-key', 'default')

// Entity store usage (automatically detected)
const [entities, setEntities] = useIndexedDBState<MyEntity[]>(STORES.MY_STORE, [])

// Functional updates (always use for correct behavior)
setValue(prevValue => prevValue + 1)
setEntities(prevEntities => [...prevEntities, newEntity])
```

### Direct IndexedDB Access

```typescript
import { indexedDB, STORES } from '@/lib/indexed-db'

// CRUD operations
await indexedDB.create(STORES.TIMESHEETS, timesheet)
await indexedDB.read(STORES.TIMESHEETS, id)
await indexedDB.readAll(STORES.TIMESHEETS)
await indexedDB.update(STORES.TIMESHEETS, updatedTimesheet)
await indexedDB.delete(STORES.TIMESHEETS, id)

// Bulk operations
await indexedDB.bulkCreate(STORES.TIMESHEETS, timesheets)
await indexedDB.bulkUpdate(STORES.TIMESHEETS, timesheets)

// Query with predicate
const results = await indexedDB.query(STORES.TIMESHEETS, t => t.status === 'pending')

// Index-based queries
const byWorker = await indexedDB.readByIndex(STORES.TIMESHEETS, 'workerId', workerId)

// App state
await indexedDB.saveAppState('my-key', value)
const value = await indexedDB.getAppState('my-key')
await indexedDB.deleteAppState('my-key')
```

## Breaking Changes

### None!
The migration was designed to be backward compatible. The API surface of `useIndexedDBState` matches `useKV` exactly:

```typescript
// Before (Spark KV)
const [value, setValue, deleteValue] = useKV('key', defaultValue)

// After (IndexedDB)
const [value, setValue, deleteValue] = useIndexedDBState('key', defaultValue)
```

## Data Persistence

### Session Data
- Sessions are stored in the `sessions` object store
- Automatic expiry after 24 hours
- Activity tracking for timeout management

### Business Data
- All entity data is stored in dedicated object stores
- Indexes enable fast queries and filtering
- Support for complex relationships

### User Preferences
- Stored in the `appState` store
- Includes locale, session timeout settings, UI preferences
- Persists across browser sessions

## Best Practices

### 1. Always Use Functional Updates
```typescript
// ❌ WRONG - Don't reference state from closure
setValue([...value, newItem]) // value might be stale!

// ✅ CORRECT - Use functional update
setValue(currentValue => [...currentValue, newItem])
```

### 2. Use Appropriate Storage
```typescript
// Entity data → Use entity stores
useIndexedDBState(STORES.TIMESHEETS, [])

// Simple preferences → Use app state
useIndexedDBState('user-preference', defaultValue)
```

### 3. Handle Errors
```typescript
try {
  await indexedDB.create(STORES.TIMESHEETS, timesheet)
} catch (error) {
  console.error('Failed to create timesheet:', error)
  // Handle error appropriately
}
```

## Testing

The IndexedDB implementation uses the browser's native IndexedDB API, which is available in all modern browsers and can be tested in:
- Development environment
- Browser DevTools (Application → IndexedDB)
- Automated tests using jsdom (already configured)

## Future Enhancements

Potential improvements for future iterations:
1. **Data Migration Tool**: Utility to migrate from Spark KV to IndexedDB (if needed for existing users)
2. **IndexedDB DevTools**: Custom debugging panel for inspecting database state
3. **Query Builder**: Fluent API for complex queries
4. **Schema Migrations**: Automated database schema versioning
5. **Offline Sync**: Sync mechanism for multi-device scenarios

## Troubleshooting

### Database Not Initializing
Check browser console for errors. IndexedDB may be blocked in private/incognito mode.

### Data Not Persisting
Ensure you're using functional updates with `useIndexedDBState`.

### Performance Issues
Use indexes for frequently queried fields. Consider pagination for large datasets.

### Storage Quota Exceeded
IndexedDB has generous limits (~50% of available disk space), but consider implementing data archiving for very large datasets.

## Support

For issues or questions:
1. Check browser compatibility (IndexedDB is supported in all modern browsers)
2. Review the IndexedDB manager implementation in `src/lib/indexed-db.ts`
3. Inspect the database using browser DevTools (Application → Storage → IndexedDB → WorkForceProDB)
