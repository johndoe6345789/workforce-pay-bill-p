import { CheckCircle, Warning, XCircle, ClockCounterClockwise } from '@phosphor-icons/react'
import type React from 'react'
import type { PayrollRun } from '@/lib/types'

export const STATUS_CONFIG: Record<string, {
  Icon: React.ElementType; color: string; bgColor: string; label: string
}> = {
  scheduled:  { Icon: ClockCounterClockwise, color: 'text-info',        bgColor: 'bg-info/10',        label: 'Scheduled' },
  processing: { Icon: ClockCounterClockwise, color: 'text-warning',     bgColor: 'bg-warning/10',     label: 'Processing' },
  completed:  { Icon: CheckCircle,           color: 'text-success',     bgColor: 'bg-success/10',     label: 'Completed' },
  failed:     { Icon: XCircle,               color: 'text-destructive',  bgColor: 'bg-destructive/10', label: 'Failed' },
}

export const BADGE_VARIANT: Record<string, 'success' | 'destructive' | 'outline'> = {
  completed: 'success',
  failed:    'destructive',
}

export const STATUS_ALERTS: Record<string, {
  Icon: React.ElementType; iconClass: string; borderClass: string; bgClass: string
  title: string; titleClass: string; message: (r: PayrollRun) => string
}> = {
  failed: {
    Icon: Warning, iconClass: 'text-destructive', borderClass: 'border-destructive/20', bgClass: 'bg-destructive/10',
    title: 'Payroll Processing Failed', titleClass: 'text-destructive',
    message: () => 'This payroll run encountered errors during processing. Please review the details and retry.',
  },
  completed: {
    Icon: CheckCircle, iconClass: 'text-success', borderClass: 'border-success/20', bgClass: 'bg-success/10',
    title: 'Payroll Successfully Processed', titleClass: 'text-success',
    message: r => `All ${r.workersCount} workers have been paid for the period ending ${new Date(r.periodEnding).toLocaleDateString()}.`,
  },
}
