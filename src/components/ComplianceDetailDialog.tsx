import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { ShieldCheck, User, FileText, CalendarBlank, Warning, CheckCircle, XCircle, UploadSimple } from '@phosphor-icons/react'
import type { ComplianceDocument } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ComplianceDetailDialogProps {
  document: ComplianceDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComplianceDetailDialog({ document, open, onOpenChange }: ComplianceDetailDialogProps) {
  if (!document) return null

  const statusConfig = {
    valid: { icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/10' },
    expiring: { icon: Warning, color: 'text-warning', bgColor: 'bg-warning/10' },
    expired: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' }
  }

  const StatusIcon = statusConfig[document.status].icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', statusConfig[document.status].bgColor)}>
              <StatusIcon size={24} className={statusConfig[document.status].color} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span>Compliance Document</span>
                <Badge variant={
                  document.status === 'valid' ? 'success' : 
                  document.status === 'expiring' ? 'warning' : 
                  'destructive'
                }>
                  {document.status}
                </Badge>
              </div>
              <p className="text-sm font-normal text-muted-foreground mt-1">
                {document.id}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User size={16} />
                  <span>Worker</span>
                </div>
                <p className="font-medium">{document.workerName}</p>
                <p className="text-xs text-muted-foreground">ID: {document.workerId}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <FileText size={16} />
                  <span>Document Type</span>
                </div>
                <Badge variant="outline" className="text-sm">{document.documentType}</Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <CalendarBlank size={16} />
                  <span>Expiry Date</span>
                </div>
                <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Warning size={16} />
                  <span>Days Until Expiry</span>
                </div>
                <p className={cn(
                  'font-semibold font-mono text-2xl',
                  document.daysUntilExpiry < 0 ? 'text-destructive' : 
                  document.daysUntilExpiry < 30 ? 'text-warning' : 'text-success'
                )}>
                  {document.daysUntilExpiry < 0 ? 'Expired' : `${document.daysUntilExpiry} days`}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Status Information</h4>
              <div className={cn('rounded-lg p-4', statusConfig[document.status].bgColor)}>
                <div className="flex items-start gap-3">
                  <StatusIcon size={32} className={statusConfig[document.status].color} />
                  <div className="flex-1">
                    <p className="font-semibold mb-1 capitalize">{document.status}</p>
                    {document.status === 'expired' && (
                      <p className="text-sm text-destructive">
                        This document has expired. The worker cannot be assigned to shifts until it is renewed.
                      </p>
                    )}
                    {document.status === 'expiring' && (
                      <p className="text-sm text-warning">
                        This document is expiring soon. Please ensure it is renewed before expiry to avoid disruption.
                      </p>
                    )}
                    {document.status === 'valid' && (
                      <p className="text-sm text-success">
                        This document is valid and the worker is compliant for placement.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Document Details</h4>
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Document ID</p>
                    <p className="font-mono">{document.id}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Worker ID</p>
                    <p className="font-mono">{document.workerId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Worker Name</p>
                    <p className="font-medium">{document.workerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{document.documentType}</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{new Date(document.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={
                      document.status === 'valid' ? 'success' : 
                      document.status === 'expiring' ? 'warning' : 
                      'destructive'
                    }>
                      {document.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Days Remaining</p>
                    <p className={cn(
                      'font-mono font-semibold',
                      document.daysUntilExpiry < 0 ? 'text-destructive' : 
                      document.daysUntilExpiry < 30 ? 'text-warning' : 'text-success'
                    )}>
                      {document.daysUntilExpiry < 0 
                        ? `${Math.abs(document.daysUntilExpiry)} days overdue` 
                        : `${document.daysUntilExpiry} days`
                      }
                    </p>
                  </div>
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
                  <Button variant="outline" size="sm">
                    <FileText size={16} className="mr-2" />
                    View Document
                  </Button>
                  <Button variant="outline" size="sm">
                    <UploadSimple size={16} className="mr-2" />
                    Upload New Version
                  </Button>
                </div>
              </div>
            </div>

            {(document.status === 'expiring' || document.status === 'expired') && (
              <>
                <Separator />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline">
                    Send Reminder
                  </Button>
                  <Button>
                    <UploadSimple size={18} className="mr-2" />
                    Upload Renewal
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
