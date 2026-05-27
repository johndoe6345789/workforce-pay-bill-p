import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useTranslation } from '@/hooks/use-translation'
import { toast } from 'sonner'

export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked'
export type OnboardingStep = 'personal-info' | 'right-to-work' | 'tax-forms' | 'bank-details' | 'compliance-docs' | 'contract-signing'

export interface OnboardingStepStatus {
  step: OnboardingStep
  label: string
  status: 'pending' | 'in-progress' | 'completed' | 'blocked'
  completedDate?: string
  documents?: string[]
}

export interface OnboardingWorkflow {
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

const DEFAULT_FORM = { workerName: '', email: '', startDate: '' }

export function useOnboardingWorkflowManager() {
  const { t } = useTranslation()
  const [workflows = [], setWorkflows] = useKV<OnboardingWorkflow[]>('onboarding-workflows', [])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_FORM)

  const makeDefaultSteps = (): OnboardingStepStatus[] => [
    { step: 'personal-info', label: t('onboarding.steps.personalInfo'), status: 'pending' },
    { step: 'right-to-work', label: t('onboarding.steps.rightToWork'), status: 'pending' },
    { step: 'tax-forms', label: t('onboarding.steps.taxForms'), status: 'pending' },
    { step: 'bank-details', label: t('onboarding.steps.bankDetails'), status: 'pending' },
    { step: 'compliance-docs', label: t('onboarding.steps.complianceDocs'), status: 'pending' },
    { step: 'contract-signing', label: t('onboarding.steps.contractSigning'), status: 'pending' },
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
      steps: makeDefaultSteps(),
      currentStep: 'personal-info'
    }
    setWorkflows(current => [...(current || []), newWorkflow])
    toast.success(t('onboarding.messages.createSuccess', { workerName: formData.workerName }))
    setFormData(DEFAULT_FORM)
    setIsCreateOpen(false)
  }

  const handleCompleteStep = (workflowId: string, step: OnboardingStep) => {
    setWorkflows(current => {
      if (!current) return []
      return current.map(workflow => {
        if (workflow.id !== workflowId) return workflow
        const updatedSteps = workflow.steps.map(s =>
          s.step === step ? { ...s, status: 'completed' as const, completedDate: new Date().toISOString() } : s
        )
        const completedCount = updatedSteps.filter(s => s.status === 'completed').length
        const progress = Math.round((completedCount / updatedSteps.length) * 100)
        const allCompleted = completedCount === updatedSteps.length
        const nextIncompleteStep = updatedSteps.find(s => s.status !== 'completed')
        return {
          ...workflow, steps: updatedSteps, progress,
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

  return {
    t, workflows,
    isCreateOpen, setIsCreateOpen,
    formData, setFormData,
    inProgressWorkflows, completedWorkflows, blockedWorkflows,
    handleCreate, handleCompleteStep, handleSendReminder,
  }
}
