# Component & Hook Library

## Overview

WorkForce Pro now includes an extensive library of custom React hooks and UI components designed to streamline development and provide consistent user experiences across the platform.

## 📚 Custom Hooks Library

### Categories

#### 🔄 State Management (3 hooks)
- `useToggle` - Boolean state with toggle function
- `usePrevious` - Access previous state value
- `useLocalStorage` - Persist state in browser storage

#### ⏱️ Async & Timing (3 hooks)
- `useAsync` - Manage async operations with loading/error states
- `useDebounce` - Delay state updates for performance
- `useThrottle` - Limit function execution frequency

#### 🖥️ UI & Interaction (8 hooks)
- `useMediaQuery` - Responsive breakpoint detection
- `useIsMobile` - Mobile device detection
- `useWindowSize` - Window dimension tracking
- `useScrollPosition` - Scroll position monitoring
- `useOnClickOutside` - Outside click detection
- `useIntersectionObserver` - Element visibility detection
- `useKeyboardShortcut` - Global keyboard shortcuts
- `useIdleTimer` - User idle state detection

#### 📊 Data Management (4 hooks)
- `useFilter` - Array filtering with debouncing
- `useSort` - Array sorting with direction control
- `usePagination` - Dataset pagination
- `useSelection` - Multi-item selection management

#### 📝 Forms (2 hooks)
- `useFormValidation` - Form validation with error tracking
- `useWizard` - Multi-step form/wizard management

#### 🛠️ Utilities (2 hooks)
- `useCopyToClipboard` - Clipboard operations
- `useNotifications` - Application notifications

**Total: 22 Custom Hooks**

## 🎨 Extended UI Components

### New Components (17)

#### Display Components
1. **EmptyState** - Empty state placeholder with customizable content
2. **StatusBadge** - Status indicator with icon and label
3. **StatCard** - Metric display card with trend indicators
4. **DataList** - Key-value pair display
5. **Timeline** - Event timeline with completion tracking

#### Input Components
6. **SearchInput** - Search field with clear button
7. **FileUpload** - Drag-and-drop file upload area

#### Navigation Components
8. **Stepper** - Multi-step progress indicator

#### Feedback Components
9. **LoadingSpinner** - Animated loading indicator
10. **LoadingOverlay** - Full-screen loading state
11. **InfoBox** - Contextual information display

#### Utility Components
12. **Chip** - Removable tag component
13. **CopyButton** - Copy-to-clipboard button
14. **CodeBlock** - Code display with syntax highlighting
15. **Divider** - Section divider with optional label
16. **Kbd** - Keyboard shortcut display
17. **SortableHeader** - Sortable table header

### Existing shadcn Components (46)
- Accordion, Alert Dialog, Alert, Aspect Ratio, Avatar
- Badge, Breadcrumb, Button, Calendar, Card
- Carousel, Chart, Checkbox, Collapsible, Command
- Context Menu, Dialog, Drawer, Dropdown Menu, Form
- Hover Card, Input OTP, Input, Label, Menubar
- Navigation Menu, Pagination, Popover, Progress, Radio Group
- Resizable, Scroll Area, Select, Separator, Sheet
- Sidebar, Skeleton, Slider, Sonner, Switch
- Table, Tabs, Textarea, Toggle Group, Toggle, Tooltip

**Total: 63 UI Components**

## 🚀 Quick Start

### Using Hooks

```tsx
import { useDebounce, usePagination, useSelection } from '@/hooks'

function MyComponent() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  
  const { paginatedItems, nextPage, previousPage } = usePagination(items, 10)
  
  const { selectedIds, toggleSelection, selectAll } = useSelection(items)
  
  return (
    // Your component JSX
  )
}
```

### Using UI Components

```tsx
import { EmptyState, StatusBadge, SearchInput } from '@/components/ui'
import { FileX } from '@phosphor-icons/react'

function MyView() {
  return (
    <div>
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch('')}
      />
      
      <StatusBadge status="success" label="Active" />
      
      <EmptyState
        icon={<FileX size={48} />}
        title="No results found"
        description="Try adjusting your search"
      />
    </div>
  )
}
```

## 📖 Documentation

Detailed documentation available:
- `/src/hooks/README.md` - Complete hook documentation with examples
- `/src/components/ui/README.md` - UI component reference

## 🎯 Common Use Cases

### Data Tables
Combine `useFilter`, `useSort`, `usePagination`, and `useSelection` for full-featured data tables.

### Multi-Step Forms
Use `useWizard` with `Stepper` component for intuitive form flows.

### Search Functionality
Pair `useDebounce` with `SearchInput` for optimized search experiences.

### Loading States
Use `LoadingOverlay` or `LoadingSpinner` with `useAsync` for async operations.

### Status Display
Use `StatusBadge` consistently across the platform for status indicators.

### Empty States
Always show meaningful `EmptyState` components when data is not available.

## 🔧 Development Guidelines

1. **Consistency** - Use library components before creating custom ones
2. **Composition** - Combine hooks and components for complex functionality
3. **Performance** - Leverage `useDebounce` and `useThrottle` for expensive operations
4. **Accessibility** - All components include ARIA attributes and keyboard support
5. **Styling** - Extend components with Tailwind classes via `className` prop

## 📦 Import Paths

```tsx
// Hooks
import { hookName } from '@/hooks'

// UI Components
import { ComponentName } from '@/components/ui/component-name'

// Or use existing barrel exports
import { Button, Card, Dialog } from '@/components/ui'
```

## 🎨 Theming

All components respect the application theme defined in `/src/index.css`:
- Primary, secondary, accent colors
- Success, warning, error, info colors
- Border radius and spacing
- Typography scale

## 🔍 Finding Components

**Need a component?** Check these locations in order:
1. New extended components: `/src/components/ui/README.md`
2. shadcn components: `/src/components/ui/` directory
3. Custom hooks: `/src/hooks/README.md`

## 🤝 Contributing

When adding new hooks or components:
1. Follow existing patterns and conventions
2. Add TypeScript types for all props
3. Include forwardRef for DOM components
4. Support className for styling
5. Document usage in respective README
6. Export from index files
