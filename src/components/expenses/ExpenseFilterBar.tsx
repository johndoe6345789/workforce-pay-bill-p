import { Download, Funnel, CaretDown } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Stack } from '@/components/ui/stack'

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected', 'paid'] as const

interface Props {
  statusFilter: string
  setStatusFilter: (v: string) => void
  onExport: (fmt: 'csv' | 'xlsx' | 'json') => void
  t: (key: string, params?: Record<string, unknown>) => string
}

export function ExpenseFilterBar({ statusFilter, setStatusFilter, onExport, t }: Props) {
  return (
    <Stack direction="horizontal" spacing={4} align="center">
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40">
          <div className="flex items-center gap-2"><Funnel size={16} /><SelectValue /></div>
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map(s => (
            <SelectItem key={s} value={s}>{t(`expenses.status.${s}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Download size={18} className="mr-2" />
            {t('common.export')}
            <CaretDown size={16} className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(['csv', 'xlsx', 'json'] as const).map(fmt => (
            <DropdownMenuItem key={fmt} onClick={() => onExport(fmt)}>
              {t('common.exportAs', { format: fmt === 'xlsx' ? 'Excel' : fmt.toUpperCase() })}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Stack>
  )
}
