import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Warning } from '@phosphor-icons/react'

interface ValidationIssue { code: string; message: string; field?: string }
interface ValidationResult { isValid: boolean; errors: ValidationIssue[]; warnings: ValidationIssue[] }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  result: ValidationResult
}

function IssueList({ items, variant }: { items: ValidationIssue[]; variant: 'error' | 'warning' }) {
  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className={`p-3 rounded-lg ${variant === 'error' ? 'border border-destructive/30 bg-destructive/5' : 'border border-warning/30 bg-warning/5'}`}>
          <div className="font-semibold text-sm">{item.code}</div>
          <div className="text-sm text-muted-foreground">{item.message}</div>
          {item.field && <div className="text-xs text-muted-foreground mt-1">Field: {item.field}</div>}
        </div>
      ))}
    </div>
  )
}

export function PAYEValidationDialog({ open, onOpenChange, result }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Validation Results</DialogTitle>
          <DialogDescription>RTI submission validation report</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {result.isValid ? (
            <Alert className="border-success bg-success/10">
              <CheckCircle size={16} className="text-success" />
              <AlertDescription>All validation checks passed. This submission is ready to send to HMRC.</AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <XCircle size={16} />
              <AlertDescription>Validation failed. Please correct the errors before submitting.</AlertDescription>
            </Alert>
          )}
          {result.errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <XCircle size={16} className="text-destructive" />Errors ({result.errors.length})
                </CardTitle>
              </CardHeader>
              <CardContent><IssueList items={result.errors} variant="error" /></CardContent>
            </Card>
          )}
          {result.warnings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Warning size={16} className="text-warning" />Warnings ({result.warnings.length})
                </CardTitle>
              </CardHeader>
              <CardContent><IssueList items={result.warnings} variant="warning" /></CardContent>
            </Card>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
