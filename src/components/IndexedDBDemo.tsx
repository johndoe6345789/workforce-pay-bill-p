import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Database, Trash, FloppyDisk, ArrowClockwise } from '@phosphor-icons/react'
import { useIndexedDBDemo } from '@/hooks/useIndexedDBDemo'
import { INDEXED_DB_FEATURES } from '@/data/indexed-db-demo-data'

export function IndexedDBDemo() {
  const vm = useIndexedDBDemo()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database size={20} />IndexedDB Storage Demo
            </CardTitle>
            <CardDescription>Test IndexedDB persistence with custom keys and values</CardDescription>
          </div>
          {vm.sessionId && (
            <Badge variant="outline" className="font-mono text-xs">
              Session: {vm.sessionId.slice(0, 12)}...
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Storage Key</Label>
            <Input id="key" value={vm.testKey}
              onChange={e => vm.setTestKey(e.target.value)}
              placeholder="Enter storage key" />
            <p className="text-xs text-muted-foreground">Change the key to test different storage locations</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="value">Value to Store</Label>
            <Input id="value" value={vm.testValue}
              onChange={e => vm.setTestValue(e.target.value)}
              placeholder="Enter value to store" />
          </div>
          <div className="flex gap-2">
            <Button onClick={vm.handleSave} size="sm"><FloppyDisk size={16} />Save to IndexedDB</Button>
            <Button onClick={vm.handleLoad} variant="secondary" size="sm"><ArrowClockwise size={16} />Load from IndexedDB</Button>
            <Button onClick={vm.handleDelete} variant="destructive" size="sm"><Trash size={16} />Delete</Button>
          </div>
          {vm.storedValue && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Currently Stored Value:</p>
              <p className="text-sm font-mono">{vm.storedValue}</p>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold mb-2">Session Information</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm text-muted-foreground">Current Session ID</span>
              <code className="text-xs bg-background px-2 py-1 rounded">
                {vm.sessionId ? vm.sessionId.slice(0, 20) + '...' : 'No active session'}
              </code>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <span className="text-sm text-muted-foreground">Active Sessions</span>
              <Badge variant="secondary">{vm.sessionCount}</Badge>
            </div>
          </div>
          <Button onClick={vm.handleLoadSessions} variant="outline" size="sm" className="mt-3">
            <ArrowClockwise size={16} />Refresh Session Count
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Features</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {INDEXED_DB_FEATURES.map(f => <li key={f}>✓ {f}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-sm text-info-foreground">
            <strong>Tip:</strong> Open DevTools → Application → IndexedDB → WorkForceProDB to inspect stored data.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
