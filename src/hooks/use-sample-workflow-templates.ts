import { useEffect } from 'react'
import { useApprovalWorkflowTemplates } from './use-approval-workflow-templates'
import { buildTemplateSeeds } from './use-sample-workflow-templates.data'

export function useSampleWorkflowTemplates() {
  const { templates, createTemplate, updateTemplate } = useApprovalWorkflowTemplates()

  useEffect(() => {
    if (templates.length !== 0) return

    for (const seed of buildTemplateSeeds()) {
      const created = createTemplate(seed.name, seed.batchType, seed.description)
      updateTemplate(created.id, seed.patch)
    }
  }, [])
}
