import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Clock, Warning } from '@phosphor-icons/react'

interface SessionExpiryDialogProps {
  open: boolean
  timeRemaining: number
  totalWarningTime: number
  onExtend: () => void
  onLogout: () => void
}

export function SessionExpiryDialog({
  open,
  timeRemaining,
  totalWarningTime,
  onExtend,
  onLogout,
}: SessionExpiryDialogProps) {
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const progressPercentage = (timeRemaining / totalWarningTime) * 100

  const formatTime = () => {
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return `${seconds} seconds`
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <Warning size={24} weight="fill" aria-hidden="true" />
            </div>
            <AlertDialogTitle className="text-xl">Session Expiring Soon</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Your session will automatically expire due to inactivity. You will be logged out in:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center gap-2 text-4xl font-mono font-semibold text-foreground">
            <Clock size={40} weight="bold" className="text-warning" aria-hidden="true" />
            <span role="timer" aria-live="polite" aria-atomic="true">
              {formatTime()}
            </span>
          </div>

          <Progress 
            value={progressPercentage} 
            className="h-2"
            aria-label={`Time remaining: ${formatTime()}`}
          />

          <Alert className="bg-muted border-border">
            <AlertDescription className="text-sm">
              Click <strong>Stay Logged In</strong> to continue your session, or{' '}
              <strong>Log Out</strong> to end your session now.
            </AlertDescription>
          </Alert>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLogout} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            Log Out
          </AlertDialogCancel>
          <AlertDialogAction onClick={onExtend} autoFocus>
            Stay Logged In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
