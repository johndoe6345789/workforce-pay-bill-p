# Role-Based Permissions System

## Overview

The WorkForce Pro platform now includes a comprehensive role-based permissions system that controls access to features and data across the application.

## Features

### 1. Predefined Roles

The system includes 11 predefined roles:

- **Super Administrator** - Full system access
- **Administrator** - Full agency operations and configuration
- **Finance Manager** - Billing, invoicing, and financial operations
- **Payroll Manager** - Payroll processing and payment operations
- **Compliance Officer** - Compliance documentation and regulatory requirements
- **Operations Manager** - Day-to-day operations and approvals
- **Recruiter** - Worker relationships and placements
- **Client Manager** - Client relationships and service delivery
- **Client User** - Client portal access for timesheet approval
- **Worker** - Worker portal for timesheet/expense submission
- **Auditor** - Read-only access for audit and compliance review

### 2. Granular Permissions

Permissions are organized by module and action:

**Modules:**
- Timesheets
- Expenses
- Invoices
- Payroll
- Compliance
- Workers
- Clients
- Rates
- Reports
- Users
- Settings

**Actions:**
- `view` - View records
- `view-own` - View only your own records
- `create` - Create new records
- `create-own` - Create your own records
- `edit` - Edit records
- `approve` - Approve submissions
- `delete` - Delete records
- `*` - All actions for a module

**Example Permissions:**
- `timesheets.view` - View all timesheets
- `timesheets.view-own` - View only your own timesheets
- `timesheets.*` - All timesheet actions
- `*` - All permissions (super admin)

### 3. Permission Checking

Use the `usePermissions` hook in your components:

```tsx
import { usePermissions } from '@/hooks/use-permissions'

function MyComponent() {
  const { hasPermission, canAccess } = usePermissions()
  
  // Check single permission
  if (hasPermission('invoices.create')) {
    // Show create invoice button
  }
  
  // Check module access
  if (canAccess('payroll', 'process')) {
    // Show process payroll button
  }
  
  // Check multiple permissions (any)
  if (hasAnyPermission(['timesheets.approve', 'expenses.approve'])) {
    // Show approval interface
  }
  
  // Check multiple permissions (all)
  if (hasAllPermissions(['users.edit', 'settings.edit'])) {
    // Show admin interface
  }
}
```

### 4. Permission Gate Component

Wrap UI elements to show/hide based on permissions:

```tsx
import { PermissionGate } from '@/components/PermissionGate'

<PermissionGate permission="invoices.create">
  <Button>Create Invoice</Button>
</PermissionGate>

<PermissionGate permissions={['timesheets.view', 'expenses.view']} requireAll={false}>
  <ReportsTab />
</PermissionGate>

<PermissionGate 
  permission="admin.access"
  fallback={<div>Access Denied</div>}
>
  <AdminPanel />
</PermissionGate>
```

### 5. Role Management UI

Access the Roles & Permissions view from the Configuration section to:

- View all defined roles
- See permission assignments for each role
- Create custom roles (Admin)
- Edit role permissions (Admin)
- Duplicate roles as templates (Admin)
- View users assigned to each role

## Test Accounts

Use these accounts to test different permission levels:

| Email | Password | Role |
|-------|----------|------|
| admin@workforce.com | admin123 | Administrator |
| finance@workforce.com | finance123 | Finance Manager |
| payroll@workforce.com | payroll123 | Payroll Manager |
| compliance@workforce.com | compliance123 | Compliance Officer |
| operations@workforce.com | operations123 | Operations Manager |
| recruiter@workforce.com | recruiter123 | Recruiter |
| client@workforce.com | client123 | Client Manager |
| auditor@workforce.com | auditor123 | Auditor |
| superadmin@workforce.com | super123 | Super Administrator |
| worker@workforce.com | worker123 | Worker |

## Data Files

### `/src/data/roles-permissions.json`

Defines all roles and permissions in the system. Structure:

```json
{
  "roles": [
    {
      "id": "admin",
      "name": "Administrator",
      "description": "...",
      "color": "primary",
      "permissions": ["timesheets.*", "invoices.*", ...]
    }
  ],
  "permissions": [
    {
      "id": "timesheets.view",
      "module": "timesheets",
      "name": "View Timesheets",
      "description": "..."
    }
  ]
}
```

### `/src/data/logins.json`

Defines test users with their assigned roles:

```json
{
  "users": [
    {
      "id": "user-001",
      "email": "admin@workforce.com",
      "password": "admin123",
      "name": "Sarah Admin",
      "roleId": "admin",
      "role": "Administrator"
    }
  ]
}
```

## Implementation Details

### Redux State

User permissions are stored in the auth slice:

```typescript
interface User {
  id: string
  email: string
  name: string
  role: string
  roleId?: string
  permissions?: string[]
}
```

### Authentication Flow

1. User logs in with email/password
2. System looks up user in `logins.json`
3. System retrieves role permissions from `roles-permissions.json`
4. User object with permissions is stored in Redux
5. Components check permissions using `usePermissions` hook

### Navigation

Navigation items can be filtered based on permissions by wrapping them in PermissionGate components or checking permissions before rendering.

## Future Enhancements

- User assignment to roles (user management)
- Custom permission creation
- Permission inheritance
- Team-based permissions
- Resource-level permissions (e.g., access to specific clients)
- Audit logging of permission changes
- API integration for permission checks
