# Custom Hook Library

A comprehensive collection of React hooks for the WorkForce Pro platform.

## Available Hooks

### State Management
- **useToggle** - Boolean state toggle with setter
- **usePrevious** - Access previous value of state
- **useLocalStorage** - Persist state in localStorage

### Async Operations
- **useAsync** - Handle async operations with loading/error states
- **useDebounce** - Debounce rapidly changing values
- **useThrottle** - Throttle function calls

### UI & Interaction
- **useMediaQuery** - Responsive media query matching
- **useIsMobile** - Mobile device detection
- **useWindowSize** - Track window dimensions
- **useScrollPosition** - Monitor scroll position
- **useOnClickOutside** - Detect clicks outside element
- **useIntersectionObserver** - Visibility detection
- **useKeyboardShortcut** - Global keyboard shortcuts
- **useIdleTimer** - Detect user idle state
- **useCopyToClipboard** - Copy text to clipboard

### Data Management
- **useFilter** - Filter arrays with debouncing
- **useSort** - Sort arrays by key and direction
- **usePagination** - Paginate large datasets
- **useSelection** - Multi-select management

### Forms & Validation
- **useFormValidation** - Form validation with error handling
- **useWizard** - Multi-step form/wizard state

### Application-Specific
- **useNotifications** - Notification system state
- **useSampleData** - Initialize sample data

## Usage Examples

### useDebounce
```tsx
import { useDebounce } from '@/hooks'

const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  // API call with debounced value
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
