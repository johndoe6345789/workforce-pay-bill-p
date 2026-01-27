import { useState, useMemo } from 'react'
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Download,
  Upload,
  Warning,
  Info,
  Trash
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Stack } from '@/components/ui/stack'
import { Grid } from '@/components/ui/grid'
import { DataTable } from '@/components/ui/data-table'
import { usePAYEIntegration, type PAYESubmission, type FPSEmployee } from '@/hooks/use-paye-integration'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface PAYEManagerProps {
  payrollRunId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PAYEManager({ payrollRunId, open, onOpenChange }: PAYEManagerProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<PAYESubmission | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('pending')

  const {
    submissions,
    fpsData,
    isValidating,
    isSubmitting,
    validateSubmission,
    submitToHMRC,
    generateRTIReport,
    getPendingSubmissions,
    getSubmittedSubmissions
  } = usePAYEIntegration()

  const pendingSubmissions = useMemo(
    () => getPendingSubmissions(),
    [getPendingSubmissions]
  )

  const submittedSubmissions = useMemo(
    () => getSubmittedSubmissions(),
    [getSubmittedSubmissions]
  )

  const handleValidate = async (submission: PAYESubmission) => {
    try {
      const result = await validateSubmission(submission.id)
      setValidationResult(result)
      setShowValidation(true)

      if (result.isValid) {
        toast.success('Validation passed', {
          description: 'RTI submission is ready to send to HMRC'
        })
      } else {
        toast.error('Validation failed', {
          description: `Found ${result.errors.length} error(s)`
        })
      }
    } catch (error) {
      toast.error('Validation error', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const handleSubmit = async (submission: PAYESubmission) => {
    try {
      const result = await submitToHMRC(submission.id)

      if (result.success) {
        toast.success('Submitted to HMRC', {
          description: `Reference: ${result.hmrcReference}`
        })
      } else {
        toast.error('Submission failed', {
          description: result.errors?.[0]?.message || 'Unknown error'
        })
      }
    } catch (error) {
      toast.error('Submission error', {
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  const handleDownloadReport = (submission: PAYESubmission) => {
    const report = generateRTIReport(submission.id)
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `RTI_${submission.type}_${submission.id}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Report downloaded')
  }

  const getStatusBadge = (status: PAYESubmission['status']) => {
    const variants: Record<PAYESubmission['status'], {
      variant: 'default' | 'secondary' | 'destructive' | 'outline'
      icon: React.ReactNode
      label: string
    }> = {
      draft: {
        variant: 'outline',
        icon: <FileText size={14} />,
        label: 'Draft'
      },
      ready: {
        variant: 'secondary',
        icon: <CheckCircle size={14} />,
        label: 'Ready'
      },
      submitted: {
        variant: 'default',
        icon: <Upload size={14} />,
        label: 'Submitted'
      },
      accepted: {
        variant: 'default',
        icon: <CheckCircle size={14} />,
        label: 'Accepted'
      },
      rejected: {
        variant: 'destructive',
        icon: <XCircle size={14} />,
        label: 'Rejected'
      },
      corrected: {
        variant: 'secondary',
        icon: <Clock size={14} />,
        label: 'Corrected'
      }
    }

    const config = variants[status]

    return (
      <Badge variant={config.variant} className="gap-1.5">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  const getTypeBadge = (type: PAYESubmission['type']) => {
    const colors: Record<PAYESubmission['type'], string> = {
      FPS: 'bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300',
      EPS: 'bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300',
      EAS: 'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300',
      NVR: 'bg-orange-100 text-orange-900 dark:bg-orange-900/30 dark:text-orange-300'
    }

    return (
      <Badge variant="outline" className={colors[type]}>
        {type}
      </Badge>
    )
  }

  const renderPendingSubmissions = () => {
    if (pendingSubmissions.length === 0) {
      return (
        <Card>
          <CardContent className="py-12">
            <Stack spacing={4} align="center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <FileText size={32} className="text-muted-foreground" />
              </div>
              <Stack spacing={2} align="center">
                <h3 className="text-lg font-semibold">No pending submissions</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Create a new PAYE submission from a completed payroll run to get started
                </p>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {pendingSubmissions.map(submission => {
          const fps = fpsData.find(f => f.submissionId === submission.id)

          return (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Stack spacing={2}>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(submission.type)}
                      {getStatusBadge(submission.status)}
                    </div>
                    <CardTitle className="text-base">
                      {submission.type} - {submission.taxYear} Month {submission.taxMonth}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Created {format(new Date(submission.createdDate), 'PPp')}
                    </div>
                  </Stack>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <Info size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Grid cols={4} gap={4} className="mb-4">
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Employees</div>
                    <div className="text-lg font-semibold">{submission.employeesCount}</div>
                  </Stack>
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Total Payment</div>
                    <div className="text-lg font-semibold">
                      £{submission.totalPayment.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </Stack>
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Total Tax</div>
                    <div className="text-lg font-semibold">
                      £{submission.totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </Stack>
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Total NI</div>
                    <div className="text-lg font-semibold">
                      £{submission.totalNI.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </Stack>
                </Grid>

                {submission.errors && submission.errors.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <Warning size={16} />
                    <AlertDescription>
                      {submission.errors.length} validation error(s) found
                    </AlertDescription>
                  </Alert>
                )}

                {submission.warnings && submission.warnings.length > 0 && (
                  <Alert className="mb-4 border-warning bg-warning/10">
                    <Info size={16} className="text-warning-foreground" />
                    <AlertDescription>
                      {submission.warnings.length} warning(s) found
                    </AlertDescription>
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleValidate(submission)}
                    disabled={isValidating}
                  >
                    <CheckCircle size={16} />
                    Validate
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSubmit(submission)}
                    disabled={isSubmitting || submission.status !== 'ready'}
                  >
                    <Upload size={16} />
                    Submit to HMRC
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadReport(submission)}
                  >
                    <Download size={16} />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderSubmittedSubmissions = () => {
    if (submittedSubmissions.length === 0) {
      return (
        <Card>
          <CardContent className="py-12">
            <Stack spacing={4} align="center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle size={32} className="text-muted-foreground" />
              </div>
              <Stack spacing={2} align="center">
                <h3 className="text-lg font-semibold">No submitted returns</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  Submissions sent to HMRC will appear here
                </p>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {submittedSubmissions.map(submission => {
          const fps = fpsData.find(f => f.submissionId === submission.id)

          return (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Stack spacing={2}>
                    <div className="flex items-center gap-2">
                      {getTypeBadge(submission.type)}
                      {getStatusBadge(submission.status)}
                    </div>
                    <CardTitle className="text-base">
                      {submission.type} - {submission.taxYear} Month {submission.taxMonth}
                    </CardTitle>
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
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Employees</div>
                    <div className="text-lg font-semibold">{submission.employeesCount}</div>
                  </Stack>
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Total Payment</div>
                    <div className="text-lg font-semibold">
                      £{submission.totalPayment.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </Stack>
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Total Tax</div>
                    <div className="text-lg font-semibold">
                      £{submission.totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </Stack>
                  <Stack spacing={1}>
                    <div className="text-xs text-muted-foreground">Total NI</div>
                    <div className="text-lg font-semibold">
                      £{submission.totalNI.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </div>
                  </Stack>
                </Grid>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadReport(submission)}
                  >
                    <Download size={16} />
                    Download Report
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <Info size={16} />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>PAYE RTI Manager</DialogTitle>
            <DialogDescription>
              Manage Real Time Information (RTI) submissions to HMRC
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pending">
                Pending ({pendingSubmissions.length})
              </TabsTrigger>
              <TabsTrigger value="submitted">
                Submitted ({submittedSubmissions.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              {renderPendingSubmissions()}
            </TabsContent>

            <TabsContent value="submitted" className="mt-6">
              {renderSubmittedSubmissions()}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showValidation && validationResult && (
        <Dialog open={showValidation} onOpenChange={setShowValidation}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Validation Results</DialogTitle>
              <DialogDescription>
                RTI submission validation report
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {validationResult.isValid ? (
                <Alert className="border-success bg-success/10">
                  <CheckCircle size={16} className="text-success" />
                  <AlertDescription>
                    All validation checks passed. This submission is ready to send to HMRC.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert variant="destructive">
                  <XCircle size={16} />
                  <AlertDescription>
                    Validation failed. Please correct the errors before submitting.
                  </AlertDescription>
                </Alert>
              )}

              {validationResult.errors.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <XCircle size={16} className="text-destructive" />
                      Errors ({validationResult.errors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {validationResult.errors.map((error: any, idx: number) => (
                        <div key={idx} className="p-3 border border-destructive/30 bg-destructive/5 rounded-lg">
                          <div className="font-semibold text-sm">{error.code}</div>
                          <div className="text-sm text-muted-foreground">{error.message}</div>
                          {error.field && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Field: {error.field}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {validationResult.warnings.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Warning size={16} className="text-warning" />
                      Warnings ({validationResult.warnings.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {validationResult.warnings.map((warning: any, idx: number) => (
                        <div key={idx} className="p-3 border border-warning/30 bg-warning/5 rounded-lg">
                          <div className="font-semibold text-sm">{warning.code}</div>
                          <div className="text-sm text-muted-foreground">{warning.message}</div>
                          {warning.field && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Field: {warning.field}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowValidation(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
