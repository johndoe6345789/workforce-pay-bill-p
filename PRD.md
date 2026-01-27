# Planning Guide

A cloud-based workforce back-office platform that centralizes timesheet management, billing, payroll, compliance, and analytics for recruitment and staffing organizations, enabling efficient end-to-end workflow automation with real-time visibility and control.

**Experience Qualities**:
1. **Professional** - Enterprise-grade interface that conveys reliability, security, and operational sophistication appropriate for financial and HR workflows
2. **Efficient** - Dense information architecture with quick-access navigation, bulk actions, and keyboard shortcuts that minimize clicks for high-frequency tasks
3. **Transparent** - Clear visibility into workflow status, approval chains, and data lineage with comprehensive audit trails and real-time updates

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-module enterprise platform requiring navigation between distinct functional areas (timesheets, billing, payroll, compliance), role-based access control, real-time dashboards, complex form workflows, extensive data visualization capabilities, and Redux-powered state management for scalable, predictable application state.

## Essential Features

**Authentication & Login**
- Functionality: Salesforce-style login screen with email/password authentication
- Purpose: Secure access to the platform with professional enterprise-grade authentication
- Trigger: User navigates to application without authenticated session
- Progression: Enter credentials → Validate → Show loading state → Redirect to dashboard
- Success criteria: Smooth authentication flow, password visibility toggle, remember me option, secure session management

**User Profile & Settings**
- Functionality: Comprehensive profile management with personal details, preferences, notifications, and security settings
- Purpose: Enables users to customize their experience, manage account security, and control notification preferences
- Trigger: User clicks on their profile avatar/name in the sidebar
- Progression: Click user profile → View profile tabs → Edit information → Configure preferences → Save changes → See confirmation
- Success criteria: Profile updates persist, settings apply immediately, password changes require current password, session management visible

**Dashboard Overview**
- Functionality: Displays real-time KPIs, alerts, and quick actions across all modules with live data refresh from IndexedDB
- Purpose: Provides at-a-glance operational health with automatic updates when data changes, reducing time to critical actions
- Trigger: Successful user login or navigation to home
- Progression: Login → Dashboard loads with widgets → Data automatically refreshes every 2 seconds → User scans metrics → Clicks widget to drill down → Navigates to relevant module
- Success criteria: All KPIs update in real-time via live IndexedDB polling, widgets are interactive, live refresh indicator shows update status, no data older than 2 seconds

**Timesheet Management**
- Functionality: Multi-channel timesheet capture, approval routing, and adjustment workflows
- Purpose: Centralizes time data from multiple sources with automated validation and approval
- Trigger: Worker submission, admin creation, or batch import
- Progression: Timesheet entry → Validation against contract rules → Routing to approver → Approval/rejection → Integration to billing/payroll
- Success criteria: All submission methods work, approval routing follows configured rules, adjustments create audit trail

**Billing & Invoicing**
- Functionality: Automated invoice generation, matching, delivery, and payment tracking
- Purpose: Eliminates manual invoice creation and ensures billing accuracy from approved timesheets
- Trigger: Timesheet approval or manual invoice creation
- Progression: Approved timesheet → Invoice generation → Client review → Delivery → Payment tracking → Reconciliation
- Success criteria: Invoices auto-generate within 1 hour, support multiple currencies, track payment status

**Payroll Processing**
- Functionality: One-click payroll runs supporting multiple employment models
- Purpose: Automates complex payroll calculations across PAYE, CIS, and contractor payments
- Trigger: Pay period close or manual initiation
- Progression: Select pay period → Review timesheets → Calculate deductions → Generate payment files → Submit to bank → Issue payslips
- Success criteria: Supports all employment types, calculates correctly, generates compliant reports

**Compliance Monitoring**
- Functionality: Document tracking, expiry alerts, and automated compliance enforcement
- Purpose: Reduces risk by ensuring all workers maintain required documentation
- Trigger: Document upload, expiry date reached, or onboarding initiation
- Progression: Document request → Worker upload → Verification → Expiry monitoring → Alert before expiry → Block engagement if expired
- Success criteria: All documents tracked, alerts sent 30 days before expiry, workers blocked if non-compliant

**Reporting & Analytics**
- Functionality: Pre-built and custom reports with drill-down capabilities, real-time margin analysis, and predictive forecasting
- Purpose: Provides visibility into margins, forecasts, and operational metrics with AI-powered insights
- Trigger: User navigates to reports or scheduled report generation
- Progression: Select report type → Apply filters → Generate → Review visualizations → Drill down → Export data
- Success criteria: Reports load under 5 seconds, support export to Excel/PDF, reflect real-time data, forecasts show confidence levels

**Multi-Currency Management**
- Functionality: Comprehensive currency rate management with automatic conversion and tracking
- Purpose: Enables global operations with support for multiple currencies and real-time exchange rates
- Trigger: User adds currency or updates exchange rates
- Progression: Navigate to currency → View rates → Add new currency → Update rates → Apply to invoices
- Success criteria: Exchange rates update in real-time, conversions are accurate, supports unlimited currencies

**Multi-Tenant Navigation**
- Functionality: Switch between organizational entities and divisions
- Purpose: Enables agency groups to manage multiple brands/divisions in single platform
- Trigger: User selects entity switcher
- Progression: Click entity selector → Choose entity → Context switches → Data filters to selected entity
- Success criteria: Clear indication of active entity, data properly segregated, no cross-contamination

**Collapsible Navigation Groups**
- Functionality: Organized, collapsible navigation menu with grouped module sections
- Purpose: Manages growing menu complexity by organizing related modules into expandable/collapsible groups
- Trigger: User clicks group header to expand/collapse
- Progression: Navigate to sidebar → Click group header → Group expands/collapses → Access module within group
- Success criteria: Groups persist state, smooth animations, essential modules always visible

**One-Click Payroll Processing**
- Functionality: Automated payroll processing from approved timesheets with instant calculation and payment file generation
- Purpose: Eliminates manual payroll calculations and reduces processing time from hours to seconds
- Trigger: User clicks "Process Payroll Now" button
- Progression: View approved timesheets → Review worker payments → Confirm processing → Generate payment files → Mark timesheets as processed → Download payment files
- Success criteria: Processes 100+ workers in under 5 seconds, calculates all deductions correctly, generates bank-compatible files

**Rate Template Management**
- Functionality: Pre-configured rate structures for different roles, clients, and shift types (standard, overtime, weekend, night, holiday)
- Purpose: Ensures consistent rate application and automates shift premium calculations across all timesheets
- Trigger: User creates new rate template or applies template to timesheet
- Progression: Define role/client → Set standard rate → Configure premium multipliers → Save template → Apply to timesheets → Automatic rate calculation
- Success criteria: Unlimited templates supported, automatic application to matching timesheets, version history maintained

**Custom Report Builder**
- Functionality: Flexible report configuration with custom metrics, grouping, filtering, and date ranges across all data types
- Purpose: Empowers users to create ad-hoc analysis without requiring technical support or pre-built reports
- Trigger: User navigates to Custom Reports and configures parameters
- Progression: Select data type → Choose metrics → Apply filters → Set grouping → Define date range → Generate report → Export to CSV/PDF
- Success criteria: Supports 10+ data dimensions, generates reports under 3 seconds, exports to multiple formats

**Holiday Pay Management**
- Functionality: Automatic holiday accrual calculation, request workflows, and balance tracking with statutory compliance
- Purpose: Automates complex holiday pay calculations and ensures workers receive correct entitlements
- Trigger: Hours worked recorded in timesheet (automatic accrual) or worker submits holiday request
- Progression: Hours worked → Accrual calculated at 5.6% → Balance updated → Worker requests holiday → Manager approves → Balance deducted → Holiday pay included in next payroll
- Success criteria: Automatic accrual from all timesheets, real-time balance visibility, integration with payroll system

**Advanced Search & Query Language**
- Functionality: Powerful query language parser with filter builder UI for all list views (timesheets, invoices, expenses, compliance)
- Purpose: Enables power users to rapidly filter and sort large datasets using natural query syntax while providing visual builder for less technical users
- Trigger: User types in search bar or opens filter builder
- Progression: Enter query (e.g., "status = pending hours > 40") → Parse and validate → Apply filters → Display results count → Show active filter badges → Clear/modify filters
- Success criteria: Supports text (contains/equals/starts/ends), numeric (>/</=/>=/<=/), list (in), and sorting operators; sub-second query parsing; persistent filter state; guided help documentation; exports include active filters
- Query Examples:
  - Timesheets: `status = pending workerName : Smith hours > 40 sort amount desc`
  - Invoices: `amount > 5000 currency = GBP status in sent,overdue`
  - Expenses: `category = Travel billable = true status = pending`
  - Compliance: `status = expiring daysUntilExpiry < 30 documentType : DBS`

## Edge Case Handling

- **Missing Timesheet Data**: Display clear empty states with guided actions to submit or import timesheets
- **Approval Conflicts**: Show resolution wizard when multiple approvers provide conflicting inputs
- **Currency Conversion Failures**: Fall back to manual rate entry with prominent warning indicator
- **Offline Submission**: Queue submissions for sync when connectivity restored with visual feedback
- **Duplicate Detection**: Flag potential duplicates with side-by-side comparison and merge option
- **Expired Documents**: Block critical actions with modal explaining requirement and upload path
- **Payment Failures**: Retry logic with exponential backoff and admin notification after 3 attempts
- **Rate Calculation Errors**: Highlight affected rows and provide inline correction interface

## Design Direction

The design should evoke trust, precision, and control—essential for handling sensitive financial and HR data. It should feel like a sophisticated financial platform: organized, systematic, and information-rich without overwhelming users. The interface should prioritize data density and scanning efficiency while maintaining clear visual hierarchy for critical alerts and actions.

## Color Selection

An enterprise financial platform with professional authority and clear status communication.

- **Primary Color**: Deep Navy Blue (oklch(0.28 0.05 250)) - Conveys trust, stability, and corporate professionalism appropriate for financial applications
- **Secondary Colors**: 
  - Light Slate (oklch(0.95 0.01 250)) - Subtle backgrounds for cards and panels maintaining visual separation
  - Medium Gray (oklch(0.55 0.01 250)) - Secondary text and borders for information hierarchy
- **Accent Color**: Vibrant Cyan (oklch(0.65 0.15 210)) - Energetic highlight for CTAs, active states, and interactive elements
- **Status Colors**:
  - Success Green (oklch(0.65 0.15 145)) - Approved timesheets, successful payments
  - Warning Amber (oklch(0.75 0.15 85)) - Pending approvals, approaching deadlines
  - Error Red (oklch(0.58 0.20 25)) - Rejections, overdue items, compliance failures
  - Info Blue (oklch(0.60 0.12 230)) - Informational alerts, help tooltips
  
- **Foreground/Background Pairings**:
  - Primary Navy (oklch(0.28 0.05 250)): White text (oklch(1 0 0)) - Ratio 11.2:1 ✓
  - Accent Cyan (oklch(0.65 0.15 210)): White text (oklch(1 0 0)) - Ratio 4.6:1 ✓
  - Light Slate (oklch(0.95 0.01 250)): Dark Navy text (oklch(0.25 0.04 250)) - Ratio 13.8:1 ✓
  - Success Green (oklch(0.65 0.15 145)): White text (oklch(1 0 0)) - Ratio 4.8:1 ✓
  - Warning Amber (oklch(0.75 0.15 85)): Dark text (oklch(0.25 0.02 85)) - Ratio 10.5:1 ✓

## Font Selection

Typography should project precision and clarity appropriate for data-heavy financial interfaces, with excellent readability at small sizes for dense tables and forms while maintaining personality beyond standard corporate defaults.

- **Primary Font**: IBM Plex Sans - Technical precision with warmth, excellent at small sizes for tables and forms
- **Monospace Font**: IBM Plex Mono - For monetary values, IDs, and reference numbers requiring alignment

- **Typographic Hierarchy**:
  - H1 (Page Titles): IBM Plex Sans SemiBold / 32px / -0.5px letter-spacing / 1.2 line-height
  - H2 (Section Headers): IBM Plex Sans SemiBold / 24px / -0.3px letter-spacing / 1.3 line-height
  - H3 (Card Headers): IBM Plex Sans Medium / 18px / 0 letter-spacing / 1.4 line-height
  - Body (Primary): IBM Plex Sans Regular / 14px / 0 letter-spacing / 1.5 line-height
  - Body Small (Tables): IBM Plex Sans Regular / 13px / 0 letter-spacing / 1.4 line-height
  - Labels: IBM Plex Sans Medium / 12px / 0.3px letter-spacing / 1.3 line-height
  - Data Values: IBM Plex Mono Regular / 13px / 0 letter-spacing / 1.4 line-height

## Animations

Animations should reinforce the feeling of a responsive, well-engineered system while never impeding workflow speed for power users performing high-frequency operations.

- **Micro-interactions**: Subtle scale (0.98) and opacity (0.9) on button press (100ms) to provide tactile feedback
- **Panel Transitions**: Smooth slide-in from right for detail panels (300ms ease-out) maintaining spatial model
- **Status Changes**: Color transition with gentle pulse (200ms) when timesheet moves from pending to approved
- **Data Loading**: Skeleton screens with shimmer effect rather than spinners to maintain layout stability
- **Notifications**: Toast slides in from top-right with bounce (400ms spring physics)
- **Navigation**: Fade-swap between major views (250ms) with stagger on list items (50ms per item)
- **Hover States**: Instant background color change (0ms) with border accent fade-in (150ms)

## Component Selection

- **Components**:
  - **Sidebar**: Persistent left navigation with collapsible module groups and entity switcher
  - **Card**: Primary container for dashboard widgets and detail sections with subtle shadow
  - **Table**: Dense data tables for timesheets, invoices, workers with sticky headers and row actions
  - **Dialog**: Modal forms for creating/editing records with multi-step support
  - **Sheet**: Slide-in detail panels from right for viewing full records without navigation
  - **Tabs**: Switch between related views (e.g., pending/approved/rejected timesheets)
  - **Badge**: Status indicators with color coding (approved/pending/rejected)
  - **Button**: Primary actions (solid), secondary (outline), destructive (red), icon-only (ghost)
  - **Input/Textarea/Select**: Form fields with labels-inside for space efficiency
  - **Calendar**: Date range pickers for filtering reports and selecting pay periods
  - **Popover**: Contextual actions menu on table rows
  - **Alert**: Banner notifications for system-wide messages
  - **Progress**: Visual representation of onboarding completion or document collection
  - **Switch**: Toggle settings and feature flags
  - **Separator**: Visual dividers between content sections

- **Customizations**:
  - Custom data table component with virtual scrolling for 1000+ rows
  - Custom status timeline component showing approval chain progress
  - Custom metric card with sparkline trend visualization
  - Custom currency input with automatic formatting and symbol
  - Custom entity switcher dropdown with search and favorites

- **States**:
  - Buttons: Default → Hover (accent background) → Active (scale 0.98) → Disabled (opacity 0.5)
  - Inputs: Default (border-input) → Focus (ring-2 ring-accent) → Error (border-destructive) → Success (border-success)
  - Rows: Default → Hover (bg-muted/50) → Selected (bg-accent/10 border-l-4 border-accent)
  - Cards: Default (border subtle) → Hover (shadow-md) → Active (border-accent)

- **Icon Selection**:
  - Clock: Timesheets module
  - Receipt: Billing/invoicing
  - CurrencyDollar: Payroll
  - ShieldCheck: Compliance
  - ChartBar: Reports/analytics
  - Buildings: Entity switcher
  - CheckCircle: Approved status
  - Clock: Pending status
  - XCircle: Rejected status
  - Plus: Create new record
  - MagnifyingGlass: Search
  - Funnel: Filter
  - Download: Export

- **Spacing**:
  - Page padding: 6 (24px)
  - Card padding: 4 (16px) mobile / 6 (24px) desktop
  - Section gaps: 6 (24px)
  - Component gaps: 4 (16px)
  - Tight spacing (tables): 2 (8px)
  - Loose spacing (forms): 8 (32px)

- **Mobile**:
  - Sidebar collapses to bottom navigation bar with 5 primary modules
  - Tables scroll horizontally with sticky first column
  - Cards stack vertically with full width
  - Multi-column layouts collapse to single column
  - Sheet panels become full-screen modals
  - Reduce font sizes by 1px (e.g., 14px → 13px for body)
  - Dashboard widgets become swipeable carousel
  - Bulk actions hidden behind menu on mobile
