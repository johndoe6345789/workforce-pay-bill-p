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
import { useTranslation } from '@/hooks/use-translation'

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
  const { t } = useTranslation()
  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60
  const progressPercentage = (timeRemaining / totalWarningTime) * 100

  const formatTime = () => {
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return t('sessionExpiry.seconds', { seconds })
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-warning/10 text-warning">
              <Warning size={24} weight="fill" aria-hidden="true" />
            </div>
            <AlertDialogTitle className="text-xl">{t('sessionExpiry.title')}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            {t('sessionExpiry.description')}
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
            aria-label={`${t('sessionExpiry.timeRemainingLabel')} ${formatTime()}`}
          />

          <Alert className="bg-muted border-border">
            <AlertDescription 
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: t('sessionExpiry.instructionFull') }}
            />
          </Alert>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLogout} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
            {t('sessionExpiry.logOut')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onExtend} autoFocus>
            {t('sessionExpiry.stayLoggedIn')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
