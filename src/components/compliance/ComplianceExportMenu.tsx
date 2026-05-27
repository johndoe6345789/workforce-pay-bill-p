import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Stack } from '@/components/ui/stack'
import { Download, CaretDown } from '@phosphor-icons/react'

interface Props {
  onExport: (format: string) => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ComplianceExportMenu({ onExport, t }: Props) {
  return (
    <Stack direction="horizontal" spacing={2} justify="end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download size={18} className="mr-2" />{t('common.export')}<CaretDown size={16} className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onExport('csv')}>{t('common.exportAs', { format: 'CSV' })}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('xlsx')}>{t('common.exportAs', { format: 'Excel' })}</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onExport('json')}>{t('common.exportAs', { format: 'JSON' })}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Stack>
  )
}
