import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { StatusBadge } from '@/components/ui/status-badge'
import { MetricCard } from '@/components/ui/metric-card'
import { StatCard } from '@/components/ui/stat-card'
import { Avatar } from '@/components/ui/avatar'
import { InfoBox } from '@/components/ui/info-box'
import { Chip } from '@/components/ui/chip'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
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
  List as ListIcon,
  Play,
  Eye,
  Warning,
  Info,
  CheckCircle as CheckCircleIcon,
  TrendUp,
  User,
  X,
  Funnel,
  SquaresFour,
  Rows
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/hooks/use-mobile'

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
  demo?: () => React.ReactNode
}

const components: ComponentItem[] = [
  { 
    id: 'button', 
    name: 'Button', 
    category: ['buttons'], 
    description: 'Primary action trigger', 
    tags: ['interactive', 'action'],
    demo: () => (
      <div className="flex flex-wrap gap-2">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button size="sm">Small</Button>
        <Button size="lg">Large</Button>
        <Button disabled>Disabled</Button>
      </div>
    )
  },
  { 
    id: 'icon-button', 
    name: 'Icon Button', 
    category: ['buttons'], 
    description: 'Icon-only button', 
    tags: ['interactive', 'icon'],
    demo: () => (
      <div className="flex gap-2">
        <Button size="icon"><CheckCircle /></Button>
        <Button size="icon" variant="outline"><User /></Button>
        <Button size="icon" variant="ghost"><X /></Button>
      </div>
    )
  },
  { 
    id: 'input', 
    name: 'Input', 
    category: ['forms'], 
    description: 'Text input field', 
    tags: ['form', 'text'],
    demo: () => (
      <div className="space-y-2 w-full">
        <Input placeholder="Default input" />
        <Input placeholder="Disabled input" disabled />
        <Input type="email" placeholder="email@example.com" />
        <Input type="password" placeholder="Password" />
      </div>
    )
  },
  { 
    id: 'search-input', 
    name: 'Search Input', 
    category: ['forms'], 
    description: 'Search field with icon', 
    tags: ['search', 'filter'], 
    isNew: true,
    demo: () => (
      <div className="relative w-full">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>
    )
  },
  { 
    id: 'select', 
    name: 'Select', 
    category: ['forms'], 
    description: 'Dropdown selection', 
    tags: ['form', 'select'],
    demo: () => (
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    )
  },
  { 
    id: 'checkbox', 
    name: 'Checkbox', 
    category: ['forms'], 
    description: 'Boolean input control', 
    tags: ['form', 'boolean'],
    demo: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Checkbox id="c1" />
          <label htmlFor="c1" className="text-sm">Default</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c2" defaultChecked />
          <label htmlFor="c2" className="text-sm">Checked</label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="c3" disabled />
          <label htmlFor="c3" className="text-sm">Disabled</label>
        </div>
      </div>
    )
  },
  { 
    id: 'switch', 
    name: 'Switch', 
    category: ['forms'], 
    description: 'Toggle switch control', 
    tags: ['form', 'boolean'],
    demo: () => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Switch id="s1" />
          <label htmlFor="s1" className="text-sm">Off</label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="s2" defaultChecked />
          <label htmlFor="s2" className="text-sm">On</label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="s3" disabled />
          <label htmlFor="s3" className="text-sm">Disabled</label>
        </div>
      </div>
    )
  },
  { 
    id: 'slider', 
    name: 'Slider', 
    category: ['forms'], 
    description: 'Range input control', 
    tags: ['form', 'number'],
    demo: () => (
      <div className="space-y-4 w-full">
        <Slider defaultValue={[50]} max={100} step={1} />
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>
    )
  },
  { 
    id: 'badge', 
    name: 'Badge', 
    category: ['data-display'], 
    description: 'Status indicator', 
    tags: ['status'],
    demo: () => (
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    )
  },
  { 
    id: 'status-badge', 
    name: 'Status Badge', 
    category: ['data-display'], 
    description: 'Semantic status badge', 
    tags: ['status'], 
    isNew: true,
    demo: () => (
      <div className="flex flex-wrap gap-2">
        <StatusBadge status="success" label="Success" />
        <StatusBadge status="warning" label="Warning" />
        <StatusBadge status="error" label="Error" />
        <StatusBadge status="info" label="Info" />
        <StatusBadge status="neutral" label="Neutral" />
      </div>
    )
  },
  { 
    id: 'chip', 
    name: 'Chip', 
    category: ['data-display'], 
    description: 'Compact info element', 
    tags: ['tag', 'label'], 
    isNew: true,
    demo: () => (
      <div className="flex flex-wrap gap-2">
        <Chip label="Default Chip" />
        <Chip label="Outlined" variant="outline" />
        <Chip label="Removable" onRemove={() => {}} />
      </div>
    )
  },
  { 
    id: 'avatar', 
    name: 'Avatar', 
    category: ['data-display'], 
    description: 'User profile image', 
    tags: ['user', 'image'],
    demo: () => (
      <div className="flex gap-2">
        <Avatar>
          <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center">JD</div>
        </Avatar>
        <Avatar>
          <div className="bg-secondary text-secondary-foreground w-full h-full flex items-center justify-center">AB</div>
        </Avatar>
        <Avatar>
          <div className="bg-accent text-accent-foreground w-full h-full flex items-center justify-center">XY</div>
        </Avatar>
      </div>
    )
  },
  { 
    id: 'stat-card', 
    name: 'Stat Card', 
    category: ['data-display'], 
    description: 'Metric display card', 
    tags: ['metric', 'dashboard'], 
    isNew: true,
    demo: () => (
      <div className="grid gap-2 w-full">
        <StatCard
          label="Total Revenue"
          value="£45,231"
          trend={{ value: 12.5, isPositive: true }}
          icon={<TrendUp />}
        />
      </div>
    )
  },
  { 
    id: 'metric-card', 
    name: 'Metric Card', 
    category: ['data-display'], 
    description: 'Enhanced metric card', 
    tags: ['metric', 'dashboard'], 
    isNew: true,
    demo: () => (
      <div className="w-full">
        <MetricCard
          label="Active Workers"
          value={127}
          change={{ value: 8, trend: 'up' }}
          icon={<User />}
        />
      </div>
    )
  },
  { 
    id: 'alert', 
    name: 'Alert', 
    category: ['feedback'], 
    description: 'Attention message', 
    tags: ['notification'],
    demo: () => (
      <div className="space-y-2 w-full">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>This is an informational message.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <Warning className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong.</AlertDescription>
        </Alert>
      </div>
    )
  },
  { 
    id: 'info-box', 
    name: 'Info Box', 
    category: ['feedback'], 
    description: 'Information callout', 
    tags: ['notification'], 
    isNew: true,
    demo: () => (
      <div className="space-y-2 w-full">
        <InfoBox variant="info">Information message</InfoBox>
        <InfoBox variant="success">Success message</InfoBox>
        <InfoBox variant="warning">Warning message</InfoBox>
        <InfoBox variant="error">Error message</InfoBox>
      </div>
    )
  },
  { 
    id: 'progress', 
    name: 'Progress', 
    category: ['feedback'], 
    description: 'Progress indicator', 
    tags: ['loading'],
    demo: () => (
      <div className="space-y-3 w-full">
        <Progress value={25} />
        <Progress value={50} />
        <Progress value={75} />
        <Progress value={100} />
      </div>
    )
  },
  { 
    id: 'spinner', 
    name: 'Spinner', 
    category: ['feedback'], 
    description: 'Loading spinner', 
    tags: ['loading'], 
    isNew: true,
    demo: () => (
      <div className="flex gap-4">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
      </div>
    )
  },
  { 
    id: 'card', 
    name: 'Card', 
    category: ['layout', 'data-display'], 
    description: 'Content container', 
    tags: ['container'],
    demo: () => (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a card with header and content.
          </p>
        </CardContent>
      </Card>
    )
  },
  { 
    id: 'separator', 
    name: 'Separator', 
    category: ['layout'], 
    description: 'Visual divider', 
    tags: ['divider'],
    demo: () => (
      <div className="space-y-2 w-full">
        <div>Content above</div>
        <Separator />
        <div>Content below</div>
      </div>
    )
  },
  { 
    id: 'tabs', 
    name: 'Tabs', 
    category: ['navigation'], 
    description: 'Tabbed interface', 
    tags: ['navigation'],
    demo: () => (
      <Tabs defaultValue="tab1" className="w-full">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    )
  },
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
  { id: 'forms', label: 'Forms', icon: ListIcon, count: components.filter(c => c.category.includes('forms')).length },
  { id: 'data-display', label: 'Data Display', icon: Package, count: components.filter(c => c.category.includes('data-display')).length },
  { id: 'feedback', label: 'Feedback', icon: CheckCircle, count: components.filter(c => c.category.includes('feedback')).length },
  { id: 'layout', label: 'Layout', icon: Stack, count: components.filter(c => c.category.includes('layout')).length },
  { id: 'navigation', label: 'Navigation', icon: Palette, count: components.filter(c => c.category.includes('navigation')).length },
  { id: 'overlays', label: 'Overlays', icon: Stack, count: components.filter(c => c.category.includes('overlays')).length },
  { id: 'hooks', label: 'Hooks', icon: CircleNotch, count: hooks.length },
] as const

export function ComponentShowcase() {
  const isMobile = useIsMobile()
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category.includes(selectedCategory)
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleComponentClick = (item: ComponentItem) => {
    setSelectedComponent(item)
    if (isMobile) {
      setShowDetails(true)
    }
  }

  const CategorySidebar = () => (
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
                onClick={() => {
                  setSelectedCategory(category.id as ComponentCategory)
                  if (isMobile) setShowFilters(false)
                }}
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
    </>
  )

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background">
      {!isMobile && (
        <aside className="w-64 border-r border-border bg-card flex flex-col">
          <CategorySidebar />
        </aside>
      )}

      {isMobile && (
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="left" className="w-80 p-0 flex flex-col">
            <CategorySidebar />
          </SheetContent>
        </Sheet>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border bg-card px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isMobile && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(true)}
                    className="shrink-0"
                  >
                    <Funnel className="h-4 w-4" />
                  </Button>
                )}
                <h1 className="text-lg lg:text-2xl font-bold truncate">
                  {categories.find(c => c.id === selectedCategory)?.label || 'All Components'}
                </h1>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="hidden sm:flex"
              >
                <SquaresFour className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
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

        <ScrollArea className="flex-1">
          <div className="p-4 lg:p-6">
            {filteredItems.length === 0 ? (
              <Card className="p-8 lg:p-12">
                <div className="text-center space-y-2">
                  <MagnifyingGlass className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="text-lg font-semibold">No components found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try adjusting your search or filter
                  </p>
                </div>
              </Card>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
                {filteredItems.map(item => (
                  <Card 
                    key={item.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden"
                    onClick={() => handleComponentClick(item)}
                  >
                    <CardContent className="p-3 lg:p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                              {item.name}
                            </h3>
                            {item.isNew && (
                              <Badge variant="default" className="text-xs px-1.5 py-0 shrink-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {item.demo && (
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            <Play className="h-3 w-3" />
                            Preview
                          </div>
                          <div className="bg-muted/30 p-3 rounded-md flex items-center justify-center min-h-[80px] overflow-x-auto">
                            {item.demo()}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map(item => (
                  <Card 
                    key={item.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer group"
                    onClick={() => handleComponentClick(item)}
                  >
                    <CardContent className="p-3 lg:p-4">
                      <div className="flex items-start gap-3 lg:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {item.name}
                            </h3>
                            {item.isNew && (
                              <Badge variant="default" className="text-xs px-1.5 py-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        {item.demo && !isMobile && (
                          <div className="w-48 lg:w-64 bg-muted/30 p-3 rounded-md flex items-center justify-center overflow-x-auto shrink-0">
                            {item.demo()}
                          </div>
                        )}
                        <Eye className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {selectedComponent && !isMobile && (
        <aside className="w-96 border-l border-border bg-card flex flex-col overflow-hidden">
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
              {selectedComponent.demo && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Play className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">Live Preview</h3>
                  </div>
                  <Card>
                    <CardContent className="p-6 flex items-center justify-center min-h-[120px]">
                      {selectedComponent.demo()}
                    </CardContent>
                  </Card>
                </div>
              )}

              <Tabs defaultValue="usage" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="overview">Details</TabsTrigger>
                  <TabsTrigger value="api">API</TabsTrigger>
                </TabsList>
                
                <TabsContent value="usage" className="space-y-4 mt-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Import</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs font-mono break-all">
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
                      <code className="text-xs font-mono whitespace-pre-wrap break-all">
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

      {isMobile && selectedComponent && (
        <Sheet open={showDetails} onOpenChange={setShowDetails}>
          <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
            <SheetHeader className="p-4 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <SheetTitle className="text-lg font-semibold">{selectedComponent.name}</SheetTitle>
              </div>
              <p className="text-sm text-muted-foreground text-left">
                {selectedComponent.description}
              </p>
              {selectedComponent.isNew && (
                <Badge variant="default" className="mt-2 w-fit">
                  New Component
                </Badge>
              )}
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="p-4 space-y-6">
                {selectedComponent.demo && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Play className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold">Live Preview</h3>
                    </div>
                    <Card>
                      <CardContent className="p-4 flex items-center justify-center min-h-[120px] overflow-x-auto">
                        {selectedComponent.demo()}
                      </CardContent>
                    </Card>
                  </div>
                )}

                <Tabs defaultValue="usage" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="usage" className="text-xs">Usage</TabsTrigger>
                    <TabsTrigger value="overview" className="text-xs">Details</TabsTrigger>
                    <TabsTrigger value="api" className="text-xs">API</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="usage" className="space-y-4 mt-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Import</h3>
                      <div className="bg-muted p-3 rounded-md overflow-x-auto">
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
                      <div className="bg-muted p-3 rounded-md overflow-x-auto">
                        <code className="text-xs font-mono">
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

                  <TabsContent value="api" className="space-y-4 mt-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Props & API</h3>
                      <p className="text-sm text-muted-foreground">
                        View the TypeScript definitions in the component file for complete prop types and API documentation.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold mb-2">File Location</h3>
                      <div className="bg-muted p-3 rounded-md overflow-x-auto">
                        <code className="text-xs font-mono">
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
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
