# Accessibility Testing Guide for WorkForce Pro

## Overview

This guide provides step-by-step instructions for testing accessibility features in WorkForce Pro to ensure WCAG 2.1 AA compliance.

## Automated Testing

### Setup

```bash
npm install --save-dev @axe-core/react
npm install --save-dev jest-axe
```

### Running Tests

```bash
# Run all accessibility tests
npm run test:a11y

# Run with coverage
npm run test:a11y -- --coverage
```

### Automated Checks

✅ Color contrast ratios
✅ ARIA attribute validity
✅ Keyboard navigation structure
✅ Semantic HTML validation
✅ Form label associations
✅ Heading hierarchy

## Manual Testing Checklist

### 1. Keyboard Navigation Testing

#### Test Procedure

1. **Disconnect or ignore your mouse**
2. **Use only keyboard to navigate**
3. **Test all interactive elements**

#### Checklist

- [ ] Tab key moves focus forward through all interactive elements
- [ ] Shift+Tab moves focus backward
- [ ] Focus indicator is visible at all times
- [ ] Focus order is logical and follows visual layout
- [ ] Enter key activates buttons and links
- [ ] Space bar toggles checkboxes and activates buttons
- [ ] Escape key closes modals and dialogs
- [ ] Arrow keys work in custom widgets (tabs, menus, etc.)
- [ ] No keyboard traps (can always escape with Tab/Escape)
- [ ] Skip link appears when pressing Tab on page load

#### Views to Test

1. Dashboard
   - [ ] All metric cards are focusable
   - [ ] Chart elements provide keyboard access
   - [ ] Action buttons are accessible

2. Timesheets
   - [ ] Table navigation with arrow keys
   - [ ] Enter opens detail view
   - [ ] Can filter and search with keyboard

3. Billing
   - [ ] Invoice list is keyboard navigable
   - [ ] Can open invoice details
   - [ ] Actions menu accessible

4. Forms
   - [ ] Tab order follows visual flow
   - [ ] All fields focusable
   - [ ] Date pickers keyboard accessible
   - [ ] Dropdowns navigable with arrows

5. Dialogs/Modals
   - [ ] Focus moves to dialog on open
   - [ ] Focus trapped within dialog
   - [ ] Escape closes dialog
   - [ ] Focus returns to trigger on close

### 2. Screen Reader Testing

#### Required Tools

- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca
- **Mobile**: TalkBack (Android) or VoiceOver (iOS)

#### NVDA Quick Start (Windows)

```
Insert = NVDA modifier key

Insert+Q = Quit NVDA
Insert+N = NVDA menu
Insert+T = Read title
H/Shift+H = Next/Previous heading
B/Shift+B = Next/Previous button
F/Shift+F = Next/Previous form field
T/Shift+T = Next/Previous table
Insert+Down = Read all
Insert+Up = Current line
```

#### VoiceOver Quick Start (macOS)

```
Control+Option = VO (VoiceOver modifier)

VO+A = Start reading
VO+Left/Right Arrow = Navigate
VO+Space = Activate element
VO+Shift+Down = Into element
VO+Shift+Up = Out of element
VO+U = Rotor menu
VO+H = Next heading
```

#### Screen Reader Checklist

##### Navigation

- [ ] Skip link is announced and functional
- [ ] Main landmarks are announced (navigation, main, aside)
- [ ] Page title is descriptive and announced
- [ ] Headings form logical hierarchy (H1 → H2 → H3)
- [ ] Links have descriptive text (not "click here")

##### Forms

- [ ] Labels are associated with inputs
- [ ] Required fields are announced as required
- [ ] Error messages are announced
- [ ] Field instructions are read before input
- [ ] Group labels for radio/checkbox groups
- [ ] Placeholder text is not the only label

##### Interactive Elements

- [ ] Button purpose is clear from label
- [ ] Icon buttons have aria-label
- [ ] Current page/tab indicated with aria-current
- [ ] Disabled state is announced
- [ ] Loading state is announced

##### Dynamic Content

- [ ] Toast notifications are announced
- [ ] Live regions announce updates
- [ ] AJAX content changes are announced
- [ ] Loading spinners have status messages

##### Tables

- [ ] Table has caption or aria-label
- [ ] Column headers properly marked
- [ ] Row headers when applicable
- [ ] Table navigation works correctly

### 3. Visual Testing

#### Focus Indicators

- [ ] Visible on all interactive elements
- [ ] High contrast (3:1 minimum)
- [ ] Not obscured by other elements
- [ ] Consistent style throughout app
- [ ] Clearly distinguishable from hover state

#### Color Contrast

Use tools like:
- WebAIM Contrast Checker
- Chrome DevTools Color Picker
- Stark plugin for Figma/browsers

Requirements:
- [ ] Normal text: 4.5:1
- [ ] Large text (18pt+): 3:1
- [ ] UI components: 3:1
- [ ] Icons: 3:1

Test combinations:
- [ ] Text on background
- [ ] Text on colored backgrounds
- [ ] Links in paragraphs
- [ ] Button text
- [ ] Icon colors
- [ ] Border colors
- [ ] Focus indicators

#### Text Readability

- [ ] Text can be resized to 200% without loss of content
- [ ] No horizontal scrolling at 400% zoom
- [ ] Line height at least 1.5x font size
- [ ] Paragraph spacing at least 2x font size
- [ ] Letter spacing at least 0.12x font size
- [ ] Word spacing at least 0.16x font size

### 4. Reduced Motion Testing

#### Enable Reduced Motion

**Windows 10/11:**
Settings → Ease of Access → Display → Show animations

**macOS:**
System Preferences → Accessibility → Display → Reduce motion

**Test:**
- [ ] Animations are disabled or simplified
- [ ] Transitions are instant or very brief
- [ ] Auto-playing content is paused
- [ ] Page remains functional without motion

### 5. Browser Testing

Test in multiple browsers to ensure compatibility:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Test Scenarios by Feature

### Login Flow

1. Navigate to login with keyboard
2. Use screen reader to fill form
3. Verify error messages are announced
4. Test with high contrast mode
5. Test at 200% zoom

**Checklist:**
- [ ] All fields have visible labels
- [ ] Errors announced on submission
- [ ] Password visibility toggle accessible
- [ ] Remember me checkbox accessible
- [ ] Login button clearly labeled

### Creating a Timesheet

1. Navigate to Timesheets view
2. Use keyboard to open creation dialog
3. Fill form using only keyboard
4. Submit and verify success announcement

**Checklist:**
- [ ] Dialog receives focus on open
- [ ] All form fields accessible
- [ ] Date picker keyboard friendly
- [ ] Time input accessible
- [ ] Validation errors announced
- [ ] Success message announced

### Searching and Filtering

1. Use keyboard shortcut (Ctrl+K) to open search
2. Navigate results with arrows
3. Apply filters with keyboard
4. Verify results announced

**Checklist:**
- [ ] Search shortcut works
- [ ] Results announced to screen reader
- [ ] No results state communicated
- [ ] Filter controls keyboard accessible
- [ ] Clear filters button accessible

### Viewing Reports

1. Navigate to Reports view
2. Interact with charts via keyboard
3. Export data using keyboard
4. Verify high contrast mode displays correctly

**Checklist:**
- [ ] Chart data accessible
- [ ] Legend items selectable
- [ ] Export button accessible
- [ ] Date range picker accessible
- [ ] Data table sortable via keyboard

## Common Issues and Solutions

### Issue: Focus Not Visible
**Solution:** Ensure `:focus-visible` styles are applied and have sufficient contrast

### Issue: Screen Reader Not Announcing Updates
**Solution:** Add `aria-live` regions or use `useAnnounce` hook

### Issue: Keyboard Trap in Modal
**Solution:** Use `useFocusTrap` hook and ensure Escape key closes modal

### Issue: Poor Color Contrast
**Solution:** Update CSS variables to meet WCAG AA standards (4.5:1)

### Issue: Icon Button No Label
**Solution:** Add `aria-label` or `aria-labelledby` attribute

### Issue: Form Errors Not Announced
**Solution:** Link errors with `aria-describedby` and use `role="alert"`

## Reporting Accessibility Issues

When filing an accessibility bug, include:

1. **WCAG Criterion**: Which guideline is violated
2. **Severity**: Critical, High, Medium, Low
3. **User Impact**: Who is affected and how
4. **Steps to Reproduce**: Detailed steps
5. **Expected Behavior**: What should happen
6. **Actual Behavior**: What actually happens
7. **Environment**: Browser, OS, assistive technology used
8. **Screenshots/Video**: Visual evidence if applicable

### Example Bug Report

```
Title: Invoice table not keyboard navigable

WCAG: 2.1.1 Keyboard (Level A)
Severity: High
Impact: Keyboard-only users cannot navigate invoice table

Steps:
1. Navigate to Billing view
2. Press Tab to focus on invoice table
3. Try to navigate rows with arrow keys

Expected: Arrow keys should navigate between table cells
Actual: Arrow keys do nothing, Tab skips entire table

Environment: Chrome 120, Windows 11, NVDA 2023.3
```

## Accessibility Champions Program

Every development team should have an accessibility champion who:

- Reviews PRs for accessibility issues
- Runs automated tests on new features
- Conducts keyboard navigation testing
- Performs screen reader testing
- Maintains this documentation
- Educates team on best practices

## Resources

### Tools

- [axe DevTools Browser Extension](https://www.deque.com/axe/devtools/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [Lighthouse in Chrome DevTools](https://developers.google.com/web/tools/lighthouse)
- [NVDA Screen Reader](https://www.nvaccess.org/)

### Documentation

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility Docs](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Resources](https://webaim.org/resources/)

### Training

- [Web Accessibility Course (Udacity)](https://www.udacity.com/course/web-accessibility--ud891)
- [Digital Accessibility Foundations (W3C)](https://www.edx.org/course/digital-accessibility-foundations)
- [Deque University](https://dequeuniversity.com/)

## Continuous Monitoring

### Pre-commit Hooks

Ensure accessibility linting runs before commits:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint:a11y"
    }
  }
}
```

### CI/CD Integration

Add accessibility tests to your pipeline:

```yaml
- name: Accessibility Tests
  run: npm run test:a11y
```

### Monthly Audits

Schedule monthly comprehensive audits:
- Full manual keyboard testing
- Screen reader testing of new features
- Automated scan of all pages
- User testing with people with disabilities

## Success Metrics

Track these metrics to measure accessibility:

- Automated test pass rate (target: 100%)
- Manual test completion rate (target: 100% per release)
- Accessibility bugs in backlog (target: <5)
- Average time to fix a11y bugs (target: <2 sprints)
- Team training completion (target: 100%)
