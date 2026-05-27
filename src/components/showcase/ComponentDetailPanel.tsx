import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ComponentDetailContent } from '@/components/showcase/ComponentDetailContent'
import type { ComponentItem } from '@/data/componentRegistry'

interface Props {
  selectedComponent: ComponentItem | null
  isMobile: boolean
  showDetails: boolean
  setShowDetails: (v: boolean) => void
  setSelectedComponent: (c: ComponentItem | null) => void
}

export function ComponentDetailPanel({
  selectedComponent, isMobile, showDetails, setShowDetails, setSelectedComponent,
}: Props) {
  if (!selectedComponent) return null

  const header = (
    <>
      <p className="text-sm text-muted-foreground">{selectedComponent.description}</p>
      {selectedComponent.isNew && <Badge variant="default" className="mt-2 w-fit">New Component</Badge>}
    </>
  )

  if (!isMobile) {
    return (
      <aside className="w-96 border-l border-border bg-card flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">{selectedComponent.name}</h2>
            <Button variant="ghost" size="sm" onClick={() => setSelectedComponent(null)}>✕</Button>
          </div>
          {header}
        </div>
        <ComponentDetailContent component={selectedComponent} />
      </aside>
    )
  }

  return (
    <Sheet open={showDetails} onOpenChange={setShowDetails}>
      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <SheetTitle className="text-lg font-semibold">{selectedComponent.name}</SheetTitle>
          </div>
          <div className="text-left">{header}</div>
        </SheetHeader>
        <ComponentDetailContent component={selectedComponent} />
      </SheetContent>
    </Sheet>
  )
}
