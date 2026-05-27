import { CheckCircle, Warning, XCircle } from '@phosphor-icons/react'
import type React from 'react'

export const STATUS_CONFIG: Record<string, {
  Icon: React.ElementType; color: string; bgColor: string; message: string; messageColor: string
}> = {
  valid:    { Icon: CheckCircle, color: 'text-success',     bgColor: 'bg-success/10',     message: 'This document is valid and the worker is compliant for placement.',                                             messageColor: 'text-success' },
  expiring: { Icon: Warning,     color: 'text-warning',     bgColor: 'bg-warning/10',     message: 'This document is expiring soon. Please ensure it is renewed before expiry to avoid disruption.',              messageColor: 'text-warning' },
  expired:  { Icon: XCircle,     color: 'text-destructive', bgColor: 'bg-destructive/10', message: 'This document has expired. The worker cannot be assigned to shifts until it is renewed.',                     messageColor: 'text-destructive' },
}

export const BADGE_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  valid:    'success',
  expiring: 'warning',
  expired:  'destructive',
}
