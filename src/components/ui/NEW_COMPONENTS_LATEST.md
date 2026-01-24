# New UI Components - Latest Additions

This document lists all newly added UI components to the library.

## Security & Session Components

### `SessionExpiryDialog`
Modal dialog that warns users when their session is about to expire with a countdown timer.

```tsx
<SessionExpiryDialog
  open={isWarningShown}
  timeRemaining={300} // seconds
  totalWarningTime={300} // total warning period in seconds
  onExtend={() => extendSession()}
  onLogout={() => handleLogout()}
/>
```

**Props:**
- `open`: boolean - controls dialog visibility
- `timeRemaining`: number - seconds until auto-logout
- `totalWarningTime`: number - total warning period for progress bar
- `onExtend`: () => void - callback to extend session
- `onLogout`: () => void - callback for manual logout

**Features:**
- Live countdown timer with minutes:seconds format
- Visual progress bar showing time remaining
- Clear call-to-action buttons
- Accessible with ARIA live regions
- Auto-focuses "Stay Logged In" button

### `SessionManager`
Comprehensive session management interface showing active sessions and security settings.

```tsx
<SessionManager />
```

**Features:**
- List of all active sessions with timestamps
- Last activity tracking
- Manual session termination
- Bulk session management
- Security information panel
- Auto-logout configuration details

## Layout Components

### `Container`
Responsive container with max-width constraints.

```tsx
<Container maxWidth="xl" centered>
  <h1>Page Content</h1>
</Container>
```

**Props:**
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
- `centered`: boolean - auto-centers with margin

### `Box`
Polymorphic primitive component.

```tsx
<Box as="section" className="p-4">
  Content
</Box>

<Box asChild>
  <a href="/link">Renders as link</a>
</Box>
```

### `Flex`
Flexbox layout with prop-based styling.

```tsx
<Flex direction="row" align="center" justify="between" gap={4}>
  <div>Item 1</div>
  <div>Item 2</div>
</Flex>
```

**Props:**
- `direction`: 'row' | 'col' | 'row-reverse' | 'col-reverse'
- `align`: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
- `justify`: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
- `wrap`: 'wrap' | 'nowrap' | 'wrap-reverse'
- `gap`: 0-12

### `Center`
Center content horizontally and vertically.

```tsx
<Center className="h-screen">
  <Spinner />
</Center>
```

## Typography Components

### `Text`
Polymorphic text component.

```tsx
<Text as="span" size="lg" weight="semibold" muted>
  Muted text
</Text>

<Text truncate>
  This text will truncate with ellipsis...
</Text>
```

**Props:**
- `as`: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em' | 'small'
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold'
- `align`: 'left' | 'center' | 'right' | 'justify'
- `truncate`: boolean
- `muted`: boolean

### `Heading`
Semantic heading component.

```tsx
<Heading as="h1" size="3xl" gradient>
  Page Title
</Heading>
```

**Props:**
- `as`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
- `weight`: 'normal' | 'medium' | 'semibold' | 'bold'
- `gradient`: boolean - applies gradient text effect

## Feedback Components

### `Spinner`
Loading spinner with size and color variants.

```tsx
<Spinner size="lg" variant="primary" />
```

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'default' | 'primary' | 'accent'

### `Pulse`
Animated pulsing indicator.

```tsx
<Pulse color="success" size="md" />
```

**Props:**
- `color`: 'default' | 'primary' | 'accent' | 'success' | 'warning' | 'destructive'
- `size`: 'sm' | 'md' | 'lg'

## Interactive Components

### `Rating`
Star rating component.

```tsx
<Rating 
  value={4} 
  max={5} 
  size="md"
  onChange={(value) => setRating(value)}
/>

<Rating value={4.5} readonly />
```

**Props:**
- `value`: number - current rating
- `max`: number - maximum rating (default: 5)
- `readonly`: boolean - disable interaction
- `size`: 'sm' | 'md' | 'lg'
- `onChange`: (value: number) => void

### `Checklist`
Interactive checklist with items.

```tsx
<Checklist
  items={[
    { id: '1', label: 'Task 1', checked: true },
    { id: '2', label: 'Task 2', checked: false, description: 'Optional desc' }
  ]}
  onItemToggle={(id) => toggleItem(id)}
  variant="default"
/>
```

## Display Components

### `ImagePreview`
Image preview with optional remove button.

```tsx
<ImagePreview
  src="/path/to/image.jpg"
  alt="Preview"
  aspectRatio="square"
  onRemove={() => removeImage()}
/>
```

**Props:**
- `src`: string - image URL
- `alt`: string
- `aspectRatio`: 'square' | 'video' | 'auto'
- `onRemove`: () => void - optional remove handler

### `FeatureGrid`
Grid layout for displaying features.

```tsx
<FeatureGrid
  columns={3}
  features={[
    {
      icon: <Icon />,
      title: 'Feature Name',
      description: 'Feature description'
    }
  ]}
/>
```

**Props:**
- `columns`: 2 | 3 | 4
- `features`: Feature[] - array of feature objects

### `PricingCard`
Pricing plan card component.

```tsx
<PricingCard
  title="Pro Plan"
  price={29}
  period="month"
  description="For growing teams"
  features={['Feature 1', 'Feature 2', 'Feature 3']}
  highlighted
  cta={{
    label: 'Get Started',
    onClick: () => subscribe()
  }}
/>
```

### `AccordionFAQ`
FAQ-style accordion.

```tsx
<AccordionFAQ
  items={[
    { question: 'Question 1?', answer: 'Answer 1' },
    { question: 'Question 2?', answer: <CustomAnswer /> }
  ]}
  defaultOpenIndex={0}
  allowMultiple
/>
```

## Animation Components

### `BlurFade`
Animated blur fade-in effect.

```tsx
<BlurFade delay={0.2} inView>
  <Card>Content fades in when scrolled into view</Card>
</BlurFade>
```

**Props:**
- `delay`: number - animation delay in seconds
- `duration`: number - animation duration
- `inView`: boolean - trigger on scroll into view
- `blur`: string - blur amount (default: '10px')

## Accessibility Components

### `VisuallyHidden`
Hide content visually but keep it for screen readers.

```tsx
<VisuallyHidden>
  This text is hidden but accessible to screen readers
</VisuallyHidden>
```

## Usage Best Practices

1. **Use layout components** (`Container`, `Flex`, `Center`) for consistent spacing
2. **Use typography components** (`Text`, `Heading`) for semantic, styled text
3. **Combine primitives** to build complex layouts quickly
4. **Use `BlurFade`** sparingly for entrance animations
5. **Always provide `alt` text** for `ImagePreview`
6. **Use `VisuallyHidden`** for accessibility when hiding labels visually
