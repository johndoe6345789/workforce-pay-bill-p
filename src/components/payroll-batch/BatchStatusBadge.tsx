import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock } from '@phosphor-icons/react'
import type React from 'react'

interface StatusCfg { label: string; className: string; Icon: React.ElementType | null }

const STATUS_CONFIG: Record<string, StatusCfg> = {
  'draft':            { label: 'Draft',            className: 'bg-muted text-muted-foreground', Icon: null },
  'pending-approval': { label: 'Pending Approval', className: 'bg-warning/10 text-warning-foreground border-warning/30', Icon: Clock },
  'approved':         { label: 'Approved',         className: 'bg-success/10 text-success-foreground border-success/30', Icon: CheckCircle },
  'rejected':         { label: 'Rejected',         className: 'bg-destructive/10 text-destructive-foreground border-destructive/30', Icon: XCircle },
  'processing':       { label: 'Processing',       className: 'bg-accent/10 text-accent-foreground border-accent/30', Icon: Clock },
  'completed':        { label: 'Completed',        className: 'bg-success/10 text-success-foreground border-success/30', Icon: CheckCircle },
}

export function BatchStatusBadge({ status }: { status: string }) {
  const { label, className, Icon } = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <Badge className={className}>
      {Icon && <Icon className="mr-1" size={14} />}
      {label}
    </Badge>
  )
}
