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
