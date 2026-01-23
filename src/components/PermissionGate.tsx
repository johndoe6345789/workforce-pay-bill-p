import { ReactNode } from 'react'
import { usePermissions } from '@/hooks/use-permissions'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ShieldSlash } from '@phosphor-icons/react'

interface PermissionGateProps {
  permission?: string
  permissions?: string[]
  requireAll?: boolean
  fallback?: ReactNode
  children: ReactNode
}

export function PermissionGate({
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  children
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  const hasAccess = (() => {
    if (permission) {
      return hasPermission(permission)
    }
    if (permissions.length > 0) {
      return requireAll 
        ? hasAllPermissions(permissions)
        : hasAnyPermission(permissions)
    }
    return true
  })()

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>
    }
    return (
      <Alert variant="destructive">
        <ShieldSlash className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to access this content
        </AlertDescription>
      </Alert>
    )
  }

  return <>{children}</>
}
