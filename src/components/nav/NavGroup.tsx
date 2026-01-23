import { CaretDown, CaretRight } from '@phosphor-icons/react'

interface NavGroupProps {
  id: string
  label: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function NavGroup({ label, expanded, onToggle, children }: NavGroupProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors"
      >
        {expanded ? <CaretDown size={14} weight="bold" /> : <CaretRight size={14} weight="bold" />}
        <span className="flex-1 text-left">{label}</span>
      </button>
      {expanded && (
        <div className="space-y-1 pl-2">
          {children}
        </div>
      )}
    </div>
  )
}
