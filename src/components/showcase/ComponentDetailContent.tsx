import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Play } from '@phosphor-icons/react'
import type { ComponentItem } from '@/data/componentRegistry'
import { ComponentDetailTabs } from '@/components/showcase/ComponentDetailTabs'

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

        <ComponentDetailTabs component={component} isHook={isHook} />
      </div>
    </ScrollArea>
  )
}
