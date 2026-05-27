import { Download, Funnel, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Stack } from '@/components/ui/stack'

interface Props {
  statusFilter: string
  setStatusFilter: (v: string) => void
  validationStats: { invalid: number }
  t: (key: string, params?: Record<string, unknown>) => string
}

export function TimesheetFilterBar({ statusFilter, setStatusFilter, validationStats, t }: Props) {
  return (
    <Stack direction="horizontal" spacing={3} align="center" justify="between">
      <Stack direction="horizontal" spacing={3}>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <div className="flex items-center gap-2"><Funnel size={16} /><SelectValue /></div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('timesheets.status.all')}</SelectItem>
            <SelectItem value="pending">{t('timesheets.status.pending')}</SelectItem>
            <SelectItem value="approved">{t('timesheets.status.approved')}</SelectItem>
            <SelectItem value="rejected">{t('timesheets.status.rejected')}</SelectItem>
          </SelectContent>
        </Select>
        {validationStats.invalid > 0 && (
          <Badge variant="destructive" className="px-3 py-1.5">
            <Warning size={14} weight="bold" className="mr-1" />
            {t('timesheets.validationErrors', {
              count: validationStats.invalid,
              errors: validationStats.invalid === 1 ? t('timesheets.error') : t('timesheets.errors'),
            })}
          </Badge>
        )}
      </Stack>
      <Button variant="outline">
        <Download size={18} className="mr-2" />
        {t('timesheets.exportCsv')}
      </Button>
    </Stack>
  )
}
