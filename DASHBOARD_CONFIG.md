# Dashboard JSON Configuration

The dashboard layout, data, and translations are now loaded from JSON files, making it easy to customize and configure the dashboard without modifying React components.

## Files

- **`/src/data/dashboard.json`** - Dashboard layout and configuration
- **`/src/data/translations/en.json`** - English translations (including dashboard keys)
- **`/src/data/translations/fr.json`** - French translations
- **`/src/data/translations/es.json`** - Spanish translations

## Dashboard Configuration Structure

### Layout Sections

The dashboard is divided into three main sections:

#### 1. Metrics Grid
Displays key performance indicators (KPIs) in a grid layout.

```json
{
  "id": "metrics",
  "type": "metrics-grid",
  "columns": {
    "mobile": 1,
    "tablet": 2,
    "desktop": 4
  },
  "metrics": [
    {
      "id": "pendingApprovals",
      "titleKey": "dashboard.pendingApprovals",
      "dataSource": "metrics.pendingApprovals",
      "icon": "ClockCounterClockwise",
      "iconColor": "text-warning",
      "variant": "warning",
      "trend": {
        "enabled": true,
        "direction": "up",
        "value": 12,
        "textKey": "dashboard.vsLastWeek",
        "textParams": { "value": "12" }
      }
    }
  ]
}
```

#### 2. Financial Summary Cards
Shows financial metrics like revenue, payroll, and margins.

```json
{
  "id": "financial-summary",
  "type": "cards-grid",
  "columns": {
    "mobile": 1,
    "tablet": 1,
    "desktop": 3
  },
  "cards": [
    {
      "id": "monthlyRevenue",
      "titleKey": "dashboard.monthlyRevenue",
      "descriptionKey": "dashboard.monthlyRevenueDescription",
      "dataSource": "metrics.monthlyRevenue",
      "format": "currency",
      "currencySymbol": "£",
      "trend": {
        "enabled": true,
        "direction": "up",
        "value": 12.5,
        "textKey": "dashboard.vsLastMonth",
        "textParams": { "value": "12.5" },
        "color": "text-success"
      }
    }
  ]
}
```

#### 3. Activity Feed & Quick Actions
Two-column layout showing recent activities and quick action buttons.

```json
{
  "id": "activity-and-actions",
  "type": "two-column-cards",
  "columns": {
    "mobile": 1,
    "tablet": 1,
    "desktop": 2
  },
  "cards": [
    {
      "id": "recentActivity",
      "type": "activity-feed",
      "titleKey": "dashboard.recentActivity",
      "descriptionKey": "dashboard.recentActivityDescription",
      "dataSource": "recentActivities",
      "maxItems": 4
    },
    {
      "id": "quickActions",
      "type": "action-list",
      "titleKey": "dashboard.quickActions",
      "descriptionKey": "dashboard.quickActionsDescription",
      "actions": [
        {
          "id": "createTimesheet",
          "labelKey": "dashboard.createTimesheet",
          "icon": "Clock",
          "action": "navigate",
          "target": "timesheets"
        }
      ]
    }
  ]
}
```

### Recent Activities

Activity feed items are defined separately:

```json
{
  "recentActivities": [
    {
      "id": "activity-1",
      "icon": "CheckCircle",
      "iconColor": "text-success",
      "titleKey": "dashboard.timesheetApproved",
      "description": "John Smith - Week ending 15 Jan 2025",
      "timeKey": "dashboard.minutesAgo",
      "timeParams": { "value": "5" },
      "timestamp": "2025-01-15T14:55:00Z"
    }
  ]
}
```

## Data Sources

The `dataSource` field references metrics from the application's state:

- `metrics.pendingApprovals` → Dashboard metrics object
- `metrics.monthlyRevenue` → Financial data
- `metrics.complianceAlerts` → Compliance tracking

The hook automatically resolves nested paths like `metrics.pendingApprovals` by traversing the metrics object.

## Available Icons

Icons are mapped from Phosphor Icons library:
- Clock
- Receipt
- CurrencyDollar
- ClockCounterClockwise
- CheckCircle
- Warning
- Notepad
- Download
- ArrowUp
- ArrowDown

## Variants

Metric cards support visual variants:
- `default` - Standard border
- `success` - Green accent border
- `warning` - Yellow/orange accent border
- `error` - Red accent border

## Formats

Financial cards support multiple formats:
- `currency` - Displays with currency symbol (e.g., £1,234)
- `percentage` - Displays with % symbol (e.g., 15.5%)
- `number` - Plain number with locale formatting

## Translations

All text is loaded from translation files using translation keys:

```json
{
  "dashboard": {
    "title": "Dashboard",
    "subtitle": "Real-time overview of your workforce operations",
    "pendingApprovals": "Pending Approvals",
    "monthlyRevenue": "Monthly Revenue",
    "vsLastWeek": "{{value}}% vs last week",
    "minutesAgo": "{{value}} minutes ago"
  }
}
```

Translation keys support parameter interpolation using `{{paramName}}` syntax.

## Custom Hook

The `useDashboardConfig` hook provides easy access to the configuration:

```typescript
import { useDashboardConfig } from '@/hooks/use-dashboard-config'

const {
  config,              // Full configuration object
  loading,             // Loading state
  error,               // Error state
  getMetricsSection,   // Get metrics section config
  getFinancialSection, // Get financial cards config
  getRecentActivities, // Get activity feed (with optional limit)
  getQuickActions      // Get quick action buttons
} = useDashboardConfig()
```

## Adding New Metrics

To add a new metric:

1. Add the metric to `/src/data/dashboard.json` in the appropriate section
2. Add translation keys to all language files (`en.json`, `fr.json`, `es.json`)
3. Ensure the data source path matches your metrics object structure

Example:
```json
{
  "id": "activeWorkers",
  "titleKey": "dashboard.activeWorkers",
  "dataSource": "metrics.activeWorkers",
  "icon": "Users",
  "iconColor": "text-info",
  "variant": "default"
}
```

## Benefits

✅ **No code changes needed** - Update dashboard by editing JSON
✅ **Fully internationalized** - All text comes from translation files
✅ **Flexible layout** - Responsive column configurations
✅ **Type-safe** - TypeScript interfaces ensure correct structure
✅ **Easy maintenance** - Centralized configuration
✅ **Reusable** - Same pattern can be applied to other views
