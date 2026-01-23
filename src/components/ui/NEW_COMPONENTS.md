# New UI Components

This document describes the newly added UI components for WorkForce Pro platform.

## Display Components

### `<Timeline />`
Vertical timeline for displaying chronological events.

```tsx
import { Timeline, TimelineItemProps } from '@/components/ui/timeline-vertical'

const items: TimelineItemProps[] = [
  {
    date: '2024-01-15',
    title: 'Timesheet Submitted',
    description: 'Worker submitted timesheet for week ending 14 Jan',
    status: 'completed',
    icon: <CheckCircle />
  },
  {
    date: '2024-01-16',
    title: 'Manager Approval',
    description: 'Awaiting manager approval',
    status: 'current'
  },
  {
    date: '2024-01-17',
    title: 'Invoice Generation',
    description: 'Invoice will be generated after approval',
    status: 'upcoming'
  }
]

<Timeline items={items} />
```

### `<DescriptionList />`
Display key-value pairs in various layouts.

```tsx
import { DescriptionList, DataValue } from '@/components/ui/description-list'

const items: DataValue[] = [
  { label: 'Worker Name', value: 'John Smith' },
  { label: 'Total Hours', value: '40.0', badge: <Badge>Full Time</Badge> },
  { label: 'Rate', value: '£25.00/hr' },
  { label: 'Total Amount', value: '£1,000.00' }
]

<DescriptionList items={items} layout="horizontal" />
<DescriptionList items={items} layout="grid" columns={2} />
```

### `<StatusIndicator />`
Visual status indicators with optional pulse animation.

```tsx
import { StatusIndicator } from '@/components/ui/status-indicator'

<StatusIndicator status="success" label="Active" />
<StatusIndicator status="pending" label="Awaiting Approval" pulse />
<StatusIndicator status="error" label="Expired" size="lg" />
```

**Status types:** `success`, `warning`, `error`, `info`, `default`, `pending`, `approved`, `rejected`

### `<ActivityLog />`
Display chronological activity feed with user actions.

```tsx
import { ActivityLog, ActivityLogEntry } from '@/components/ui/activity-log'

const entries: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: '2 hours ago',
    user: { name: 'John Smith', avatar: '/avatars/john.jpg' },
    action: 'updated',
    description: 'Changed timesheet hours from 40 to 45',
    icon: <Pencil />,
    metadata: {
      'Previous Hours': '40',
      'New Hours': '45',
      'Reason': 'Client requested adjustment'
    }
  }
]

<ActivityLog entries={entries} />
```

### `<NotificationList />`
Styled notification list with actions and dismissal.

```tsx
import { NotificationList, NotificationItem } from '@/components/ui/notification-list'

const notifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Timesheet Approved',
    message: 'Your timesheet for week ending 14 Jan has been approved',
    type: 'success',
    timestamp: '5 minutes ago',
    read: false,
    action: {
      label: 'View Details',
      onClick: () => navigate('/timesheets/123')
    }
  }
]

<NotificationList 
  notifications={notifications}
  onDismiss={(id) => removeNotification(id)}
  onNotificationClick={(notification) => markAsRead(notification.id)}
/>
```

## Navigation & Flow Components

### `<Wizard />`
Multi-step wizard with validation and progress tracking.

```tsx
import { Wizard, WizardStep } from '@/components/ui/wizard'

const steps: WizardStep[] = [
  {
    id: 'details',
    title: 'Basic Details',
    description: 'Worker and client information',
    content: <WorkerDetailsForm />,
    validate: async () => {
      // Return true if valid, false otherwise
      return form.workerName && form.clientName
    }
  },
  {
    id: 'hours',
    title: 'Hours',
    description: 'Enter working hours',
    content: <HoursForm />
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review and submit',
    content: <ReviewStep />
  }
]

<Wizard 
  steps={steps}
  onComplete={(data) => submitTimesheet(data)}
  onCancel={() => navigate('/timesheets')}
  showStepIndicator
/>
```

### `<Stepper />`
Progress stepper for showing current position in a flow.

```tsx
import { Stepper, Step } from '@/components/ui/stepper-simple'

const steps: Step[] = [
  { label: 'Submit', description: 'Worker submission', status: 'completed' },
  { label: 'Approve', description: 'Manager approval', status: 'current' },
  { label: 'Invoice', description: 'Generate invoice', status: 'upcoming' }
]

<Stepper steps={steps} orientation="horizontal" currentStep={1} />
<Stepper steps={steps} orientation="vertical" />
```

## Data Display Components

### `<SimpleTable />`
Lightweight table with custom rendering.

```tsx
import { SimpleTable, DataTableColumn } from '@/components/ui/simple-table'

const columns: DataTableColumn<Timesheet>[] = [
  { key: 'workerName', label: 'Worker', width: '200px' },
  { key: 'hours', label: 'Hours', align: 'right' },
  { 
    key: 'amount', 
    label: 'Amount', 
    align: 'right',
    render: (value) => formatCurrency(value)
  },
  {
    key: 'status',
    label: 'Status',
    render: (value) => <Badge>{value}</Badge>
  }
]

<SimpleTable 
  data={timesheets}
  columns={columns}
  onRowClick={(row) => navigate(`/timesheets/${row.id}`)}
  striped
  hoverable
/>
```

## Input & Action Components

### `<PaginationButtons />`
Full-featured pagination with page numbers.

```tsx
import { PaginationButtons } from '@/components/ui/pagination-buttons'

<PaginationButtons
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  showFirstLast
  maxButtons={7}
/>
```

### `<ExportButton />`
Multi-format export button with dropdown.

```tsx
import { ExportButton } from '@/components/ui/export-button'

<ExportButton
  onExport={(format) => {
    if (format === 'csv') exportToCSV(data)
    if (format === 'json') exportToJSON(data)
  }}
  formats={['csv', 'json', 'xlsx']}
  variant="outline"
/>

// Single format (no dropdown)
<ExportButton
  onExport={(format) => exportToCSV(data)}
  formats={['csv']}
/>
```

### `<FilterChipsBar />`
Display active filters as removable chips.

```tsx
import { FilterChipsBar, FilterChip } from '@/components/ui/filter-chips-bar'

const filters: FilterChip[] = [
  { id: '1', label: 'Pending', value: 'pending', field: 'Status' },
  { id: '2', label: 'This Week', value: 'week', field: 'Date Range' },
  { id: '3', label: 'John Smith', value: 'john', field: 'Worker' }
]

<FilterChipsBar
  filters={filters}
  onRemove={(id) => removeFilter(id)}
  onClearAll={() => clearAllFilters()}
  showClearAll
/>
```

### `<QuickSearch />`
Debounced search input with icon.

```tsx
import { QuickSearch } from '@/components/ui/quick-search'

<QuickSearch
  onSearch={(value) => setSearchQuery(value)}
  debounceMs={300}
  placeholder="Search timesheets..."
/>
```

## Complete Examples

### Timesheet List with Filters and Export
```tsx
import { SimpleTable, FilterChipsBar, ExportButton, QuickSearch } from '@/components/ui'
import { useFilterableData, useSortableData, useDataExport } from '@/hooks'

function TimesheetList() {
  const { filteredData, filters, addFilter, removeFilter, clearFilters } = useFilterableData(timesheets)
  const { sortedData, requestSort } = useSortableData(filteredData)
  const { exportToCSV } = useDataExport()
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <QuickSearch onSearch={(q) => addFilter({ 
          field: 'workerName', 
          operator: 'contains', 
          value: q 
        })} />
        <ExportButton 
          onExport={(format) => exportToCSV(sortedData, { filename: 'timesheets' })}
          formats={['csv', 'json']}
        />
      </div>
      
      <FilterChipsBar 
        filters={filters}
        onRemove={removeFilter}
        onClearAll={clearFilters}
      />
      
      <SimpleTable 
        data={sortedData}
        columns={columns}
        onRowClick={(row) => openDetails(row)}
      />
    </div>
  )
}
```

### Multi-Step Approval Workflow
```tsx
import { Wizard, Stepper, ActivityLog } from '@/components/ui'
import { useApprovalWorkflow, useAuditLog } from '@/hooks'

function ApprovalWorkflowView() {
  const { workflows, approveStep } = useApprovalWorkflow()
  const { auditLog, getLogsByEntity } = useAuditLog()
  
  const workflow = workflows[0]
  const logs = getLogsByEntity('workflow', workflow.id)
  
  return (
    <div className="space-y-6">
      <Stepper 
        steps={workflow.steps.map(s => ({
          label: s.approverRole,
          status: s.status
        }))}
        currentStep={workflow.currentStepIndex}
      />
      
      <ActivityLog entries={logs} />
      
      <Button onClick={() => approveStep(workflow.id, currentStepId)}>
        Approve
      </Button>
    </div>
  )
}
```

### Status Dashboard with Timeline
```tsx
import { Timeline, StatusIndicator, DescriptionList } from '@/components/ui'

function TimesheetStatus({ timesheet }) {
  const timeline = [
    {
      date: timesheet.submittedDate,
      title: 'Submitted',
      status: 'completed',
      description: `Submitted by ${timesheet.workerName}`
    },
    {
      date: timesheet.approvedDate,
      title: 'Approved',
      status: timesheet.status === 'approved' ? 'completed' : 'current',
      description: 'Awaiting manager approval'
    }
  ]
  
  const details = [
    { label: 'Status', value: <StatusIndicator status={timesheet.status} label={timesheet.status} /> },
    { label: 'Hours', value: timesheet.hours },
    { label: 'Amount', value: formatCurrency(timesheet.amount) }
  ]
  
  return (
    <div className="grid grid-cols-2 gap-6">
      <DescriptionList items={details} layout="vertical" />
      <Timeline items={timeline} />
    </div>
  )
}
```
