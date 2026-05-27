import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle, XCircle, Clock, Upload } from '@phosphor-icons/react'
import type { PAYESubmission } from '@/hooks/use-paye-integration'

const STATUS_CONFIG: Record<PAYESubmission['status'], { variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode; label: string }> = {
  draft: { variant: 'outline', icon: <FileText size={14} />, label: 'Draft' },
  ready: { variant: 'secondary', icon: <CheckCircle size={14} />, label: 'Ready' },
  submitted: { variant: 'default', icon: <Upload size={14} />, label: 'Submitted' },
  accepted: { variant: 'default', icon: <CheckCircle size={14} />, label: 'Accepted' },
  rejected: { variant: 'destructive', icon: <XCircle size={14} />, label: 'Rejected' },
  corrected: { variant: 'secondary', icon: <Clock size={14} />, label: 'Corrected' },
}

const TYPE_COLORS: Record<PAYESubmission['type'], string> = {
  FPS: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300',
  EPS: 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300',
  EAS: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300',
  NVR: 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300',
}

export function PAYEStatusBadge({ status }: { status: PAYESubmission['status'] }) {
  const { variant, icon, label } = STATUS_CONFIG[status]
  return <Badge variant={variant} className="gap-1.5">{icon}{label}</Badge>
}

export function PAYETypeBadge({ type }: { type: PAYESubmission['type'] }) {
  return <Badge variant="outline" className={TYPE_COLORS[type]}>{type}</Badge>
}
