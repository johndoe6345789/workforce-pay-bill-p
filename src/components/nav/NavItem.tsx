import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NavItemProps {
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
  badge?: number
}

export function NavItem({ icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        active 
          ? 'bg-accent text-accent-foreground' 
          : 'text-foreground hover:bg-muted'
      )}
    >
      <span className={active ? 'text-accent-foreground' : 'text-muted-foreground'}>
        {icon}
      </span>
      <span className="flex-1 text-left">{label}</span>
      {badge !== undefined && badge > 0 && (
        <Badge variant="destructive" className="ml-auto h-5 px-1.5 text-xs">
          {badge}
        </Badge>
      )}
    </button>
  )
}
