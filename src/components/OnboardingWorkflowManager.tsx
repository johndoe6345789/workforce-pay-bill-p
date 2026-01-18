import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
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
  const [workflows = [], setWorkflows] = useKV<OnboardingWorkflow[]>('onboarding-workflows', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState({
    workerName: '',
    email: '',
    startDate: ''
  })

  const defaultSteps: OnboardingStepStatus[] = [
    { step: 'personal-info', label: 'Personal Information', status: 'pending' },
    { step: 'right-to-work', label: 'Right to Work', status: 'pending' },
    { step: 'tax-forms', label: 'Tax Forms', status: 'pending' },
    { step: 'bank-details', label: 'Bank Details', status: 'pending' },
    { step: 'compliance-docs', label: 'Compliance Documents', status: 'pending' },
    { step: 'contract-signing', label: 'Contract Signing', status: 'pending' }
  ]

  const handleCreate = () => {
    if (!formData.workerName || !formData.email || !formData.startDate) {
      toast.error('Please fill in all required fields')
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
    toast.success(`Onboarding workflow created for ${formData.workerName}`)
    
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
    toast.success('Step completed')
  }

  const handleSendReminder = (workflow: OnboardingWorkflow) => {
    toast.success(`Reminder email sent to ${workflow.email}`)
  }

  const inProgressWorkflows = workflows.filter(w => w.status === 'in-progress' || w.status === 'not-started')
  const completedWorkflows = workflows.filter(w => w.status === 'completed')
  const blockedWorkflows = workflows.filter(w => w.status === 'blocked')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Digital Onboarding</h2>
          <p className="text-muted-foreground mt-1">Manage worker onboarding workflows</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus size={18} className="mr-2" />
              Start Onboarding
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Start New Onboarding</DialogTitle>
              <DialogDescription>
                Create a digital onboarding workflow for a new worker
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ob-name">Worker Name *</Label>
                <Input
                  id="ob-name"
                  value={formData.workerName}
                  onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                  placeholder="John Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-email">Email Address *</Label>
                <Input
                  id="ob-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.smith@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ob-start">Expected Start Date *</Label>
                <Input
                  id="ob-start"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Start Onboarding</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{inProgressWorkflows.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-success">{completedWorkflows.length}</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-warning/20">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{blockedWorkflows.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Avg. Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">3.2 days</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" className="space-y-4">
        <TabsList>
          <TabsTrigger value="in-progress">In Progress ({inProgressWorkflows.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedWorkflows.length})</TabsTrigger>
          <TabsTrigger value="blocked">Blocked ({blockedWorkflows.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="in-progress" className="space-y-3">
          {inProgressWorkflows.map(workflow => (
            <OnboardingCard 
              key={workflow.id} 
              workflow={workflow} 
              onCompleteStep={handleCompleteStep}
              onSendReminder={handleSendReminder}
            />
          ))}
          {inProgressWorkflows.length === 0 && (
            <Card className="p-12 text-center">
              <UserPlus size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active onboardings</h3>
              <p className="text-muted-foreground">Start a new onboarding workflow to begin</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-3">
          {completedWorkflows.map(workflow => (
            <OnboardingCard key={workflow.id} workflow={workflow} />
          ))}
        </TabsContent>

        <TabsContent value="blocked" className="space-y-3">
          {blockedWorkflows.map(workflow => (
            <OnboardingCard key={workflow.id} workflow={workflow} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface OnboardingCardProps {
  workflow: OnboardingWorkflow
  onCompleteStep?: (workflowId: string, step: OnboardingStep) => void
  onSendReminder?: (workflow: OnboardingWorkflow) => void
}

function OnboardingCard({ workflow, onCompleteStep, onSendReminder }: OnboardingCardProps) {
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
                      {workflow.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{workflow.email}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(workflow.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Step</p>
                    <p className="font-medium">
                      {workflow.steps.find(s => s.step === workflow.currentStep)?.label || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completed Steps</p>
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
                                Completed {new Date(step.completedDate).toLocaleDateString()}
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
                              Mark Complete
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
                {showDetails ? 'Hide' : 'View'} Steps
              </Button>
              {workflow.status !== 'completed' && onSendReminder && (
                <Button size="sm" variant="outline" onClick={() => onSendReminder(workflow)}>
                  <Envelope size={16} className="mr-2" />
                  Remind
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
