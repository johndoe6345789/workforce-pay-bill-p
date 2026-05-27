import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CheckCircle, XCircle, Warning, MapTrifold, Play, X } from '@phosphor-icons/react'
import type { ValidationResult } from '@/hooks/useBatchImport'

interface Props {
  result: ValidationResult
  showMapping: boolean
  isImporting: boolean
  onConfigureMapping: () => void
  onImport: () => void
  onReset: () => void
}

export function ValidationResultsCard({ result, showMapping, isImporting, onConfigureMapping, onImport, onReset }: Props) {
  return (
    <Card className={result.valid ? 'border-success' : 'border-destructive'}>
      <CardContent className="pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold flex items-center gap-2">
            {result.valid ? (
              <><CheckCircle size={18} className="text-success" weight="fill" />Validation Passed</>
            ) : (
              <><XCircle size={18} className="text-destructive" weight="fill" />Validation Failed</>
            )}
          </h4>
          <Badge variant={result.valid ? 'success' : 'destructive'}>{result.rowCount} rows</Badge>
        </div>

        {result.errors.length > 0 && (
          <div>
            <p className="text-sm font-medium text-destructive mb-2">Errors:</p>
            <ScrollArea className="max-h-32">
              <ul className="text-sm space-y-1">
                {result.errors.map((error, i) => (
                  <li key={i} className="flex items-start gap-2 text-destructive">
                    <XCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
        )}

        {result.warnings.length > 0 && (
          <div>
            <p className="text-sm font-medium text-warning mb-2">Warnings:</p>
            <ul className="text-sm space-y-1">
              {result.warnings.map((warning, i) => (
                <li key={i} className="flex items-start gap-2 text-warning">
                  <Warning size={14} className="mt-0.5 flex-shrink-0" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.valid && !showMapping && (
          <Button onClick={onConfigureMapping} className="w-full">
            <MapTrifold size={18} className="mr-2" />
            Configure Field Mapping
          </Button>
        )}

        {result.valid && showMapping && (
          <Button
            onClick={onImport}
            disabled={isImporting}
            className="w-full"
            style={{ backgroundColor: 'var(--success)', color: 'var(--success-foreground)' }}
          >
            <Play size={18} className="mr-2" />
            {isImporting ? 'Importing...' : `Import ${result.rowCount} Records`}
          </Button>
        )}

        <Button variant="outline" onClick={onReset} className="w-full">
          <X size={18} className="mr-2" />
          Reset
        </Button>
      </CardContent>
    </Card>
  )
}
