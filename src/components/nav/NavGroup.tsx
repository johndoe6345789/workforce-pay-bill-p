import { CaretDown, CaretRight } from '@phosphor-icons/react'

interface NavGroupProps {
  id: string
  label: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function NavGroup({ id, label, expanded, onToggle, children }: NavGroupProps) {
  return (
    <div className="space-y-1">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-expanded={expanded}
        aria-controls={`nav-group-${id}`}
        aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label} section`}
      >
        {expanded ? <CaretDown size={14} weight="bold" aria-hidden="true" /> : <CaretRight size={14} weight="bold" aria-hidden="true" />}
        <span className="flex-1 text-left">{label}</span>
      </button>
      {expanded && (
        <div id={`nav-group-${id}`} className="space-y-1 pl-2" role="group" aria-label={`${label} navigation items`}>
          {children}
        </div>
      )}
    </div>
  )
}
