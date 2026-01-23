# Translation System Documentation

## Overview

The WorkForce Pro platform now includes a comprehensive internationalization (i18n) system that loads translations from JSON files. This enables the application to support multiple languages seamlessly, with user preferences persisted across sessions.

## Features

- ✅ **JSON-based translations** - All translations stored in structured JSON files
- ✅ **Multiple languages** - Support for English, Spanish, and French (easily extensible)
- ✅ **Persistent preferences** - Language selection saved using KV store
- ✅ **Parameter interpolation** - Dynamic values in translation strings
- ✅ **Nested keys** - Organized translation hierarchy with dot notation access
- ✅ **Automatic fallback** - Falls back to English if translation missing
- ✅ **Type-safe** - TypeScript support throughout
- ✅ **Lazy loading** - Translations loaded on-demand
- ✅ **Easy integration** - Simple React hook API

## File Structure

```
/src
  /data
    /translations
      en.json      # English translations
      es.json      # Spanish translations
      fr.json      # French translations
  /hooks
    use-translation.ts   # Translation hook
  /components
    LanguageSwitcher.tsx # UI component for language selection
    TranslationDemo.tsx  # Demonstration component
```

## Translation Files

Translation files are located in `/src/data/translations/` and follow a consistent structure:

### Structure

```json
{
  "app": {
    "title": "WorkForce Pro",
    "subtitle": "Enhanced Back Office Platform"
  },
  "navigation": {
    "dashboard": "Dashboard",
    "timesheets": "Timesheets",
    ...
  },
  "common": {
    "search": "Search",
    "filter": "Filter",
    ...
  },
  "validation": {
    "required": "This field is required",
    "minLength": "Minimum length is {{min}} characters"
  }
}
```

### Available Languages

- **English** (`en`) - Default language
- **Spanish** (`es`) - Español
- **French** (`fr`) - Français

## Usage

### Basic Usage

```typescript
import { useTranslation } from '@/hooks/use-translation'

function MyComponent() {
  const { t } = useTranslation()
  
  return (
    <div>
      <h1>{t('navigation.dashboard')}</h1>
      <button>{t('common.save')}</button>
      <p>{t('timesheets.status.approved')}</p>
    </div>
  )
}
```

### With Parameters

Translations support parameter interpolation using `{{variable}}` syntax:

```typescript
const { t } = useTranslation()

// Translation: "{{count}} unread"
const message = t('notifications.unreadCount', { count: 5 })
// Result: "5 unread"

// Translation: "Minimum length is {{min}} characters"
const validation = t('validation.minLength', { min: 8 })
// Result: "Minimum length is 8 characters"
```

### Changing Language

```typescript
import { useTranslation } from '@/hooks/use-translation'

function LanguageSelector() {
  const { locale, changeLocale, availableLocales } = useTranslation()
  
  return (
    <div>
      <p>Current: {locale}</p>
      <button onClick={() => changeLocale('es')}>Español</button>
      <button onClick={() => changeLocale('fr')}>Français</button>
      <button onClick={() => changeLocale('en')}>English</button>
    </div>
  )
}
```

### Getting Current Locale (Lightweight)

If you only need the current locale without translation functionality:

```typescript
import { useLocale } from '@/hooks/use-translation'

function MyComponent() {
  const locale = useLocale()
  
  return <span>Current language: {locale}</span>
}
```

### Changing Locale (Without Translation)

If you only need to change the locale:

```typescript
import { useChangeLocale } from '@/hooks/use-translation'

function LanguageButton() {
  const changeLocale = useChangeLocale()
  
  return <button onClick={() => changeLocale('es')}>Switch to Spanish</button>
}
```

## Hook API Reference

### `useTranslation()`

Main hook for translation functionality.

**Returns:**
```typescript
{
  t: (key: string, params?: Record<string, string | number>) => string,
  locale: 'en' | 'es' | 'fr',
  changeLocale: (newLocale: 'en' | 'es' | 'fr') => void,
  availableLocales: ['en', 'es', 'fr'],
  isLoading: boolean,
  error: Error | null
}
```

**Example:**
```typescript
const { t, locale, changeLocale, isLoading } = useTranslation()

if (isLoading) {
  return <div>Loading translations...</div>
}

return (
  <div>
    <h1>{t('app.title')}</h1>
    <button onClick={() => changeLocale('es')}>Español</button>
  </div>
)
```

### `useLocale()`

Lightweight hook that only returns the current locale.

**Returns:** `'en' | 'es' | 'fr'`

### `useChangeLocale()`

Hook that only provides locale change functionality.

**Returns:** `(newLocale: 'en' | 'es' | 'fr') => void`

## Components

### LanguageSwitcher

Dropdown component for selecting language, integrated in the app header.

```typescript
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

<LanguageSwitcher />
```

**Features:**
- Displays current language
- Dropdown with all available languages
- Visual indicator for selected language
- Automatically updates on selection

### TranslationDemo

Comprehensive demonstration component showing all translation features. Access via:
- Navigation: Tools & Utilities → Translations
- Direct view: `translation-demo`

## Translation Keys Reference

### App Level
- `app.title` - Application title
- `app.subtitle` - Application subtitle

### Navigation
- `navigation.dashboard` - Dashboard
- `navigation.timesheets` - Timesheets
- `navigation.billing` - Billing
- `navigation.payroll` - Payroll
- `navigation.compliance` - Compliance
- `navigation.expenses` - Expenses
- `navigation.reports` - Reports
- Plus 20+ more navigation items

### Common Actions
- `common.search` - Search
- `common.filter` - Filter
- `common.export` - Export
- `common.save` - Save
- `common.cancel` - Cancel
- `common.submit` - Submit
- `common.delete` - Delete
- Plus 30+ more common terms

### Status Messages
- `common.success` - Success
- `common.error` - Error
- `common.warning` - Warning
- `common.info` - Information
- `common.loading` - Loading...

### Timesheets
- `timesheets.title` - Timesheets title
- `timesheets.addTimesheet` - Add timesheet action
- `timesheets.status.draft` - Draft status
- `timesheets.status.submitted` - Submitted status
- `timesheets.status.approved` - Approved status
- `timesheets.status.rejected` - Rejected status
- Plus 20+ more timesheet terms

### Billing
- `billing.createInvoice` - Create invoice
- `billing.invoiceNumber` - Invoice number
- `billing.status.paid` - Paid status
- `billing.status.overdue` - Overdue status
- Plus 20+ more billing terms

### Payroll
- `payroll.processPayroll` - Process payroll
- `payroll.grossPay` - Gross pay
- `payroll.netPay` - Net pay
- Plus 15+ more payroll terms

### Validation
- `validation.required` - Required field message
- `validation.invalidEmail` - Invalid email message
- `validation.minLength` - Minimum length (with {{min}} param)
- `validation.maxLength` - Maximum length (with {{max}} param)
- Plus more validation messages

### Errors
- `errors.generic` - Generic error message
- `errors.network` - Network error message
- `errors.notFound` - Not found message
- `errors.unauthorized` - Unauthorized message

## Adding New Languages

1. Create a new JSON file in `/src/data/translations/`:
   ```bash
   # Example: German
   /src/data/translations/de.json
   ```

2. Copy the structure from `en.json` and translate all values

3. Update the `use-translation.ts` hook:
   ```typescript
   type Locale = 'en' | 'es' | 'fr' | 'de'
   const AVAILABLE_LOCALES: Locale[] = ['en', 'es', 'fr', 'de']
   ```

4. Update `LanguageSwitcher.tsx`:
   ```typescript
   const LOCALE_NAMES: Record<string, string> = {
     en: 'English',
     es: 'Español',
     fr: 'Français',
     de: 'Deutsch'
   }
   ```

## Adding New Translation Keys

1. Add the key to all language files in the appropriate section:

   **en.json:**
   ```json
   {
     "mySection": {
       "myKey": "My English text"
     }
   }
   ```

   **es.json:**
   ```json
   {
     "mySection": {
       "myKey": "Mi texto en español"
     }
   }
   ```

   **fr.json:**
   ```json
   {
     "mySection": {
       "myKey": "Mon texte en français"
     }
   }
   ```

2. Use in your component:
   ```typescript
   const { t } = useTranslation()
   const text = t('mySection.myKey')
   ```

## Best Practices

### 1. Organize by Feature
Group related translations together:
```json
{
  "timesheets": {
    "title": "...",
    "addTimesheet": "...",
    "status": {
      "draft": "...",
      "approved": "..."
    }
  }
}
```

### 2. Use Descriptive Keys
```typescript
// Good
t('timesheets.status.approved')
t('billing.invoice.overdue')

// Bad
t('text1')
t('message')
```

### 3. Keep Parameters Simple
```json
{
  "greeting": "Hello, {{name}}!",
  "itemCount": "{{count}} items selected"
}
```

### 4. Provide Context in Comments
```json
{
  "common": {
    // Used on all save buttons
    "save": "Save",
    // Used for destructive actions
    "delete": "Delete"
  }
}
```

### 5. Handle Pluralization
```json
{
  "notifications": {
    "unreadCount": "{{count}} unread"
  }
}
```

Then handle in code:
```typescript
const count = 1
const text = count === 1 
  ? t('notifications.unreadSingular', { count })
  : t('notifications.unreadCount', { count })
```

### 6. Test All Languages
Always verify translations in all supported languages before deployment.

## Performance Considerations

- **Lazy Loading**: Translations are loaded on-demand when language changes
- **Caching**: Once loaded, translations are cached in memory
- **Persistent Storage**: Selected language is stored in KV store, not re-fetched
- **Minimal Re-renders**: Hook uses React hooks efficiently to minimize re-renders

## Troubleshooting

### Translation Not Showing

1. Check the key exists in the translation file
2. Verify the file is valid JSON
3. Check browser console for errors
4. Ensure the key path is correct (case-sensitive)

### Language Not Changing

1. Verify the locale is in `AVAILABLE_LOCALES`
2. Check browser console for loading errors
3. Clear KV store if needed: `spark.kv.delete('app-locale')`

### Missing Translation

If a translation key is missing, the system will:
1. Return the key itself as a fallback
2. Log a warning to console (in development)
3. Attempt to load from default language (English)

## Examples

### Full Component Example

```typescript
import { useTranslation } from '@/hooks/use-translation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function TimesheetApproval({ timesheet }) {
  const { t } = useTranslation()
  
  const handleApprove = () => {
    // Approval logic
    toast.success(t('timesheets.status.approved'))
  }
  
  const handleReject = () => {
    // Rejection logic
    toast.error(t('timesheets.status.rejected'))
  }
  
  return (
    <Card>
      <h2>{t('timesheets.title')}</h2>
      <p>{t('timesheets.hoursWorked')}: {timesheet.hours}</p>
      <div>
        <Button onClick={handleApprove}>
          {t('timesheets.approveTimesheet')}
        </Button>
        <Button variant="destructive" onClick={handleReject}>
          {t('timesheets.rejectTimesheet')}
        </Button>
      </div>
    </Card>
  )
}
```

### Form Validation Example

```typescript
import { useTranslation } from '@/hooks/use-translation'
import { useForm } from 'react-hook-form'

export function MyForm() {
  const { t } = useTranslation()
  const { register, formState: { errors } } = useForm()
  
  return (
    <form>
      <input
        {...register('email', {
          required: t('validation.required'),
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: t('validation.invalidEmail')
          }
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}
    </form>
  )
}
```

## Summary

The translation system provides a robust, scalable solution for internationalization in the WorkForce Pro platform. With JSON-based storage, easy parameter interpolation, and persistent user preferences, it enables seamless multi-language support while maintaining clean, maintainable code.

For a live demonstration of all features, navigate to **Tools & Utilities → Translations** in the application.
