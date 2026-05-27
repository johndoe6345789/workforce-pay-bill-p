import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/use-translation'
import { ICON_MAP } from './dashboardIconMap'
import type { DashboardAction } from '@/hooks/use-dashboard-config'

interface Props { action: DashboardAction }

export function QuickAction({ action }: Props) {
  const { t } = useTranslation()
  const Icon = ICON_MAP[action.icon]
  return (
    <Button className="w-full justify-start" variant="outline">
      {Icon && <Icon size={18} className="mr-2" />}
      {t(action.labelKey)}
    </Button>
  )
}
