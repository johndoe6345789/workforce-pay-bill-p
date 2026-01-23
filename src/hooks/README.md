# Custom Hook Library

A comprehensive collection of React hooks for the WorkForce Pro platform.

## Available Hooks

### State Management
- **useToggle** - Boolean state toggle with setter
- **usePrevious** - Access previous value of state
- **useLocalStorage** - Persist state in localStorage
- **useDisclosure** - Modal/drawer open/close state
- **useUndo** - Undo/redo state management
- **useFormState** - Form state with validation and dirty tracking

### Async Operations
- **useAsync** - Handle async operations with loading/error states
- **useDebounce** - Debounce rapidly changing values
- **useThrottle** - Throttle function calls
- **useInterval** - Declarative setInterval hook

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
- **useClipboard** - Enhanced clipboard with timeout
- **useFocusTrap** - Trap focus within element

### Data Management
- **useFilter** - Filter arrays with debouncing
- **useSort** - Sort arrays by key and direction
- **usePagination** - Paginate large datasets
- **useSelection** - Multi-select management
- **useTable** - Complete table with sort/filter/pagination

### Forms & Validation
- **useFormValidation** - Form validation with error handling
- **useWizard** - Multi-step form/wizard state
- **useMultiStepForm** - Advanced multi-step form with validation
- **useConfirmation** - Confirmation dialog state

### Browser & Navigation
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
}, 5000)
```
