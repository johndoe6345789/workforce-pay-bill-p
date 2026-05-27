import { Plus, PlayCircle, Users } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useParallelApprovalDemo } from '@/hooks/useParallelApprovalDemo'
import { CreateWorkflowDialog } from '@/components/parallel-approval-demo/CreateWorkflowDialog'
import { WorkflowCard } from '@/components/parallel-approval-demo/WorkflowCard'

const SIMULATED_USERS = ['APPROVER-1', 'APPROVER-2', 'APPROVER-3', 'APPROVER-4', 'APPROVER-5']

export function ParallelApprovalDemo() {
  const vm = useParallelApprovalDemo()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Parallel Approval Demo</h1>
          <p className="text-muted-foreground mt-1">Test concurrent review workflows with multiple approvers</p>
        </div>
        <Button disabled={vm.parallelTemplates.length === 0} onClick={() => vm.setShowCreateDialog(true)}>
          <Plus className="mr-2" size={16} />Create Test Workflow
        </Button>
      </div>

      <CreateWorkflowDialog
        open={vm.showCreateDialog}
        onOpenChange={vm.setShowCreateDialog}
        parallelTemplates={vm.parallelTemplates}
        selectedTemplateId={vm.selectedTemplateId}
        onTemplateChange={vm.setSelectedTemplateId}
        entityId={vm.entityId}
        onEntityIdChange={vm.setEntityId}
        onSubmit={vm.handleCreateWorkflow}
      />

      {vm.parallelTemplates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-medium text-foreground mb-2">No Parallel Approval Templates</h3>
            <p className="text-sm text-muted-foreground mb-4">Create a workflow template with parallel approval steps enabled to test concurrent reviews</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <Label htmlFor="user-select">Simulate Approver</Label>
            <Badge variant="outline">Current User: {vm.simulatedUserId}</Badge>
          </div>
          <Select value={vm.simulatedUserId} onValueChange={vm.setSimulatedUserId}>
            <SelectTrigger id="user-select"><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIMULATED_USERS.map(u => <SelectItem key={u} value={u}>{u.replace('-', ' ')}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {vm.activeWorkflows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PlayCircle size={24} className="text-primary" />
            <h2 className="text-xl font-semibold">Active Workflows</h2>
            <Badge>{vm.activeWorkflows.length}</Badge>
          </div>
          {vm.activeWorkflows.map(workflow => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              currentUserId={vm.simulatedUserId}
              onApprove={(approverId, comments) => vm.handleApprove(workflow.id, workflow.steps.find(s => s.isParallel)?.id ?? '', approverId, comments)}
              onReject={(approverId, comments) => vm.handleReject(workflow.id, workflow.steps.find(s => s.isParallel)?.id ?? '', approverId, comments)}
            />
          ))}
        </div>
      )}

      {vm.completedWorkflows.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Completed Workflows</h2>
            <Badge variant="outline">{vm.completedWorkflows.length}</Badge>
          </div>
          {vm.completedWorkflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} readOnly />
          ))}
        </div>
      )}
    </div>
  )
}
