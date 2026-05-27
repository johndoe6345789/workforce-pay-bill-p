import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Clock, Warning, Envelope } from '@phosphor-icons/react'
import type { OnboardingWorkflow, OnboardingStep } from '@/hooks/useOnboardingWorkflowManager'

const STATUS_CONFIG = {
  'not-started': { Icon: Clock, color: 'text-muted-foreground' },
  'in-progress': { Icon: Clock, color: 'text-warning' },
  'completed': { Icon: CheckCircle, color: 'text-success' },
  'blocked': { Icon: Warning, color: 'text-destructive' },
}

interface Props {
  workflow: OnboardingWorkflow
  onCompleteStep?: (workflowId: string, step: OnboardingStep) => void
  onSendReminder?: (workflow: OnboardingWorkflow) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

export function OnboardingCard({ workflow, onCompleteStep, onSendReminder, t }: Props) {
  const [showDetails, setShowDetails] = useState(false)
  const { Icon, color } = STATUS_CONFIG[workflow.status]

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Icon size={24} weight="fill" className={color} />
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
                <div><p className="text-muted-foreground">{t('onboarding.card.startDate')}</p><p className="font-medium">{new Date(workflow.startDate).toLocaleDateString()}</p></div>
                <div><p className="text-muted-foreground">{t('onboarding.card.currentStep')}</p><p className="font-medium">{workflow.steps.find(s => s.step === workflow.currentStep)?.label || 'N/A'}</p></div>
                <div><p className="text-muted-foreground">{t('onboarding.card.status')}</p><p className="font-medium">{workflow.steps.filter(s => s.status === 'completed').length} / {workflow.steps.length}</p></div>
              </div>
              {showDetails && (
                <div className="border-t border-border pt-4 space-y-2">
                  {workflow.steps.map((step, idx) => (
                    <div key={step.step} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">{idx + 1}.</span>
                        <div>
                          <p className="text-sm font-medium">{step.label}</p>
                          {step.completedDate && <p className="text-xs text-muted-foreground">{t('onboarding.stepStatus.completed')} {new Date(step.completedDate).toLocaleDateString()}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.status === 'completed' && <CheckCircle size={18} className="text-success" weight="fill" />}
                        {step.status === 'in-progress' && <Clock size={18} className="text-warning" weight="fill" />}
                        {step.status === 'pending' && workflow.status !== 'completed' && onCompleteStep && (
                          <Button size="sm" variant="outline" onClick={() => onCompleteStep(workflow.id, step.step)}>{t('onboarding.completeStep')}</Button>
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
                <Envelope size={16} className="mr-2" />{t('onboarding.sendReminder')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
