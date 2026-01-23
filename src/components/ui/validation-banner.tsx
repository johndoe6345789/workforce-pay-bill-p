import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, X, Info, Warning } from '@phosphor-icons/react'

export interface ValidationRule {
  id: string
  label: string
  validate: (value: any) => boolean
  message?: string
}

export interface ValidationIndicatorProps {
  rules: ValidationRule[]
  value: any
  showOnlyFailed?: boolean
  className?: string
}

export function ValidationIndicator({
  rules,
  value,
  showOnlyFailed = false,
  className
}: ValidationIndicatorProps) {
  const results = React.useMemo(() => {
    return rules.map(rule => ({
      ...rule,
      passed: rule.validate(value)
    }))
  }, [rules, value])

  const displayedRules = showOnlyFailed 
    ? results.filter(r => !r.passed)
    : results

  if (displayedRules.length === 0 && showOnlyFailed) {
    return null
  }

  return (
    <div className={cn('space-y-2', className)}>
      {displayedRules.map(result => (
        <div
          key={result.id}
          className={cn(
            'flex items-start gap-2 text-sm',
            result.passed ? 'text-success' : 'text-destructive'
          )}
        >
          {result.passed ? (
            <Check size={16} weight="bold" className="mt-0.5 flex-shrink-0" />
          ) : (
            <X size={16} weight="bold" className="mt-0.5 flex-shrink-0" />
          )}
          <span>{result.message || result.label}</span>
        </div>
      ))}
    </div>
  )
}

export interface BannerProps {
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  children: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

export function Banner({
  variant = 'info',
  title,
  children,
  icon,
  actions,
  dismissible = false,
  onDismiss,
  className
}: BannerProps) {
  const [isDismissed, setIsDismissed] = React.useState(false)

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) return null

  const variantStyles = {
    info: 'bg-info/10 border-info/20 text-info-foreground',
    success: 'bg-success/10 border-success/20 text-success-foreground',
    warning: 'bg-warning/10 border-warning/20 text-warning-foreground',
    error: 'bg-destructive/10 border-destructive/20 text-destructive-foreground'
  }

  const defaultIcons = {
    info: <Info size={20} weight="fill" />,
    success: <Check size={20} weight="bold" />,
    warning: <Warning size={20} weight="fill" />,
    error: <X size={20} weight="bold" />
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex-shrink-0">
        {icon || defaultIcons[variant]}
      </div>

      <div className="flex-1 space-y-1">
        {title && (
          <h4 className="font-semibold text-sm">{title}</h4>
        )}
        <div className="text-sm">{children}</div>
      </div>

      {(actions || dismissible) && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="text-current hover:opacity-70 transition-opacity"
              aria-label="Dismiss"
            >
              <X size={16} weight="bold" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
