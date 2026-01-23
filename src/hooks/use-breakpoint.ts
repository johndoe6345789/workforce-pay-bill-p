import { useState, useEffect } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('md')

  useEffect(() => {
    const calculateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= breakpoints['2xl']) return '2xl'
      if (width >= breakpoints.xl) return 'xl'
      if (width >= breakpoints.lg) return 'lg'
      if (width >= breakpoints.md) return 'md'
      if (width >= breakpoints.sm) return 'sm'
      return 'xs'
    }

    const handleResize = () => {
      setBreakpoint(calculateBreakpoint())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

export function useBreakpointValue<T>(values: Partial<Record<Breakpoint, T>>): T | undefined {
  const breakpoint = useBreakpoint()
  
  const orderedBreakpoints: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs']
  const currentIndex = orderedBreakpoints.indexOf(breakpoint)
  
  for (let i = currentIndex; i < orderedBreakpoints.length; i++) {
    const bp = orderedBreakpoints[i]
    if (values[bp] !== undefined) {
      return values[bp]
    }
  }
  
  return undefined
}
