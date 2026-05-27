import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { ComplianceDocument } from '@/lib/types'

interface Props {
  document: ComplianceDocument
  badgeVariant: 'success' | 'warning' | 'destructive'
}

export function ComplianceDocumentDetails({ document, badgeVariant }: Props) {
  const days = document.daysUntilExpiry
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm">Document Details</h4>
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-muted-foreground">Document ID</p><p className="font-mono">{document.id}</p></div>
          <div><p className="text-muted-foreground">Worker ID</p><p className="font-mono">{document.workerId}</p></div>
          <div><p className="text-muted-foreground">Worker Name</p><p className="font-medium">{document.workerName}</p></div>
          <div><p className="text-muted-foreground">Type</p><p className="font-medium">{document.documentType}</p></div>
          <div><p className="text-muted-foreground">Expiry Date</p><p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p></div>
          <div><p className="text-muted-foreground">Status</p><Badge variant={badgeVariant}>{document.status}</Badge></div>
          <div>
            <p className="text-muted-foreground">Days Remaining</p>
            <p className={cn('font-mono font-semibold', days < 0 ? 'text-destructive' : days < 30 ? 'text-warning' : 'text-success')}>
              {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
