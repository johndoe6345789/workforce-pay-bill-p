import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTranslation } from '@/hooks/use-translation'
import { UserPlus, CheckCircle, Clock, FileText, Upload, Envelope, ArrowRight, Warning } from '@phosphor-icons/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type OnboardingStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked'
type OnboardingStep = 'personal-info' | 'right-to-work' | 'tax-forms' | 'bank-details' | 'compliance-docs' | 'contract-signing'

interface OnboardingWorkflow {
  id: string
  workerId: string
  workerName: string
  email: string
  startDate: string
  status: OnboardingStatus
  progress: number
  steps: OnboardingStepStatus[]
  currentStep: OnboardingStep
  notes?: string
}

interface OnboardingStepStatus {
  step: OnboardingStep
  label: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  completedDate?: string
  documents?: string[]
}

export function OnboardingWorkflowManager() {
  const { t } = useTranslation()
  const [workflows = [], setWorkflows] = useKV<OnboardingWorkflow[]>('onboarding-workflows', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    workerName: '',
    email: '',
    startDate: ''
  })

  const defaultSteps: OnboardingStepStatus[] = [
    { step: 'personal-info', label: t('onboarding.steps.personalInfo'), status: 'pending' },
    { step: 'right-to-work', label: t('onboarding.steps.rightToWork'), status: 'pending' },
    { step: 'tax-forms', label: t('onboarding.steps.taxForms'), status: 'pending' },
    { step: 'bank-details', label: t('onboarding.steps.bankDetails'), status: 'pending' },
    { step: 'compliance-docs', label: t('onboarding.steps.complianceDocs'), status: 'pending' },
    { step: 'contract-signing', label: t('onboarding.steps.contractSigning'), status: 'pending' }
  ]

  const handleCreate = () => {
    if (!formData.workerName || !formData.email || !formData.startDate) {
      toast.error(t('onboarding.createDialog.fillAllFields'))
      return
    }

    const newWorkflow: OnboardingWorkflow = {
      id: `OB-${Date.now()}`,
      workerId: `W-${Date.now()}`,
      workerName: formData.workerName,
      email: formData.email,
      startDate: formData.startDate,
      status: 'not-started',
      progress: 0,
      steps: defaultSteps,
      currentStep: 'personal-info'
    }

    setWorkflows(current => [...(current || []), newWorkflow])
    toast.success(t('onboarding.messages.createSuccess', { workerName: formData.workerName }))
    
    setFormData({ workerName: '', email: '', startDate: '' })
    setIsCreateOpen(false)
  }

  const handleCompleteStep = (workflowId: string, step: OnboardingStep) => {
    setWorkflows(current => {
      if (!current) return []
      return current.map(workflow => {
        if (workflow.id !== workflowId) return workflow

        const updatedSteps = workflow.steps.map(s => 
          s.step === step 
            ? { ...s, status: 'completed' as const, completedDate: new Date().toISOString() }
            : s
        )

        const completedCount = updatedSteps.filter(s => s.status === 'completed').length
        const progress = Math.round((completedCount / updatedSteps.length) * 100)
        const allCompleted = completedCount === updatedSteps.length

        const nextIncompleteStep = updatedSteps.find(s => s.status !== 'completed')

        return {
          ...workflow,
          steps: updatedSteps,
          progress,
          status: allCompleted ? 'completed' as const : 'in-progress' as const,
          currentStep: nextIncompleteStep?.step || workflow.currentStep
        }
      })
    })
    toast.success(t('onboarding.messages.stepCompleted'))
  }

  const handleSendReminder = (workflow: OnboardingWorkflow) => {
    toast.success(t('onboarding.messages.reminderSent', { email: workflow.email }))
  }

  const inProgressWorkflows = workflows.filter(w => w.status === 'in-progress' || w.status === 'not-started')
  const completedWorkflows = workflows.filter(w => w.status === 'completed')
  const blockedWorkflows = workflows.filter(w => w.status === 'blocked')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{t('onboarding.title')}</h2>
          <p className="text-muted-foreground mt-1">{t('onboarding.subtitle')}</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus size={18} className="mr-2" />
              {t('onboarding.startOnboarding')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('onboarding.createDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('onboarding.createDialog.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ob-name">{t('onboarding.createDialog.workerNameLabel')}</Label>
                <Input
                  id="ob-name"
                  value={formData.workerName}
                  onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                  placeholder={t('onboarding.createDialog.workerNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-email">{t('onboarding.createDialog.emailLabel')}</Label>
                <Input
                  id="ob-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={t('onboarding.createDialog.emailPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-start">{t('onboarding.createDialog.startDateLabel')}</Label>
                <Input
                  id="ob-start"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>{t('onboarding.createDialog.cancel')}</Button>
              <Button onClick={handleCreate}>{t('onboarding.createDialog.start')}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('onboarding.metrics.inProgress')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{inProgressWorkflows.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('onboarding.metrics.completed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-success">{completedWorkflows.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('onboarding.metrics.blocked')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{blockedWorkflows.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">{t('onboarding.metrics.avgTime')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{t('onboarding.metrics.avgTimeDays', { days: '3.2' })}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="in-progress">{t('onboarding.tabs.inProgress', { count: inProgressWorkflows.length })}</TabsTrigger>
          <TabsTrigger value="completed">{t('onboarding.tabs.completed', { count: completedWorkflows.length })}</TabsTrigger>
          <TabsTrigger value="blocked">{t('onboarding.tabs.blocked', { count: blockedWorkflows.length })}</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="space-y-3">
          {inProgressWorkflows.map(workflow => (
            <OnboardingCard 
              key={workflow.id} 
              workflow={workflow} 
              onCompleteStep={handleCompleteStep}
              onSendReminder={handleSendReminder}
              t={t}
            />
          ))}
          {inProgressWorkflows.length === 0 && (
            <Card className="p-12 text-center">
              <UserPlus size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('onboarding.emptyStates.noActive')}</h3>
              <p className="text-muted-foreground">{t('onboarding.emptyStates.noActiveDescription')}</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedWorkflows.map(workflow => (
            <OnboardingCard key={workflow.id} workflow={workflow} t={t} />
          ))}
          {completedWorkflows.length === 0 && (
            <Card className="p-12 text-center">
              <CheckCircle size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('onboarding.emptyStates.noCompleted')}</h3>
              <p className="text-muted-foreground">{t('onboarding.emptyStates.noCompletedDescription')}</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="blocked" className="space-y-3">
          {blockedWorkflows.map(workflow => (
            <OnboardingCard key={workflow.id} workflow={workflow} t={t} />
          ))}
          {blockedWorkflows.length === 0 && (
            <Card className="p-12 text-center">
              <Warning size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('onboarding.emptyStates.noBlocked')}</h3>
              <p className="text-muted-foreground">{t('onboarding.emptyStates.noBlockedDescription')}</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OnboardingCardProps {
  workflow: OnboardingWorkflow
  onCompleteStep?: (workflowId: string, step: OnboardingStep) => void
  onSendReminder?: (workflow: OnboardingWorkflow) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

function OnboardingCard({ workflow, onCompleteStep, onSendReminder, t }: OnboardingCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const statusConfig = {
    'not-started': { icon: Clock, color: 'text-muted-foreground' },
    'in-progress': { icon: Clock, color: 'text-warning' },
    'completed': { icon: CheckCircle, color: 'text-success' },
    'blocked': { icon: Warning, color: 'text-destructive' }
  }

  const StatusIcon = statusConfig[workflow.status].icon

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <StatusIcon 
                size={24} 
                weight="fill" 
                className={statusConfig[workflow.status].color}
              />
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg">{workflow.workerName}</h3>
                    <Badge variant={workflow.status === 'completed' ? 'success' : workflow.status === 'blocked' ? 'destructive' : 'warning'}>
                      {t(`onboarding.status.${workflow.status.replace('-', '') as 'notStarted' | 'inProgress' | 'completed' | 'blocked'}`)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{workflow.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('onboarding.card.progress')}</span>
                    <span className="font-medium">{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">{t('onboarding.card.startDate')}</p>
                    <p className="font-medium">{new Date(workflow.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('onboarding.card.currentStep')}</p>
                    <p className="font-medium">
                      {workflow.steps.find(s => s.step === workflow.currentStep)?.label || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">{t('onboarding.card.status')}</p>
                    <p className="font-medium">
                      {workflow.steps.filter(s => s.status === 'completed').length} / {workflow.steps.length}
                    </p>
                  </div>
                </div>

                {showDetails && (
                  <div className="border-t border-border pt-4 space-y-2">
                    {workflow.steps.map((step, idx) => (
                      <div key={step.step} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">{idx + 1}.</span>
                          <div>
                            <p className="text-sm font-medium">{step.label}</p>
                            {step.completedDate && (
                              <p className="text-xs text-muted-foreground">
                                {t('onboarding.stepStatus.completed')} {new Date(step.completedDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {step.status === 'completed' && (
                            <CheckCircle size={18} className="text-success" weight="fill" />
                          )}
                          {step.status === 'in-progress' && (
                            <Clock size={18} className="text-warning" weight="fill" />
                          )}
                          {step.status === 'pending' && workflow.status !== 'completed' && onCompleteStep && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onCompleteStep(workflow.id, step.step)}
                            >
                              {t('onboarding.completeStep')}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 ml-4">
              <Button size="sm" variant="outline" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? t('common.close') : t('onboarding.viewWorkflow')}
              </Button>
              {workflow.status !== 'completed' && onSendReminder && (
                <Button size="sm" variant="outline" onClick={() => onSendReminder(workflow)}>
                  <Envelope size={16} className="mr-2" />
                  {t('onboarding.sendReminder')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
