import { CheckCircle } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { STAT_CELLS } from '@/data/parallel-approval-config'
import type { ParallelApproval } from '@/hooks/use-approval-workflow'

interface Props {
  counts: { approved: number; pending: number; rejected: number }
  totalCount: number
  required: ParallelApproval[]
  requiredApprovedCount: number
}

export function ApprovalProgressSection({ counts, totalCount, required, requiredApprovedCount }: Props) {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall Progress</span>
          <span className="font-medium">{counts.approved} / {totalCount} Approved</span>
        </div>
        <Progress value={(counts.approved / totalCount) * 100} className="h-2" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {STAT_CELLS.map(({ key, label, bg, text }) => (
          <div key={key} className={`text-center p-3 ${bg} rounded-md`}>
            <div className={`text-2xl font-semibold ${text}`}>{counts[key]}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {required.length > 0 && (
        <div className="p-3 bg-info/10 border border-info/20 rounded-md">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="destructive" className="text-xs">Required</Badge>
            <span className="text-muted-foreground">
              {requiredApprovedCount} / {required.length} required approvals completed
            </span>
            {requiredApprovedCount === required.length && (
              <CheckCircle size={16} weight="fill" className="text-success ml-auto" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
