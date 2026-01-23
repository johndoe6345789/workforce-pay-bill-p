# Extended Hooks and Components Library

This document lists all the newly added custom hooks and UI components for the WorkForce Pro platform.

## New Custom Hooks

### useBulkOperations
**Purpose**: Handle bulk operations on multiple items with progress tracking, error handling, and batch processing.

**Features**:
- Item selection with multi-select support
- Batch processing with configurable batch size
- Progress tracking
- Error handling and retry logic
- Range selection support

**Usage**:
```typescript
const { selectedItems, processBulk, progress, errors } = useBulkOperations()

// Process selected items in batches
await processBulk(async (id) => {
  await approveTimesheet(id)
}, { batchSize: 5, continueOnError: true })
```

---

### useOptimisticUpdate
**Purpose**: Apply optimistic UI updates with automatic rollback on failure.

**Features**:
- Immediate UI updates
- Automatic rollback on error
- Configurable timeout
- Track pending updates

**Usage**:
```typescript
const { executeOptimistic } = useOptimisticUpdate()

await executeOptimistic(
  'timesheet-123',
  currentData,
  updatedData,
  async () => await updateTimesheetAPI(updatedData)
)
```

---

### usePolling
**Purpose**: Poll an API endpoint at regular intervals with automatic retry and backoff.

**Features**:
- Configurable polling interval
- Automatic retry with exponential backoff
- Start/stop/refresh controls
- Error handling

**Usage**:
```typescript
const { data, start, stop, refresh } = usePolling(
  fetchMissingTimesheets,
  { interval: 30000, maxRetries: 3 }
)
```

---

### useVirtualScroll
**Purpose**: Efficiently render large lists using virtual scrolling.

**Features**:
- Only renders visible items
- Configurable overscan
- Scroll-to-index functionality
- Performance optimized for 1000+ items

**Usage**:
```typescript
const { containerRef, visibleItems, scrollToIndex } = useVirtualScroll(
  allTimesheets,
  { itemHeight: 60, containerHeight: 600 }
)
```

---

### useQueue
**Purpose**: Process tasks in a queue with concurrency control and retry logic.

**Features**:
- Configurable concurrency
- Priority queue support
- Automatic retry on failure
- Queue statistics

**Usage**:
```typescript
const { enqueue, stats } = useQueue(processInvoice, { 
  concurrency: 3,
  maxRetries: 2 
})

enqueue(invoiceData, priority)
```

---

### useDragAndDrop
**Purpose**: Add drag-and-drop functionality to components.

**Features**:
- Type-safe drag and drop
- Drop zone validation
- Custom drag preview
- Drag state tracking

**Usage**:
```typescript
const { getDragHandlers, getDropHandlers, isDragging } = useDragAndDrop()

<div {...getDragHandlers({ id: '1', data: item })}>Draggable</div>
<div {...getDropHandlers({ id: 'zone1' }, handleDrop)}>Drop Zone</div>
```

---

### useCache
**Purpose**: In-memory caching with TTL and size limits.

**Features**:
- Automatic expiration (TTL)
- LRU eviction when max size reached
- Hit rate tracking
- Import/export cache state

**Usage**:
```typescript
const { get, set, getOrSet, hitRate } = useCache({ 
  ttl: 300000,
  maxSize: 100 
})

const data = await getOrSet('workers', fetchWorkers)
```

---

### useWebSocket
**Purpose**: WebSocket connection with automatic reconnection and heartbeat.

**Features**:
- Automatic reconnection
- Configurable heartbeat
- Connection state tracking
- JSON message support

**Usage**:
```typescript
const { sendJson, isOpen, lastMessage } = useWebSocket(
  'wss://api.example.com/ws',
  { reconnectAttempts: 5, heartbeatInterval: 30000 }
)
```

---

## New UI Components

### MultiSelect
**Purpose**: Multi-selection dropdown with search and tag display.

**Features**:
- Searchable options
- Tag display with remove
- Maximum selection limit
- Clear all functionality

**Usage**:
```tsx
<MultiSelect
  options={workers}
  value={selectedWorkers}
  onChange={setSelectedWorkers}
  maxSelections={5}
  searchable
/>
```

---

### Timeline (Enhanced)
**Purpose**: Display chronological events with status indicators.

**Features**:
- Vertical and horizontal orientation
- Status indicators (completed, current, upcoming, error)
- Metadata display
- Custom icons
- Clickable items

**Usage**:
```tsx
<Timeline
  items={auditLogItems}
  orientation="vertical"
  onItemClick={(item) => console.log(item)}
/>
```

---

### ValidationIndicator & Banner
**Purpose**: Display validation rules and contextual banners.

**Features**:
- Real-time validation feedback
- Rule-based validation display
- Contextual banners (info, success, warning, error)
- Dismissible banners

**Usage**:
```tsx
<ValidationIndicator
  rules={passwordRules}
  value={password}
  showOnlyFailed
/>

<Banner variant="warning" dismissible>
  Your compliance document expires in 3 days
</Banner>
```

---

### Stepper (Enhanced)
**Purpose**: Step-by-step navigation with multiple variants.

**Features**:
- Horizontal and vertical orientation
- Multiple variants (default, compact, dots)
- Optional steps
- Click navigation
- Step status tracking

**Usage**:
```tsx
<Stepper
  steps={onboardingSteps}
  currentStep={currentIndex}
  onStepClick={goToStep}
  variant="default"
  allowSkip
/>

<StepperNav
  currentStep={step}
  totalSteps={5}
  onNext={handleNext}
  onComplete={handleComplete}
/>
```

---

### ComboBox
**Purpose**: Searchable dropdown with grouping and descriptions.

**Features**:
- Searchable options
- Group support
- Option descriptions
- Empty state handling

**Usage**:
```tsx
<ComboBox
  options={clientOptions}
  value={selectedClient}
  onChange={setSelectedClient}
  showGroups
  searchPlaceholder="Search clients..."
/>
```

---

### TreeView
**Purpose**: Hierarchical data display with expand/collapse.

**Features**:
- Nested data support
- Expand/collapse nodes
- Custom icons
- Selection support
- Disabled nodes
- Connection lines

**Usage**:
```tsx
<TreeView
  data={organizationStructure}
  selectedId={selectedNode}
  onSelect={handleSelect}
  expandedByDefault
  showLines
/>
```

---

### DataPill & DataGroup
**Purpose**: Display tags and grouped data elements.

**Features**:
- Multiple variants (default, primary, success, warning, error, info)
- Removable pills
- Size variants (sm, md, lg)
- Optional icons
- Collapsible groups

**Usage**:
```tsx
<DataGroup label="Skills" collapsible>
  <DataPill variant="primary" removable onRemove={removeSkill}>
    JavaScript
  </DataPill>
  <DataPill variant="success">React</DataPill>
</DataGroup>
```

---

### AdvancedTable
**Purpose**: Feature-rich table with sorting, styling options, and loading states.

**Features**:
- Column sorting
- Custom cell rendering
- Sticky headers and columns
- Row selection
- Loading states
- Empty states
- Striped and bordered variants

**Usage**:
```tsx
<AdvancedTable
  data={timesheets}
  columns={columns}
  keyExtractor={(row) => row.id}
  onRowClick={handleRowClick}
  hoverable
  striped
  stickyHeader
/>
```

---

## Integration Notes

All hooks are exported from `@/hooks` and all components are available in `@/components/ui`.

These additions significantly expand the platform's capabilities for:
- **Bulk operations** - Approve/reject multiple timesheets, invoices
- **Real-time updates** - WebSocket connections, polling for new data
- **Performance** - Virtual scrolling for large datasets, caching
- **User experience** - Drag-and-drop, multi-select, advanced steppers
- **Data display** - Tree views, timelines, advanced tables

All components follow the existing design system and are fully typed with TypeScript.
