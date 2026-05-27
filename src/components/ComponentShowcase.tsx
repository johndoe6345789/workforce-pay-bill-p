import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { MagnifyingGlass, Code, Funnel, SquaresFour, Rows } from '@phosphor-icons/react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useComponentShowcase } from '@/hooks/useComponentShowcase'
import { categories } from '@/data/componentCategories'
import { CategorySidebar } from '@/components/showcase/CategorySidebar'
import { ComponentGrid } from '@/components/showcase/ComponentGrid'
import { ComponentList } from '@/components/showcase/ComponentList'
import { ComponentDetailContent } from '@/components/showcase/ComponentDetailContent'

export function ComponentShowcase() {
  const isMobile = useIsMobile()
  const vm = useComponentShowcase(isMobile)

  return (
    <div className="flex h-full bg-background rounded-lg border border-border overflow-hidden">
      {!isMobile && (
        <aside className="w-64 border-r border-border bg-card flex flex-col">
          <CategorySidebar
            searchQuery={vm.searchQuery}
            setSearchQuery={vm.setSearchQuery}
            selectedCategory={vm.selectedCategory}
            setSelectedCategory={vm.setSelectedCategory}
          />
        </aside>
      )}

      {isMobile && (
        <Sheet open={vm.showFilters} onOpenChange={vm.setShowFilters}>
          <SheetContent side="left" className="w-80 p-0 flex flex-col">
            <CategorySidebar
              searchQuery={vm.searchQuery}
              setSearchQuery={vm.setSearchQuery}
              selectedCategory={vm.selectedCategory}
              setSelectedCategory={vm.setSelectedCategory}
              onCategorySelect={() => vm.setShowFilters(false)}
            />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isMobile && (
                  <Button variant="outline" size="sm" onClick={() => vm.setShowFilters(true)} className="shrink-0">
                    <Funnel className="h-4 w-4" />
                  </Button>
                )}
                <h1 className="text-lg lg:text-2xl font-bold truncate">
                  {categories.find(c => c.id === vm.selectedCategory)?.label || 'All Components'}
                </h1>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground">
                {vm.filteredItems.length} {vm.filteredItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={vm.viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => vm.setViewMode('grid')}
                className="hidden sm:flex"
              >
                <SquaresFour className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={vm.viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => vm.setViewMode('list')}
                className="hidden sm:flex"
              >
                <Rows className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">List</span>
              </Button>
              <Badge variant="outline" className="hidden lg:flex gap-1">
                <Code className="h-3 w-3" />
                v2.0
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            {vm.filteredItems.length === 0 ? (
              <Card className="p-8 lg:p-12">
                <div className="text-center space-y-2">
                  <MagnifyingGlass className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No components found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter</p>
                </div>
              </Card>
            ) : vm.viewMode === 'grid' ? (
              <ComponentGrid items={vm.filteredItems} onSelect={vm.handleComponentClick} />
            ) : (
              <ComponentList items={vm.filteredItems} onSelect={vm.handleComponentClick} isMobile={isMobile} />
            )}
          </div>
        </div>
      </main>

      {vm.selectedComponent && !isMobile && (
        <aside className="w-96 border-l border-border bg-card flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{vm.selectedComponent.name}</h2>
              <Button variant="ghost" size="sm" onClick={() => vm.setSelectedComponent(null)}>✕</Button>
            </div>
            <p className="text-sm text-muted-foreground">{vm.selectedComponent.description}</p>
            {vm.selectedComponent.isNew && (
              <Badge variant="default" className="mt-2">New Component</Badge>
            )}
          </div>
          <ComponentDetailContent component={vm.selectedComponent} />
        </aside>
      )}

      {isMobile && vm.selectedComponent && (
        <Sheet open={vm.showDetails} onOpenChange={vm.setShowDetails}>
          <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <SheetTitle className="text-lg font-semibold">{vm.selectedComponent.name}</SheetTitle>
              </div>
              <p className="text-sm text-muted-foreground text-left">{vm.selectedComponent.description}</p>
              {vm.selectedComponent.isNew && (
                <Badge variant="default" className="mt-2 w-fit">New Component</Badge>
              )}
            </SheetHeader>
            <ComponentDetailContent component={vm.selectedComponent} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
