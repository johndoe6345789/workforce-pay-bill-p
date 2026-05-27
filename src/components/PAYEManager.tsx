import { FileText, CheckCircle } from '@phosphor-icons/react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PAYEPendingCard } from '@/components/paye/PAYEPendingCard'
import { PAYESubmittedCard } from '@/components/paye/PAYESubmittedCard'
import { PAYEValidationDialog } from '@/components/paye/PAYEValidationDialog'
import { PAYEPAYEEmptyState } from '@/components/paye/PAYEPAYEEmptyState'
import { usePAYEManager } from '@/hooks/usePAYEManager'

interface PAYEManagerProps {
  payrollRunId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PAYEManager({ open, onOpenChange }: PAYEManagerProps) {
  const vm = usePAYEManager()

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>PAYE RTI Manager</DialogTitle>
            <DialogDescription>Manage Real Time Information (RTI) submissions to HMRC</DialogDescription>
          </DialogHeader>

          <Tabs value={vm.activeTab} onValueChange={vm.setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">Pending ({vm.pendingSubmissions.length})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({vm.submittedSubmissions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {vm.pendingSubmissions.length === 0 ? (
                <PAYEEmptyState icon={<FileText size={32} className="text-muted-foreground" />} title="No pending submissions" description="Create a new PAYE submission from a completed payroll run to get started" />
              ) : (
                <div className="space-y-4">
                  {vm.pendingSubmissions.map(submission => (
                    <PAYEPendingCard
                      key={submission.id}
                      submission={submission}
                      fps={vm.fpsData.find(f => f.submissionId === submission.id)}
                      isValidating={vm.isValidating}
                      isSubmitting={vm.isSubmitting}
                      onValidate={vm.handleValidate}
                      onSubmit={vm.handleSubmit}
                      onDownload={vm.handleDownloadReport}
                      onViewDetails={vm.setSelectedSubmission}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="submitted" className="mt-6">
              {vm.submittedSubmissions.length === 0 ? (
                <PAYEEmptyState icon={<CheckCircle size={32} className="text-muted-foreground" />} title="No submitted returns" description="Submissions sent to HMRC will appear here" />
              ) : (
                <div className="space-y-4">
                  {vm.submittedSubmissions.map(submission => (
                    <PAYESubmittedCard
                      key={submission.id}
                      submission={submission}
                      onDownload={vm.handleDownloadReport}
                      onViewDetails={vm.setSelectedSubmission}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {vm.showValidation && vm.validationResult && (
        <PAYEValidationDialog
          open={vm.showValidation}
          onOpenChange={vm.setShowValidation}
          result={vm.validationResult}
        />
      )}
    </>
  )
}
