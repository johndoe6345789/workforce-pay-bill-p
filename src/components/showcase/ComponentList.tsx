import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye } from '@phosphor-icons/react'
import type { ComponentItem } from '@/data/componentRegistry'

interface Props {
  items: ComponentItem[]
  onSelect: (item: ComponentItem) => void
  isMobile: boolean
}

export function ComponentList({ items, onSelect, isMobile }: Props) {
  return (
    <div className="space-y-3 pb-4">
      {items.map(item => (
        <Card
          key={item.id}
          className="hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden"
          onClick={() => onSelect(item)}
        >
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{item.name}</h3>
                  {item.isNew && (
                    <Badge variant="default" className="text-xs px-1.5 py-0">New</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
              {item.demo && !isMobile && (
                <div className="w-48 lg:w-64 bg-muted/30 p-3 rounded-md flex items-center justify-center shrink-0 overflow-x-auto">
                  <div className="w-full flex items-center justify-center">
                    {item.demo()}
                  </div>
                </div>
              )}
              <Eye className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
