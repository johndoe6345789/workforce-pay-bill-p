# WorkForce Pro - Back Office Platform

A comprehensive cloud-based pay, bill, and workforce back-office platform for recruitment, contracting, and staffing organizations.

## 🚀 Features

- **Timesheet Management** - Multi-channel capture and approval workflows
- **Billing & Invoicing** - Automated invoice generation and compliance
- **Payroll Processing** - One-click payroll with multiple payment models
- **Compliance Tracking** - Document management and expiry monitoring
- **Expense Management** - Capture and control of billable expenses
- **Advanced Reporting** - Real-time dashboards and custom reports
- **Multi-Currency Support** - Global billing and payroll capabilities
- **Self-Service Portals** - Branded portals for workers, clients, and agencies

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 19 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (v4)
- **Icons**: Phosphor Icons
- **Data Persistence**: IndexedDB
- **Build Tool**: Vite 7

### Data Persistence

**All data is stored locally using IndexedDB** - a powerful browser database that provides:
- Large storage capacity (50% of available disk space)
- Fast indexed queries
- Full ACID compliance
- Offline capability

See [MIGRATION_INDEXEDDB.md](./MIGRATION_INDEXEDDB.md) for complete documentation on the data persistence layer.

### Key Libraries
- `framer-motion` - Animations
- `recharts` - Data visualization
- `date-fns` - Date handling
- `react-hook-form` + `zod` - Form validation
- `sonner` - Toast notifications

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn components (40+ pre-installed)
│   ├── nav/            # Navigation components
│   ├── timesheets/     # Timesheet-specific components
│   ├── reports/        # Reporting components
│   └── views/          # View components
├── hooks/              # Custom React hooks (100+ hooks)
├── lib/                # Utilities and core logic
│   ├── indexed-db.ts   # IndexedDB manager
│   ├── utils.ts        # Helper functions
│   └── types.ts        # TypeScript types
├── store/              # Redux store and slices
├── data/               # JSON data files
│   ├── app-data.json   # Sample business data
│   ├── logins.json     # User credentials
│   └── translations/   # i18n files
└── styles/             # CSS files
```

## 🎯 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Default Login

Development mode includes an "Express Admin Login" button. Or use:
- **Email**: Any email from `logins.json`
- **Password**: Not required (demo mode)

## 🗄️ Data Management

### Using IndexedDB State

```typescript
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'
import { STORES } from '@/lib/indexed-db'

// For app state (preferences, settings)
const [locale, setLocale] = useIndexedDBState('app-locale', 'en')

// For entity data (business objects)
const [timesheets, setTimesheets] = useIndexedDBState(STORES.TIMESHEETS, [])

// Always use functional updates
setTimesheets(current => [...current, newTimesheet])
```

### Direct IndexedDB Access

```typescript
import { indexedDB, STORES } from '@/lib/indexed-db'

// Create
await indexedDB.create(STORES.TIMESHEETS, timesheet)

// Read
const timesheet = await indexedDB.read(STORES.TIMESHEETS, id)
const allTimesheets = await indexedDB.readAll(STORES.TIMESHEETS)

// Update
await indexedDB.update(STORES.TIMESHEETS, updatedTimesheet)

// Delete
await indexedDB.delete(STORES.TIMESHEETS, id)

// Query with indexes
const pending = await indexedDB.readByIndex(STORES.TIMESHEETS, 'status', 'pending')
```

## 🎨 UI Components

The application uses a comprehensive component library built on shadcn/ui v4:

- **40+ Pre-installed Components** - All shadcn components available
- **Custom Components** - Extended with business-specific components
- **Design System** - Consistent styling with Tailwind CSS
- **Accessibility** - WCAG 2.1 AA compliant
- **Responsive** - Mobile-first design

See [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) for details.

## 🔌 Custom Hooks

100+ custom hooks organized by category:

- **State Management** - Advanced state patterns
- **Data Operations** - CRUD, filtering, sorting
- **Business Logic** - Invoicing, payroll calculations, time tracking
- **Accessibility** - Screen reader support, keyboard navigation
- **UI Utilities** - Modals, toasts, clipboard

See [HOOK_AND_COMPONENT_SUMMARY.md](./HOOK_AND_COMPONENT_SUMMARY.md) for complete reference.

## 🌍 Internationalization

Multi-language support with JSON-based translations:

```typescript
import { useTranslation } from '@/hooks/use-translation'

const { t, locale, changeLocale } = useTranslation()

// Use translations
<h1>{t('dashboard.title')}</h1>

// Change language
changeLocale('fr')
```

Supported languages: English, Spanish, French

See [TRANSLATIONS.md](./TRANSLATIONS.md) for details.

## 🔐 Security & Permissions

- **Role-Based Access Control** - Fine-grained permissions
- **Session Management** - Automatic timeout and expiry
- **Audit Trails** - Complete action history
- **Permission Gates** - Component-level access control

See [PERMISSIONS.md](./PERMISSIONS.md) and [SECURITY.md](./SECURITY.md).

## ♿ Accessibility

Full WCAG 2.1 AA compliance:

- Keyboard navigation
- Screen reader support
- Focus management
- ARIA labels and live regions
- Reduced motion support

See [ACCESSIBILITY_AUDIT.md](./ACCESSIBILITY_AUDIT.md) for details.

## 📊 State Management

Redux Toolkit for global state:

```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { setCurrentView } from '@/store/slices/uiSlice'

const dispatch = useAppDispatch()
const currentView = useAppSelector(state => state.ui.currentView)

dispatch(setCurrentView('timesheets'))
```

See [REDUX_GUIDE.md](./REDUX_GUIDE.md) for complete guide.

## 🗺️ Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and development timeline.

## 📚 Additional Documentation

- [PRD.md](./PRD.md) - Product Requirements
- [BEST_PRACTICES.md](./BEST_PRACTICES.md) - Coding standards
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details
- [MIGRATION_INDEXEDDB.md](./MIGRATION_INDEXEDDB.md) - Data persistence guide
- [LAZY_LOADING.md](./LAZY_LOADING.md) - Performance optimization

## 🤝 Contributing

This is a demonstration application showcasing modern React patterns and IndexedDB integration. Feel free to use it as a reference or starting point for your own projects.

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
