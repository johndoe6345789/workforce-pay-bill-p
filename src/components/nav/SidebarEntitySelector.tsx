import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Buildings } from '@phosphor-icons/react'
import { useTranslation } from '@/hooks/use-translation'

interface Props {
  /** Currently selected entity key. */
  currentEntity: string
  /** Label for the currently selected entity. */
  entityLabel: string
  /** Called when the user picks a different entity. */
  onEntityChange: (entity: string) => void
}

/** Entity switcher shown at the top of the sidebar. */
export function SidebarEntitySelector({ currentEntity, entityLabel, onEntityChange }: Props) {
  const { t } = useTranslation()
  return (
    <div className="p-4 border-b border-border">
      <Select value={currentEntity} onValueChange={onEntityChange}>
        <SelectTrigger className="w-full" aria-label={t('sidebar.selectEntity')}>
          <div className="flex items-center gap-2">
            <Buildings size={16} weight="fill" className="text-primary" aria-hidden="true" />
            <span>{entityLabel}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Main Agency">{t('entities.mainAgency')}</SelectItem>
          <SelectItem value="North Division">{t('entities.northDivision')}</SelectItem>
          <SelectItem value="South Division">{t('entities.southDivision')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
