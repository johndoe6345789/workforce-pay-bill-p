import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ImportProgress } from '@/hooks/useBatchImport'

interface Props {
  progress: ImportProgress
}

export function ImportProgressCard({ progress }: Props) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Import Progress</span>
          <span className="text-sm text-muted-foreground">{progress.processed} / {progress.total}</span>
        </div>
        <Progress value={(progress.processed / progress.total) * 100} />
        <div className="flex gap-4 text-sm">
          <span className="text-success">✓ {progress.succeeded} succeeded</span>
          {progress.failed > 0 && <span className="text-destructive">✗ {progress.failed} failed</span>}
        </div>
        {progress.errors.length > 0 && (
          <div>
            <p className="text-sm font-medium text-destructive mb-2">Import Errors:</p>
            <ScrollArea className="max-h-32">
              <ul className="text-xs space-y-1">
                {progress.errors.map((error, i) => (
                  <li key={i} className="text-destructive">Row {error.row}: {error.error}</li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
