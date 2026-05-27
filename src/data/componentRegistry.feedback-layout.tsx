import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { InfoBox } from '@/components/ui/info-box'
import { Info, Warning } from '@phosphor-icons/react'
import type { ComponentItem } from './componentRegistry.types'

export const feedbackLayoutItems: ComponentItem[] = [
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
