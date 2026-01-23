# UI Component Library - Extended

This document describes the newly added UI components to the WorkForce Pro platform.

## Data Display Components

### `DataGrid`
Enterprise-grade table component with full feature set.

```tsx
<DataGrid>
  <DataGridHeader>
    <DataGridRow>
      <DataGridHead sortable>Worker</DataGridHead>
      <DataGridHead>Hours</DataGridHead>
      <DataGridHead>Amount</DataGridHead>
    </DataGridRow>
  </DataGridHeader>
  <DataGridBody>
    {data.map(row => (
      <DataGridRow key={row.id} selected={isSelected(row.id)}>
        <DataGridCell>{row.worker}</DataGridCell>
        <DataGridCell>{row.hours}</DataGridCell>
        <DataGridCell>{format(row.amount)}</DataGridCell>
      </DataGridRow>
    ))}
  </DataGridBody>
</DataGrid>
```

### `KeyValuePair` & `KeyValueList`
Display label-value pairs in a consistent format.

```tsx
<KeyValueList
  items={[
    { label: 'Invoice Number', value: 'INV-12345' },
    { label: 'Amount', value: '£1,250.00' },
    { label: 'Due Date', value: '2024-02-15' }
  ]}
  vertical
/>
```

### `Stat`
Display key metrics with optional trend indicators.

```tsx
<Stat
  label="Monthly Revenue"
  value="£125,450"
  change={12.5}
  trend="up"
  icon={<TrendingUp />}
/>
```

### `StatsGrid`
Responsive grid layout for statistics.

```tsx
<StatsGrid columns={4}>
  <Stat label="Active Workers" value={245} />
  <Stat label="Pending Timesheets" value={12} />
  <Stat label="Outstanding Invoices" value={8} />
  <Stat label="This Month Revenue" value="£245k" />
</StatsGrid>
```

## Filter & Search Components

### `FilterChips`
Display active filters as removable chips.

```tsx
<FilterChips
  filters={[
    { id: 'status', label: 'Status', value: 'pending' },
    { id: 'client', label: 'Client', value: 'Acme Corp' }
  ]}
  onRemove={(id) => removeFilter(id)}
  onClearAll={clearAllFilters}
/>
```

### `DateRangePicker`
Select date ranges with preset options.

```tsx
<DateRangePicker
  from={startDate}
  to={endDate}
  onSelect={({ from, to }) => setDateRange(from, to)}
  presets={[
    { label: 'Last 7 days', value: () => getLast7Days() },
    { label: 'This month', value: () => getThisMonth() }
  ]}
/>
```

## Navigation & Layout Components

### `ActionBar`
Sticky bottom bar for bulk actions.

```tsx
<ActionBar>
  <span>{selectedCount} items selected</span>
  <div className="flex gap-2">
    <Button onClick={bulkApprove}>Approve All</Button>
    <Button variant="outline" onClick={clearSelection}>Clear</Button>
  </div>
</ActionBar>
```

### `Toolbar`
Horizontal toolbar for actions and controls.

```tsx
<Toolbar>
  <ToolbarSection>
    <Button size="sm">New</Button>
    <Button size="sm" variant="outline">Import</Button>
  </ToolbarSection>
  <ToolbarSeparator />
  <ToolbarSection>
    <IconButton icon={<Filter />} />
    <IconButton icon={<Download />} />
  </ToolbarSection>
</Toolbar>
```

### `SlidePanel`
Animated side panel for details or forms.

```tsx
<SlidePanel
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Invoice Details"
  position="right"
  width="500px"
>
  <InvoiceDetailsForm invoice={selectedInvoice} />
</SlidePanel>
```

## Feedback Components

### `InlineAlert`
In-context alerts with variants.

```tsx
<InlineAlert variant="warning" title="Attention Required">
  3 documents are expiring within 30 days
</InlineAlert>

<InlineAlert variant="success">
  All timesheets have been approved
</InlineAlert>
```

**Variants:** `info`, `success`, `warning`, `error`

### `ProgressBar`
Visual progress indicator with labels.

```tsx
<ProgressBar
  value={75}
  max={100}
  showLabel
  variant="success"
/>
```

## Control Components

### `PaginationControls`
Full pagination controls with first/last page navigation.

```tsx
<PaginationControls
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
  showFirstLast
/>
```

### `IconButton`
Icon-only button with variants.

```tsx
<IconButton
  icon={<Edit />}
  label="Edit timesheet"
  variant="ghost"
  size="md"
  onClick={handleEdit}
/>
```

### `CounterBadge`
Display counts with overflow handling.

```tsx
<CounterBadge count={notifications.length} max={99} variant="error" />
```

## Process Components

### `Stepper`
Visual stepper for multi-step processes.

```tsx
<Stepper
  steps={[
    { id: '1', label: 'Details', status: 'completed' },
    { id: '2', label: 'Review', status: 'current' },
    { id: '3', label: 'Confirm', status: 'pending' }
  ]}
  orientation="horizontal"
/>
```

## Component Composition Examples

### Advanced Table with All Features
```tsx
function AdvancedTimesheetTable() {
  const { selectedIds, toggleSelection } = useBatchActions()
  const { data, handleSort, handleFilter } = useDataGrid({ data: timesheets })
  const { exportToCSV } = useExport()

  return (
    <div className="space-y-4">
      <Toolbar>
        <ToolbarSection>
          <Button onClick={() => exportToCSV(data, 'timesheets')}>
            Export
          </Button>
        </ToolbarSection>
        <ToolbarSeparator />
        <ToolbarSection>
          <SearchInput onChange={handleFilter} />
        </ToolbarSection>
      </Toolbar>

      <FilterChips filters={activeFilters} onRemove={removeFilter} />

      <DataGrid>
        <DataGridHeader>
          <DataGridRow>
            <DataGridHead>
              <Checkbox
                checked={selectedIds.size === data.length}
                onCheckedChange={toggleAll}
              />
            </DataGridHead>
            <DataGridHead sortable onClick={() => handleSort('worker')}>
              Worker
            </DataGridHead>
            <DataGridHead sortable onClick={() => handleSort('amount')}>
              Amount
            </DataGridHead>
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody>
          {data.map(row => (
            <DataGridRow key={row.id} selected={selectedIds.has(row.id)}>
              <DataGridCell>
                <Checkbox
                  checked={selectedIds.has(row.id)}
                  onCheckedChange={() => toggleSelection(row.id)}
                />
              </DataGridCell>
              <DataGridCell>{row.workerName}</DataGridCell>
              <DataGridCell>{format(row.amount)}</DataGridCell>
            </DataGridRow>
          ))}
        </DataGridBody>
      </DataGrid>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {selectedIds.size > 0 && (
        <ActionBar>
          <span>{selectedIds.size} selected</span>
          <Button onClick={bulkApprove}>Approve Selected</Button>
        </ActionBar>
      )}
    </div>
  )
}
```

### Dashboard with Stats
```tsx
function Dashboard() {
  return (
    <div className="space-y-6">
      <StatsGrid columns={4}>
        <Stat
          label="Active Workers"
          value={245}
          change={5.2}
          trend="up"
          icon={<Users />}
        />
        <Stat
          label="Pending Timesheets"
          value={12}
          change={-15}
          trend="down"
          icon={<Clock />}
        />
        <Stat
          label="Monthly Revenue"
          value="£245,430"
          change={8.5}
          trend="up"
          icon={<CurrencyPound />}
        />
        <Stat
          label="Compliance Alerts"
          value={3}
          icon={<Warning />}
        />
      </StatsGrid>

      <InlineAlert variant="warning" title="Action Required">
        3 workers have documents expiring within 30 days
      </InlineAlert>
    </div>
  )
}
```

## Best Practices

1. **Consistency:** Use these components consistently across the app for a unified experience
2. **Accessibility:** All components include proper ARIA labels and keyboard navigation
3. **Responsive:** Components adapt to mobile and desktop layouts
4. **Composition:** Combine components to create complex interfaces
5. **Performance:** Components are optimized with React.memo and proper key usage

## Animation Guidelines

Components using `framer-motion` follow these principles:
- **Duration:** 200-500ms for most transitions
- **Easing:** Natural spring physics for panels and modals
- **Purpose:** Animations guide attention and provide feedback
- **Performance:** GPU-accelerated transforms only
