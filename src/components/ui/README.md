# UI Component Library

Extended collection of UI components for WorkForce Pro.

## New Components

### Display Components

#### EmptyState
Empty state placeholder with icon, title, description, and action button.

```tsx
<EmptyState
  icon={<FileX size={48} />}
  title="No timesheets found"
  description="Create your first timesheet to get started"
  action={<Button>Create Timesheet</Button>}
/>
```

#### StatusBadge
Status indicator with icon and label.

```tsx
<StatusBadge status="success" label="Approved" />
<StatusBadge status="pending" label="Pending" showIcon={false} />
```

#### StatCard
Metric display card with optional trend indicator.

```tsx
<StatCard
  label="Total Revenue"
  value="£45,250"
  icon={<CurrencyPound />}
  trend={{ value: 12.5, isPositive: true }}
/>
```

#### MetricCard
Flexible metric card with composable parts.

```tsx
<MetricCard>
  <MetricCardHeader>
    <MetricCardTitle>Active Workers</MetricCardTitle>
    <MetricCardIcon><Users /></MetricCardIcon>
  </MetricCardHeader>
  <MetricCardContent>
    <MetricCardValue>1,234</MetricCardValue>
    <MetricCardDescription>+12% from last month</MetricCardDescription>
    <MetricCardTrend trend="up">↑ 12%</MetricCardTrend>
  </MetricCardContent>
</MetricCard>
```

#### DataList
Key-value pair display list.

```tsx
<DataList
  items={[
    { label: 'Worker', value: 'John Smith' },
    { label: 'Client', value: 'Acme Corp' },
    { label: 'Hours', value: '40' }
  ]}
  orientation="horizontal"
/>
```

#### DataTable
Generic data table with custom column rendering.

```tsx
<DataTable
  columns={[
    { key: 'name', header: 'Name', sortable: true },
    { key: 'status', header: 'Status', render: (val) => <StatusBadge status={val} /> },
    { key: 'amount', header: 'Amount', width: '120px' }
  ]}
  data={timesheets}
  onRowClick={(row) => viewDetails(row)}
  emptyMessage="No data found"
/>
```

#### Timeline
Chronological event timeline with completion states.

```tsx
<Timeline
  items={[
    { id: '1', title: 'Submitted', timestamp: '2 hours ago', isComplete: true },
    { id: '2', title: 'Under Review', isActive: true },
    { id: '3', title: 'Approved' }
  ]}
/>
```

#### List
Composable list component for structured data.

```tsx
<List variant="bordered">
  <ListItem interactive onClick={handleClick}>
    <ListItemTitle>John Smith</ListItemTitle>
    <ListItemDescription>Software Engineer</ListItemDescription>
  </ListItem>
</List>
```

### Layout Components

#### PageHeader
Page header with title, description, and actions.

```tsx
<PageHeader>
  <PageHeaderRow>
    <div>
      <PageTitle>Timesheets</PageTitle>
      <PageDescription>Manage and approve worker timesheets</PageDescription>
    </div>
    <PageActions>
      <Button>Export</Button>
      <Button variant="primary">Create</Button>
    </PageActions>
  </PageHeaderRow>
</PageHeader>
```

#### Section
Content section with header.

```tsx
<Section>
  <SectionHeader>
    <SectionTitle>Recent Activity</SectionTitle>
    <SectionDescription>Your latest updates and changes</SectionDescription>
  </SectionHeader>
  <SectionContent>
    {/* content */}
  </SectionContent>
</Section>
```

#### Stack
Flexible container for arranging items with consistent spacing.

```tsx
<Stack direction="vertical" spacing="md" align="center">
  <Button>Item 1</Button>
  <Button>Item 2</Button>
  <Button>Item 3</Button>
</Stack>

<Stack direction="horizontal" spacing="sm" justify="between">
  <span>Left</span>
  <span>Right</span>
</Stack>
```

#### Grid
Responsive grid layout.

```tsx
<Grid cols={3} gap="lg">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</Grid>
```

### Input Components

#### SearchInput
Search input with clear button.

```tsx
<SearchInput
  placeholder="Search timesheets..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  onClear={() => setSearchQuery('')}
/>
```

#### FileUpload
Drag-and-drop file upload area.

```tsx
<FileUpload
  accept=".pdf,.doc,.docx"
  multiple
  maxSize={5 * 1024 * 1024}
  onFileSelect={(files) => handleFiles(files)}
/>
```

#### FilterBar
Container for filter controls.

```tsx
<FilterBar>
  <FilterGroup label="Status">
    <Select value={status} onValueChange={setStatus}>
      <option value="all">All</option>
      <option value="pending">Pending</option>
    </Select>
  </FilterGroup>
  <FilterGroup label="Date Range">
    <DatePicker />
  </FilterGroup>
</FilterBar>
```

#### Tag
Removable tag component with variants.

```tsx
<TagGroup>
  <Tag variant="primary" onRemove={() => removeTag('js')}>
    JavaScript
  </Tag>
  <Tag variant="success">Active</Tag>
  <Tag variant="warning">Pending</Tag>
</TagGroup>
```

### Navigation Components

#### Stepper
Multi-step progress indicator.

```tsx
<Stepper
  steps={[
    { id: '1', label: 'Details', description: 'Basic info' },
    { id: '2', label: 'Review' },
    { id: '3', label: 'Submit' }
  ]}
  currentStep={1}
  onStepClick={(step) => goToStep(step)}
/>
```

#### QuickPagination
Simple pagination controls.

```tsx
<QuickPagination
  currentPage={page}
  totalPages={10}
  onPageChange={setPage}
/>
```

### Modal Components

#### Modal
Flexible modal dialog with composable parts.

```tsx
<Modal isOpen={isOpen} onClose={close} size="lg">
  <ModalHeader onClose={close}>
    <ModalTitle>Edit Timesheet</ModalTitle>
  </ModalHeader>
  <ModalBody>
    {/* form content */}
  </ModalBody>
  <ModalFooter>
    <Button variant="ghost" onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={save}>Save</Button>
  </ModalFooter>
</Modal>
```

### Utility Components

#### LoadingSpinner
Animated loading spinner.

```tsx
<LoadingSpinner size="lg" />
```

#### LoadingOverlay
Full-screen loading overlay.

```tsx
<LoadingOverlay isLoading={loading} text="Processing...">
  <div>Your content</div>
</LoadingOverlay>
```

#### Chip
Removable tag/chip component.

```tsx
<Chip
  label="JavaScript"
  variant="primary"
  onRemove={() => removeTag('js')}
/>
```

#### CopyButton
Button to copy text to clipboard.

```tsx
<CopyButton text="INV-00123" />
```

#### CodeBlock
Syntax-highlighted code display.

```tsx
<CodeBlock
  code="const greeting = 'Hello World'"
  language="javascript"
/>
```

#### Divider
Horizontal or vertical divider with optional label.

```tsx
<Divider label="OR" />
<Divider orientation="vertical" />
```

#### InfoBox
Informational message box.

```tsx
<InfoBox
  variant="warning"
  title="Important Notice"
  dismissible
  onDismiss={() => setShowInfo(false)}
>
  Your compliance documents will expire soon.
</InfoBox>
```

#### Kbd
Keyboard shortcut display.

```tsx
<Kbd keys={['Ctrl', 'S']} />
```

#### SortableHeader
Table header with sort indicators.

```tsx
<SortableHeader
  label="Name"
  active={sortKey === 'name'}
  direction="asc"
  onClick={() => handleSort('name')}
/>
```

## Component Props

All components support standard HTML attributes and can be styled using Tailwind classes via the `className` prop.

## Accessibility

All components are built with accessibility in mind:
- Semantic HTML elements
- ARIA labels where appropriate
- Keyboard navigation support
- Focus management
