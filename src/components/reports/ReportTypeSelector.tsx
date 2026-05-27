import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ReportType, GroupByField } from '@/hooks/useCustomReportBuilder'
import { REPORT_TYPES, GROUP_BY_OPTIONS } from '@/data/report-config-options'

interface Props {
  type: ReportType
  groupBy: GroupByField | undefined
  onChangeType: (v: ReportType) => void
  onChangeGroupBy: (v: GroupByField | undefined) => void
}

export function ReportTypeSelector({ type, groupBy, onChangeType, onChangeGroupBy }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="reportType">Report Type</Label>
        <Select value={type} onValueChange={onChangeType}>
          <SelectTrigger id="reportType"><SelectValue /></SelectTrigger>
          <SelectContent>
            {REPORT_TYPES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="groupBy">Group By (Optional)</Label>
        <Select
          value={groupBy ?? 'none'}
          onValueChange={v => onChangeGroupBy(v === 'none' ? undefined : v as GroupByField)}
        >
          <SelectTrigger id="groupBy"><SelectValue /></SelectTrigger>
          <SelectContent>
            {GROUP_BY_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
