import { useState } from 'react'
import { allItems } from '@/data/componentRegistry'
import type { ComponentCategory, ComponentItem } from '@/data/componentRegistry'

export function useComponentShowcase(isMobile: boolean) {
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComponent, setSelectedComponent] = useState<ComponentItem | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const filteredItems = allItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category.includes(selectedCategory)
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const handleComponentClick = (item: ComponentItem) => {
    setSelectedComponent(item)
    if (isMobile) setShowDetails(true)
  }

  return {
    selectedCategory, setSelectedCategory,
    searchQuery, setSearchQuery,
    selectedComponent, setSelectedComponent,
    viewMode, setViewMode,
    showFilters, setShowFilters,
    showDetails, setShowDetails,
    filteredItems,
    handleComponentClick,
  }
}
