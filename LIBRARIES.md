# WorkForce Pro - Developer Libraries

## Overview

This document provides an overview of the expanded custom hook library and UI component library available in the WorkForce Pro application. These libraries provide production-ready, reusable building blocks for rapid feature development.

## Custom Hook Library

The application includes **40+ custom React hooks** organized into the following categories:

### State Management (8 hooks)
- `useToggle` - Boolean state toggle
- `usePrevious` - Access previous value
- `useLocalStorage` - Persist to localStorage
- `useDisclosure` - Modal/drawer state
- `useUndo` - Undo/redo functionality
- `useFormState` - Form state with validation
- `useArray` - Array manipulation utilities
- `useMap` - Map data structure utilities
- `useSet` - Set data structure utilities

### Async Operations (5 hooks)
- `useAsync` - Async operation handling
- `useDebounce` - Debounce values
- `useThrottle` - Throttle function calls
- `useInterval` - Declarative intervals
- `useTimeout` - Declarative timeouts

### UI & Interaction (12 hooks)
- `useMediaQuery` - Media query matching
- `useIsMobile` - Mobile detection
- `useWindowSize` - Window dimensions
- `useScrollPosition` - Scroll tracking
- `useOnClickOutside` - Outside click detection
- `useIntersectionObserver` - Visibility detection
- `useKeyboardShortcut` - Keyboard shortcuts
- `useIdleTimer` - Idle state detection
- `useCopyToClipboard` - Copy to clipboard
- `useClipboard` - Enhanced clipboard
- `useFocusTrap` - Focus management
- `useCountdown` - Countdown timer

### Data Management (5 hooks)
- `useFilter` - Array filtering
- `useSort` - Array sorting
- `usePagination` - Data pagination
- `useSelection` - Multi-select management
- `useTable` - Complete table utilities

### Forms & Validation (4 hooks)
- `useFormValidation` - Form validation
- `useWizard` - Multi-step wizards
- `useMultiStepForm` - Advanced multi-step forms
- `useSteps` - Step navigation
- `useConfirmation` - Confirmation dialogs

### Browser & Navigation (2 hooks)
- `useQueryParams` - URL query params
- `useDownload` - File downloads

### Application-Specific (2 hooks)
- `useNotifications` - Notification system
- `useSampleData` - Sample data initialization

## UI Component Library

The application includes **70+ UI components** from shadcn v4, plus custom components:

### Display Components
- `EmptyState` - Empty state placeholder
- `StatusBadge` - Status indicators
- `StatCard` - Simple metric cards
- `MetricCard` - Advanced metric cards with trends
- `DataList` - Key-value pair lists
- `DataTable` - Generic data tables
- `Timeline` - Event timelines
- `List` / `ListItem` - Structured lists
- `Chip` - Tag chips
- `Badge` - Status badges
- `Avatar` - User avatars
- `Card` - Content cards
- `Alert` - Alert messages

### Layout Components
- `PageHeader` / `PageTitle` / `PageDescription` / `PageActions` - Page headers
- `Section` / `SectionHeader` / `SectionTitle` / `SectionContent` - Content sections
- `Stack` - Flex containers with spacing
- `Grid` - Responsive grid layouts
- `Separator` - Dividers
- `Divider` - Enhanced dividers with labels
- `ScrollArea` - Scrollable containers
- `Resizable` - Resizable panels

### Input Components
- `Input` - Text inputs
- `Textarea` - Multi-line text
- `Select` - Dropdowns
- `Checkbox` - Checkboxes
- `RadioGroup` - Radio buttons
- `Switch` - Toggle switches
- `Slider` - Range sliders
- `Calendar` - Date picker
- `SearchInput` - Search with clear
- `FileUpload` - File upload with drag-drop
- `InputOTP` - OTP inputs
- `Form` - Form components

### Navigation Components
- `Tabs` - Tab navigation
- `Breadcrumb` - Breadcrumb navigation
- `Pagination` - Full pagination
- `QuickPagination` - Simple pagination
- `Stepper` - Multi-step indicator
- `NavigationMenu` - Navigation menus
- `Menubar` - Menu bars
- `Sidebar` - Application sidebar

### Modal & Dialog Components
- `Dialog` - Standard dialogs
- `AlertDialog` - Confirmation dialogs
- `Modal` / `ModalHeader` / `ModalBody` / `ModalFooter` - Custom modals
- `Sheet` - Side panels
- `Drawer` - Drawer panels
- `Popover` - Popovers
- `HoverCard` - Hover cards
- `Tooltip` - Tooltips
- `ContextMenu` - Context menus
- `DropdownMenu` - Dropdown menus

### Filter & Search Components
- `FilterBar` / `FilterGroup` - Filter controls
- `Tag` / `TagGroup` - Removable tags
- `Command` - Command palette
- `Combobox` - Searchable selects

### Utility Components
- `LoadingSpinner` - Loading indicators
- `LoadingOverlay` - Full-screen loading
- `Progress` - Progress bars
- `Skeleton` - Loading skeletons
- `CopyButton` - Copy to clipboard
- `CodeBlock` - Code display
- `InfoBox` - Info messages
- `Kbd` - Keyboard shortcuts display
- `SortableHeader` - Sortable table headers

### Chart Components
- `Chart` - Recharts wrapper with themes

## Best Practices

### When to Use Hooks vs Components

**Use Hooks When:**
- Managing state or side effects
- Sharing logic between components
- Accessing browser APIs
- Managing complex interactions

**Use Components When:**
- Creating reusable UI elements
- Defining visual structures
- Composing layouts
- Building forms

### Performance Considerations

1. **Memoization**: Most hooks use `useCallback` and `useMemo` internally
2. **Lazy Loading**: Import only what you need
3. **State Colocation**: Keep state close to where it's used
4. **Pagination**: Use `useTable` or `usePagination` for large datasets

### Composition Patterns

**Hooks Composition:**
```tsx
function useTimesheetForm() {
  const { values, errors, handleChange } = useFormState(initialData)
  const { isOpen, open, close } = useDisclosure()
  const { copy } = useClipboard()
  
  return { values, errors, handleChange, isOpen, open, close, copy }
}
```

**Component Composition:**
```tsx
<PageHeader>
  <PageHeaderRow>
    <PageTitle>Title</PageTitle>
    <PageActions>
      <Button>Action</Button>
    </PageActions>
  </PageHeaderRow>
</PageHeader>
```

## Quick Reference

### Most Commonly Used Hooks
1. `useKV` - Data persistence (Spark SDK)
2. `useTable` - Table management
3. `useDisclosure` - Modal state
4. `useFormState` - Form handling
5. `useDebounce` - Search optimization

### Most Commonly Used Components
1. `Button` - Primary actions
2. `Card` - Content containers
3. `Dialog` - Modals and confirmations
4. `Input` / `Select` - Form fields
5. `Table` - Data display
6. `Badge` - Status indicators
7. `Skeleton` - Loading states

## Documentation

- **Hooks**: See `/src/hooks/README.md` for detailed examples
- **Components**: See `/src/components/ui/README.md` for usage guides
- **Types**: All hooks and components are fully typed with TypeScript

## Support

For questions or issues with the libraries, please refer to:
1. Individual hook/component files for implementation details
2. README files in respective directories
3. TypeScript type definitions for API contracts
