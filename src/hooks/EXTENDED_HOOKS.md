# Custom Hooks Library - Extended

This document describes the newly added custom hooks to the WorkForce Pro platform.

## Batch Operations

### `useBatchActions<T>`
Manage batch selection and operations on items with IDs.

```tsx
const { 
  selectedIds, 
  selectedCount, 
  toggleSelection, 
  selectAll, 
  clearSelection,
  isSelected,
  hasSelection 
} = useBatchActions<Invoice>()
```

**Use cases:**
- Bulk approve timesheets
- Batch invoice sending
- Multi-select delete operations

## Date Management

### `useDateRange(initialRange?)`
Handle date range selection with presets (today, this week, last month, etc.).

```tsx
const { 
  dateRange, 
  preset, 
  applyPreset, 
  setCustomRange 
} = useDateRange()

applyPreset('last30Days')
```

**Presets:** `today`, `yesterday`, `thisWeek`, `lastWeek`, `thisMonth`, `lastMonth`, `last7Days`, `last30Days`, `custom`

## Data Export

### `useExport()`
Export data to CSV or JSON formats.

```tsx
const { exportToCSV, exportToJSON } = useExport()

exportToCSV(invoices, 'invoices-2024')
exportToJSON(timesheets, 'timesheets-backup')
```

## Currency Formatting

### `useCurrency(currency, options)`
Format and parse currency values with internationalization support.

```tsx
const { format, parse, symbol, code } = useCurrency('GBP', {
  locale: 'en-GB',
  showSymbol: true
})

format(1250.50) // "£1,250.50"
```

## Permissions & Authorization

### `usePermissions(userRole)`
Check user permissions based on role.

```tsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions('manager')

if (hasPermission('invoices.send')) {
  // Show send button
}
```

**Roles:** `admin`, `manager`, `accountant`, `viewer`

## Data Grid Management

### `useDataGrid<T>(options)`
Advanced data grid with sorting, filtering, and pagination.

```tsx
const {
  data,
  totalRows,
  currentPage,
  setCurrentPage,
  sortConfig,
  handleSort,
  filters,
  handleFilter,
  clearFilters
} = useDataGrid({
  data: timesheets,
  columns: columnConfig,
  pageSize: 20
})
```

## Keyboard Shortcuts

### `useHotkeys(configs)`
Register keyboard shortcuts for actions.

```tsx
useHotkeys([
  { keys: 'ctrl+s', callback: handleSave, description: 'Save' },
  { keys: 'ctrl+k', callback: openSearch, description: 'Search' }
])
```

## Auto-Save

### `useAutoSave<T>(data, onSave, delay)`
Automatically save data after changes with debouncing.

```tsx
useAutoSave(formData, async (data) => {
  await saveToServer(data)
}, 2000)
```

## Multi-Select

### `useMultiSelect<T>(items)`
Advanced multi-selection with range support.

```tsx
const {
  selectedIds,
  toggle,
  selectRange,
  selectAll,
  deselectAll,
  getSelectedItems,
  isAllSelected
} = useMultiSelect(workers)
```

## Column Visibility

### `useColumnVisibility(initialColumns)`
Manage visible/hidden columns in tables.

```tsx
const {
  visibleColumns,
  toggleColumn,
  showAll,
  hideAll,
  reorderColumns,
  resizeColumn
} = useColumnVisibility(columns)
```

## Form Validation

### `useValidation<T>(initialValues)`
Form validation with rules and error tracking.

```tsx
const {
  values,
  errors,
  touched,
  setValue,
  validate,
  isValid
} = useValidation({ email: '', amount: 0 })

const rules = {
  email: [{ validate: (v) => v.includes('@'), message: 'Invalid email' }]
}
validate(rules)
```

## Best Practices

1. **Performance:** Use hooks with proper dependencies to avoid unnecessary re-renders
2. **Type Safety:** Always provide generic types for hooks that accept data
3. **Composition:** Combine multiple hooks for complex features
4. **Cleanup:** Hooks handle cleanup automatically, but be mindful of async operations

## Examples

### Bulk Invoice Processing
```tsx
function InvoiceList() {
  const { selectedIds, toggleSelection, selectAll } = useBatchActions<Invoice>()
  const { exportToCSV } = useExport()
  
  const handleBulkExport = () => {
    const selected = invoices.filter(inv => selectedIds.has(inv.id))
    exportToCSV(selected, 'bulk-invoices')
  }
  
  return (
    <div>
      <Button onClick={selectAll}>Select All</Button>
      <Button onClick={handleBulkExport}>Export Selected</Button>
      {/* ... */}
    </div>
  )
}
```

### Advanced Filtering
```tsx
function TimesheetTable() {
  const { dateRange, applyPreset } = useDateRange()
  const { data, handleFilter, handleSort } = useDataGrid({
    data: timesheets.filter(t => 
      new Date(t.weekEnding) >= dateRange.from &&
      new Date(t.weekEnding) <= dateRange.to
    ),
    columns,
    pageSize: 25
  })
  
  return (
    <div>
      <DateRangePicker onPreset={applyPreset} />
      <DataGrid data={data} onSort={handleSort} />
    </div>
  )
}
```
