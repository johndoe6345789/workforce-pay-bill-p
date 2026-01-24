# ♿ Accessibility in WorkForce Pro

WorkForce Pro is built with accessibility as a core principle, ensuring WCAG 2.1 AA compliance and providing an inclusive experience for all users.

## 🎯 Accessibility Features

### Keyboard Navigation
- ✅ Full keyboard support throughout the application
- ✅ Logical tab order following visual layout
- ✅ Visible focus indicators with high contrast (3:1 minimum)
- ✅ No keyboard traps - users can always escape with Tab or Escape
- ✅ Skip links to bypass repetitive navigation

### Screen Reader Support
- ✅ Comprehensive ARIA labels on all interactive elements
- ✅ ARIA live regions for dynamic content updates
- ✅ Semantic HTML with proper landmark roles (nav, main, aside)
- ✅ Descriptive button and link text
- ✅ Form field labels and error associations
- ✅ Status announcements for user actions

### Keyboard Shortcuts
Press `Ctrl+?` (or `Cmd+?` on Mac) to view all available shortcuts.

**Global Shortcuts:**
- `Ctrl+K` - Open quick search
- `Alt+1` - Go to Dashboard
- `Alt+2` - Go to Timesheets
- `Alt+3` - Go to Billing
- `Alt+4` - Go to Payroll
- `Alt+5` - Go to Compliance
- `Alt+N` - Open notifications
- `Escape` - Close dialogs/modals

**Navigation:**
- `Tab` - Move focus forward
- `Shift+Tab` - Move focus backward
- `Enter` - Activate button or link
- `Space` - Toggle checkbox or select

**Tables:**
- `Arrow Keys` - Navigate table cells
- `Enter` - Open row details
- `Ctrl+A` - Select all rows

### Focus Management
- ✅ Automatic focus trapping in modals and dialogs
- ✅ Focus restoration when closing overlays
- ✅ Auto-focus on modal open
- ✅ Focus visible utility classes throughout

### Color & Contrast
- ✅ All text meets WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text)
- ✅ UI components meet 3:1 contrast ratio
- ✅ Color is never the only indicator (icons and patterns supplement)
- ✅ High contrast mode support

### Motion & Animation
- ✅ Respects `prefers-reduced-motion` user preference
- ✅ Animations disabled or simplified when requested
- ✅ Instant state changes available as alternative

### Semantic Structure
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Semantic HTML5 elements (header, nav, main, aside, footer, section)
- ✅ Button elements for actions, anchor tags for navigation
- ✅ Lists use proper list markup

## 📚 Documentation

- **[ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md)** - Complete audit results and compliance status
- **[ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md)** - Testing procedures and checklists
- **[src/hooks/ACCESSIBILITY_HOOKS.md](./src/hooks/ACCESSIBILITY_HOOKS.md)** - Hook documentation and usage

## 🔧 Accessibility Hooks

We provide several React hooks to make building accessible components easier:

### useFocusTrap
Traps keyboard focus within a container (for modals/dialogs).

```typescript
const containerRef = useFocusTrap(isOpen)
```

### useFocusReturn
Saves and restores focus when opening/closing overlays.

```typescript
const { saveFocus, restoreFocus } = useFocusReturn()
```

### useAnnounce
Announces messages to screen readers.

```typescript
const announce = useAnnounce()
announce('Changes saved successfully')
```

### useReducedMotion
Detects if user prefers reduced motion.

```typescript
const prefersReducedMotion = useReducedMotion()
```

### useKeyboardShortcuts
Registers keyboard shortcuts with help dialog.

```typescript
useKeyboardShortcuts([
  { key: 's', ctrl: true, description: 'Save', action: handleSave }
])
```

### useSkipLink
Creates skip-to-content link for keyboard users.

```typescript
useSkipLink(mainContentRef, 'Skip to main content')
```

## 🧪 Testing

### Automated Testing
```bash
# Run accessibility tests
npm run test:a11y
```

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through entire interface
- [ ] All interactive elements are focusable
- [ ] Focus order is logical
- [ ] Focus indicators are visible
- [ ] No keyboard traps
- [ ] Skip link appears on first Tab

#### Screen Reader
- [ ] Navigate with screen reader (NVDA/JAWS/VoiceOver)
- [ ] All content is announced
- [ ] Interactive elements have clear labels
- [ ] Dynamic updates are announced
- [ ] Form errors are communicated

#### Visual
- [ ] Check color contrast with tools
- [ ] Test at 200% zoom
- [ ] Verify focus indicators visible
- [ ] Test with high contrast mode

## 🎨 Accessibility Utilities

### CSS Classes

```css
.sr-only              /* Screen reader only - visually hidden */
.focus-visible-only   /* Only visible when focused */
```

### ARIA Utilities

```typescript
import { 
  announceToScreenReader,
  createAriaLiveRegion,
  trapFocus,
  getFocusableElements 
} from '@/lib/accessibility'
```

## 🏆 Compliance Status

### WCAG 2.1 Level A
✅ **100% Compliant**

### WCAG 2.1 Level AA
✅ **100% Compliant**

### Section 508
✅ **Compliant**

## 🤝 Contributing Accessible Code

When adding new features:

1. **Use semantic HTML** - Button for actions, links for navigation
2. **Add ARIA labels** - Especially for icon buttons
3. **Test keyboard navigation** - Ensure your component is fully keyboard accessible
4. **Check color contrast** - Use tools to verify ratios
5. **Test with screen reader** - At least quick test with NVDA/VoiceOver
6. **Use accessibility hooks** - Leverage our provided hooks for common patterns
7. **Document shortcuts** - Add new shortcuts to KeyboardShortcutsDialog

### Example: Accessible Button

```typescript
<Button 
  onClick={handleSave}
  aria-label="Save invoice"
  disabled={isSaving}
>
  <FloppyDisk aria-hidden="true" />
  Save
</Button>
```

### Example: Accessible Form Field

```typescript
<div>
  <Label htmlFor="email">Email Address</Label>
  <Input
    id="email"
    type="email"
    required
    aria-required="true"
    aria-describedby={error ? "email-error" : undefined}
  />
  {error && (
    <span id="email-error" role="alert">
      {error}
    </span>
  )}
</div>
```

## 📖 Resources

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension for accessibility testing
- [WAVE](https://wave.webaim.org/extension/) - Web accessibility evaluation tool
- [NVDA](https://www.nvaccess.org/) - Free screen reader for Windows
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Built into Chrome DevTools

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)

## 💬 Feedback

If you encounter any accessibility issues, please:

1. File an issue with the "accessibility" label
2. Include WCAG criterion if known
3. Describe the impact on users
4. Provide steps to reproduce
5. Mention the assistive technology used

We're committed to maintaining and improving accessibility in WorkForce Pro!
