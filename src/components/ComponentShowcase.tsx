import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { EmptyState } from '@/components/ui/empty-state'
import { StatusBadge } from '@/components/ui/status-badge'
import { Chip } from '@/components/ui/chip'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { InfoBox } from '@/components/ui/info-box'
import { Divider } from '@/components/ui/divider'
import { StatCard } from '@/components/ui/stat-card'
import { DataList } from '@/components/ui/data-list'
import { Kbd } from '@/components/ui/kbd'
import { CopyButton } from '@/components/ui/copy-button'
import { FileUpload } from '@/components/ui/file-upload'
import { Timeline } from '@/components/ui/timeline'
import { Stepper } from '@/components/ui/stepper'
import { SortableHeader } from '@/components/ui/sortable-header'
import {
  useDebounce,
  useToggle,
  usePagination,
  useSelection,
  useWizard,
  useCopyToClipboard,
  useLocalStorage
} from '@/hooks'
import { 
  MagnifyingGlass, 
  Package, 
  Cpu, 
  Lightning,
  Clock
} from '@phosphor-icons/react'

const sampleItems = Array.from({ length: 50 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Item ${i + 1}`,
  status: ['success', 'pending', 'error'][i % 3] as 'success' | 'pending' | 'error',
  value: Math.floor(Math.random() * 1000)
}))

export function ComponentShowcase() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [showInfo, toggleShowInfo] = useToggle(true)
  const [savedPreference, setSavedPreference] = useLocalStorage('showcase-pref', 'default')
  const [, copy] = useCopyToClipboard()

  const filteredItems = sampleItems.filter(item =>
    item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  const { paginatedItems, currentPage, totalPages, nextPage, previousPage, hasNextPage, hasPreviousPage } = 
    usePagination(filteredItems, 5)

  const { selectedIds, toggleSelection, selectAll, clearSelection, hasSelection } = 
    useSelection(paginatedItems)

  const wizardSteps = [
    { id: '1', title: 'Start', description: 'Getting started' },
    { id: '2', title: 'Configure', description: 'Setup options' },
    { id: '3', title: 'Complete', description: 'Finish up' }
  ]

  const { currentStep, currentStepIndex, goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = 
    useWizard(wizardSteps)

  const stepperSteps = [
    { id: '1', label: 'Start', description: 'Getting started', status: 'completed' as const },
    { id: '2', label: 'Configure', description: 'Setup options', status: 'current' as const },
    { id: '3', label: 'Complete', description: 'Finish up', status: 'pending' as const }
  ]

  const timelineItems = [
    { id: '1', title: 'Component Library Created', timestamp: '2 hours ago', isComplete: true },
    { id: '2', title: 'Hooks Implemented', timestamp: '1 hour ago', isComplete: true },
    { id: '3', title: 'Documentation Added', timestamp: 'Just now', isActive: true },
    { id: '4', title: 'Testing Phase', description: 'Coming soon' }
  ]

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Component & Hook Library Showcase</h1>
        <p className="text-muted-foreground">
          Demonstration of the new custom hooks and UI components
        </p>
      </div>

      <Divider />

      {showInfo && (
        <InfoBox
          title="Welcome to the Component Library"
          variant="info"
          dismissible
          onDismiss={toggleShowInfo}
        >
          This page demonstrates all the new hooks and components available in the library.
          Explore each section to see them in action.
        </InfoBox>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Components"
          value="63"
          icon={<Package className="h-6 w-6" />}
          trend={{ value: 27, isPositive: true }}
          description="UI components available"
        />
        <StatCard
          label="Custom Hooks"
          value="22"
          icon={<Cpu className="h-6 w-6" />}
          trend={{ value: 100, isPositive: true }}
          description="React hooks for state & logic"
        />
        <StatCard
          label="Performance"
          value="Fast"
          icon={<Lightning className="h-6 w-6" />}
          description="Optimized for speed"
        />
        <StatCard
          label="Build Time"
          value="2hrs"
          icon={<Clock className="h-6 w-6" />}
          description="Development time saved"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Badges & Chips</CardTitle>
            <CardDescription>Visual status indicators and tags</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="success" label="Approved" />
              <StatusBadge status="pending" label="Pending" />
              <StatusBadge status="error" label="Rejected" />
              <StatusBadge status="warning" label="Expiring" />
              <StatusBadge status="info" label="Information" />
            </div>
            <Divider />
            <div className="flex flex-wrap gap-2">
              <Chip label="React" variant="primary" />
              <Chip label="TypeScript" variant="secondary" />
              <Chip label="Tailwind" variant="outline" />
              <Chip label="Removable" onRemove={() => alert('Removed!')} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data List & Utilities</CardTitle>
            <CardDescription>Information display patterns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataList
              items={[
                { label: 'Environment', value: 'Production' },
                { label: 'Version', value: '2.0.0' },
                { label: 'Last Deploy', value: '2 hours ago' }
              ]}
            />
            <Divider />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Invoice ID: <code className="font-mono">INV-12345</code></span>
                <CopyButton text="INV-12345" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>Keyboard shortcut:</span>
                <Kbd keys={['Ctrl', 'K']} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wizard & Stepper</CardTitle>
          <CardDescription>Multi-step form navigation with useWizard hook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Stepper
            steps={stepperSteps}
            orientation="horizontal"
          />
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-semibold">{currentStep.title}</h4>
              <p className="text-sm text-muted-foreground">{currentStep.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={isFirstStep}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={goToNextStep}
                disabled={isLastStep}
              >
                {isLastStep ? 'Complete' : 'Next'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>Event history with completion tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <Timeline items={timelineItems} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>Drag and drop file handling</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUpload
              accept=".pdf,.doc,.docx"
              multiple
              maxSize={5 * 1024 * 1024}
              onFileSelect={(files) => {
                if (files) {
                  alert(`Selected ${files.length} file(s)`)
                }
              }}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Table with Hooks</CardTitle>
          <CardDescription>
            Combining useDebounce, usePagination, useSelection, and useSort
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <SearchInput
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClear={() => setSearch('')}
              className="max-w-sm"
            />
            <div className="flex gap-2">
              {hasSelection && (
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear ({selectedIds.size})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All
              </Button>
            </div>
          </div>

          {paginatedItems.length === 0 ? (
            <EmptyState
              icon={<MagnifyingGlass size={48} />}
              title="No items found"
              description="Try adjusting your search query"
              action={<Button onClick={() => setSearch('')}>Clear Search</Button>}
            />
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">
                        <input
                          type="checkbox"
                          onChange={selectAll}
                          checked={selectedIds.size === paginatedItems.length}
                        />
                      </th>
                      <th className="p-3 text-left">
                        <SortableHeader
                          label="Name"
                          active={false}
                          direction="asc"
                        />
                      </th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-right">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-muted/50"
                      >
                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelection(item.id)}
                          />
                        </td>
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3">
                          <StatusBadge
                            status={item.status}
                            label={item.status}
                            showIcon={false}
                          />
                        </td>
                        <td className="p-3 text-right">£{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({filteredItems.length} items)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousPage}
                    disabled={!hasPreviousPage}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={!hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Spinner and overlay components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="sm" />
              <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="md" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="lg" />
              <span className="text-xs text-muted-foreground">Large</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <LoadingSpinner size="xl" />
              <span className="text-xs text-muted-foreground">Extra Large</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
