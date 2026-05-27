import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Play } from '@phosphor-icons/react'
import type { ComponentItem } from '@/data/componentRegistry'

interface Props {
  items: ComponentItem[]
  onSelect: (item: ComponentItem) => void
}

export function ComponentGrid({ items, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
      {items.map(item => (
        <Card
          key={item.id}
          className="hover:border-primary/50 transition-colors cursor-pointer group overflow-hidden"
          onClick={() => onSelect(item)}
        >
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm group-hover:text-primary transition-colors truncate">
                    {item.name}
                  </h3>
                  {item.isNew && (
                    <Badge variant="default" className="text-xs px-1.5 py-0 shrink-0">New</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
              </div>
              <Eye className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
            </div>
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0">{tag}</Badge>
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
  )
}
