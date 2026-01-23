import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  icon?: React.ReactNode
  metadata?: Record<string, any>
  disabled?: boolean
}

export interface TreeViewProps {
  data: TreeNode[]
  selectedId?: string
  onSelect?: (node: TreeNode) => void
  expandedByDefault?: boolean
  showLines?: boolean
  className?: string
}

export function TreeView({
  data,
  selectedId,
  onSelect,
  expandedByDefault = false,
  showLines = true,
  className
}: TreeViewProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
    () => {
      if (!expandedByDefault) return new Set()
      const expanded = new Set<string>()
      const collectIds = (nodes: TreeNode[]) => {
        nodes.forEach(node => {
          if (node.children && node.children.length > 0) {
            expanded.add(node.id)
            collectIds(node.children)
          }
        })
      }
      collectIds(data)
      return expanded
    }
  )

  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const isExpanded = expandedNodes.has(node.id)
    const isSelected = selectedId === node.id

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            isSelected && 'bg-accent text-accent-foreground font-medium',
            node.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => !node.disabled && onSelect?.(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(node.id)
              }}
              className="flex-shrink-0 p-0.5 hover:bg-accent-foreground/10 rounded"
            >
              <svg
                className={cn('h-4 w-4 transition-transform', isExpanded && 'rotate-90')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          {!hasChildren && showLines && <div className="w-4 flex-shrink-0" />}
          {node.icon && <div className="flex-shrink-0">{node.icon}</div>}
          <span className="text-sm flex-1">{node.label}</span>
          {node.metadata && Object.keys(node.metadata).length > 0 && (
            <span className="text-xs text-muted-foreground">
              {Object.values(node.metadata)[0]}
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div className={cn(showLines && 'border-l border-border ml-3')}>
            {node.children!.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-0.5', className)}>
      {data.map(node => renderNode(node))}
    </div>
  )
}
