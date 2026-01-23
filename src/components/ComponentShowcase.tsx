import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  MagnifyingGlass, 
  Cube,
  Package,
  Palette,
  Code,
  Lightning,
  Stack,
  CircleNotch,
  CheckCircle,
  List
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

type ComponentCategory = 
  | 'all'
  | 'buttons'
  | 'forms'
  | 'data-display'
  | 'feedback'
  | 'layout'
  | 'navigation'
  | 'overlays'
  | 'hooks'

interface ComponentItem {
  id: string
  name: string
  category: ComponentCategory[]
  description: string
  variant?: string
  path?: string
  isNew?: boolean
  tags?: string[]
}

const components: ComponentItem[] = [
  { id: 'button', name: 'Button', category: ['buttons'], description: 'Primary action trigger', tags: ['interactive', 'action'] },
  { id: 'icon-button', name: 'Icon Button', category: ['buttons'], description: 'Icon-only button', tags: ['interactive', 'icon'] },
  { id: 'input', name: 'Input', category: ['forms'], description: 'Text input field', tags: ['form', 'text'] },
  { id: 'search-input', name: 'Search Input', category: ['forms'], description: 'Search field with icon', tags: ['search', 'filter'], isNew: true },
  { id: 'textarea', name: 'Textarea', category: ['forms'], description: 'Multi-line text input', tags: ['form', 'text'] },
  { id: 'select', name: 'Select', category: ['forms'], description: 'Dropdown selection', tags: ['form', 'select'] },
  { id: 'multi-select', name: 'Multi Select', category: ['forms'], description: 'Multiple selection dropdown', tags: ['form', 'select'], isNew: true },
  { id: 'checkbox', name: 'Checkbox', category: ['forms'], description: 'Boolean input control', tags: ['form', 'boolean'] },
  { id: 'radio-group', name: 'Radio Group', category: ['forms'], description: 'Single selection group', tags: ['form', 'select'] },
  { id: 'switch', name: 'Switch', category: ['forms'], description: 'Toggle switch control', tags: ['form', 'boolean'] },
  { id: 'slider', name: 'Slider', category: ['forms'], description: 'Range input control', tags: ['form', 'number'] },
  { id: 'date-picker', name: 'Date Picker', category: ['forms'], description: 'Calendar date selection', tags: ['form', 'date'] },
  { id: 'date-range-picker', name: 'Date Range Picker', category: ['forms'], description: 'Date range selection', tags: ['form', 'date'], isNew: true },
  { id: 'file-upload', name: 'File Upload', category: ['forms'], description: 'Drag & drop file input', tags: ['form', 'upload'], isNew: true },
  { id: 'card', name: 'Card', category: ['layout', 'data-display'], description: 'Content container', tags: ['container'] },
  { id: 'stat-card', name: 'Stat Card', category: ['data-display'], description: 'Metric display card', tags: ['metric', 'dashboard'], isNew: true },
  { id: 'metric-card', name: 'Metric Card', category: ['data-display'], description: 'Enhanced metric card', tags: ['metric', 'dashboard'], isNew: true },
  { id: 'table', name: 'Table', category: ['data-display'], description: 'Data table', tags: ['data', 'grid'] },
  { id: 'data-table', name: 'Data Table', category: ['data-display'], description: 'Advanced data table', tags: ['data', 'grid'], isNew: true },
  { id: 'data-grid', name: 'Data Grid', category: ['data-display'], description: 'Full-featured data grid', tags: ['data', 'grid'], isNew: true },
  { id: 'data-list', name: 'Data List', category: ['data-display'], description: 'Key-value list display', tags: ['data', 'list'], isNew: true },
  { id: 'badge', name: 'Badge', category: ['data-display'], description: 'Status indicator', tags: ['status'] },
  { id: 'status-badge', name: 'Status Badge', category: ['data-display'], description: 'Semantic status badge', tags: ['status'], isNew: true },
  { id: 'chip', name: 'Chip', category: ['data-display'], description: 'Compact info element', tags: ['tag', 'label'], isNew: true },
  { id: 'avatar', name: 'Avatar', category: ['data-display'], description: 'User profile image', tags: ['user', 'image'] },
  { id: 'alert', name: 'Alert', category: ['feedback'], description: 'Attention message', tags: ['notification'] },
  { id: 'info-box', name: 'Info Box', category: ['feedback'], description: 'Information callout', tags: ['notification'], isNew: true },
  { id: 'toast', name: 'Toast', category: ['feedback'], description: 'Temporary notification', tags: ['notification'] },
  { id: 'progress', name: 'Progress', category: ['feedback'], description: 'Progress indicator', tags: ['loading'] },
  { id: 'spinner', name: 'Spinner', category: ['feedback'], description: 'Loading spinner', tags: ['loading'], isNew: true },
  { id: 'loading-spinner', name: 'Loading Spinner', category: ['feedback'], description: 'Enhanced loading spinner', tags: ['loading'], isNew: true },
  { id: 'loading-overlay', name: 'Loading Overlay', category: ['feedback'], description: 'Full-screen loading', tags: ['loading'], isNew: true },
  { id: 'empty-state', name: 'Empty State', category: ['feedback'], description: 'No data placeholder', tags: ['empty'], isNew: true },
  { id: 'skeleton', name: 'Skeleton', category: ['feedback'], description: 'Loading placeholder', tags: ['loading'] },
  { id: 'dialog', name: 'Dialog', category: ['overlays'], description: 'Modal dialog', tags: ['modal', 'overlay'] },
  { id: 'modal', name: 'Modal', category: ['overlays'], description: 'Modal wrapper', tags: ['modal', 'overlay'], isNew: true },
  { id: 'alert-dialog', name: 'Alert Dialog', category: ['overlays'], description: 'Confirmation dialog', tags: ['modal', 'confirm'] },
  { id: 'sheet', name: 'Sheet', category: ['overlays'], description: 'Side panel', tags: ['panel', 'drawer'] },
  { id: 'drawer', name: 'Drawer', category: ['overlays'], description: 'Slide-out panel', tags: ['panel', 'drawer'], isNew: true },
  { id: 'popover', name: 'Popover', category: ['overlays'], description: 'Floating content', tags: ['popup', 'tooltip'] },
  { id: 'tooltip', name: 'Tooltip', category: ['overlays'], description: 'Hover information', tags: ['popup', 'help'] },
  { id: 'tabs', name: 'Tabs', category: ['navigation'], description: 'Tabbed interface', tags: ['navigation'] },
  { id: 'breadcrumb', name: 'Breadcrumb', category: ['navigation'], description: 'Location trail', tags: ['navigation'], isNew: true },
  { id: 'pagination', name: 'Pagination', category: ['navigation'], description: 'Page navigation', tags: ['navigation'] },
  { id: 'stepper', name: 'Stepper', category: ['navigation'], description: 'Multi-step progress', tags: ['wizard', 'progress'], isNew: true },
  { id: 'timeline', name: 'Timeline', category: ['data-display'], description: 'Event timeline', tags: ['events', 'history'], isNew: true },
  { id: 'accordion', name: 'Accordion', category: ['layout'], description: 'Collapsible content', tags: ['collapse'] },
  { id: 'collapsible', name: 'Collapsible', category: ['layout'], description: 'Toggle visibility', tags: ['collapse'] },
  { id: 'separator', name: 'Separator', category: ['layout'], description: 'Visual divider', tags: ['divider'] },
  { id: 'divider', name: 'Divider', category: ['layout'], description: 'Content separator', tags: ['divider'], isNew: true },
  { id: 'scroll-area', name: 'Scroll Area', category: ['layout'], description: 'Custom scrollbar', tags: ['scroll'] },
]

const hooks: ComponentItem[] = [
  { id: 'use-debounce', name: 'useDebounce', category: ['hooks'], description: 'Delay value updates', tags: ['performance'], isNew: true },
  { id: 'use-throttle', name: 'useThrottle', category: ['hooks'], description: 'Limit execution rate', tags: ['performance'], isNew: true },
  { id: 'use-toggle', name: 'useToggle', category: ['hooks'], description: 'Boolean state toggle', tags: ['state'], isNew: true },
  { id: 'use-local-storage', name: 'useLocalStorage', category: ['hooks'], description: 'Persist state to localStorage', tags: ['storage'], isNew: true },
  { id: 'use-pagination', name: 'usePagination', category: ['hooks'], description: 'Pagination logic', tags: ['data'], isNew: true },
  { id: 'use-selection', name: 'useSelection', category: ['hooks'], description: 'Multi-item selection', tags: ['data'], isNew: true },
  { id: 'use-sort', name: 'useSort', category: ['hooks'], description: 'Sortable data', tags: ['data'], isNew: true },
  { id: 'use-filter', name: 'useFilter', category: ['hooks'], description: 'Data filtering', tags: ['data'], isNew: true },
  { id: 'use-wizard', name: 'useWizard', category: ['hooks'], description: 'Multi-step wizard', tags: ['navigation'], isNew: true },
  { id: 'use-clipboard', name: 'useClipboard', category: ['hooks'], description: 'Copy to clipboard', tags: ['utility'], isNew: true },
  { id: 'use-async', name: 'useAsync', category: ['hooks'], description: 'Async state management', tags: ['async'], isNew: true },
  { id: 'use-fetch', name: 'useFetch', category: ['hooks'], description: 'Data fetching', tags: ['async', 'api'], isNew: true },
  { id: 'use-form-validation', name: 'useFormValidation', category: ['hooks'], description: 'Form validation logic', tags: ['form'], isNew: true },
  { id: 'use-invoicing', name: 'useInvoicing', category: ['hooks'], description: 'Invoice calculations', tags: ['business'], isNew: true },
  { id: 'use-payroll', name: 'usePayrollCalculations', category: ['hooks'], description: 'Payroll calculations', tags: ['business'], isNew: true },
  { id: 'use-time-tracking', name: 'useTimeTracking', category: ['hooks'], description: 'Time tracking logic', tags: ['business'], isNew: true },
  { id: 'use-rate-calculator', name: 'useRateCalculator', category: ['hooks'], description: 'Rate calculations', tags: ['business'], isNew: true },
]

const allItems = [...components, ...hooks]

const categories = [
  { id: 'all', label: 'All', icon: Cube, count: allItems.length },
  { id: 'buttons', label: 'Buttons', icon: Lightning, count: components.filter(c => c.category.includes('buttons')).length },
  { id: 'forms', label: 'Forms', icon: List, count: components.filter(c => c.category.includes('forms')).length },
  { id: 'data-display', label: 'Data Display', icon: Package, count: components.filter(c => c.category.includes('data-display')).length },
  { id: 'feedback', label: 'Feedback', icon: CheckCircle, count: components.filter(c => c.category.includes('feedback')).length },
  { id: 'layout', label: 'Layout', icon: Stack, count: components.filter(c => c.category.includes('layout')).length },
  { id: 'navigation', label: 'Navigation', icon: Palette, count: components.filter(c => c.category.includes('navigation')).length },
  { id: 'overlays', label: 'Overlays', icon: Stack, count: components.filter(c => c.category.includes('overlays')).length },
  { id: 'hooks', label: 'Hooks', icon: CircleNotch, count: hooks.length },
] as const

export function ComponentShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null)

  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category.includes(selectedCategory)
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  onClick={() => setSelectedCategory(category.id as ComponentCategory)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{category.label}</span>
                  </div>
                  <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
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
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {categories.find(c => c.id === selectedCategory)?.label || 'All Components'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Code className="h-3 w-3" />
                v2.0
              </Badge>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6">
            {filteredItems.length === 0 ? (
              <Card className="p-12">
                <div className="text-center space-y-2">
                  <MagnifyingGlass className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No components found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map(item => (
                  <Card 
                    key={item.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => setSelectedComponent(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            {item.isNew && (
                              <Badge variant="default" className="text-xs px-1.5 py-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {selectedComponent && (
        <aside className="w-96 border-l border-border bg-card flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">{selectedComponent.name}</h2>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedComponent(null)}
              >
                ✕
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedComponent.description}
            </p>
            {selectedComponent.isNew && (
              <Badge variant="default" className="mt-2">
                New Component
              </Badge>
            )}
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Category</h3>
                    <div className="flex flex-wrap gap-1">
                      {selectedComponent.category.map(cat => (
                        <Badge key={cat} variant="secondary">
                          {categories.find(c => c.id === cat)?.label || cat}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedComponent.tags && (
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-1">
                        {selectedComponent.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedComponent.description}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="usage" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Import</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs font-mono">
                        {selectedComponent.category.includes('hooks')
                          ? `import { ${selectedComponent.name} } from '@/hooks'`
                          : `import { ${selectedComponent.name} } from '@/components/ui/${selectedComponent.id}'`
                        }
                      </code>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Basic Example</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs font-mono whitespace-pre-wrap">
                        {selectedComponent.category.includes('hooks')
                          ? `const value = ${selectedComponent.name}()`
                          : `<${selectedComponent.name} />`
                        }
                      </code>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    See component files for full implementation details and examples.
                  </div>
                </TabsContent>

                <TabsContent value="api" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Props & API</h3>
                    <p className="text-sm text-muted-foreground">
                      View the TypeScript definitions in the component file for complete prop types and API documentation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">File Location</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs font-mono break-all">
                        {selectedComponent.category.includes('hooks')
                          ? `src/hooks/${selectedComponent.id}.ts`
                          : `src/components/ui/${selectedComponent.id}.tsx`
                        }
                      </code>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </aside>
      )}
    </div>
  )
}
