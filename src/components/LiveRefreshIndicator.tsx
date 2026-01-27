import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { ArrowsClockwise } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface LiveRefreshIndicatorProps {
  lastUpdated?: Date
  isRefreshing?: boolean
  pollingInterval?: number
  className?: string
}

export function LiveRefreshIndicator({ 
  lastUpdated, 
  isRefreshing = false,
  pollingInterval = 2000,
  className 
}: LiveRefreshIndicatorProps) {
  const [countdown, setCountdown] = useState(pollingInterval)

  useEffect(() => {
    setCountdown(pollingInterval)
    
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 100) {
          return pollingInterval
        }
        return prev - 100
      })
    }, 100)

    return () => clearInterval(interval)
  }, [pollingInterval, lastUpdated])

  const progress = ((pollingInterval - countdown) / pollingInterval) * 100

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Badge 
        variant="outline" 
        className={cn(
          'font-mono text-xs transition-colors',
          isRefreshing ? 'bg-accent/10 border-accent/30' : 'bg-muted/50'
        )}
      >
        <ArrowsClockwise 
          size={12} 
          className={cn(
            'mr-1.5',
            isRefreshing && 'animate-spin'
          )}
        />
        Live
      </Badge>
      {lastUpdated && (
        <span className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(lastUpdated)}
        </span>
      )}
      <div className="relative w-16 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-accent transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
