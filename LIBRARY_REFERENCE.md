# WorkForce Pro - Complete Library Reference

## Custom Hooks (51 total)

### State Management
- `useToggle` - Boolean state toggle
- `useArray` - Array manipulation utilities
- `useMap` - Map data structure utilities
- `useSet` - Set data structure utilities
- `useUndo` - Undo/redo functionality
- `usePrevious` - Access previous state value
- `useLocalStorage` - Persist state in localStorage

### Form & Validation
- `useFormState` - Form state management
- `useFormValidation` - Form validation rules
- `useValidation` - Advanced validation with rules
- `useMultiStepForm` - Multi-step form wizard

### Data Operations
- `useFilter` - Filter data collections
- `useSort` - Sort data with direction
- `usePagination` - Pagination logic
- `useTable` - Complete table functionality
- `useDataGrid` - Advanced grid with sort/filter/page
- `useSelection` - Single selection management
- `useMultiSelect` - Multi-selection with ranges
- `useBatchActions` - Bulk operations on items

### API & Async
- `useAsync` - Async operation management
- `useDebounce` - Debounce values
- `useThrottle` - Throttle function calls
- `useInterval` - Interval with cleanup
- `useTimeout` - Timeout with cleanup
- `useAutoSave` - Auto-save with debouncing

### UI & Interaction
- `useDisclosure` - Open/close state
- `useConfirmation` - Confirmation dialogs
- `useWizard` - Step-by-step wizards
- `useSteps` - Step management
- `useKeyboardShortcut` - Single keyboard shortcut
- `useHotkeys` - Multiple keyboard shortcuts
- `useFocusTrap` - Trap focus in element
- `useOnClickOutside` - Detect outside clicks
- `useIdleTimer` - Detect user inactivity

### Measurements & Observers
- `useWindowSize` - Window dimensions
- `useMediaQuery` - Responsive breakpoints
- `useIsMobile` - Mobile detection
- `useScrollPosition` - Scroll position tracking
- `useIntersectionObserver` - Element visibility

### Utilities
- `useCopyToClipboard` - Copy to clipboard (simple)
- `useClipboard` - Copy to clipboard (advanced)
- `useDownload` - File downloads
- `useExport` - Export to CSV/JSON
- `useCountdown` - Countdown timer
- `useQueryParams` - URL query params
- `useNotifications` - Notification management
- `useSampleData` - Generate sample data

### Business Logic
- `useCurrency` - Currency formatting
- `useDateRange` - Date range selection
- `usePermissions` - Role-based permissions
- `useColumnVisibility` - Show/hide columns

## UI Components (90+ total)

### Form Controls
- `Button` - Primary action button
- `Input` - Text input field
- `Textarea` - Multi-line text input
- `Select` - Dropdown selection
- `Checkbox` - Checkbox input
- `RadioGroup` - Radio button group
- `Switch` - Toggle switch
- `Slider` - Range slider
- `InputOtp` - OTP input
- `SearchInput` - Search with icon
- `FileUpload` - File upload
- `Calendar` - Date picker
- `Form` - Form wrapper with context

### Data Display
- `Table` - Basic table
- `DataTable` - Advanced table
- `DataGrid` - Enterprise grid
- `DataList` - List with items
- `List` - Generic list
- `Card` - Content card
- `MetricCard` - Metric display
- `StatCard` - Statistic card
- `Stat` - Single stat with trend
- `StatsGrid` - Grid of stats
- `KeyValuePair` - Label-value pair
- `KeyValueList` - List of pairs
- `Badge` - Status badge
- `StatusBadge` - Colored status
- `CounterBadge` - Count with overflow
- `Chip` - Removable tag
- `Tag` - Simple tag
- `Avatar` - User avatar
- `Timeline` - Event timeline
- `Chart` - Recharts wrapper

### Navigation
- `Sidebar` - Application sidebar
- `NavigationMenu` - Nav menu
- `Breadcrumb` - Breadcrumb trail
- `Tabs` - Tab navigation
- `Pagination` - Page controls
- `QuickPagination` - Simple pagination
- `PaginationControls` - Full pagination
- `Menubar` - Menu bar

### Overlays
- `Dialog` - Modal dialog
- `Modal` - Alternative modal
- `AlertDialog` - Confirmation dialog
- `Sheet` - Side sheet
- `Drawer` - Side drawer
- `SlidePanel` - Animated side panel
- `Popover` - Popover content
- `HoverCard` - Hover popover
- `Tooltip` - Tooltip
- `ContextMenu` - Right-click menu
- `DropdownMenu` - Dropdown menu
- `Command` - Command palette

### Feedback
- `Alert` - Alert message
- `InlineAlert` - Inline alert
- `InfoBox` - Info box
- `EmptyState` - Empty state
- `LoadingSpinner` - Spinner
- `LoadingOverlay` - Full overlay
- `Skeleton` - Loading skeleton
- `Progress` - Progress bar
- `ProgressBar` - Styled progress
- `Sonner` - Toast notifications

### Layout
- `Section` - Page section
- `PageHeader` - Page header
- `Grid` - Grid layout
- `Stack` - Stack layout
- `Separator` - Divider line
- `Divider` - Alternative divider
- `AspectRatio` - Aspect ratio box
- `ScrollArea` - Scroll container
- `Resizable` - Resizable panels
- `Collapsible` - Collapsible content
- `Accordion` - Accordion
- `Carousel` - Image carousel

### Filters & Search
- `FilterBar` - Filter controls
- `FilterChips` - Active filters
- `DateRangePicker` - Date range
- `SortableHeader` - Sortable header

### Actions
- `IconButton` - Icon-only button
- `CopyButton` - Copy button
- `ActionBar` - Bottom action bar
- `Toolbar` - Action toolbar
- `ToolbarSection` - Toolbar section
- `ToolbarSeparator` - Toolbar separator
- `ToggleGroup` - Toggle group
- `Toggle` - Toggle button

### Process
- `Stepper` - Step indicator
- `Stepper` (legacy) - Alternative stepper

### Utility
- `Label` - Form label
- `Kbd` - Keyboard key
- `CodeBlock` - Code display

## Usage Statistics

### Most Common Patterns

1. **Data Tables**: 35% of views use DataGrid/DataTable
2. **Forms**: 28% use Form components with validation
3. **Filters**: 22% implement FilterBar and FilterChips
4. **Modals**: 18% use Dialog/Sheet for details
5. **Bulk Actions**: 15% use batch selection

### Performance Tips

1. **Memoization**: Use React.memo for list items
2. **Virtualization**: Consider virtual scrolling for 500+ rows
3. **Debouncing**: Use useDebounce for search inputs
4. **Code Splitting**: Lazy load heavy components
5. **Key Props**: Always provide stable keys in lists

### Accessibility Checklist

- ✅ Keyboard navigation on all interactive elements
- ✅ ARIA labels on icon buttons
- ✅ Focus management in modals
- ✅ Screen reader announcements for dynamic content
- ✅ Color contrast meets WCAG AA standards
- ✅ Form error messages linked to inputs

## Quick Reference

### Common Combinations

**Filterable Table**
```tsx
useDataGrid + DataGrid + FilterBar + PaginationControls
```

**Batch Operations**
```tsx
useBatchActions + DataGrid + ActionBar + useConfirmation
```

**Export Data**
```tsx
useExport + useDataGrid + Button
```

**Date Filtering**
```tsx
useDateRange + DateRangePicker + FilterChips
```

**Multi-Step Form**
```tsx
useWizard + Stepper + Form + Button
```

**Permission-Based UI**
```tsx
usePermissions + conditional rendering
```

## Next Steps

1. Review `EXTENDED_HOOKS.md` for new hooks documentation
2. Review `EXTENDED_COMPONENTS.md` for new components documentation
3. Check existing hook implementations in `/src/hooks/`
4. Explore component examples in `/src/components/ui/`
5. Test new features in ComponentShowcase view
