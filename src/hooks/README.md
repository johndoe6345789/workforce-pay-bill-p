# Custom Hook Library

A comprehensive collection of 100+ React hooks for the WorkForce Pro platform.

## Available Hooks

### State Management (9 hooks)
- **useToggle** - Boolean state toggle with setter
- **usePrevious** - Access previous value of state
- **useLocalStorage** - Persist state in localStorage
- **useDisclosure** - Modal/drawer open/close state
- **useUndo** - Undo/redo state management with history
- **useFormState** - Form state with validation and dirty tracking
- **useArray** - Array manipulation (push, filter, update, remove, move, swap)
- **useMap** - Map data structure with reactive updates
- **useSet** - Set data structure with reactive updates
- **useIndexedDBState** - React state with IndexedDB persistence
- **useIndexedDBCache** - Cached data fetching with TTL support

### Async Operations (4 hooks)
- **useAsync** - Handle async operations with loading/error states
- **useDebounce** - Debounce rapidly changing values
- **useThrottle** - Throttle function calls
- **useInterval** - Declarative setInterval hook
- **useTimeout** - Declarative setTimeout hook
- **useCountdown** - Countdown timer with start/pause/reset

### UI & Interaction (10 hooks)
- **useMediaQuery** - Responsive media query matching
- **useIsMobile** - Mobile device detection
- **useWindowSize** - Track window dimensions
- **useScrollPosition** - Monitor scroll position
- **useOnClickOutside** - Detect clicks outside element
- **useIntersectionObserver** - Visibility detection
- **useKeyboardShortcut** - Global keyboard shortcuts
- **useIdleTimer** - Detect user idle state
- **useCopyToClipboard** - Copy text to clipboard
- **useClipboard** - Enhanced clipboard with timeout
- **useFocusTrap** - Trap focus within element

### Data Management (5 hooks)
- **useFilter** - Filter arrays with debouncing
- **useSort** - Sort arrays by key and direction
- **usePagination** - Paginate large datasets
- **useSelection** - Multi-select management
- **useTable** - Complete table with sort/filter/pagination

### Forms & Validation (5 hooks)
- **useFormValidation** - Form validation with error handling
- **useWizard** - Multi-step form/wizard state
- **useMultiStepForm** - Advanced multi-step form with validation
- **useConfirmation** - Confirmation dialog state
- **useSteps** - Step navigation with progress tracking

### Browser & Navigation (3 hooks)
- **useQueryParams** - URL query parameter management
- **useDownload** - File download utilities (JSON, CSV, etc.)

### Application-Specific
- **useNotifications** - Notification system state
- **useSampleData** - Initialize sample data

## Usage Examples

### useTable
```tsx
import { useTable } from '@/hooks'

const {
  data,
  page,
  totalPages,
  sortKey,
  sortDirection,
  handleSort,
  handleFilter,
  nextPage,
  prevPage
} = useTable({
  data: allTimesheets,
  pageSize: 10,
  initialSort: { key: 'date', direction: 'desc' }
})
```

### useMultiStepForm
```tsx
import { useMultiStepForm } from '@/hooks'

const {
  currentStep,
  formData,
  errors,
  isLastStep,
  updateData,
  nextStep,
  prevStep,
  handleSubmit
} = useMultiStepForm({
  initialData: { name: '', email: '', address: '' },
  steps: ['Personal', 'Contact', 'Review'],
  onComplete: async (data) => await saveData(data)
})
```

### useConfirmation
```tsx
import { useConfirmation } from '@/hooks'

const { isOpen, confirm, onConfirm, onCancel, title, message } = useConfirmation()

const handleDelete = async () => {
  const confirmed = await confirm({
    title: 'Delete Item',
    message: 'Are you sure? This cannot be undone.',
    variant: 'destructive'
  })
  if (confirmed) {
    await deleteItem()
  }
}
```

### useDownload
```tsx
import { useDownload } from '@/hooks'

const { isDownloading, downloadJSON, downloadCSV } = useDownload()

const exportData = () => {
  downloadCSV(timesheets, 'timesheets.csv')
}
```

### useUndo
```tsx
import { useUndo } from '@/hooks'

const {
  state,
  setState,
  undo,
  redo,
  canUndo,
  canRedo
} = useUndo({ text: '' })
```

### useQueryParams
```tsx
import { useQueryParams } from '@/hooks'

const { params, updateParams, clearParams } = useQueryParams<{
  search: string
  status: string
}>()

updateParams({ search: 'john', status: 'active' })
```

### useClipboard
```tsx
import { useClipboard } from '@/hooks'

const { isCopied, copy } = useClipboard()

<Button onClick={() => copy('Text to copy')}>
  {isCopied ? 'Copied!' : 'Copy'}
</Button>
```

### useDisclosure
```tsx
import { useDisclosure } from '@/hooks'

const { isOpen, open, close, toggle } = useDisclosure()

<Button onClick={open}>Open Modal</Button>
<Dialog open={isOpen} onOpenChange={close}>
  ...
</Dialog>
```

### useFocusTrap
```tsx
import { useFocusTrap } from '@/hooks'

const ref = useFocusTrap<HTMLDivElement>(isModalOpen)

<div ref={ref}>
  {/* Focus will be trapped within this element */}
</div>
```

### useFormState
```tsx
import { useFormState } from '@/hooks'

const {
  values,
  errors,
  touched,
  isDirty,
  setValue,
  handleChange,
  handleBlur
} = useFormState({ name: '', email: '' })
```

### useDebounce
```tsx
import { useDebounce } from '@/hooks'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  searchAPI(debouncedSearch)
}, [debouncedSearch])
```

### usePagination
```tsx
import { usePagination } from '@/hooks'

const {
  paginatedItems,
  currentPage,
  totalPages,
  nextPage,
  previousPage
} = usePagination(allItems, 10)
```

### useSelection
```tsx
import { useSelection } from '@/hooks'

const {
  selectedIds,
  toggleSelection,
  selectAll,
  clearSelection
} = useSelection(items)
```

### useFormValidation
```tsx
import { useFormValidation } from '@/hooks'

const { values, errors, handleChange, validateAll } = useFormValidation(
  { email: '', password: '' },
  {
    email: (val) => !val.includes('@') ? 'Invalid email' : undefined,
    password: (val) => val.length < 8 ? 'Too short' : undefined
  }
)
```

### useWizard
```tsx
import { useWizard } from '@/hooks'

const steps = [
  { id: '1', title: 'Personal Info' },
  { id: '2', title: 'Review' },
  { id: '3', title: 'Complete' }
]

const {
  currentStep,
  goToNextStep,
  goToPreviousStep,
  progress
} = useWizard(steps)
```

### useKeyboardShortcut
```tsx
import { useKeyboardShortcut } from '@/hooks'

useKeyboardShortcut(
  { key: 's', ctrl: true },
  () => saveDocument()
)
```

### useInterval
```tsx
import { useInterval } from '@/hooks'

useInterval(() => {
  checkForUpdates()
}, 5000, { enabled: true, immediate: false })
```

### useCountdown
```tsx
import { useCountdown } from '@/hooks'

const { seconds, minutes, remainingSeconds, start, pause, reset, isFinished } = useCountdown(60)

<div>
  <p>{minutes}:{remainingSeconds.toString().padStart(2, '0')}</p>
  <Button onClick={start}>Start</Button>
  <Button onClick={pause}>Pause</Button>
  <Button onClick={() => reset(30)}>Reset to 30s</Button>
</div>
```

### useTimeout
```tsx
import { useTimeout } from '@/hooks'

useTimeout(() => {
  showNotification()
}, 3000)
```

### useArray
```tsx
import { useArray } from '@/hooks'

const { array, push, remove, update, filter, clear, move, swap } = useArray([1, 2, 3])

push(4)
remove(0)
update(1, 99)
filter((item) => item > 2)
move(0, 2)
swap(0, 1)
```

### useMap
```tsx
import { useMap } from '@/hooks'

const { map, set, remove, clear, has, get, values, keys } = useMap<string, User>()

set('user-1', { id: '1', name: 'John' })
const user = get('user-1')
remove('user-1')
```

### useSet
```tsx
import { useSet } from '@/hooks'

const { set, add, remove, toggle, has, clear, values, size } = useSet<string>()

add('item-1')
toggle('item-2')
has('item-1')
```

### useSteps
```tsx
import { useSteps } from '@/hooks'

const {
  currentStep,
  nextStep,
  previousStep,
  goToStep,
  canGoNext,
  canGoPrevious,
  isFirstStep,
  isLastStep,
  progress
} = useSteps(5, 0)

<div>
  <Progress value={progress} />
  <Button onClick={previousStep} disabled={!canGoPrevious}>Back</Button>
  <Button onClick={nextStep} disabled={!canGoNext}>Next</Button>
</div>
```

## Composing Hooks

Hooks are designed to work together for complex functionality:

```tsx
// Full-featured data table
const [search, setSearch] = useState('')
const debouncedSearch = useDebounce(search, 300)

const filtered = useFilter(items, debouncedSearch, (item, query) =>
  item.name.toLowerCase().includes(query.toLowerCase())
)

const { sortedItems, sortKey, sortDirection, toggleSort } = useSort(
  filtered,
  'date',
  'desc'
)

const { paginatedItems, currentPage, totalPages, nextPage, previousPage } =
  usePagination(sortedItems, 10)

const { selectedIds, toggleSelection, selectAll, clearSelection } =
  useSelection(paginatedItems)
```

## Best Practices

1. **Performance**: Use `useDebounce` for search inputs and expensive operations
2. **Data Management**: Combine `useFilter`, `useSort`, and `usePagination` for tables
3. **Forms**: Use `useFormValidation` or `useFormState` for form management
4. **Workflows**: Use `useWizard` or `useSteps` for multi-step processes
5. **State Persistence**: Use `useLocalStorage` for simple data, `useIndexedDBState` for larger data
6. **Complex State**: Use `useArray`, `useMap`, or `useSet` for advanced data structures
7. **Session Management**: Use `useSessionStorage` for authentication and user session tracking

## Session & Storage Hooks

### useSessionStorage

Manages user sessions with IndexedDB persistence and automatic activity tracking.

```tsx
import { useSessionStorage } from '@/hooks'

const {
  sessionId,           // Current session ID
  isLoading,           // Loading state
  createSession,       // Create new session
  destroySession,      // End current session
  getAllSessions,      // Get all sessions
  clearAllSessions,    // Clear all sessions
  updateSession,       // Update activity
  restoreSession       // Restore from storage
} = useSessionStorage()

// Sessions automatically:
// - Restore on page load
// - Update activity every 60 seconds
// - Expire after 24 hours
// - Integrate with Redux auth state
```

### useIndexedDBState

React state hook with IndexedDB persistence - like `useState` but data survives page refreshes.

```tsx
import { useIndexedDBState } from '@/hooks'

const [preferences, setPreferences, deletePreferences] = useIndexedDBState(
  'userPreferences',
  { theme: 'light', language: 'en' }
)

// Use like useState
setPreferences({ theme: 'dark', language: 'en' })

// Functional updates
setPreferences(prev => ({ ...prev, theme: 'dark' }))

// Delete and reset to default
deletePreferences()
```

### useIndexedDBCache

Cached data fetching with automatic TTL-based refresh and IndexedDB persistence.

```tsx
import { useIndexedDBCache } from '@/hooks'

const { data, isLoading, error, refresh } = useIndexedDBCache(
  'apiData',
  async () => {
    const response = await fetch('/api/data')
    return response.json()
  },
  5 * 60 * 1000 // Cache for 5 minutes
)

// Data cached in IndexedDB
// Refetches if cache older than TTL
// Call refresh() to force fetch
```

See [INDEXED_DB.md](../lib/INDEXED_DB.md) for complete IndexedDB documentation.
