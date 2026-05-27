import { CheckCircle, XCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import type React from 'react'

export const STATUS_CONFIG: Record<string, {
  Icon: React.ElementType; color: string; bgColor: string
}> = {
  pending:  { Icon: ClockCounterClockwise, color: 'text-warning',     bgColor: 'bg-warning/10' },
  approved: { Icon: CheckCircle,           color: 'text-success',     bgColor: 'bg-success/10' },
  rejected: { Icon: XCircle,              color: 'text-destructive',  bgColor: 'bg-destructive/10' },
  paid:     { Icon: CheckCircle,           color: 'text-success',     bgColor: 'bg-success/10' },
}

export const BADGE_VARIANT: Record<string, 'success' | 'destructive' | 'warning'> = {
  approved: 'success', paid: 'success', rejected: 'destructive', pending: 'warning',
}
