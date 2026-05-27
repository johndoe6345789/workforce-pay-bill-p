export type OnboardingStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked'
export type OnboardingStep =
  | 'personal-info'
  | 'right-to-work'
  | 'tax-forms'
  | 'bank-details'
  | 'compliance-docs'
  | 'contract-signing'

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

export const DEFAULT_FORM = { workerName: '', email: '', startDate: '' }
export type OnboardingFormData = typeof DEFAULT_FORM
