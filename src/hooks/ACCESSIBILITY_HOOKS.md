# Accessibility Hooks Documentation

This document provides detailed information about the accessibility hooks available in WorkForce Pro.

## Table of Contents

1. [useFocusTrap](#usefocustrap)
2. [useFocusReturn](#usefocusreturn)
3. [useAnnounce](#useannounce)
4. [useReducedMotion](#usereducedmotion)
5. [useAriaLive](#usearialive)
6. [useKeyboardShortcuts](#usekeyboardshortcuts)
7. [useSkipLink](#useskiplink)

---

## useFocusTrap

Traps keyboard focus within a container, useful for modals and dialogs.

### Usage

```typescript
import { useFocusTrap } from '@/hooks'

function MyDialog({ isOpen }) {
  const containerRef = useFocusTrap(isOpen)

  return (
    <div ref={containerRef}>
      {/* Dialog content */}
    </div>
  )
}
```

### Parameters

- `enabled: boolean` - Whether focus trap is active (default: `true`)

### Returns

- `containerRef: RefObject<HTMLElement>` - Ref to attach to the container element

### Description

When enabled, this hook:
- Prevents Tab from moving focus outside the container
- Wraps focus from last to first focusable element (and vice versa)
- Only affects elements that are naturally focusable

---

## useFocusReturn

Saves and restores focus when opening/closing modals or navigating views.

### Usage

```typescript
import { useFocusReturn } from '@/hooks'

function MyModal({ isOpen, onClose }) {
  const { saveFocus, restoreFocus } = useFocusReturn()

  useEffect(() => {
    if (isOpen) {
      saveFocus()
    }
  }, [isOpen])

  const handleClose = () => {
    restoreFocus()
    onClose()
  }

  return <Dialog onClose={handleClose}>...</Dialog>
}
```

### Returns

- `saveFocus: () => void` - Saves the currently focused element
- `restoreFocus: () => void` - Restores focus to the previously saved element

### Description

This hook helps maintain focus context when users interact with overlays, ensuring screen reader users don't lose their place.

---

## useAnnounce

Announces messages to screen readers without visual indication.

### Usage

```typescript
import { useAnnounce } from '@/hooks'

function MyComponent() {
  const announce = useAnnounce()

  const handleSave = () => {
    // Save logic...
    announce('Changes saved successfully')
  }

  const handleError = () => {
    // Error handling...
    announce('Error: Unable to save changes', 'assertive')
  }

  return <button onClick={handleSave}>Save</button>
}
```

### Parameters

- `message: string` - The text to announce
- `priority: 'polite' | 'assertive'` - Announcement priority (default: `'polite'`)

### Description

- `'polite'` - Waits for screen reader to finish current announcement
- `'assertive'` - Interrupts current announcement (use sparingly, for errors/alerts)

---

## useReducedMotion

Detects if user prefers reduced motion.

### Usage

```typescript
import { useReducedMotion } from '@/hooks'
import { motion } from 'framer-motion'

function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ opacity: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
    >
      Content
    </motion.div>
  )
}
```

### Returns

- `prefersReducedMotion: boolean` - True if user prefers reduced motion

### Description

Respects the user's OS-level motion preferences. Use this to:
- Disable or simplify animations
- Reduce transition durations
- Use instant state changes instead of animations

---

## useAriaLive

Creates and manages an ARIA live region for announcements.

### Usage

```typescript
import { useAriaLive } from '@/hooks'

function MyComponent() {
  const announce = useAriaLive()

  useEffect(() => {
    // Announce when data loads
    announce('Data loaded successfully')
  }, [data])

  return <div>...</div>
}
```

### Returns

- `announce: (message: string) => void` - Function to announce messages

### Description

Creates a persistent live region element that screen readers monitor. Messages are cleared after 1 second to prevent repetition.

---

## useKeyboardShortcuts

Register and manage keyboard shortcuts.

### Usage

```typescript
import { useKeyboardShortcuts } from '@/hooks'

function MyComponent() {
  const shortcuts = [
    {
      key: 's',
      ctrl: true,
      description: 'Save document',
      action: () => handleSave()
    },
    {
      key: 'k',
      ctrl: true,
      shift: true,
      description: 'Open command palette',
      action: () => setCommandPaletteOpen(true)
    }
  ]

  const { showHelp, setShowHelp } = useKeyboardShortcuts(shortcuts, true)

  return (
    <>
      {/* Your content */}
      {showHelp && <KeyboardShortcutsDialog shortcuts={shortcuts} />}
    </>
  )
}
```

### Parameters

- `shortcuts: KeyboardShortcut[]` - Array of shortcut configurations
- `enabled: boolean` - Whether shortcuts are active (default: `true`)

### KeyboardShortcut Interface

```typescript
type KeyboardShortcut = {
  key: string           // Key to trigger (e.g., 's', 'Enter', 'Escape')
  ctrl?: boolean        // Requires Ctrl/Cmd key
  shift?: boolean       // Requires Shift key
  alt?: boolean         // Requires Alt key
  meta?: boolean        // Requires Meta key
  description: string   // Human-readable description
  action: () => void    // Function to execute
}
```

### Returns

- `showHelp: boolean` - Whether help dialog should be shown
- `setShowHelp: (show: boolean) => void` - Control help dialog visibility
- `shortcuts: KeyboardShortcut[]` - The registered shortcuts

### Description

- Automatically handles Ctrl/Cmd distinction between platforms
- Press `Ctrl+?` or `Cmd+?` to toggle help dialog
- Prevents default browser behavior for registered shortcuts

---

## useSkipLink

Creates a "skip to content" link for keyboard navigation.

### Usage

```typescript
import { useSkipLink } from '@/hooks'
import { useRef } from 'react'

function App() {
  const mainContentRef = useRef<HTMLElement>(null)
  
  useSkipLink(mainContentRef, 'Skip to main content')

  return (
    <>
      <nav>...</nav>
      <main ref={mainContentRef} id="main-content">
        {/* Main content */}
      </main>
    </>
  )
}
```

### Parameters

- `targetRef: RefObject<HTMLElement>` - Ref to the main content element
- `linkText: string` - Text for the skip link (default: `'Skip to main content'`)

### Description

Creates an invisible link at the top of the page that becomes visible when focused. Allows keyboard users to skip repetitive navigation and jump directly to main content.

The skip link:
- Is visually hidden by default
- Becomes visible when focused via keyboard
- Positions itself at the top-left of the viewport
- Sets focus to the target element when activated

---

## Best Practices

### Focus Management

1. **Always trap focus in modals**
```typescript
const containerRef = useFocusTrap(isOpen)
```

2. **Return focus when closing overlays**
```typescript
const { saveFocus, restoreFocus } = useFocusReturn()
```

### Screen Reader Announcements

1. **Use polite announcements for success messages**
```typescript
announce('Invoice created successfully', 'polite')
```

2. **Use assertive announcements for errors**
```typescript
announce('Error: Failed to save changes', 'assertive')
```

3. **Don't over-announce** - Only announce important state changes

### Keyboard Navigation

1. **Provide keyboard shortcuts for common actions**
```typescript
{
  key: 's',
  ctrl: true,
  description: 'Save',
  action: handleSave
}
```

2. **Document shortcuts in help dialog**
3. **Don't override browser shortcuts** (Ctrl+T, Ctrl+W, etc.)

### Motion Preferences

1. **Always check for reduced motion preference**
```typescript
const prefersReducedMotion = useReducedMotion()
const duration = prefersReducedMotion ? 0 : 0.3
```

2. **Provide instant alternatives to animations**

### Skip Links

1. **Always include skip link on pages with navigation**
2. **Make sure target has correct ID**
3. **Place skip link as first element in DOM**

---

## Complete Example

```typescript
import { 
  useFocusTrap, 
  useFocusReturn, 
  useAnnounce,
  useKeyboardShortcuts,
  useReducedMotion 
} from '@/hooks'

function AccessibleModal({ isOpen, onClose, onSave }) {
  const containerRef = useFocusTrap(isOpen)
  const { saveFocus, restoreFocus } = useFocusReturn()
  const announce = useAnnounce()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (isOpen) {
      saveFocus()
    }
  }, [isOpen])

  const handleClose = () => {
    restoreFocus()
    onClose()
  }

  const handleSave = () => {
    onSave()
    announce('Changes saved successfully')
    handleClose()
  }

  useKeyboardShortcuts([
    {
      key: 's',
      ctrl: true,
      description: 'Save changes',
      action: handleSave
    },
    {
      key: 'Escape',
      description: 'Close modal',
      action: handleClose
    }
  ], isOpen)

  if (!isOpen) return null

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        transition: prefersReducedMotion ? 'none' : 'opacity 0.3s'
      }}
    >
      <h2 id="modal-title">Edit Item</h2>
      {/* Modal content */}
      <button onClick={handleSave}>Save</button>
      <button onClick={handleClose}>Cancel</button>
    </div>
  )
}
```
