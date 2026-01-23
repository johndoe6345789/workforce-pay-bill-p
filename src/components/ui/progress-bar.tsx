import * as React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning' | 'error'
  className?: string
}

const variants = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive'
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  variant = 'default',
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('space-y-1', className)} {...props}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{percentage.toFixed(0)}%</span>
          <span className="text-muted-foreground">
            {value} / {max}
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={cn('h-full rounded-full', variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
