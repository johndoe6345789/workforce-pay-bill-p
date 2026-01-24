# Parallel Approval Workflows

## Overview

The parallel approval feature enables concurrent reviews where multiple approvers can evaluate items simultaneously rather than sequentially. This dramatically reduces approval cycle times for time-sensitive operations.

## Key Features

### 1. **Concurrent Reviews**
- Multiple approvers can review the same item at the same time
- No waiting for sequential approval chains
- Ideal for cross-functional reviews (e.g., Finance + Operations + Compliance)

### 2. **Flexible Approval Modes**

#### All Approvers Mode
- **Requires:** All assigned approvers must approve
- **Use Case:** High-stakes decisions requiring unanimous consent
- **Example:** Major contract approvals, large invoices

#### Any Approver Mode
- **Requires:** At least one approver must approve
- **Use Case:** Quick approvals where any expert can validate
- **Example:** Routine expense reports, standard timesheets

#### Majority Mode
- **Requires:** More than half of approvers must approve
- **Use Case:** Balanced decision-making with consensus
- **Example:** Policy changes, hiring decisions

### 3. **Required vs Optional Approvers**
- Mark specific approvers as **Required** - their approval is mandatory
- Optional approvers contribute to the approval mode calculation
- Example: Finance Manager (Required) + 2 Operations Managers (Optional, Majority mode)

### 4. **Real-Time Progress Tracking**
- Live visibility into approval status
- See who has approved/rejected/pending
- Progress bars and metrics
- Individual approver comments

## Implementation

### Data Structure

```typescript
interface ApprovalStep {
  isParallel: boolean
  parallelApprovalMode: 'all' | 'any' | 'majority'
  parallelApprovals: ParallelApproval[]
}

interface ParallelApproval {
  approverId: string
  approverName: string
  approverRole: string
  status: 'pending' | 'approved' | 'rejected'
  isRequired: boolean
  comments?: string
}
```

### Creating a Parallel Approval Step

1. Navigate to **Settings → Workflow Templates**
2. Create or edit a template
3. Edit an approval step
4. Toggle "Enable Parallel Approvals"
5. Select approval mode (All/Any/Majority)
6. Add approvers with their roles and mark required ones
7. Save the template

### Using the Parallel Approval Demo

1. Go to **Settings → Parallel Approvals** in the navigation
2. Create a test workflow using a template with parallel steps
3. Simulate different approvers using the user selector
4. Test approval/rejection flows
5. Observe real-time progress updates

## Business Benefits

### Time Savings
- **Sequential:** 3 approvers × 24 hours = 72 hours
- **Parallel:** All 3 approvers at once = 24 hours
- **Reduction:** 67% faster approval cycle

### Risk Management
- Required approvers ensure critical reviews happen
- Majority mode balances speed with consensus
- Full audit trail of all decisions

### Flexibility
- Different modes for different risk levels
- Mix required and optional approvers
- Adapt workflows to organizational needs

## Technical Details

### Approval Logic

**All Mode:**
```
approved = requiredApprovals.all(approved) && allApprovals.all(approved)
```

**Any Mode:**
```
approved = requiredApprovals.all(approved) && allApprovals.any(approved)
```

**Majority Mode:**
```
approved = requiredApprovals.all(approved) && (approvedCount > totalCount / 2)
```

### State Management
- Workflows stored in IndexedDB via `useApprovalWorkflow` hook
- Templates managed via `useApprovalWorkflowTemplates` hook
- Real-time updates through functional state updates

### Components

- **ParallelApprovalStepEditor**: Configure parallel steps in templates
- **ParallelApprovalStepView**: Display and interact with parallel approvals
- **ParallelApprovalDemo**: Test and demonstrate the feature
- **WorkflowTemplateEditor**: Integrated parallel step configuration

## Use Cases

### 1. Invoice Approvals
- **Mode:** All
- **Approvers:** Finance Manager (Required), Department Head (Required)
- **Benefit:** Dual authorization on spend

### 2. Timesheet Approvals
- **Mode:** Any
- **Approvers:** Team Lead, Project Manager, Operations Manager
- **Benefit:** Any manager can approve to prevent delays

### 3. Payroll Processing
- **Mode:** Majority
- **Approvers:** Payroll Manager (Required), Finance Manager, HR Manager
- **Benefit:** Consensus on payroll runs with expert override

### 4. Compliance Documents
- **Mode:** All
- **Approvers:** Compliance Officer (Required), Legal (Required), Department Head
- **Benefit:** Full regulatory and legal review

## Future Enhancements

- Email notifications to pending approvers
- Escalation after timeout periods
- Mobile app integration
- Approval delegation
- Conditional routing based on approval outcomes
