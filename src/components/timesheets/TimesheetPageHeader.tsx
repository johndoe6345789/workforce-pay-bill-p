import { ChartBar } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { Stack } from '@/components/ui/stack'
import { LiveRefreshIndicator } from '@/components/LiveRefreshIndicator'
import { TimesheetCreateDialogs } from '@/components/timesheets/TimesheetCreateDialogs'
import type React from 'react'

interface Props extends React.ComponentProps<typeof TimesheetCreateDialogs> {
  showAnalytics: boolean
  onToggleAnalytics: () => void
  lastUpdated: Date | null
  t: (key: string, params?: Record<string, unknown>) => string
}

export function TimesheetPageHeader({
  showAnalytics, onToggleAnalytics, lastUpdated, t, ...createProps
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <PageHeader
        title={t('timesheets.title')}
        description={t('timesheets.subtitle')}
        actions={
          <Stack direction="horizontal" spacing={2}>
            <Button variant="outline" onClick={onToggleAnalytics}>
              <ChartBar size={18} className="mr-2" />
              {showAnalytics ? t('timesheets.hideAnalytics') : t('timesheets.showAnalytics')}
            </Button>
            <TimesheetCreateDialogs {...createProps} />
          </Stack>
        }
      />
      <LiveRefreshIndicator lastUpdated={lastUpdated} pollingInterval={1000} />
    </div>
  )
}
