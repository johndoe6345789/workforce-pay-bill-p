import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { CheckCircle, Upload, Download, Info, Warning } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { PAYEStatusBadge, PAYETypeBadge } from './PAYEStatusBadges'
import type { PAYESubmission, FPSEmployee } from '@/hooks/use-paye-integration'

interface Props {
  submission: PAYESubmission
  fps?: FPSEmployee
  isValidating: boolean
  isSubmitting: boolean
  onValidate: (s: PAYESubmission) => void
  onSubmit: (s: PAYESubmission) => void
  onDownload: (s: PAYESubmission) => void
  onViewDetails: (s: PAYESubmission) => void
}

export function PAYEPendingCard({ submission, fps, isValidating, isSubmitting, onValidate, onSubmit, onDownload, onViewDetails }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <Stack spacing={2}>
            <div className="flex items-center gap-2">
              <PAYETypeBadge type={submission.type} />
              <PAYEStatusBadge status={submission.status} />
            </div>
            <CardTitle className="text-base">{submission.type} - {submission.taxYear} Month {submission.taxMonth}</CardTitle>
            <div className="text-sm text-muted-foreground">Created {format(new Date(submission.createdDate), 'PPp')}</div>
          </Stack>
          <Button size="sm" variant="ghost" onClick={() => onViewDetails(submission)}><Info size={16} /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <Grid cols={4} gap={4} className="mb-4">
          {[
            { label: 'Employees', value: submission.employeesCount },
            { label: 'Total Payment', value: `£${submission.totalPayment.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` },
            { label: 'Total Tax', value: `£${submission.totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` },
            { label: 'Total NI', value: `£${submission.totalNI.toLocaleString('en-GB', { minimumFractionDigits: 2 })}` },
          ].map(({ label, value }) => (
            <Stack key={label} spacing={1}>
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-lg font-semibold">{value}</div>
            </Stack>
          ))}
        </Grid>

        {submission.errors && submission.errors.length > 0 && (
          <Alert variant="destructive" className="mb-4">
            <Warning size={16} />
            <AlertDescription>{submission.errors.length} validation error(s) found</AlertDescription>
          </Alert>
        )}
        {submission.warnings && submission.warnings.length > 0 && (
          <Alert className="mb-4 border-warning bg-warning/10">
            <Info size={16} className="text-warning-foreground" />
            <AlertDescription>{submission.warnings.length} warning(s) found</AlertDescription>
          </Alert>
        )}

        {fps && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Employer Reference</div>
            <div className="text-sm font-mono">{fps.employerRef}</div>
            <div className="text-xs text-muted-foreground mt-2 mb-1">Payment Date</div>
            <div className="text-sm">{format(new Date(fps.paymentDate), 'PPP')}</div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onValidate(submission)} disabled={isValidating}>
            <CheckCircle size={16} />Validate
          </Button>
          <Button size="sm" onClick={() => onSubmit(submission)} disabled={isSubmitting || submission.status !== 'ready'}>
            <Upload size={16} />Submit to HMRC
          </Button>
          <Button size="sm" variant="outline" onClick={() => onDownload(submission)}>
            <Download size={16} />Download Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
