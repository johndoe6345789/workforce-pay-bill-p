import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/ui/status-badge'
import { Chip } from '@/components/ui/chip'
import { Avatar } from '@/components/ui/avatar'
import { MetricCard } from '@/components/ui/metric-card'
import { StatCard } from '@/components/ui/stat-card'
import { User, TrendUp } from '@phosphor-icons/react'
import type { ComponentItem } from './componentRegistry.types'

export const displayItems: ComponentItem[] = [
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
]
