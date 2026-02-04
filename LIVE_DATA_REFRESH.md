# Live Data Refresh Implementation

## Overview
Implemented automatic live data refresh for the dashboard using IndexedDB polling with change detection. The dashboard now automatically updates when data changes in IndexedDB, providing real-time visibility into operational metrics.

## Components Added

### 1. `use-indexed-db-live.ts` Hook
A new custom hook that provides live refresh functionality for IndexedDB data.

**Features:**
- Automatic change detection using checksums
- Configurable polling intervals (default: 2 seconds)
- Per-store subscription management
- Memory-efficient with automatic cleanup
- Manual refresh capability
- Optional enable/disable control

**Usage:**
```tsx
const [data, setData, deleteData, refresh] = useIndexedDBLive<MyType[]>(
  STORES.MY_STORE,
  [],
  {
    enabled: true,
    pollingInterval: 2000
  }
)
```

### 2. `LiveRefreshIndicator.tsx` Component
A visual indicator that shows live refresh status on the dashboard.

**Features:**
- "Live" badge with animated refresh icon
- Last updated timestamp with relative time formatting
- Visual progress bar showing time until next refresh
- Smooth animations and transitions
- Automatic countdown display

**Display Elements:**
- Badge showing "Live" status
- Spinning icon during refresh
- Relative time ("just now", "2s ago", "5m ago")
- Progress bar counting down to next refresh

## Updates to Existing Files

### 1. `use-app-data.ts`
Updated to use `useIndexedDBLive` instead of `useIndexedDBState` for all entity stores.

**Changes:**
- Accepts options for live refresh configuration
- Default polling interval: 2 seconds
- Can be enabled/disabled via options
- Applies to all entity stores (timesheets, invoices, payroll, workers, compliance, expenses, rate cards)

### 2. `App.tsx`
Updated to enable live refresh for the entire application.

```tsx
const { ... } = useAppData({ 
  liveRefresh: true, 
  pollingInterval: 2000 
})
```

### 3. `dashboard-view.tsx`
Enhanced with live refresh indicator and automatic update tracking.

**Changes:**
- Added `LiveRefreshIndicator` component to header
- Tracks last update time using `useEffect` monitoring metrics changes
- Indicator shows live status and countdown

### 4. `hooks/index.ts`
Added exports for new live refresh hooks.

## How It Works

### Change Detection
1. **Checksum Generation**: For each store, generates a checksum based on item IDs, statuses, and update timestamps
2. **Polling**: Every 2 seconds (configurable), checks all subscribed stores
3. **Comparison**: Compares current checksum with last known checksum
4. **Notification**: If changed, notifies all listeners for that store
5. **Refresh**: Listeners reload data from IndexedDB

### Subscription Management
- Stores only polled when there are active subscriptions
- Automatic cleanup when no listeners remain
- Efficient memory usage with WeakMap-style management
- Single polling loop shared across all subscribers

### Performance Optimizations
- Only generates checksums for subscribed stores
- Batches all store checks in single interval
- Uses lightweight checksum algorithm
- Stops polling when no active subscriptions
- Component-level control over refresh frequency

## Configuration Options

### Global Polling Interval
The polling interval is set globally when using `useIndexedDBLive`:
```tsx
const [data] = useIndexedDBLive(
  STORES.TIMESHEETS,
  [],
  {
    enabled: true,
    pollingInterval: 2000  // 2 seconds (default)
  }
)
```

### Per-Hook Configuration
Configure polling for individual hooks:
```tsx
const [data] = useIndexedDBLive(
  STORES.TIMESHEETS,
  [],
  {
    enabled: true,           // Enable/disable live refresh
    pollingInterval: 3000    // Check every 3 seconds
  }
)
```

### Manual Refresh
Trigger manual data refresh when needed:
```tsx
const [data, setData, deleteData, refresh] = useIndexedDBLive(...)

// Manually refresh data
await refresh()
```

## Benefits

### Real-Time Updates
- Dashboard metrics update automatically when data changes
- No manual refresh required
- Immediate visibility into data changes
- Reduced stale data concerns

### User Experience
- Live indicator provides visual feedback
- Users know when data was last updated
- Progress bar shows time until next refresh
- Smooth, non-disruptive updates

### Developer Experience
- Drop-in replacement for `useIndexedDBState`
- Same API with additional options
- Easy to enable/disable per component
- Configurable polling intervals

### Performance
- Efficient change detection
- Minimal re-renders (only on actual changes)
- Automatic cleanup prevents memory leaks
- Shared polling reduces overhead

## Future Enhancements

### Potential Improvements
1. **WebSocket Integration**: Replace polling with WebSocket push notifications
2. **Smart Polling**: Adjust polling frequency based on user activity
3. **Selective Store Refresh**: Only refresh stores visible in current view
4. **Batch Updates**: Debounce rapid changes to reduce re-renders
5. **Offline Detection**: Pause polling when offline
6. **Error Recovery**: Automatic retry on failed refreshes

### Advanced Features
1. **Conflict Resolution**: Handle concurrent edits from multiple tabs
2. **Optimistic Updates**: Show changes immediately before confirmation
3. **Change Notifications**: Toast messages for important updates
4. **Differential Updates**: Only update changed records, not entire store
5. **Priority Queues**: High-priority stores refresh more frequently

## Testing Recommendations

### Manual Testing
1. Open dashboard and observe live indicator
2. Open another tab and modify data in IndexedDB
3. Verify dashboard updates within 2 seconds
4. Check progress bar animation smoothness
5. Verify relative timestamps update correctly

### Automated Testing
1. Mock IndexedDB changes and verify listeners called
2. Test subscription cleanup on unmount
3. Verify polling stops when no subscriptions
4. Test manual refresh functionality
5. Validate checksum generation accuracy

## Documentation

### Updated Files
- `src/hooks/NEW_HOOKS_LATEST.md` - Added live refresh hook documentation
- `src/hooks/README.md` - Added to IndexedDB persistence section
- `PRD.md` - Updated dashboard feature with live refresh details
- `LIVE_DATA_REFRESH.md` - This comprehensive implementation guide

### Hook Documentation
Complete API documentation available in:
- Type definitions in `use-indexed-db-live.ts`
- Usage examples in `NEW_HOOKS_LATEST.md`
- Integration patterns in `use-app-data.ts`
