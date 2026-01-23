# New Custom Hooks - Latest Additions

This document lists all newly added custom hooks to the library.

## Data Fetching & State Management

### `useFetch`
Simple data fetching hook with loading, error states and refetch capability.

```tsx
const { data, loading, error, refetch } = useFetch<User[]>('/api/users', {
  onSuccess: (data) => console.log('Loaded:', data),
  onError: (error) => console.error('Failed:', error)
})
```

### `useMutation`
Hook for handling mutations with success/error callbacks and toast notifications.

```tsx
const { mutate, isLoading, isSuccess } = useMutation(
  async (data: CreateUserData) => createUser(data),
  {
    successMessage: 'User created successfully',
    onSuccess: () => refetchUsers()
  }
)
```

### `useAsyncAction`
Execute async operations with loading and error state management.

```tsx
const { execute, data, loading, error, reset } = useAsyncAction(fetchUserData)

await execute(userId)
```

### `useControllableState`
Create components that can work as both controlled and uncontrolled.

```tsx
const [value, setValue] = useControllableState({
  value: controlledValue,
  defaultValue: 'default',
  onChange: onValueChange
})
```

## UI & Interaction Hooks

### `useBreakpoint`
Get the current responsive breakpoint.

```tsx
const breakpoint = useBreakpoint() // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
const columns = useBreakpointValue({ xs: 1, md: 2, lg: 3 })
```

### `useMeasure`
Measure DOM element dimensions with ResizeObserver.

```tsx
const [ref, dimensions] = useMeasure()

return (
  <div ref={ref}>
    Width: {dimensions.width}px
  </div>
)
```

### `useFavorites`
Manage a list of favorite items with persistence.

```tsx
const { favorites, isFavorite, toggleFavorite, addFavorite } = useFavorites<Item>({
  storageKey: 'my-favorites'
})
```

### `useClipboardCopy`
Copy text to clipboard with success state.

```tsx
const { copied, copy } = useClipboardCopy({ timeout: 2000 })

<button onClick={() => copy('text to copy')}>
  {copied ? 'Copied!' : 'Copy'}
</button>
```

### `useLockBodyScroll`
Prevent body scrolling (useful for modals/drawers).

```tsx
useLockBodyScroll(isModalOpen)
```

### `useNetworkStatus`
Monitor online/offline status.

```tsx
const isOnline = useNetworkStatus()
```

## Advanced Hooks

### `useLocalStorageState`
Like useState but persisted in localStorage.

```tsx
const [theme, setTheme, removeTheme] = useLocalStorageState('theme', 'light')
```

### `useMounted`
Check if component is currently mounted.

```tsx
const isMounted = useMounted()

useEffect(() => {
  fetchData().then(data => {
    if (isMounted()) {
      setState(data)
    }
  })
}, [])
```

### `useMergeRefs`
Merge multiple refs into one.

```tsx
const mergedRef = useMergeRefs(ref1, ref2, ref3)
<div ref={mergedRef} />
```

### `useEvent`
Create stable callback references that always use latest values.

```tsx
const handleClick = useEvent(() => {
  // Always has access to latest state/props
  console.log(latestValue)
})
```

### `useUpdateEffect`
Like useEffect but skips the first render.

```tsx
useUpdateEffect(() => {
  // Only runs on updates, not initial mount
  console.log('Updated!')
}, [dependency])
```

### `useIsomorphicLayoutEffect`
Safe useLayoutEffect for SSR (falls back to useEffect on server).

```tsx
useIsomorphicLayoutEffect(() => {
  // Runs on client, safe for SSR
}, [])
```

## Usage Tips

1. **Prefer `useMutation` over raw async/await** for operations that modify data
2. **Use `useControllableState`** when building reusable form components
3. **Use `useBreakpoint`** for responsive logic instead of multiple media queries
4. **Use `useEvent`** for stable callbacks in performance-critical scenarios
5. **Use `useFavorites`** with the Spark KV store for persistence across sessions
