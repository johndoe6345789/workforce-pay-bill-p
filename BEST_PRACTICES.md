# Best Practices & Code Standards

## React Hooks - CRITICAL Rules

### ✅ ALWAYS Use Functional Updates with useState/useKV

```typescript
// ❌ WRONG - Creates stale closure bugs
const [items, setItems] = useState([])
const addItem = (newItem) => {
  setItems([...items, newItem]) // items is STALE!
}

// ✅ CORRECT - Always current
const [items, setItems] = useState([])
const addItem = (newItem) => {
  setItems(currentItems => [...currentItems, newItem])
}
```

### ✅ NEVER Reference State Outside Setter

```typescript
// ❌ WRONG - Reading from closure
const handleApprove = (id) => {
  setTimesheets(current => current.map(...))
  const timesheet = timesheets.find(t => t.id === id) // STALE!
}

// ✅ CORRECT - Get from updated state
const handleApprove = (id) => {
  setTimesheets(current => {
    const updated = current.map(...)
    const timesheet = updated.find(t => t.id === id) // CURRENT!
    return updated
  })
}
```

### ✅ Use useCallback for Expensive Functions

```typescript
// ✅ Prevents recreation on every render
const handleSubmit = useCallback((data) => {
  // expensive operation
}, [dependencies])
```

### ✅ Use useMemo for Expensive Calculations

```typescript
// ✅ Only recalculates when dependencies change
const expensiveValue = useMemo(() => {
  return data.reduce((acc, item) => acc + item.value, 0)
}, [data])
```

## Data Persistence

### Use useKV for Persistent Data

```typescript
// ✅ Data survives page refresh
const [todos, setTodos] = useKV('user-todos', [])

// ✅ ALWAYS use functional updates
setTodos(current => [...current, newTodo])
```

### Use useState for Temporary Data

```typescript
// ✅ UI state that doesn't need to persist
const [isOpen, setIsOpen] = useState(false)
const [searchQuery, setSearchQuery] = useState('')
```

## TypeScript Best Practices

### Use Explicit Types

```typescript
// ✅ Type all function parameters
function processInvoice(invoice: Invoice): ProcessedInvoice {
  // ...
}

// ❌ Avoid any
function process(data: any) { }

// ✅ Use proper types
function process(data: InvoiceData) { }
```

### Use Type Guards

```typescript
// ✅ Type narrowing
function isInvoice(obj: unknown): obj is Invoice {
  return typeof obj === 'object' && obj !== null && 'invoiceNumber' in obj
}
```

### Use Const Assertions

```typescript
// ✅ Literal types
const status = 'approved' as const
setTimesheet({ ...timesheet, status })
```

## Error Handling

### Wrap Async Operations

```typescript
// ✅ Handle errors gracefully
const loadData = async () => {
  try {
    const data = await fetchData()
    setData(data)
  } catch (error) {
    console.error('Failed to load data:', error)
    toast.error('Failed to load data')
    setError(error)
  }
}
```

### Use Error Boundaries

```typescript
// ✅ Catch render errors
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <MyComponent />
</ErrorBoundary>
```

## Performance Optimization

### Avoid Inline Functions in JSX

```typescript
// ❌ Creates new function every render
<Button onClick={() => handleClick(id)}>Click</Button>

// ✅ Use useCallback or bind
const handleButtonClick = useCallback(() => handleClick(id), [id])
<Button onClick={handleButtonClick}>Click</Button>
```

### Memo Expensive Components

```typescript
// ✅ Prevents unnecessary re-renders
const ExpensiveComponent = memo(({ data }) => {
  // expensive rendering
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data
})
```

### Virtual Scrolling for Large Lists

```typescript
// ✅ For lists with 100+ items
import { useVirtualScroll } from '@/hooks/use-virtual-scroll'

const VirtualList = ({ items }) => {
  const { visibleItems, containerProps, scrollProps } = useVirtualScroll(items)
  return (
    <div {...containerProps}>
      {visibleItems.map(item => <Item key={item.id} {...item} />)}
    </div>
  )
}
```

## Component Organization

### Keep Components Under 250 Lines

```typescript
// ✅ Extract complex logic to custom hooks
function MyComponent() {
  const { data, actions } = useMyComponentLogic()
  return <div>{/* simple JSX */}</div>
}

function useMyComponentLogic() {
  // complex state management
  return { data, actions }
}
```

### Single Responsibility

```typescript
// ✅ Each component does one thing
const UserAvatar = ({ user }) => <img src={user.avatarUrl} />
const UserName = ({ user }) => <span>{user.name}</span>
const UserBadge = ({ user }) => <Badge>{user.role}</Badge>

// Compose them
const UserCard = ({ user }) => (
  <Card>
    <UserAvatar user={user} />
    <UserName user={user} />
    <UserBadge user={user} />
  </Card>
)
```

## Styling

### Use Tailwind Composition

```typescript
// ✅ Compose utilities
<div className="flex items-center gap-4 p-6 bg-card rounded-lg border">
```

### Extract Common Patterns

```typescript
// ✅ Consistent spacing
const cardClasses = "p-6 bg-card rounded-lg border"
const flexRowClasses = "flex items-center gap-4"
```

### Use cn() for Conditional Classes

```typescript
import { cn } from '@/lib/utils'

// ✅ Merge classes safely
<div className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === 'primary' && "primary-classes"
)}>
```

## State Management with Redux

### Use Typed Hooks

```typescript
// ✅ Type-safe hooks
import { useAppSelector, useAppDispatch } from '@/store/hooks'

const user = useAppSelector(state => state.auth.user)
const dispatch = useAppDispatch()
```

### Keep Slices Focused

```typescript
// ✅ One slice per domain
const timesheetsSlice = createSlice({
  name: 'timesheets',
  // only timesheet state
})
```

### Use Redux for Global State

```typescript
// ✅ App-wide state
- Authentication
- UI preferences (theme, locale)
- Current view/navigation

// ✅ Component state
- Form inputs
- Local UI state (modals, dropdowns)
```

## Accessibility

### Semantic HTML

```typescript
// ✅ Use semantic elements
<nav>
  <ul>
    <li><a href="/dashboard">Dashboard</a></li>
  </ul>
</nav>

// ❌ Avoid div soup
<div onClick={...}>Click me</div>

// ✅ Use button
<button onClick={...}>Click me</button>
```

### ARIA Labels

```typescript
// ✅ Label interactive elements
<button aria-label="Close dialog">
  <X size={20} />
</button>
```

### Keyboard Navigation

```typescript
// ✅ Support keyboard
<Dialog onOpenAutoFocus={...} onCloseAutoFocus={...}>
```

## Testing

### Test Business Logic

```typescript
// ✅ Unit test hooks
describe('useInvoiceCalculations', () => {
  it('calculates total correctly', () => {
    const { result } = renderHook(() => useInvoiceCalculations(data))
    expect(result.current.total).toBe(1000)
  })
})
```

### Test User Interactions

```typescript
// ✅ Integration tests
it('approves timesheet on click', async () => {
  render(<TimesheetCard {...props} />)
  await userEvent.click(screen.getByText('Approve'))
  expect(screen.getByText('Approved')).toBeInTheDocument()
})
```

## Security

### Sanitize User Input

```typescript
// ✅ Validate and sanitize
function handleSubmit(input: string) {
  const sanitized = input.trim().slice(0, 100)
  if (!sanitized) {
    toast.error('Input required')
    return
  }
  processInput(sanitized)
}
```

### Never Log Sensitive Data

```typescript
// ❌ Don't log passwords, tokens
console.log('User data:', userData)

// ✅ Log safe data only
console.log('User ID:', userId)
```

### Use Permission Gates

```typescript
// ✅ Check permissions
import { PermissionGate } from '@/components/PermissionGate'

<PermissionGate permission="delete:timesheets">
  <Button variant="destructive">Delete</Button>
</PermissionGate>
```

## File Organization

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── views/        # Page-level components
│   └── [Feature].tsx # Feature components
├── hooks/
│   ├── use-[name].ts # Custom hooks
│   └── index.ts      # Barrel export
├── lib/
│   ├── types.ts      # Type definitions
│   ├── utils.ts      # Utility functions
│   └── constants.ts  # App constants
├── store/
│   ├── slices/       # Redux slices
│   ├── hooks.ts      # Typed Redux hooks
│   └── store.ts      # Store configuration
└── data/
    └── *.json        # Static data files
```

## Git Commit Messages

```bash
# ✅ Descriptive commits
fix: resolve stale closure bug in timesheet approval
feat: add error boundary to lazy-loaded views
perf: memoize dashboard metrics calculation
refactor: extract invoice logic to custom hook

# ❌ Vague commits
fix: bug
update: changes
wip
```

## Documentation

### JSDoc for Complex Functions

```typescript
/**
 * Calculates the gross margin for a given period
 * @param revenue - Total revenue in the period
 * @param costs - Total costs in the period
 * @returns Gross margin as a percentage (0-100)
 */
function calculateGrossMargin(revenue: number, costs: number): number {
  return revenue > 0 ? ((revenue - costs) / revenue) * 100 : 0
}
```

### README for Complex Features

```markdown
# Feature Name

## Purpose
Brief description

## Usage
Code examples

## API
Function signatures

## Testing
How to test
```

## Common Pitfalls to Avoid

1. ❌ Stale closures in event handlers
2. ❌ Mutating state directly
3. ❌ Missing dependency arrays
4. ❌ Inline styles (use Tailwind)
5. ❌ Deeply nested components
6. ❌ Any types everywhere
7. ❌ No error handling
8. ❌ Blocking the UI thread
9. ❌ Memory leaks (uncleared timeouts/intervals)
10. ❌ Prop drilling (use context or Redux)

## Checklist for Pull Requests

- [ ] No console.logs in production code
- [ ] All new functions have types
- [ ] Complex logic has comments
- [ ] New features have error handling
- [ ] useState uses functional updates
- [ ] Expensive calculations are memoized
- [ ] No accessibility regressions
- [ ] Code follows existing patterns
- [ ] No duplicate code
- [ ] Cleaned up unused imports
