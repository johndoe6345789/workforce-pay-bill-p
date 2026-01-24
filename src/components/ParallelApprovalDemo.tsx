import { useState } from 'react'
import { Plus, PlayCircle, Users } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ParallelApprovalStepView } from './workflow/ParallelApprovalStepView'
import { useApprovalWorkflow, type ApprovalWorkflow, type ApprovalStep, type ParallelApproval } from '@/hooks/use-approval-workflow'
import { useApprovalWorkflowTemplates } from '@/hooks/use-approval-workflow-templates'
import { toast } from 'sonner'

export function ParallelApprovalDemo() {
  const { workflows, approveStep, rejectStep } = useApprovalWorkflow()
  const { templates } = useApprovalWorkflowTemplates()
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')
  const [entityId, setEntityId] = useState('')
  const [simulatedUserId, setSimulatedUserId] = useState<string>('APPROVER-1')

  const handleCreateWorkflow = () => {
    if (!selectedTemplateId || !entityId) return

    const template = templates.find(t => t.id === selectedTemplateId)
    if (!template) return

    const newWorkflow: ApprovalWorkflow = {
      id: `WF-${Date.now()}`,
      entityType: template.batchType,
      entityId,
      status: 'pending',
      currentStepIndex: 0,
      createdDate: new Date().toISOString(),
      steps: template.steps.map((stepTemplate, index) => {
        const baseStep: ApprovalStep = {
          id: `STEP-${Date.now()}-${index}`,
          order: index,
          approverRole: stepTemplate.approverRole,
          status: 'pending',
          isParallel: stepTemplate.isParallel,
          parallelApprovalMode: stepTemplate.parallelApprovalMode
        }

        if (stepTemplate.isParallel && stepTemplate.parallelApprovers) {
          baseStep.parallelApprovals = stepTemplate.parallelApprovers.map((approver) => ({
            id: approver.id,
            approverId: approver.id,
            approverName: approver.name,
            approverRole: approver.role,
            status: 'pending',
            isRequired: approver.isRequired
          }))
        }

        return baseStep
      })
    }

    toast.success('Parallel approval workflow created')
    setShowCreateDialog(false)
    setEntityId('')
    setSelectedTemplateId('')
  }

  const handleApprove = (workflowId: string, stepId: string, approverId: string, comments?: string) => {
    approveStep(workflowId, stepId, comments, approverId)
    toast.success('Approval recorded')
  }

  const handleReject = (workflowId: string, stepId: string, approverId: string, comments?: string) => {
    rejectStep(workflowId, stepId, comments, approverId)
    toast.error('Rejection recorded')
  }

  const activeWorkflows = workflows.filter(w => 
    w.status === 'pending' || w.status === 'in-progress'
  ).filter(w => 
    w.steps.some(s => s.isParallel)
  )

  const completedWorkflows = workflows.filter(w => 
    w.status === 'approved' || w.status === 'rejected'
  ).filter(w => 
    w.steps.some(s => s.isParallel)
  )

  const parallelTemplates = templates.filter(t => 
    t.steps.some(s => s.isParallel)
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            Parallel Approval Demo
          </h1>
          <p className="text-muted-foreground mt-1">
            Test concurrent review workflows with multiple approvers
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button disabled={parallelTemplates.length === 0}>
              <Plus className="mr-2" size={16} />
              Create Test Workflow
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Test Workflow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="template-select">Select Template with Parallel Steps</Label>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger id="template-select">
                    <SelectValue placeholder="Choose a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {parallelTemplates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.batchType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entity-id">Entity ID</Label>
                <Input
                  id="entity-id"
                  placeholder="e.g., INV-12345"
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateWorkflow}
                disabled={!selectedTemplateId || !entityId}
              >
                Create Workflow
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {parallelTemplates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Parallel Approval Templates
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create a workflow template with parallel approval steps enabled to test concurrent reviews
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Simulate Approver</CardTitle>
            <Badge variant="outline">Current User: {simulatedUserId}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="user-select">Select User to Simulate</Label>
            <Select value={simulatedUserId} onValueChange={setSimulatedUserId}>
              <SelectTrigger id="user-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVER-1">Approver 1</SelectItem>
                <SelectItem value="APPROVER-2">Approver 2</SelectItem>
                <SelectItem value="APPROVER-3">Approver 3</SelectItem>
                <SelectItem value="APPROVER-4">Approver 4</SelectItem>
                <SelectItem value="APPROVER-5">Approver 5</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {activeWorkflows.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PlayCircle size={24} className="text-primary" />
            <h2 className="text-xl font-semibold">Active Workflows</h2>
            <Badge>{activeWorkflows.length}</Badge>
          </div>

          {activeWorkflows.map((workflow) => (
            <Card key={workflow.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {workflow.entityType} - {workflow.entityId}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created: {new Date(workflow.createdDate).toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={
                      workflow.status === 'approved' ? 'default' :
                      workflow.status === 'rejected' ? 'destructive' :
                      'secondary'
                    }
                  >
                    {workflow.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflow.steps
                  .filter(step => step.isParallel)
                  .map((step) => (
                    <div key={step.id}>
                      <ParallelApprovalStepView
                        step={step}
                        onApprove={(approverId, comments) =>
                          handleApprove(workflow.id, step.id, approverId, comments)
                        }
                        onReject={(approverId, comments) =>
                          handleReject(workflow.id, step.id, approverId, comments)
                        }
                        currentUserId={simulatedUserId}
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {completedWorkflows.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold">Completed Workflows</h2>
            <Badge variant="outline">{completedWorkflows.length}</Badge>
          </div>

          {completedWorkflows.map((workflow) => (
            <Card key={workflow.id} className="opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {workflow.entityType} - {workflow.entityId}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Completed: {workflow.completedDate ? new Date(workflow.completedDate).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <Badge
                    variant={workflow.status === 'approved' ? 'default' : 'destructive'}
                  >
                    {workflow.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflow.steps
                  .filter(step => step.isParallel)
                  .map((step) => (
                    <div key={step.id}>
                      <ParallelApprovalStepView
                        step={step}
                        readOnly={true}
                      />
                    </div>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
