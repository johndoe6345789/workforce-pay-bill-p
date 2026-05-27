import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Play } from '@phosphor-icons/react'
import { categories } from '@/data/componentCategories'
import type { ComponentItem } from '@/data/componentRegistry'

interface Props {
  component: ComponentItem
}

export function ComponentDetailContent({ component }: Props) {
  const isHook = component.category.includes('hooks')

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-6">
        {component.demo && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Play className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Live Preview</h3>
            </div>
            <Card>
              <CardContent className="p-4 flex items-center justify-center min-h-[120px] overflow-x-auto">
                {component.demo()}
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
                  {isHook
                    ? `import { ${component.name} } from '@/hooks'`
                    : `import { ${component.name} } from '@/components/ui/${component.id}'`}
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Basic Example</h3>
              <div className="bg-muted p-3 rounded-md overflow-x-auto">
                <code className="text-xs font-mono">
                  {isHook ? `const value = ${component.name}()` : `<${component.name} />`}
                </code>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              See component files for full implementation details and examples.
            </p>
          </TabsContent>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Category</h3>
              <div className="flex flex-wrap gap-1">
                {component.category.map(cat => (
                  <Badge key={cat} variant="secondary">
                    {categories.find(c => c.id === cat)?.label || cat}
                  </Badge>
                ))}
              </div>
            </div>
            {component.tags && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-1">
                  {component.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            <Separator />
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">{component.description}</p>
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
                  {isHook
                    ? `src/hooks/${component.id}.ts`
                    : `src/components/ui/${component.id}.tsx`}
                </code>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}
