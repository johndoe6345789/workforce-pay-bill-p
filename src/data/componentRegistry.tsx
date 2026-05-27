import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import {
  MagnifyingGlass,
  CheckCircle,
  User,
  X,
  TrendUp,
  Info,
  Warning,
} from '@phosphor-icons/react'

export type ComponentCategory =
  | 'all'
  | 'buttons'
  | 'forms'
  | 'data-display'
  | 'feedback'
  | 'layout'
  | 'navigation'
  | 'overlays'
  | 'hooks'

export interface ComponentItem {
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

export const components: ComponentItem[] = [
  {
    id: 'button', name: 'Button', category: ['buttons'], description: 'Primary action trigger', tags: ['interactive', 'action'],
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
    id: 'icon-button', name: 'Icon Button', category: ['buttons'], description: 'Icon-only button', tags: ['interactive', 'icon'],
    demo: () => (
      <div className="flex gap-2">
        <Button size="icon"><CheckCircle /></Button>
        <Button size="icon" variant="outline"><User /></Button>
        <Button size="icon" variant="ghost"><X /></Button>
      </div>
    )
  },
  {
    id: 'input', name: 'Input', category: ['forms'], description: 'Text input field', tags: ['form', 'text'],
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
    id: 'search-input', name: 'Search Input', category: ['forms'], description: 'Search field with icon', tags: ['search', 'filter'], isNew: true,
    demo: () => (
      <div className="relative w-full">
        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-9" />
      </div>
    )
  },
  {
    id: 'select', name: 'Select', category: ['forms'], description: 'Dropdown selection', tags: ['form', 'select'],
    demo: () => (
      <Select>
        <SelectTrigger className="w-full"><SelectValue placeholder="Select option" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
          <SelectItem value="option3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    )
  },
  {
    id: 'checkbox', name: 'Checkbox', category: ['forms'], description: 'Boolean input control', tags: ['form', 'boolean'],
    demo: () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2"><Checkbox id="c1" /><label htmlFor="c1" className="text-sm">Default</label></div>
        <div className="flex items-center gap-2"><Checkbox id="c2" defaultChecked /><label htmlFor="c2" className="text-sm">Checked</label></div>
        <div className="flex items-center gap-2"><Checkbox id="c3" disabled /><label htmlFor="c3" className="text-sm">Disabled</label></div>
      </div>
    )
  },
  {
    id: 'switch', name: 'Switch', category: ['forms'], description: 'Toggle switch control', tags: ['form', 'boolean'],
    demo: () => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2"><Switch id="s1" /><label htmlFor="s1" className="text-sm">Off</label></div>
        <div className="flex items-center gap-2"><Switch id="s2" defaultChecked /><label htmlFor="s2" className="text-sm">On</label></div>
        <div className="flex items-center gap-2"><Switch id="s3" disabled /><label htmlFor="s3" className="text-sm">Disabled</label></div>
      </div>
    )
  },
  {
    id: 'slider', name: 'Slider', category: ['forms'], description: 'Range input control', tags: ['form', 'number'],
    demo: () => (
      <div className="space-y-4 w-full">
        <Slider defaultValue={[50]} max={100} step={1} />
        <Slider defaultValue={[25, 75]} max={100} step={1} />
      </div>
    )
  },
  {
    id: 'badge', name: 'Badge', category: ['data-display'], description: 'Status indicator', tags: ['status'],
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
    id: 'status-badge', name: 'Status Badge', category: ['data-display'], description: 'Semantic status badge', tags: ['status'], isNew: true,
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
    id: 'chip', name: 'Chip', category: ['data-display'], description: 'Compact info element', tags: ['tag', 'label'], isNew: true,
    demo: () => (
      <div className="flex flex-wrap gap-2">
        <Chip label="Default Chip" />
        <Chip label="Outlined" variant="outline" />
        <Chip label="Removable" onRemove={() => {}} />
      </div>
    )
  },
  {
    id: 'avatar', name: 'Avatar', category: ['data-display'], description: 'User profile image', tags: ['user', 'image'],
    demo: () => (
      <div className="flex gap-2">
        <Avatar><div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center">JD</div></Avatar>
        <Avatar><div className="bg-secondary text-secondary-foreground w-full h-full flex items-center justify-center">AB</div></Avatar>
        <Avatar><div className="bg-accent text-accent-foreground w-full h-full flex items-center justify-center">XY</div></Avatar>
      </div>
    )
  },
  {
    id: 'stat-card', name: 'Stat Card', category: ['data-display'], description: 'Metric display card', tags: ['metric', 'dashboard'], isNew: true,
    demo: () => (
      <div className="grid gap-2 w-full">
        <StatCard label="Total Revenue" value="£45,231" trend={{ value: 12.5, isPositive: true }} icon={<TrendUp />} />
      </div>
    )
  },
  {
    id: 'metric-card', name: 'Metric Card', category: ['data-display'], description: 'Enhanced metric card', tags: ['metric', 'dashboard'], isNew: true,
    demo: () => (
      <div className="w-full">
        <MetricCard label="Active Workers" value={127} change={{ value: 8, trend: 'up' }} icon={<User />} />
      </div>
    )
  },
  {
    id: 'alert', name: 'Alert', category: ['feedback'], description: 'Attention message', tags: ['notification'],
    demo: () => (
      <div className="space-y-2 w-full">
        <Alert><Info className="h-4 w-4" /><AlertTitle>Info</AlertTitle><AlertDescription>This is an informational message.</AlertDescription></Alert>
        <Alert variant="destructive"><Warning className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>Something went wrong.</AlertDescription></Alert>
      </div>
    )
  },
  {
    id: 'info-box', name: 'Info Box', category: ['feedback'], description: 'Information callout', tags: ['notification'], isNew: true,
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
    id: 'progress', name: 'Progress', category: ['feedback'], description: 'Progress indicator', tags: ['loading'],
    demo: () => (
      <div className="space-y-3 w-full">
        <Progress value={25} /><Progress value={50} /><Progress value={75} /><Progress value={100} />
      </div>
    )
  },
  {
    id: 'spinner', name: 'Spinner', category: ['feedback'], description: 'Loading spinner', tags: ['loading'], isNew: true,
    demo: () => (
      <div className="flex gap-4">
        <Spinner size="sm" /><Spinner size="md" /><Spinner size="lg" />
      </div>
    )
  },
  {
    id: 'card', name: 'Card', category: ['layout', 'data-display'], description: 'Content container', tags: ['container'],
    demo: () => (
      <Card className="w-full">
        <CardHeader><CardTitle>Card Title</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground">This is a card with header and content.</p></CardContent>
      </Card>
    )
  },
  {
    id: 'separator', name: 'Separator', category: ['layout'], description: 'Visual divider', tags: ['divider'],
    demo: () => (
      <div className="space-y-2 w-full">
        <div>Content above</div><Separator /><div>Content below</div>
      </div>
    )
  },
  {
    id: 'tabs', name: 'Tabs', category: ['navigation'], description: 'Tabbed interface', tags: ['navigation'],
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

export const hooks: ComponentItem[] = [
  { id: 'use-debounce',      name: 'useDebounce',           category: ['hooks'], description: 'Delay value updates',              tags: ['performance'], isNew: true },
  { id: 'use-throttle',      name: 'useThrottle',           category: ['hooks'], description: 'Limit execution rate',             tags: ['performance'], isNew: true },
  { id: 'use-toggle',        name: 'useToggle',             category: ['hooks'], description: 'Boolean state toggle',             tags: ['state'],       isNew: true },
  { id: 'use-local-storage', name: 'useLocalStorage',       category: ['hooks'], description: 'Persist state to localStorage',    tags: ['storage'],     isNew: true },
  { id: 'use-pagination',    name: 'usePagination',         category: ['hooks'], description: 'Pagination logic',                 tags: ['data'],        isNew: true },
  { id: 'use-selection',     name: 'useSelection',          category: ['hooks'], description: 'Multi-item selection',             tags: ['data'],        isNew: true },
  { id: 'use-sort',          name: 'useSort',               category: ['hooks'], description: 'Sortable data',                   tags: ['data'],        isNew: true },
  { id: 'use-filter',        name: 'useFilter',             category: ['hooks'], description: 'Data filtering',                  tags: ['data'],        isNew: true },
  { id: 'use-wizard',        name: 'useWizard',             category: ['hooks'], description: 'Multi-step wizard',               tags: ['navigation'],  isNew: true },
  { id: 'use-clipboard',     name: 'useClipboard',          category: ['hooks'], description: 'Copy to clipboard',               tags: ['utility'],     isNew: true },
  { id: 'use-async',         name: 'useAsync',              category: ['hooks'], description: 'Async state management',          tags: ['async'],       isNew: true },
  { id: 'use-fetch',         name: 'useFetch',              category: ['hooks'], description: 'Data fetching',                   tags: ['async', 'api'],isNew: true },
  { id: 'use-form-validation',name: 'useFormValidation',    category: ['hooks'], description: 'Form validation logic',           tags: ['form'],        isNew: true },
  { id: 'use-invoicing',     name: 'useInvoicing',          category: ['hooks'], description: 'Invoice calculations',            tags: ['business'],    isNew: true },
  { id: 'use-payroll',       name: 'usePayrollCalculations',category: ['hooks'], description: 'Payroll calculations',            tags: ['business'],    isNew: true },
  { id: 'use-time-tracking', name: 'useTimeTracking',       category: ['hooks'], description: 'Time tracking logic',            tags: ['business'],    isNew: true },
  { id: 'use-rate-calculator',name: 'useRateCalculator',    category: ['hooks'], description: 'Rate calculations',              tags: ['business'],    isNew: true },
]

export const allItems = [...components, ...hooks]
