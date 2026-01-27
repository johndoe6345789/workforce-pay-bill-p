import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ClockCounterClockwise, MapTrifold, Warning, Download } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function RoadmapView() {
  const roadmapContent = `# WorkForce Pro - Development Roadmap

## Overview
This roadmap outlines the phased development plan for WorkForce Pro, a cloud-based pay, bill, and workforce back-office platform designed to improve operational efficiency, accuracy, compliance, and visibility across recruitment, contracting, and staffing organisations.

---

## Phase 1: Foundation & Core Pay/Bill (Quarters 1-2)

### 1.1 Core Platform Infrastructure
- ✅ Multi-tenancy architecture
- ✅ Entity and division management
- ✅ User authentication and role-based access control
- ✅ Role-based permissions system with Permission Gates
- ✅ Cloud-hosted SaaS deployment
- ✅ Basic security and data access controls
- ✅ IndexedDB for persistent data storage
- ✅ Redux state management across all views
- ✅ Session management with auto-expiry
- ✅ Session timeout preferences and warnings
- ✅ Development mode express admin login
- ✅ Lazy loading for optimized performance
- ✅ Full accessibility support (WCAG 2.1 AA compliant)
- ✅ Keyboard navigation and screen reader support
- ✅ Complete audit trail system

### 1.2 Timesheet Management - Basic
- ✅ Online web portal timesheet entry (worker, client, agency)
- ✅ Timesheet approval workflows (client web portal)
- ✅ Pending/approved/rejected status tracking
- ✅ Agency-initiated timesheet creation
- ✅ Bulk entry by administrators
- ✅ Mobile timesheet submission
- ✅ Batch import from third-party systems
- ✅ QR-coded paper timesheet scanning
- ✅ Detail dialogs with full timesheet information
- ✅ Advanced search and filtering with query language
- ✅ Shift pattern templates (night/weekend/custom)
- ✅ Fine-grained time tracking (variable shift times)
- ✅ Detailed timesheet entry with hour breakdowns
- ✅ Missing timesheets reporting
- ✅ CRUD operations with IndexedDB integration
- 📋 Email-based automated ingestion

### 1.3 Basic Billing & Invoicing
- ✅ Invoice generation from approved timesheets
- ✅ Invoice tracking (draft, sent, paid, overdue)
- ✅ Multi-currency support (GBP, USD, EUR, expanded)
- ✅ Electronic invoice delivery
- ✅ Sales invoice templates
- ✅ Payment terms configuration
- ✅ Purchase order tracking and management
- ✅ Purchase order enforcement interface
- ✅ Invoice detail dialogs
- ✅ Create invoice dialog with form validation
- ✅ Invoice template manager
- ✅ Credit note generator
- ✅ Permanent placement invoice support
- ✅ Advanced search and filtering
- ✅ CRUD operations with IndexedDB integration
- 📋 Credit control visibility

### 1.4 Basic Payroll
- ✅ Payroll run tracking
- ✅ Worker payment calculations
- ✅ One-click payroll processing
- ✅ PAYE payroll integration
- ✅ PAYE submission creation dialogs
- ✅ Payroll detail dialogs
- ✅ Create payroll dialog with validation
- ✅ Payroll batch processing
- ✅ Payroll approval workflows
- ✅ Payroll batch list management
- ✅ Holiday pay manager and calculations
- ✅ CRUD operations with IndexedDB integration
- ✅ Advanced search and filtering
- 📋 Limited company contractor payments

### 1.5 Dashboard & Core Reporting
- ✅ Executive dashboard with key metrics
- ✅ Pending approvals tracking
- ✅ Overdue invoice monitoring
- ✅ Revenue and margin visibility
- ✅ Activity feed
- ✅ Drill-down capabilities into all entities
- ✅ Custom report builder
- ✅ Missing timesheets report
- ✅ Margin analysis and forecasting
- ✅ Advanced reports view with multiple report types
- ✅ Data export capabilities

---

## Phase 2: Advanced Operations & Automation (Quarters 3-4)

### 2.1 Expense Management
- ✅ Worker expense submission (web portal)
- ✅ Agency-created expense entries
- ✅ Expense approval workflows
- ✅ Integration with billing and payroll
- ✅ Reimbursable vs billable expense tracking
- ✅ Expense detail dialogs with full information
- ✅ Advanced search and filtering
- ✅ CRUD operations with IndexedDB integration
- 📋 Mobile expense capture with receipt photos

### 2.2 Timesheet Management - Advanced
- ✅ Multi-step approval routing
- ✅ Time and rate adjustment wizard
- ✅ Timesheet adjustment wizard
- ✅ Full audit trail of all changes
- ✅ Shift pattern manager for recurring schedules
- ✅ Shift premium calculator
- ✅ Contract validator
- ✅ Advanced search with query language guide
- 📋 Automated credit generation
- 📋 Re-invoicing workflows
- 📋 Email-based approval workflows
- 📋 Configurable validation rules

### 2.3 Advanced Billing
- ✅ Permanent placement invoices
- ✅ Bespoke invoice templates (Invoice Template Manager)
- ✅ Credit note generation
- ✅ Purchase order tracking and enforcement
- 📋 Contractor self-billing
- 📋 Advice notes
- 📋 Supplier invoice matching
- 📋 Client self-billing support
- 📋 On-cost handling and adjustments
- 📋 Withholding tax calculations

### 2.4 Contract, Rate & Rule Enforcement
- ✅ Rate templates by role, client, placement (Rate Template Manager)
- ✅ Automatic shift premium calculations (Shift Premium Calculator)
- ✅ Contract validation at submission (Contract Validator)
- ✅ Time and rate adjustment tools
- 📋 Overtime rate automation
- 📋 Time pattern validation rules
- 📋 AWR monitoring and alerts

### 2.5 Notifications & Workflow Automation
- ✅ In-system alert notifications
- ✅ Real-time notification center
- ✅ Notification history and tracking
- ✅ Event-driven processing updates
- ✅ Email notification templates
- ✅ Email template manager
- ✅ Configurable notification rules
- ✅ Notification rules manager
- ✅ Configurable approval workflow templates for different batch types
- ✅ Approval workflow template manager
- ✅ Multi-step approval workflows with escalation rules
- ✅ Conditional approval step skipping
- ✅ Parallel approval steps for concurrent reviews
- ✅ Template management for payroll, invoices, timesheets, expenses, compliance, and purchase orders
- 📋 Automated follow-up reminders

---

## Phase 3: Compliance & Self-Service (Quarters 5-6)

### 3.1 Compliance Management - Enhanced
- ✅ Document tracking and monitoring
- ✅ Expiry alerts and notifications
- ✅ Document upload and storage
- ✅ Digital onboarding workflows (Onboarding Workflow Manager)
- ✅ Compliance detail dialogs
- ✅ Advanced search and filtering
- ✅ CRUD operations with IndexedDB integration
- 📋 Automated contract pack generation
- 📋 Compliance enforcement rules
- 📋 Statutory reporting support
- 📋 Auto-enrolment assessment

### 3.2 Self-Service Portals
- ✅ Worker portal access
- ✅ Real-time timesheet visibility
- ✅ Real-time expense visibility
- ✅ Invoice and payment status
- ✅ Mobile-responsive design throughout
- 📋 Branded worker portal
- 📋 Branded client portal
- 📋 Paperless document access
- 📋 Custom branding and SSL

### 3.3 Advanced Payroll Processing
- ✅ PAYE processing with submission management
- ✅ Holiday pay automation and manager
- ✅ Payroll batch processing
- ✅ One-click payroll with approval workflows
- 📋 CIS processing
- 📋 Agency staff payroll
- 📋 Multiple employment model support
- 📋 International payroll preparation
- 📋 Payroll cost import from overseas

---

## Phase 4: Analytics & Integrations (Quarters 7-8)

### 4.1 Advanced Reporting & Analytics
- ✅ Real-time gross margin reporting
- ✅ Forecasting and predictive analytics
- ✅ Missing timesheet reports
- ✅ Custom report builder
- ✅ Audit trail viewer with full activity history
- ✅ Data export capabilities
- ✅ Advanced search across all data entities
- ✅ Query language for complex filtering
- 📋 User and audit activity reports
- 📋 Client-level performance dashboards
- 📋 Placement-level profitability
- 📋 Worker-level activity views
- 📋 Bespoke management reports
- 📋 Role-based report access

### 4.2 System Integrations
- ✅ Batch import manager for third-party data
- ✅ Data management interface
- ✅ JSON-based data loading
- 📋 ATS (Applicant Tracking System) integration
- 📋 CRM platform integration
- 📋 Accounting system integration (Xero, QuickBooks, Sage)
- 📋 Automated placement data flow
- 📋 Financial data export automation
- 📋 RESTful API for third-party integrations
- 📋 Webhook support for real-time updates

### 4.3 Global & Multi-Currency - Advanced
- ✅ Multi-currency billing (expanded)
- ✅ Currency rate management interface
- ✅ Real-time currency conversion
- ✅ Exchange rate tracking and alerts
- ✅ Currency management dashboard
- 📋 International sales tax handling
- 📋 Withholding tax automation
- 📋 Local tax compliance
- 📋 Cross-border margin calculation
- 📋 Overseas billing support

---

## Phase 5: Enterprise & Scale (Quarters 9-10)

### 5.1 Multi-Tenancy - Advanced
- ✅ Multiple entity support
- ✅ Entity switching in navigation
- 📋 Franchise management capabilities
- 📋 Agency group consolidation
- 📋 Cross-entity reporting
- 📋 Delegated administration controls
- 📋 Logical data ring-fencing

### 5.2 Configuration & Customisation
- ✅ Editable email templates (Email Template Manager)
- ✅ Multi-language support (i18n framework)
- ✅ Translation system with JSON-based translations
- ✅ Language switcher component
- ✅ User profile and settings pages
- ✅ Session timeout preferences
- ✅ Custom workflow builders (Approval Workflow Templates)
- 📋 Custom system labels
- 📋 Agency-defined security roles
- 📋 Advanced system configuration
- 📋 White-label capabilities

### 5.3 Performance & Scale
- ✅ Lazy loading for view components
- ✅ IndexedDB for high-performance local storage
- ✅ Redux for optimized state management
- ✅ View preloading for instant navigation
- ✅ Batch processing optimization
- 📋 High-volume processing optimization
- 📋 Performance monitoring dashboards
- 📋 Load balancing and scaling
- 📋 Database optimization

### 5.4 Support & Quality
- ✅ Component showcase/library (Storybook-style)
- ✅ Business logic demo components
- ✅ IndexedDB demo for developers
- ✅ Translation demo for testing
- ✅ Parallel approval demo
- ✅ Comprehensive hook library (100+ custom hooks)
- ✅ Extensive UI component library (100+ components)
- ✅ Complete accessibility documentation
- 📋 Dedicated test/demo environments
- 📋 Managed development request process
- 📋 Phone and online support portal
- 📋 Knowledge base and documentation
- 📋 Training materials and videos

---

## Phase 6: Innovation & AI (Quarters 11-12)

### 6.1 Intelligent Automation
- 📋 AI-powered timesheet anomaly detection
- 📋 Predictive compliance alerts
- 📋 Smart invoice matching
- 📋 Automated expense categorization
- 📋 Machine learning for margin optimization

### 6.2 Advanced Analytics
- 📋 Business intelligence dashboards
- 📋 Trend analysis and insights
- 📋 Benchmarking and KPI tracking
- 📋 Predictive workforce planning
- 📋 Risk scoring and monitoring

### 6.3 Mobile Excellence
- 📋 Native mobile apps (iOS/Android)
- 📋 Offline capability
- 📋 Biometric authentication
- 📋 Push notifications
- 📋 Geolocation-based features

---

## Technical Infrastructure & Developer Experience

### Architecture & State Management
- ✅ Redux Toolkit for global state management
- ✅ Redux slices for UI, Auth, Timesheet, Invoice, Payroll, Compliance, Expense
- ✅ Redux middleware for notifications
- ✅ IndexedDB integration for persistent storage
- ✅ Optimistic updates with rollback
- ✅ Error boundary with fallback UI
- ✅ Minimal App.tsx with component composition

### Hook Library (100+ Custom Hooks)
**Business Logic Hooks:**
- ✅ useInvoicing - Invoice calculations and generation
- ✅ usePayrollCalculations - Payroll math and deductions
- ✅ useTimeTracking - Time calculation utilities
- ✅ useMarginAnalysis - Profitability calculations
- ✅ useRateCalculator - Rate and pricing logic
- ✅ usePAYEIntegration - UK tax system integration
- ✅ useComplianceCheck - Compliance validation
- ✅ useTimeAndRateAdjustment - Adjustment calculations

**CRUD Hooks:**
- ✅ useTimesheetsCRUD
- ✅ useInvoicesCRUD
- ✅ usePayrollCRUD
- ✅ useExpensesCRUD
- ✅ useComplianceCRUD
- ✅ useWorkersCRUD
- ✅ usePurchaseOrdersCRUD
- ✅ useEntityCRUD

**Workflow & Automation Hooks:**
- ✅ useApprovalWorkflow - Multi-step approval logic
- ✅ useApprovalWorkflowTemplates - Template management
- ✅ useBatchActions - Bulk operations
- ✅ useBulkOperations - Mass updates
- ✅ useAutoSave - Automatic data persistence

**UI & UX Hooks:**
- ✅ useDataGrid - Advanced table management
- ✅ useFilter - Client-side filtering
- ✅ useSort - Sorting logic
- ✅ usePagination - Page navigation
- ✅ useMultiSelect - Bulk selection
- ✅ useColumnVisibility - Dynamic columns
- ✅ useVirtualScroll - Performance optimization

**Accessibility Hooks:**
- ✅ useAnnounce - Screen reader announcements
- ✅ useAriaLive - Live region updates
- ✅ useFocusTrap - Modal focus management
- ✅ useFocusReturn - Return focus after close
- ✅ useSkipLink - Skip to content navigation
- ✅ useKeyboardShortcuts - Keyboard navigation
- ✅ useReducedMotion - Motion preferences

**Utility Hooks:**
- ✅ useDebounce, useThrottle, useLocalStorage, useSessionStorage
- ✅ useIndexedDBState, useMediaQuery, useBreakpoint, useWindowSize
- ✅ useClipboard, useAsync, useCache, useHistory, useUndo

### UI Component Library (100+ Components)
**Layout Components:**
- ✅ Stack, Flex, Grid, Box, Container, Center, Section

**Data Display:**
- ✅ DataTable, DataGrid, SimpleTable, AdvancedTable
- ✅ Card, MetricCard, StatCard, PricingCard
- ✅ Timeline, TimelineVertical, TimelineEnhanced
- ✅ DescriptionList, DataList, KeyValue
- ✅ Badge, StatusBadge, CounterBadge, Chip, Tag

**Forms & Inputs:**
- ✅ Input, Textarea, Select, MultiSelect, ComboBox
- ✅ Checkbox, Radio, Switch, Slider, Toggle
- ✅ DateRangePicker, Calendar
- ✅ FileUpload, ImagePreview
- ✅ SearchInput, QuickSearch

**Navigation:**
- ✅ Sidebar, NavigationMenu, Breadcrumb, Tabs
- ✅ Pagination, PaginationButtons, PaginationControls, QuickPagination
- ✅ Toolbar, ActionBar

**Feedback:**
- ✅ Alert, InlineAlert, ValidationBanner
- ✅ Toast (Sonner), NotificationList
- ✅ Progress, ProgressBar, Spinner, LoadingSpinner, LoadingOverlay
- ✅ Skeleton, Pulse, EmptyState

**Overlays:**
- ✅ Dialog, Modal, Sheet, Drawer, SlidePanel
- ✅ Popover, HoverCard, Tooltip, ContextMenu, DropdownMenu

**Advanced:**
- ✅ Stepper, StepperSimple, StepperEnhanced, Wizard
- ✅ TreeView, Accordion, Collapsible
- ✅ CodeBlock, CopyButton, ExportButton
- ✅ FilterBar, FilterChips, FilterChipsBar
- ✅ Chart (Recharts integration)
- ✅ Rating, Checklist

---

## Legend
- ✅ **Completed**: Feature is implemented and live
- 🔄 **In Progress**: Currently under development
- 📋 **Planned**: Scheduled for future development

---

## Success Metrics

### Operational Efficiency
- 80% reduction in timesheet processing time
- 95% straight-through invoice processing
- 90% reduction in compliance breach incidents

### User Adoption
- 85%+ worker portal adoption
- 75%+ client portal adoption
- <5% support ticket rate per user

### Financial Impact
- 99.5% billing accuracy
- <2% margin leakage
- 30% reduction in administrative overhead

---

*Last Updated: January 2025*
*Version: 2.0*`

  const parseMarkdown = (text: string) => {
    const lines = text.split('\n')
    const elements: React.ReactNode[] = []
    let inList = false
    let listItems: React.ReactNode[] = []

    const flushList = (index: number) => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="space-y-2 mb-4 pl-6">
            {listItems}
          </ul>
        )
        listItems = []
        inList = false
      }
    }

    lines.forEach((line, i) => {
      if (line.startsWith('# ')) {
        flushList(i)
        elements.push(
          <h1 key={i} className="text-3xl font-semibold tracking-tight mb-4 mt-6">
            {line.substring(2)}
          </h1>
        )
      } else if (line.startsWith('## ')) {
        flushList(i)
        const text = line.substring(3)
        elements.push(
          <h2 key={i} className="text-2xl font-semibold tracking-tight mb-3 mt-6 flex items-center gap-2">
            {text}
          </h2>
        )
      } else if (line.startsWith('### ')) {
        flushList(i)
        elements.push(
          <h3 key={i} className="text-lg font-semibold mb-2 mt-4">
            {line.substring(4)}
          </h3>
        )
      } else if (line.startsWith('- ')) {
        if (!inList) {
          inList = true
        }
        const text = line.substring(2)
        const isCompleted = text.startsWith('✅')
        const isInProgress = text.startsWith('🔄')
        const isPlanned = text.startsWith('📋')
        
        listItems.push(
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-0.5">
              {isCompleted && <span className="text-success">✅</span>}
              {isInProgress && <span className="text-warning">🔄</span>}
              {isPlanned && <span className="text-muted-foreground">📋</span>}
              {!isCompleted && !isInProgress && !isPlanned && <span className="text-muted-foreground">•</span>}
            </span>
            <span className={cn(
              isCompleted && 'text-foreground',
              isInProgress && 'text-foreground font-medium',
              isPlanned && 'text-muted-foreground'
            )}>
              {text.replace(/^[✅🔄📋]\s*/, '')}
            </span>
          </li>
        )
      } else if (line.startsWith('---')) {
        flushList(i)
        elements.push(<hr key={i} className="my-6 border-border" />)
      } else if (line.trim() !== '') {
        flushList(i)
        elements.push(
          <p key={i} className="text-sm text-muted-foreground mb-3">
            {line}
          </p>
        )
      }
    })

    flushList(lines.length)
    return elements
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Product Roadmap</h2>
          <p className="text-muted-foreground mt-1">Development phases and feature timeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-success/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-success" weight="fill" />
              Completed Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">200+</div>
            <p className="text-sm text-muted-foreground mt-1">Across Phases 1-5</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-accent" weight="fill" />
              Component Library
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">100+</div>
            <p className="text-sm text-muted-foreground mt-1">UI Components & Hooks</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ClockCounterClockwise size={18} className="text-warning" weight="fill" />
              Current Focus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">Phase 2-4</div>
            <p className="text-sm text-muted-foreground mt-1">Advanced automation features</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-accent/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <MapTrifold size={18} className="text-accent" weight="fill" />
              Total Phases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">6</div>
            <p className="text-sm text-muted-foreground mt-1">24 month timeline</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 prose prose-sm max-w-none">
          {parseMarkdown(roadmapContent)}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Warning size={20} className="text-warning" />
            Release Cadence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Major Releases</p>
              <p className="font-medium">Quarterly</p>
            </div>
            <div>
              <p className="text-muted-foreground">Minor Updates</p>
              <p className="font-medium">Monthly</p>
            </div>
            <div>
              <p className="text-muted-foreground">Patches</p>
              <p className="font-medium">Weekly</p>
            </div>
            <div>
              <p className="text-muted-foreground">Hotfixes</p>
              <p className="font-medium">As needed</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
