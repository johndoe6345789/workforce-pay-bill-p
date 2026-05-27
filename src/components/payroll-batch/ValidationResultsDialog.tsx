import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Stack } from '@/components/ui/stack'
import { XCircle, Warning } from '@phosphor-icons/react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentBatch: any
}

export function ValidationResultsDialog({ open, onOpenChange, currentBatch }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Warning className="text-warning" />Validation Results</DialogTitle>
          <DialogDescription>Review validation issues before proceeding</DialogDescription>
        </DialogHeader>
        {currentBatch?.validation && (
          <Stack spacing={3}>
            {currentBatch.validation.errors?.map((error: any, index: number) => (
              <Card key={index} className="border-destructive/50">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <XCircle className="text-destructive flex-shrink-0" />
                    <div><div className="font-medium">{error.worker}</div><div className="text-sm text-muted-foreground">{error.message}</div></div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {currentBatch.validation.warnings?.map((warning: any, index: number) => (
              <Card key={index} className="border-warning/50">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <Warning className="text-warning flex-shrink-0" />
                    <div><div className="font-medium">{warning.worker}</div><div className="text-sm text-muted-foreground">{warning.message}</div></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
