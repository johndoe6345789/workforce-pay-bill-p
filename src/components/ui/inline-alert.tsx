import * as React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, WarningCircle, Info, XCircle } from '@phosphor-icons/react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface InlineAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: WarningCircle,
  error: XCircle
}

const variants = {
  info: 'bg-info/10 border-info/30 text-info-foreground',
  success: 'bg-success/10 border-success/30 text-success-foreground',
  warning: 'bg-warning/10 border-warning/30 text-warning-foreground',
  error: 'bg-destructive/10 border-destructive/30 text-destructive-foreground'
}

export function InlineAlert({
  variant = 'info',
  title,
  children,
  className,
  ...props
}: InlineAlertProps) {
  const Icon = icons[variant]

  return (
    <div
      className={cn(
        'flex gap-3 rounded-lg border p-4',
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <div className="font-medium mb-1">{title}</div>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  )
}
