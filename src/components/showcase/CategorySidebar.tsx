import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { MagnifyingGlass, Cube } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { categories } from '@/data/componentCategories'
import { components, hooks, allItems } from '@/data/componentRegistry'
import type { ComponentCategory } from '@/data/componentRegistry'

interface Props {
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedCategory: ComponentCategory
  setSelectedCategory: (c: ComponentCategory) => void
  onCategorySelect?: () => void
}

export function CategorySidebar({
  searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, onCategorySelect
}: Props) {
  return (
    <>
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Cube className="h-6 w-6 text-primary" />
          <h2 className="text-lg font-semibold">Components</h2>
        </div>
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {categories.map(category => {
            const Icon = category.icon
            const isActive = selectedCategory === category.id
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  onCategorySelect?.()
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors',
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-foreground'
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </div>
                <Badge variant={isActive ? 'secondary' : 'outline'} className="text-xs">
                  {category.count}
                </Badge>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center justify-between">
            <span>Components:</span>
            <span className="font-mono">{components.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Hooks:</span>
            <span className="font-mono">{hooks.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>New:</span>
            <span className="font-mono">{allItems.filter(i => i.isNew).length}</span>
          </div>
        </div>
      </div>
    </>
  )
}
