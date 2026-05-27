import { Badge } from '@/components/ui/badge'
import { User, FileText, CalendarBlank, Warning } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import type { ComplianceDocument } from '@/lib/types'

const DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

function expiryColor(days: number) {
  return days < 0 ? 'text-destructive' : days < 30 ? 'text-warning' : 'text-success'
}

interface Props {
  document: ComplianceDocument
  badgeVariant: 'success' | 'warning' | 'destructive'
}

export function ComplianceInfoGrid({ document, badgeVariant }: Props) {
  const days = document.daysUntilExpiry
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><User size={16} /><span>Worker</span></div>
        <p className="font-medium">{document.workerName}</p>
        <p className="text-xs text-muted-foreground">ID: {document.workerId}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><FileText size={16} /><span>Document Type</span></div>
        <Badge variant="outline" className="text-sm">{document.documentType}</Badge>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><CalendarBlank size={16} /><span>Expiry Date</span></div>
        <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString('en-GB', DATE_FORMAT)}</p>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground text-sm"><Warning size={16} /><span>Days Until Expiry</span></div>
        <p className={cn('font-semibold font-mono text-2xl', expiryColor(days))}>
          {days < 0 ? 'Expired' : `${days} days`}
        </p>
      </div>
    </div>
  )
}
