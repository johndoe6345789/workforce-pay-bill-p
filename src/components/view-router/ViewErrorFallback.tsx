import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { ArrowCounterClockwise, Warning } from '@phosphor-icons/react'

interface Props { error: Error; resetErrorBoundary: () => void }

export function ViewErrorFallback({ error, resetErrorBoundary }: Props) {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px] p-6">
      <div className="max-w-md w-full">
        <Alert variant="destructive" className="mb-4">
          <Warning size={20} />
          <AlertTitle>View Load Error</AlertTitle>
          <AlertDescription>Failed to load this view. This might be due to a temporary issue.</AlertDescription>
        </Alert>
        <div className="bg-muted/50 p-4 rounded-lg mb-4">
          <p className="text-sm font-mono text-muted-foreground">{error.message}</p>
        </div>
        <Button onClick={resetErrorBoundary} className="w-full">
          <ArrowCounterClockwise size={18} className="mr-2" />Try Again
        </Button>
      </div>
    </div>
  )
}
