import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { Download, Info } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { PAYEStatusBadge, PAYETypeBadge } from './PAYEStatusBadges'
import type { PAYESubmission } from '@/hooks/use-paye-integration'

interface Props {
  submission: PAYESubmission
  onDownload: (s: PAYESubmission) => void
  onViewDetails: (s: PAYESubmission) => void
}

export function PAYESubmittedCard({ submission, onDownload, onViewDetails }: Props) {
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
            <div className="text-sm text-muted-foreground">
              Submitted {submission.submittedDate && format(new Date(submission.submittedDate), 'PPp')}
            </div>
            {submission.acceptedDate && (
              <div className="text-sm text-success">
                Accepted {format(new Date(submission.acceptedDate), 'PPp')}
              </div>
            )}
          </Stack>
        </div>
      </CardHeader>
      <CardContent>
        {submission.hmrcReference && (
          <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">HMRC Reference</div>
            <div className="text-sm font-mono font-semibold">{submission.hmrcReference}</div>
          </div>
        )}
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
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => onDownload(submission)}>
            <Download size={16} />Download Report
          </Button>
          <Button size="sm" variant="outline" onClick={() => onViewDetails(submission)}>
            <Info size={16} />View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
