import { UserPlus, CheckCircle, Warning } from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OnboardingCreateDialog } from '@/components/onboarding/OnboardingCreateDialog'
import { OnboardingCard } from '@/components/onboarding/OnboardingCard'
import { useOnboardingWorkflowManager } from '@/hooks/useOnboardingWorkflowManager'

export function OnboardingWorkflowManager() {
  const vm = useOnboardingWorkflowManager()

  const tabDefs = [
    { value: 'in-progress', label: vm.t('onboarding.tabs.inProgress', { count: vm.inProgressWorkflows.length }), workflows: vm.inProgressWorkflows, EmptyIcon: UserPlus, emptyTitle: vm.t('onboarding.emptyStates.noActive'), emptyDesc: vm.t('onboarding.emptyStates.noActiveDescription') },
    { value: 'completed', label: vm.t('onboarding.tabs.completed', { count: vm.completedWorkflows.length }), workflows: vm.completedWorkflows, EmptyIcon: CheckCircle, emptyTitle: vm.t('onboarding.emptyStates.noCompleted'), emptyDesc: vm.t('onboarding.emptyStates.noCompletedDescription') },
    { value: 'blocked', label: vm.t('onboarding.tabs.blocked', { count: vm.blockedWorkflows.length }), workflows: vm.blockedWorkflows, EmptyIcon: Warning, emptyTitle: vm.t('onboarding.emptyStates.noBlocked'), emptyDesc: vm.t('onboarding.emptyStates.noBlockedDescription') },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{vm.t('onboarding.title')}</h2>
          <p className="text-muted-foreground mt-1">{vm.t('onboarding.subtitle')}</p>
        </div>
        <OnboardingCreateDialog
          open={vm.isCreateOpen}
          onOpenChange={vm.setIsCreateOpen}
          formData={vm.formData}
          setFormData={vm.setFormData}
          onSubmit={vm.handleCreate}
          t={vm.t}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('onboarding.metrics.inProgress')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.inProgressWorkflows.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('onboarding.metrics.completed')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold text-success">{vm.completedWorkflows.length}</div></CardContent>
        </Card>
        <Card className="border-l-4 border-warning/20">
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('onboarding.metrics.blocked')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.blockedWorkflows.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm text-muted-foreground">{vm.t('onboarding.metrics.avgTime')}</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-semibold">{vm.t('onboarding.metrics.avgTimeDays', { days: '3.2' })}</div></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="in-progress" className="space-y-4">
        <TabsList>
          {tabDefs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
        </TabsList>
        {tabDefs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="space-y-3">
            {tab.workflows.map(workflow => (
              <OnboardingCard
                key={workflow.id}
                workflow={workflow}
                onCompleteStep={tab.value === 'in-progress' ? vm.handleCompleteStep : undefined}
                onSendReminder={tab.value === 'in-progress' ? vm.handleSendReminder : undefined}
                t={vm.t}
              />
            ))}
            {!tab.workflows.length && (
              <Card className="p-12 text-center">
                <CardContent>
                  <tab.EmptyIcon size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{tab.emptyTitle}</h3>
                  <p className="text-muted-foreground">{tab.emptyDesc}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
