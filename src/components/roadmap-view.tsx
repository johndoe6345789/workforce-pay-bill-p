import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ClockCounterClockwise, MapTrifold, Warning, Download } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

export function RoadmapView() {
  const roadmapContent = `# WorkForce Pro - Development Roadmap

## Phase 1: Foundation & Core Pay/Bill (Quarters 1-2) ✅

### Core Platform Infrastructure
- ✅ Multi-tenancy architecture
- ✅ Entity and division management
- ✅ User authentication and role-based access control
- ✅ Cloud-hosted SaaS deployment
- ✅ Basic security and data access controls

### Timesheet Management - Basic
- ✅ Online web portal timesheet entry
- ✅ Timesheet approval workflows
- ✅ Status tracking (pending/approved/rejected)
- ✅ Agency-initiated timesheet creation
- ✅ Bulk entry by administrators
- ✅ Mobile timesheet submission
- 📋 Batch import capabilities
- ✅ QR-coded paper timesheet scanning

### Basic Billing & Invoicing
- ✅ Invoice generation from timesheets
- ✅ Invoice status tracking
- ✅ Multi-currency support (GBP, USD, EUR)
- ✅ Electronic invoice delivery
- ✅ Sales invoice templates
- ✅ Payment terms configuration
- 📋 Purchase order tracking

### Basic Payroll
- ✅ Payroll run tracking
- ✅ Worker payment calculations
- ✅ One-click payroll processing
- 📋 PAYE payroll integration
- ✅ Holiday pay calculations

### Dashboard & Core Reporting
- ✅ Executive dashboard with key metrics
- ✅ Pending approvals tracking
- ✅ Overdue invoice monitoring
- ✅ Revenue and margin visibility
- ✅ Activity feed

---

## Phase 2: Advanced Operations & Automation (Quarters 3-4) 🔄

### Expense Management
- ✅ Worker expense submission (web portal)
- ✅ Agency-created expense entries
- ✅ Expense approval workflows
- ✅ Integration with billing and payroll
- ✅ Reimbursable vs billable expense tracking
- 📋 Mobile expense capture with receipt photos

### Notifications & Workflow Automation
- ✅ In-system alert notifications
- ✅ Real-time notification center
- ✅ Notification history and tracking
- ✅ Event-driven processing updates
- ✅ Email notification templates
- 📋 Configurable notification rules
- 📋 Automated follow-up reminders

### Timesheet Management - Advanced
- ✅ Multi-step approval routing
- 📋 Time and rate adjustment wizard
- 📋 Automated credit generation
- 📋 Re-invoicing workflows
- 📋 Full audit trail

### Advanced Billing
- 📋 Permanent placement invoices
- 📋 Contractor self-billing
- 📋 Bespoke invoice templates
- 📋 Client self-billing support
- 📋 Withholding tax handling

### Contract, Rate & Rule Enforcement
- ✅ Rate templates by role/client/placement
- 📋 Automatic shift premium calculations
- 📋 Overtime rate automation
- 📋 Time pattern validation
- 📋 AWR monitoring

---

## Phase 3: Compliance & Self-Service (Quarters 5-6) 📋

### Compliance Management - Enhanced
- ✅ Document tracking and monitoring
- ✅ Expiry alerts and notifications
- ✅ Document upload and storage
- 📋 Digital onboarding workflows
- 📋 Automated contract pack generation
- 📋 Compliance enforcement rules
- 📋 Statutory reporting support

### Self-Service Portals
- 📋 Branded worker portal
- 📋 Branded client portal
- 📋 Real-time timesheet visibility
- 📋 Invoice and payment status
- 📋 Paperless document access
- 📋 Mobile-responsive design

### Advanced Payroll Processing
- 📋 CIS processing
- 📋 Agency staff payroll
- 📋 Multiple employment models
- 📋 International payroll preparation
- 📋 Holiday pay automation

---

## Phase 4: Analytics & Integrations (Quarters 7-8) 📋

### Advanced Reporting & Analytics
- ✅ Real-time gross margin reporting
- ✅ Forecasting and predictive analytics
- ✅ Missing timesheet reports
- ✅ Custom report builder
- 📋 Client-level performance dashboards
- 📋 Placement-level profitability

### System Integrations
- 📋 ATS (Applicant Tracking System) integration
- 📋 CRM platform integration
- 📋 Accounting system integration (Xero, QuickBooks, Sage)
- 📋 RESTful API for third-party integrations
- 📋 Webhook support for real-time updates

### Global & Multi-Currency - Advanced
- ✅ Multi-currency billing (expanded)
- 📋 International sales tax handling
- 📋 Withholding tax automation
- 📋 Cross-border margin calculation

---

## Phase 5: Enterprise & Scale (Quarters 9-10) 📋

### Multi-Tenancy - Advanced
- 📋 Franchise management capabilities
- 📋 Agency group consolidation
- 📋 Cross-entity reporting
- 📋 Delegated administration controls

### Configuration & Customisation
- 📋 Custom system labels
- 📋 Agency-defined security roles
- ✅ Editable email templates
- 📋 White-label capabilities
- 📋 Custom workflow builders

### Performance & Scale
- 📋 High-volume processing optimization
- 📋 Batch processing improvements
- 📋 Performance monitoring dashboards
- 📋 Load balancing and scaling

---

## Phase 6: Innovation & AI (Quarters 11-12) 📋

### Intelligent Automation
- 📋 AI-powered timesheet anomaly detection
- 📋 Predictive compliance alerts
- 📋 Smart invoice matching
- 📋 Automated expense categorization
- 📋 Machine learning for margin optimization

### Advanced Analytics
- 📋 Business intelligence dashboards
- 📋 Trend analysis and insights
- 📋 Benchmarking and KPI tracking
- 📋 Predictive workforce planning

### Mobile Excellence
- 📋 Native mobile apps (iOS/Android)
- 📋 Offline capability
- 📋 Biometric authentication
- 📋 Push notifications
- 📋 Geolocation-based features

---

## Legend
- ✅ **Completed** - Feature is implemented and live
- 🔄 **In Progress** - Currently under development
- 📋 **Planned** - Scheduled for future development

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
- 30% reduction in administrative overhead`

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-success/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle size={18} className="text-success" weight="fill" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">Phase 1-2 + Features</div>
            <p className="text-sm text-muted-foreground mt-1">Core platform with advanced features</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <ClockCounterClockwise size={18} className="text-warning" weight="fill" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">Phase 2</div>
            <p className="text-sm text-muted-foreground mt-1">Advanced Operations & Automation</p>
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
            <p className="text-sm text-muted-foreground mt-1">2 years timeline</p>
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
