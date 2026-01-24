# Utility Library Documentation

This directory contains core utility functions for the WorkForce Pro application. All utilities are exported through `utils.ts` for convenient imports.

## Overview

```typescript
import { 
  cn,                    // Tailwind class merger
  TIMEOUTS, LIMITS,      // Constants
  handleError,           // Error handling
  sanitizeEmail,         // Input sanitization
  isValidEmail,          // Type guards
  validateEmail,         // Validation
} from '@/lib/utils'
```

## Modules

### 1. `utils.ts` (Core)

The main utility file that exports the `cn` function for merging Tailwind classes.

```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class')} />
```

### 2. `constants.ts`

Application-wide constants to eliminate magic numbers and strings.

#### Available Constants:

**TIMEOUTS**
```typescript
TIMEOUTS.LOGIN_DELAY          // 800ms
TIMEOUTS.TOAST_DURATION       // 3000ms
TIMEOUTS.POLLING_INTERVAL     // 30000ms
TIMEOUTS.DEBOUNCE_DELAY       // 300ms
TIMEOUTS.AUTO_SAVE_DELAY      // 2000ms
```

**FORMATS**
```typescript
FORMATS.DATE                  // 'yyyy-MM-dd'
FORMATS.DATE_DISPLAY          // 'MMM dd, yyyy'
FORMATS.DATETIME              // 'yyyy-MM-dd HH:mm:ss'
FORMATS.TIME                  // 'HH:mm'
```

**DURATIONS**
```typescript
DURATIONS.INVOICE_DUE_DAYS         // 30
DURATIONS.SESSION_TIMEOUT_MINUTES  // 60
DURATIONS.PASSWORD_RESET_HOURS     // 24
```

**LIMITS**
```typescript
LIMITS.MAX_FILE_SIZE_MB           // 10
LIMITS.MAX_BATCH_SIZE             // 100
LIMITS.PAGE_SIZE                  // 20
LIMITS.MIN_PASSWORD_LENGTH        // 8
LIMITS.INVOICE_NUMBER_PADDING     // 5
```

**Usage Example:**
```typescript
import { TIMEOUTS, LIMITS } from '@/lib/constants'

setTimeout(handleRefresh, TIMEOUTS.POLLING_INTERVAL)

if (file.size > LIMITS.MAX_FILE_SIZE_MB * 1024 * 1024) {
  toast.error('File too large')
}
```

### 3. `error-handler.ts`

Centralized error handling with custom error types and utilities.

#### Error Classes:

```typescript
import { 
  AppError, 
  ValidationError, 
  AuthenticationError, 
  NetworkError 
} from '@/lib/error-handler'

throw new ValidationError('Invalid email format', { email })
throw new AuthenticationError('Session expired')
throw new NetworkError('Failed to fetch data')
```

#### Functions:

**handleError**
```typescript
import { handleError } from '@/lib/error-handler'

try {
  await riskyOperation()
} catch (error) {
  handleError(error, 'Operation Name')
}
```

**handleAsyncError**
```typescript
import { handleAsyncError } from '@/lib/error-handler'

const data = await handleAsyncError(
  fetchUserData(id),
  'Fetch User'
)

if (data === null) {
  // Error was handled, show fallback UI
}
```

**withErrorHandler**
```typescript
import { withErrorHandler } from '@/lib/error-handler'

const safeFunction = withErrorHandler(riskyFunction, 'Risky Operation')
```

**logError**
```typescript
import { logError } from '@/lib/error-handler'

logError(error, 'Context', { userId, action: 'delete' })
```

### 4. `sanitize.ts`

Input sanitization to prevent XSS and ensure data integrity.

#### Available Functions:

**Text Sanitization**
```typescript
import { sanitizeHTML, sanitizeSearchQuery, stripHTML } from '@/lib/sanitize'

const safe = sanitizeHTML(userInput)
const query = sanitizeSearchQuery(searchTerm)
const text = stripHTML(htmlContent)
```

**Email & URLs**
```typescript
import { sanitizeEmail, sanitizeURL } from '@/lib/sanitize'

const email = sanitizeEmail(input)  // Lowercase, trim, limit length
const url = sanitizeURL(input)      // Validate protocol, return safe URL
```

**Numeric Input**
```typescript
import { sanitizeNumericInput, sanitizeInteger } from '@/lib/sanitize'

const num = sanitizeNumericInput(value)        // Returns number or null
const int = sanitizeInteger(value, 0, 100)     // Clamps to min/max
```

**Filenames & Special Fields**
```typescript
import { 
  sanitizeFilename, 
  sanitizePhoneNumber,
  sanitizeUsername,
  sanitizePostalCode
} from '@/lib/sanitize'

const filename = sanitizeFilename(upload.name)
const phone = sanitizePhoneNumber(phoneInput)
const username = sanitizeUsername(userInput)
```

**Data Export**
```typescript
import { sanitizeCSVValue, truncateString } from '@/lib/sanitize'

const csvSafe = sanitizeCSVValue(cellValue)
const short = truncateString(longText, 100, '...')
```

### 5. `type-guards.ts`

Runtime type checking and validation guards.

#### Basic Guards:

```typescript
import { isNotNull, isDefined, isValidDate } from '@/lib/type-guards'

if (isNotNull(value)) {
  // TypeScript knows value is not null/undefined
}

if (isValidDate(dateInput)) {
  // TypeScript knows it's a Date
}
```

#### Validation Guards:

```typescript
import { 
  isValidEmail,
  isValidPhoneNumber,
  isValidURL,
  isPositiveNumber,
  isValidCurrency
} from '@/lib/type-guards'

if (isValidEmail(email)) {
  // Email format is correct
}

if (isPositiveNumber(amount)) {
  // Number is > 0 and finite
}
```

#### Entity Guards:

```typescript
import { 
  isValidTimesheet,
  isValidInvoice,
  isValidWorker
} from '@/lib/type-guards'

if (isValidTimesheet(data)) {
  // data has all required Timesheet properties
  console.log(data.workerName)
}
```

#### Collection Guards:

```typescript
import { isArrayOf, isRecordOf } from '@/lib/type-guards'

if (isArrayOf(data, isValidTimesheet)) {
  // data is Timesheet[]
}

if (isRecordOf(data, isPositiveNumber)) {
  // data is Record<string, number>
}
```

#### Property Guards:

```typescript
import { hasProperty, hasProperties } from '@/lib/type-guards'

if (hasProperty(obj, 'email')) {
  // obj.email exists
}

if (hasProperties(obj, ['id', 'name', 'email'])) {
  // All properties exist
}
```

### 6. `validation.ts`

Form validation with detailed error messages.

#### Basic Validation:

```typescript
import { 
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhoneNumber,
  validateURL
} from '@/lib/validation'

const result = validateEmail(email)
if (!result.isValid) {
  console.log(result.errors) // Array of error messages
}
```

#### Number & Date Validation:

```typescript
import { 
  validateNumber,
  validateDate,
  validateDateRange
} from '@/lib/validation'

const ageValidation = validateNumber(age, 18, 120, 'Age')
const dateValidation = validateDate(startDate, 'Start Date')
const rangeValidation = validateDateRange(start, end)
```

#### File Validation:

```typescript
import { validateFileSize, validateFileType } from '@/lib/validation'

const sizeCheck = validateFileSize(file, 10) // Max 10MB
const typeCheck = validateFileType(file, ['pdf', 'doc', 'docx'])
```

#### String Validation:

```typescript
import { validateLength, validatePattern, validateRequired } from '@/lib/validation'

const lengthCheck = validateLength(input, 5, 50, 'Description')
const patternCheck = validatePattern(code, /^[A-Z]{3}$/, 'Invalid format')
const requiredCheck = validateRequired(value, 'Field Name')
```

#### Form Validation:

```typescript
import { validateFormData, combineValidations } from '@/lib/validation'

const { isValid, errors } = validateFormData(formData, {
  email: validateEmail,
  password: validatePassword,
  age: (value) => validateNumber(value, 18, 120, 'Age'),
})

if (!isValid) {
  // errors is Record<string, string[]>
  console.log(errors.email) // ['Email format is invalid']
}
```

## Usage Patterns

### Pattern 1: Form Input Handling

```typescript
import { sanitizeEmail, validateEmail } from '@/lib/utils'

function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
  const sanitized = sanitizeEmail(e.target.value)
  setEmail(sanitized)
  
  const validation = validateEmail(sanitized)
  setErrors(validation.errors)
}
```

### Pattern 2: Safe Data Processing

```typescript
import { isValidTimesheet, handleError } from '@/lib/utils'

async function processData(data: unknown[]) {
  try {
    const validTimesheets = data.filter(isValidTimesheet)
    // TypeScript knows validTimesheets is Timesheet[]
    return validTimesheets
  } catch (error) {
    handleError(error, 'Process Data')
    return []
  }
}
```

### Pattern 3: API Error Handling

```typescript
import { handleAsyncError, NetworkError } from '@/lib/utils'

async function fetchData() {
  const response = await handleAsyncError(
    fetch('/api/data'),
    'Fetch Data'
  )
  
  if (!response) {
    // Error was already handled and shown to user
    return null
  }
  
  return response.json()
}
```

### Pattern 4: Complex Validation

```typescript
import { 
  validateFormData,
  validateEmail,
  validateNumber,
  validateRequired
} from '@/lib/utils'

const { isValid, errors } = validateFormData(formData, {
  name: (v) => validateRequired(v, 'Name'),
  email: validateEmail,
  age: (v) => validateNumber(v, 18, undefined, 'Age'),
  phone: validatePhoneNumber,
})
```

### Pattern 5: Search Query Handling

```typescript
import { sanitizeSearchQuery, LIMITS } from '@/lib/utils'

function handleSearch(query: string) {
  const sanitized = sanitizeSearchQuery(query)
  
  const results = data.filter(item =>
    item.name.toLowerCase().includes(sanitized.toLowerCase())
  ).slice(0, LIMITS.MAX_SEARCH_RESULTS)
  
  setResults(results)
}
```

## Best Practices

### 1. Always Sanitize User Input

```typescript
// ❌ Bad
setEmail(e.target.value)

// ✅ Good
setEmail(sanitizeEmail(e.target.value))
```

### 2. Validate Before Submission

```typescript
// ❌ Bad
async function handleSubmit() {
  await api.createUser(formData)
}

// ✅ Good
async function handleSubmit() {
  const { isValid, errors } = validateFormData(formData, validators)
  
  if (!isValid) {
    setFormErrors(errors)
    return
  }
  
  await api.createUser(formData)
}
```

### 3. Use Type Guards for Runtime Safety

```typescript
// ❌ Bad
function processData(data: any) {
  return data.map(item => item.name)
}

// ✅ Good
function processData(data: unknown) {
  if (!isArrayOf(data, isValidWorker)) {
    throw new ValidationError('Invalid data format')
  }
  
  return data.map(worker => worker.name)
}
```

### 4. Handle All Errors

```typescript
// ❌ Bad
async function fetchData() {
  const response = await fetch('/api/data')
  return response.json()
}

// ✅ Good
async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new NetworkError(`Failed to fetch: ${response.statusText}`)
    }
    return response.json()
  } catch (error) {
    handleError(error, 'Fetch Data')
    return null
  }
}
```

### 5. Use Constants Instead of Magic Values

```typescript
// ❌ Bad
setTimeout(refresh, 30000)
if (password.length < 8) { ... }

// ✅ Good
import { TIMEOUTS, LIMITS } from '@/lib/constants'

setTimeout(refresh, TIMEOUTS.POLLING_INTERVAL)
if (password.length < LIMITS.MIN_PASSWORD_LENGTH) { ... }
```

## Testing Utilities

Each utility module should be tested independently:

```typescript
// Example test
import { sanitizeEmail, validateEmail } from '@/lib/utils'

describe('Email utilities', () => {
  it('sanitizes email correctly', () => {
    expect(sanitizeEmail('  USER@EXAMPLE.COM  ')).toBe('user@example.com')
  })
  
  it('validates email format', () => {
    const result = validateEmail('invalid-email')
    expect(result.isValid).toBe(false)
    expect(result.errors).toContain('Email format is invalid')
  })
})
```

## Performance Considerations

- **Sanitization**: Called on every input change - kept lightweight
- **Validation**: Called on blur/submit - can be more comprehensive
- **Type Guards**: Used in filters/maps - optimized for speed
- **Error Handlers**: Include logging - may be async

## Migration Guide

If you're updating existing code to use these utilities:

1. Replace magic numbers with constants
2. Wrap API calls in error handlers
3. Add sanitization to all form inputs
4. Use type guards instead of `any` types
5. Replace custom validation with standard validators

## Contributing

When adding new utilities:

1. Add to appropriate module (or create new one)
2. Export from `utils.ts`
3. Update this README
4. Add JSDoc comments
5. Write tests
6. Consider performance implications

---

*Last updated: January 2025*
