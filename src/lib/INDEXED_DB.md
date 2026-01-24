# IndexedDB Session & State Management

This module provides a comprehensive IndexedDB wrapper for managing user sessions and application state with persistence across browser sessions.

## Features

- **Session Management**: Store and manage user authentication sessions with automatic expiry
- **Activity Tracking**: Track user activity and update session timestamps
- **App State Persistence**: Store arbitrary application state with timestamps
- **Automatic Cleanup**: Expired sessions are automatically detected and removed
- **React Hooks**: Easy-to-use React hooks for session and state management

## Core API

### IndexedDB Manager

The `IndexedDBManager` class provides low-level access to IndexedDB storage.

```typescript
import { indexedDB } from '@/lib/indexed-db'
```

#### Session Methods

```typescript
// Save a new session
const sessionId = await indexedDB.saveSession({
  userId: 'user-123',
  email: 'user@example.com',
  name: 'John Doe',
  role: 'Admin',
  currentEntity: 'Main Agency',
  expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
})

// Get a specific session
const session = await indexedDB.getSession(sessionId)

// Get the most recent active session
const currentSession = await indexedDB.getCurrentSession()

// Update session activity timestamp
await indexedDB.updateSessionActivity(sessionId)

// Delete a session
await indexedDB.deleteSession(sessionId)

// Get all sessions
const allSessions = await indexedDB.getAllSessions()

// Clear all sessions
await indexedDB.clearAllSessions()
```

#### App State Methods

```typescript
// Save app state
await indexedDB.saveAppState('userPreferences', {
  theme: 'dark',
  language: 'en',
  notifications: true
})

// Get app state
const preferences = await indexedDB.getAppState<UserPreferences>('userPreferences')

// Delete app state
await indexedDB.deleteAppState('userPreferences')

// Clear all app state
await indexedDB.clearAppState()
```

## React Hooks

### useSessionStorage

Manages user sessions with automatic persistence and restoration.

```typescript
import { useSessionStorage } from '@/hooks/use-session-storage'

function MyComponent() {
  const {
    sessionId,           // Current session ID
    isLoading,           // Loading state during initialization
    createSession,       // Create a new session
    destroySession,      // End the current session
    updateSession,       // Update activity timestamp
    getAllSessions,      // Get all sessions
    clearAllSessions,    // Clear all sessions
    restoreSession       // Restore session from storage
  } = useSessionStorage()

  // Sessions are automatically:
  // - Created when user logs in
  // - Restored on page load
  // - Updated every 60 seconds while active
  // - Updated when page is closed
}
```

**Features:**
- Automatic session restoration on app load
- Activity tracking with configurable intervals (default: 60 seconds)
- Session expiry (default: 24 hours)
- Integration with Redux auth state
- Beforeunload event handling

### useIndexedDBState

React state hook with IndexedDB persistence.

```typescript
import { useIndexedDBState } from '@/hooks/use-indexed-db-state'

function MyComponent() {
  const [preferences, setPreferences, deletePreferences] = useIndexedDBState(
    'userPreferences',
    { theme: 'light', language: 'en' }
  )

  // Works like useState but persists to IndexedDB
  setPreferences({ theme: 'dark', language: 'en' })

  // Or use functional updates
  setPreferences(prev => ({ ...prev, theme: 'dark' }))

  // Delete from storage and reset to default
  deletePreferences()
}
```

### useIndexedDBCache

Cached data fetching with TTL support.

```typescript
import { useIndexedDBCache } from '@/hooks/use-indexed-db-state'

function MyComponent() {
  const { data, isLoading, error, refresh } = useIndexedDBCache(
    'apiData',
    async () => {
      const response = await fetch('/api/data')
      return response.json()
    },
    5 * 60 * 1000 // Cache for 5 minutes
  )

  // Data is cached in IndexedDB
  // Automatically refetches if cache is older than TTL
  // Call refresh() to force a new fetch
}
```

## UI Components

### SessionManager

A complete UI for managing user sessions.

```typescript
import { SessionManager } from '@/components/SessionManager'

function ProfilePage() {
  return (
    <div>
      <SessionManager />
    </div>
  )
}
```

**Features:**
- View all active sessions
- See last activity time and login time
- End individual sessions
- End all other sessions (keep current)
- Clear all sessions

## Session Data Structure

```typescript
interface SessionData {
  id: string                    // Unique session identifier
  userId: string                // User ID
  email: string                 // User email
  name: string                  // User name
  role: string                  // User role
  roleId?: string              // Optional role ID
  avatarUrl?: string           // Optional avatar URL
  permissions?: string[]       // Optional permissions array
  currentEntity: string        // Current organizational entity
  loginTimestamp: number       // When session was created
  lastActivityTimestamp: number // Last activity time
  expiresAt?: number          // Optional expiry timestamp
}
```

## Best Practices

1. **Always use functional updates** with `useIndexedDBState`:
   ```typescript
   // ✅ CORRECT
   setState(prev => ({ ...prev, newValue }))
   
   // ❌ WRONG - state may be stale
   setState({ ...state, newValue })
   ```

2. **Set appropriate TTLs** for cached data:
   ```typescript
   // Frequently changing data
   useIndexedDBCache('realtimeData', fetcher, 30 * 1000) // 30 seconds
   
   // Rarely changing data
   useIndexedDBCache('staticData', fetcher, 60 * 60 * 1000) // 1 hour
   ```

3. **Handle errors gracefully**:
   ```typescript
   try {
     await indexedDB.saveSession(sessionData)
   } catch (error) {
     console.error('Failed to save session:', error)
     // Fallback to in-memory session
   }
   ```

4. **Clean up sessions** when appropriate:
   ```typescript
   // On logout
   await destroySession()
   
   // On account deletion
   await clearAllSessions()
   ```

## Browser Support

IndexedDB is supported in all modern browsers:
- Chrome 24+
- Firefox 16+
- Safari 10+
- Edge 12+

## Storage Limits

IndexedDB storage limits vary by browser:
- Chrome: ~60% of available disk space
- Firefox: ~50% of available disk space
- Safari: 1GB (asks user for more)

The module handles quota exceeded errors gracefully.

## Security Considerations

1. **Data is stored locally** on the user's device
2. **Not encrypted by default** - don't store sensitive data
3. **Clear sessions** on logout to prevent unauthorized access
4. **Set appropriate expiry times** to limit session lifetime
5. **Validate session data** when restoring from storage

## Migration from localStorage

If you're migrating from localStorage:

```typescript
// Before (localStorage)
const data = JSON.parse(localStorage.getItem('key') || '{}')
localStorage.setItem('key', JSON.stringify(data))

// After (IndexedDB)
const [data, setData] = useIndexedDBState('key', {})
setData(newData)
```

## Debugging

Enable IndexedDB debugging in Chrome DevTools:
1. Open DevTools
2. Go to Application tab
3. Expand IndexedDB
4. Select "WorkForceProDB"
5. View "sessions" and "appState" stores

## Performance

- **Initial load**: ~10-50ms
- **Read operations**: ~5-20ms
- **Write operations**: ~10-30ms
- **Bulk operations**: Batched for optimal performance

## Future Enhancements

Potential improvements for future versions:
- Encryption support for sensitive data
- Sync between tabs using BroadcastChannel
- Migration utilities for schema changes
- Compression for large data
- Export/import functionality
