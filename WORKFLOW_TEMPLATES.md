# Approval Workflow Templates

## Overview

The Approval Workflow Templates system provides a flexible, configurable framework for managing multi-step approval processes across different batch types in WorkForce Pro. This system allows administrators to define, customize, and manage approval workflows that can be applied to payroll batches, invoices, timesheets, expenses, compliance documents, and purchase orders.

## Key Features

### 1. Template Management
- **Create Templates**: Define reusable approval workflows for different batch types
- **Edit Templates**: Modify existing templates including steps, approvers, and rules
- **Duplicate Templates**: Clone templates to create variations quickly
- **Delete Templates**: Remove unused or obsolete templates
- **Active/Inactive Status**: Enable or disable templates without deletion
- **Default Templates**: Set default workflows for each batch type

### 2. Multi-Step Approval Workflows
Each template can contain multiple approval steps executed sequentially:
- **Step Order**: Define the sequence of approval steps
- **Approver Roles**: Assign specific roles responsible for each step
- **Step Descriptions**: Add context and instructions for approvers
- **Required Comments**: Force approvers to provide justification
- **Skippable Steps**: Allow conditional bypassing of steps

### 3. Escalation Rules
Prevent bottlenecks with automatic escalation:
- **Time-Based Escalation**: Escalate to senior roles after specified hours
- **Escalation Targets**: Define which role receives escalated approvals
- **Original Approver Notification**: Keep initial approvers informed
- **Multiple Escalation Tiers**: Chain escalations for critical processes

### 4. Conditional Logic
Smart workflows that adapt to batch characteristics:
- **Skip Conditions**: Automatically skip steps based on field values
- **Auto-Approval Conditions**: Approve steps automatically when criteria are met
- **Field Operators**: Support for equals, greater than, less than, contains, not equals
- **Compound Logic**: Combine conditions with AND/OR operators

### 5. Batch Type Support
Preconfigured templates for six core batch types:
- **Payroll**: Multi-step approval with finance oversight
- **Invoice**: Single or multi-tier approval based on amount
- **Timesheet**: Quick approval with optional manager review
- **Expense**: Two-step approval with finance authorization
- **Compliance**: Rigorous approval with legal review
- **Purchase Order**: Budget and finance approval workflows

## Architecture

### Data Models

#### WorkflowTemplate
```typescript
interface WorkflowTemplate {
  id: string
  name: string
  description: string
  batchType: 'payroll' | 'invoice' | 'timesheet' | 'expense' | 'compliance' | 'purchase-order'
  isActive: boolean
  isDefault: boolean
  steps: ApprovalStepTemplate[]
  createdAt: string
  updatedAt: string
  createdBy?: string
  metadata?: {
    color?: string
    icon?: string
    tags?: string[]
  }
}
```

#### ApprovalStepTemplate
```typescript
interface ApprovalStepTemplate {
  id: string
  order: number
  name: string
  description?: string
  approverRole: string
  requiresComments: boolean
  canSkip: boolean
  skipConditions?: StepCondition[]
  autoApprovalConditions?: StepCondition[]
  escalationRules?: EscalationRule[]
}
```

#### EscalationRule
```typescript
interface EscalationRule {
  id: string
  hoursUntilEscalation: number
  escalateTo: string
  notifyOriginalApprover: boolean
}
```

#### StepCondition
```typescript
interface StepCondition {
  id: string
  field: string
  operator: 'equals' | 'greaterThan' | 'lessThan' | 'contains' | 'notEquals'
  value: string | number
  logic?: 'AND' | 'OR'
}
```

### Storage
- **IndexedDB**: All workflow templates are persisted in the browser's IndexedDB
- **useIndexedDBState Hook**: Provides reactive state management with automatic persistence
- **No Server Dependencies**: Fully client-side with instant updates

### Components

#### ApprovalWorkflowTemplateManager
Main management interface with:
- Template list view with filtering by batch type
- Create, edit, duplicate, and delete operations
- Active/inactive status indicators
- Default template badges

#### WorkflowTemplateCard
Displays template summary:
- Template name and description
- Batch type badge with color coding
- Status indicators (active/inactive, default)
- Step count and overview
- Action buttons (edit, duplicate, delete)
- Escalation rule indicators

#### WorkflowTemplateEditor
Comprehensive editing interface:
- **Template Details Section**:
  - Name and description
  - Batch type selection
  - Active/inactive toggle
  - Set as default option
- **Steps Section**:
  - Add, remove, reorder steps
  - Step-by-step configuration
  - Expand/collapse individual steps
  - Visual step numbering
- **Step Configuration**:
  - Step name and description
  - Approver role selection
  - Requires comments toggle
  - Can skip toggle
  - Escalation rules management
- **Escalation Rules**:
  - Hours until escalation
  - Escalation target role
  - Original approver notification

### Hooks

#### useApprovalWorkflowTemplates
Primary hook for template management:
- `createTemplate()`: Create new template
- `updateTemplate()`: Update existing template
- `deleteTemplate()`: Remove template
- `duplicateTemplate()`: Clone template
- `addStep()`: Add approval step
- `updateStep()`: Modify step configuration
- `removeStep()`: Delete step
- `reorderSteps()`: Change step sequence
- `setDefaultTemplate()`: Set default for batch type
- `getTemplatesByBatchType()`: Filter templates
- `getDefaultTemplate()`: Get default for batch type
- `getActiveTemplates()`: Get all active templates

#### useSampleWorkflowTemplates
Initializes sample templates on first load:
- Standard Payroll Approval (2-step with escalation)
- Client Invoice Approval (1-step standard)
- Large Invoice Approval (3-step for high values)
- Timesheet Batch Approval (1-step with skip conditions)
- Expense Claim Approval (2-step with conditional skip)
- Compliance Document Approval (2-step rigorous)
- Purchase Order Approval (2-step with escalation)

## Usage Examples

### Creating a New Template
```typescript
const { createTemplate, updateTemplate } = useApprovalWorkflowTemplates()

const template = createTemplate(
  'High-Value Invoice Workflow',
  'invoice',
  'Special approval process for invoices over $50,000'
)

updateTemplate(template.id, {
  isActive: true,
  isDefault: false,
  steps: [
    {
      id: 'step-1',
      order: 0,
      name: 'Billing Manager Review',
      approverRole: 'Manager',
      requiresComments: true,
      canSkip: false
    },
    {
      id: 'step-2',
      order: 1,
      name: 'CFO Approval',
      approverRole: 'CFO',
      requiresComments: true,
      canSkip: false,
      escalationRules: [{
        id: 'esc-1',
        hoursUntilEscalation: 24,
        escalateTo: 'CEO',
        notifyOriginalApprover: true
      }]
    }
  ]
})
```

### Adding Conditional Logic
```typescript
const { updateStep } = useApprovalWorkflowTemplates()

updateStep(templateId, stepId, {
  canSkip: true,
  skipConditions: [
    {
      id: 'cond-1',
      field: 'totalAmount',
      operator: 'lessThan',
      value: 10000
    }
  ]
})
```

### Setting Default Template
```typescript
const { setDefaultTemplate } = useApprovalWorkflowTemplates()

setDefaultTemplate(templateId, 'payroll')
```

## User Interface

### Navigation
Access via: **Configuration → Workflow Templates**

### Template List View
- Filter dropdown for batch type selection
- Card-based layout showing:
  - Template name with badges (default, active/inactive)
  - Batch type with color coding
  - Description
  - Step count and summary
  - Creation and update dates
  - Action buttons

### Template Editor
- Modal dialog with scrollable content
- Two main sections: Template Details and Approval Steps
- Visual step ordering with up/down arrows
- Expandable step details
- Inline escalation rule management
- Save/Cancel actions

### Color Coding
- **Payroll**: Blue accent
- **Invoice**: Info blue
- **Timesheet**: Success green
- **Expense**: Warning amber
- **Compliance**: Destructive red
- **Purchase Order**: Primary purple

## Best Practices

### Template Design
1. **Keep It Simple**: Start with minimal steps, add complexity only when needed
2. **Clear Naming**: Use descriptive names that indicate purpose
3. **Document Steps**: Add descriptions to guide approvers
4. **Set Escalations**: Prevent bottlenecks with time-based escalation
5. **Test Thoroughly**: Validate workflows before setting as default

### Step Configuration
1. **Logical Order**: Arrange steps from least to most senior authority
2. **Required Comments**: Use for rejection scenarios and high-value approvals
3. **Skip Wisely**: Only allow skipping for low-risk, routine approvals
4. **Role Alignment**: Ensure approver roles match organizational structure

### Escalation Rules
1. **Reasonable Timeframes**: Set escalation times based on typical response times
2. **Clear Hierarchy**: Escalate to next level of authority
3. **Keep Informed**: Enable notifications to maintain visibility
4. **Multiple Tiers**: Consider multi-level escalation for critical processes

## Integration

### With Payroll Batch Processing
The `usePayrollBatch` hook integrates workflow templates:
```typescript
const batch = createBatch(periodStart, periodEnd, workers)
applyWorkflowTemplate(batch.id, templateId)
```

### With Other Batch Types
Future integration planned for:
- Invoice generation workflows
- Timesheet batch approval
- Expense claim processing
- Compliance document submission
- Purchase order approval

## Future Enhancements

### Planned Features
- **Parallel Approval**: Multiple approvers at same step
- **Delegation**: Temporary approver substitution
- **Approval History**: Detailed audit trail
- **Custom Fields**: Dynamic field validation in conditions
- **Email Integration**: Direct approval from email
- **Mobile Approval**: Native mobile app integration
- **Analytics**: Workflow performance metrics
- **Version Control**: Template versioning and rollback
- **Import/Export**: Share templates between instances
- **API Access**: Programmatic template management

### Advanced Conditional Logic
- **Complex Expressions**: JavaScript-based conditions
- **Data Lookups**: Reference external data sources
- **Time-Based Rules**: Approval requirements based on date/time
- **User Attributes**: Conditions based on submitter characteristics

### Enhanced Notifications
- **SMS Alerts**: Critical approval reminders
- **Slack Integration**: Team channel notifications
- **Custom Webhooks**: Integration with external systems
- **Digest Emails**: Grouped pending approvals

## Troubleshooting

### Common Issues

**Templates Not Appearing**
- Check browser IndexedDB is enabled
- Clear cache and reload application
- Verify template is set to active

**Steps Not Reordering**
- Click and hold drag handle
- Use up/down arrows as alternative
- Refresh page if drag-drop fails

**Escalation Not Triggering**
- Verify hours until escalation is reasonable
- Check escalation target role exists
- Ensure approver has not taken action

**Cannot Delete Template**
- Check template is not set as default
- Verify no active batches use template
- Temporarily deactivate before deletion

## Support

For issues or questions about approval workflow templates:
1. Check this documentation
2. Review sample templates for examples
3. Contact system administrator
4. Submit support ticket through platform

## Version History

### v1.0.0 (Current)
- Initial release
- Six batch type support
- Multi-step approval workflows
- Escalation rules
- Conditional skip logic
- Template management UI
- Sample templates included
- IndexedDB persistence
