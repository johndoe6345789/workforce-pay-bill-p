# Redux Integration Guide

This application uses Redux Toolkit for centralized state management across the entire platform.

## Architecture Overview

The Redux store is configured in `/src/store/store.ts` and provides the following slices:

### State Slices

#### 1. Auth Slice (`/src/store/slices/authSlice.ts`)
Manages authentication state and user information.

**State:**
- `user`: Current authenticated user object
- `isAuthenticated`: Boolean flag for auth status
- `currentEntity`: Selected organizational entity

**Actions:**
- `login(user)`: Authenticates user and stores user data
- `logout()`: Clears user session
- `setCurrentEntity(entity)`: Switches between organizational entities

#### 2. UI Slice (`/src/store/slices/uiSlice.ts`)
Manages global UI state.

**State:**
- `currentView`: Active view/page in the application
- `searchQuery`: Global search query string
- `sidebarCollapsed`: Sidebar visibility state

**Actions:**
- `setCurrentView(view)`: Navigate to different views
- `setSearchQuery(query)`: Update search query
- `toggleSidebar()`: Toggle sidebar collapsed state

#### 3. Timesheets Slice (`/src/store/slices/timesheetsSlice.ts`)
Manages timesheet data.

**State:**
- `timesheets`: Array of timesheet objects
- `loading`: Loading state for async operations

**Actions:**
- `setTimesheets(timesheets)`: Replace all timesheets
- `addTimesheet(timesheet)`: Add new timesheet
- `updateTimesheet(timesheet)`: Update existing timesheet
- `deleteTimesheet(id)`: Remove timesheet by ID
- `setLoading(boolean)`: Set loading state

#### 4. Invoices Slice (`/src/store/slices/invoicesSlice.ts`)
Manages invoice data.

**State:**
- `invoices`: Array of invoice objects
- `loading`: Loading state for async operations

**Actions:**
- `setInvoices(invoices)`: Replace all invoices
- `addInvoice(invoice)`: Add new invoice
- `updateInvoice(invoice)`: Update existing invoice
- `deleteInvoice(id)`: Remove invoice by ID
- `setLoading(boolean)`: Set loading state

#### 5. Payroll Slice (`/src/store/slices/payrollSlice.ts`)
Manages payroll run data.

**State:**
- `payrollRuns`: Array of payroll run objects
- `loading`: Loading state for async operations

**Actions:**
- `setPayrollRuns(runs)`: Replace all payroll runs
- `addPayrollRun(run)`: Add new payroll run
- `updatePayrollRun(run)`: Update existing payroll run
- `setLoading(boolean)`: Set loading state

#### 6. Compliance Slice (`/src/store/slices/complianceSlice.ts`)
Manages compliance document data.

**State:**
- `documents`: Array of compliance document objects
- `loading`: Loading state for async operations

**Actions:**
- `setComplianceDocs(docs)`: Replace all compliance documents
- `addComplianceDoc(doc)`: Add new compliance document
- `updateComplianceDoc(doc)`: Update existing compliance document
- `deleteComplianceDoc(id)`: Remove compliance document by ID
- `setLoading(boolean)`: Set loading state

#### 7. Expenses Slice (`/src/store/slices/expensesSlice.ts`)
Manages expense data.

**State:**
- `expenses`: Array of expense objects
- `loading`: Loading state for async operations

**Actions:**
- `setExpenses(expenses)`: Replace all expenses
- `addExpense(expense)`: Add new expense
- `updateExpense(expense)`: Update existing expense
- `deleteExpense(id)`: Remove expense by ID
- `setLoading(boolean)`: Set loading state

#### 8. Notifications Slice (`/src/store/slices/notificationsSlice.ts`)
Manages system notifications.

**State:**
- `notifications`: Array of notification objects
- `unreadCount`: Number of unread notifications

**Actions:**
- `setNotifications(notifications)`: Replace all notifications
- `addNotification(notification)`: Add new notification
- `markAsRead(id)`: Mark notification as read
- `markAllAsRead()`: Mark all notifications as read
- `deleteNotification(id)`: Remove notification by ID

## Using Redux in Components

### 1. Import the typed hooks

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks'
```

### 2. Access state with useAppSelector

```typescript
const user = useAppSelector(state => state.auth.user)
const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated)
const timesheets = useAppSelector(state => state.timesheets.timesheets)
```

### 3. Dispatch actions with useAppDispatch

```typescript
import { login, logout } from '@/store/slices/authSlice'
import { setCurrentView } from '@/store/slices/uiSlice'

const dispatch = useAppDispatch()

// Dispatch actions
dispatch(login({ id: '1', email: 'user@example.com', name: 'User', role: 'Admin' }))
dispatch(setCurrentView('dashboard'))
dispatch(logout())
```

## Custom Hooks with Redux

We've created several custom hooks that wrap Redux logic for cleaner component code:

### useAuth Hook (`/src/hooks/use-auth.ts`)

```typescript
import { useAuth } from '@/hooks/use-auth'

function MyComponent() {
  const { user, isAuthenticated, currentEntity, logout } = useAuth()
  
  return (
    <div>
      {isAuthenticated && <p>Welcome, {user?.name}!</p>}
      <button onClick={logout}>Log Out</button>
    </div>
  )
}
```

### useNavigation Hook (`/src/hooks/use-navigation.ts`)

```typescript
import { useNavigation } from '@/hooks/use-navigation'

function MyComponent() {
  const { currentView, navigateTo } = useNavigation()
  
  return (
    <button onClick={() => navigateTo('dashboard')}>
      Go to Dashboard
    </button>
  )
}
```

### useReduxNotifications Hook (`/src/hooks/use-redux-notifications.ts`)

```typescript
import { useReduxNotifications } from '@/hooks/use-redux-notifications'

function MyComponent() {
  const { notifications, unreadCount, addNotification, markAsRead } = useReduxNotifications()
  
  const handleAction = () => {
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Action completed successfully',
    })
  }
  
  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map(n => (
        <div key={n.id} onClick={() => markAsRead(n.id)}>
          {n.title}
        </div>
      ))}
    </div>
  )
}
```

## Best Practices

1. **Use typed hooks**: Always use `useAppSelector` and `useAppDispatch` instead of the untyped versions from `react-redux`

2. **Create custom hooks**: Wrap common Redux patterns in custom hooks for reusability and cleaner components

3. **Keep slices focused**: Each slice should manage a single domain of state

4. **Use Redux DevTools**: The store is configured with Redux DevTools support for debugging

5. **Immutable updates**: Redux Toolkit uses Immer internally, so you can write "mutating" code in reducers that is automatically converted to immutable updates

6. **Async operations**: For async operations, consider using Redux Toolkit's `createAsyncThunk` or handle them in components/custom hooks

## Example: Complete Component with Redux

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setTimesheets, addTimesheet } from '@/store/slices/timesheetsSlice'
import { addNotification } from '@/store/slices/notificationsSlice'
import { Button } from '@/components/ui/button'

export function TimesheetList() {
  const dispatch = useAppDispatch()
  const timesheets = useAppSelector(state => state.timesheets.timesheets)
  const loading = useAppSelector(state => state.timesheets.loading)
  
  const handleAddTimesheet = () => {
    const newTimesheet = {
      id: `TS-${Date.now()}`,
      workerName: 'New Worker',
      status: 'pending',
      // ... other fields
    }
    
    dispatch(addTimesheet(newTimesheet))
    dispatch(addNotification({
      id: `notif-${Date.now()}`,
      type: 'success',
      title: 'Timesheet Added',
      message: 'New timesheet created successfully',
      timestamp: new Date().toISOString(),
      read: false,
    }))
  }
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <Button onClick={handleAddTimesheet}>Add Timesheet</Button>
      {timesheets.map(ts => (
        <div key={ts.id}>{ts.workerName}</div>
      ))}
    </div>
  )
}
```

## Migration from useState to Redux

For existing components using local state, follow this pattern:

**Before (local state):**
```typescript
const [currentView, setCurrentView] = useState('dashboard')
```

**After (Redux):**
```typescript
const currentView = useAppSelector(state => state.ui.currentView)
const dispatch = useAppDispatch()

// To update:
dispatch(setCurrentView('timesheets'))
```

## Future Enhancements

Consider adding these Redux features as the application grows:

- **Redux Persist**: Persist state to localStorage/sessionStorage
- **RTK Query**: For API data fetching and caching
- **createAsyncThunk**: For complex async operations
- **Entity Adapters**: For normalized state management of collections
