import { useTranslation } from '@/hooks/use-translation'
import { ICON_MAP } from './dashboardIconMap'
import type { DashboardActivity } from '@/hooks/use-dashboard-config'

interface Props { activity: DashboardActivity }

export function ActivityItem({ activity }: Props) {
  const { t } = useTranslation()
  const Icon = ICON_MAP[activity.icon]
  const description = activity.description || (activity.descriptionKey ? t(activity.descriptionKey, activity.descriptionParams) : '')
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{Icon && <Icon size={18} className={activity.iconColor} />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{t(activity.titleKey)}</p>
        <p className="text-sm text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{t(activity.timeKey, activity.timeParams)}</span>
    </div>
  )
}
