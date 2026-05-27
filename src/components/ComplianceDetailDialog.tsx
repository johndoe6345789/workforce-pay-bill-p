import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ShieldCheck, User, FileText, CalendarBlank, Warning, CheckCircle, XCircle, UploadSimple } from '@phosphor-icons/react'
import type { ComplianceDocument } from '@/lib/types'
import { cn } from '@/lib/utils'
import type React from 'react'

interface Props {
  document: ComplianceDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_CONFIG: Record<string, { Icon: React.ElementType; color: string; bgColor: string; message: string; messageColor: string }> = {
  valid:    { Icon: CheckCircle, color: 'text-success',     bgColor: 'bg-success/10',     message: 'This document is valid and the worker is compliant for placement.',                                             messageColor: 'text-success' },
  expiring: { Icon: Warning,     color: 'text-warning',     bgColor: 'bg-warning/10',     message: 'This document is expiring soon. Please ensure it is renewed before expiry to avoid disruption.',              messageColor: 'text-warning' },
  expired:  { Icon: XCircle,     color: 'text-destructive', bgColor: 'bg-destructive/10', message: 'This document has expired. The worker cannot be assigned to shifts until it is renewed.',                     messageColor: 'text-destructive' },
}

const BADGE_VARIANT: Record<string, 'success' | 'warning' | 'destructive'> = {
  valid:    'success',
  expiring: 'warning',
  expired:  'destructive',
}

const DATE_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }

function expiryColor(days: number) {
  return days < 0 ? 'text-destructive' : days < 30 ? 'text-warning' : 'text-success'
}

export function ComplianceDetailDialog({ document, open, onOpenChange }: Props) {
  if (!document) return null

  const cfg = STATUS_CONFIG[document.status] ?? STATUS_CONFIG.expired
  const { Icon, color, bgColor, message, messageColor } = cfg
  const badgeVariant = BADGE_VARIANT[document.status] ?? 'destructive'
  const days = document.daysUntilExpiry

  const DETAIL_ROWS: { label: string; value: React.ReactNode }[] = [
    { label: 'Document ID',  value: <p className="font-mono">{document.id}</p> },
    { label: 'Worker ID',    value: <p className="font-mono">{document.workerId}</p> },
    { label: 'Worker Name',  value: <p className="font-medium">{document.workerName}</p> },
    { label: 'Type',         value: <p className="font-medium">{document.documentType}</p> },
    { label: 'Expiry Date',  value: <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p> },
    { label: 'Status',       value: <Badge variant={badgeVariant}>{document.status}</Badge> },
    { label: 'Days Remaining', value: (
      <p className={cn('font-mono font-semibold', expiryColor(days))}>
        {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days`}
      </p>
    )},
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', bgColor)}>
              <Icon size={24} className={color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Compliance Document</span>
                <Badge variant={badgeVariant}>{document.status}</Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">{document.id}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
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

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Status Information</h4>
              <div className={cn('rounded-lg p-4', bgColor)}>
                <div className="flex items-start gap-3">
                  <Icon size={32} className={color} />
                  <div className="flex-1">
                    <p className="font-semibold mb-1 capitalize">{document.status}</p>
                    <p className={cn('text-sm', messageColor)}>{message}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Document Details</h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {DETAIL_ROWS.map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-muted-foreground">{label}</p>
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Document File</h4>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <ShieldCheck size={32} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">Document stored securely</p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" size="sm"><FileText size={16} className="mr-2" />View Document</Button>
                  <Button variant="outline" size="sm"><UploadSimple size={16} className="mr-2" />Upload New Version</Button>
                </div>
              </div>
            </div>

            {(document.status === 'expiring' || document.status === 'expired') && (
              <>
                <Separator />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline">Send Reminder</Button>
                  <Button><UploadSimple size={18} className="mr-2" />Upload Renewal</Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
