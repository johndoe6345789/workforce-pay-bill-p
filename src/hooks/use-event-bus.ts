import { useState, useCallback, useRef, useEffect } from 'react'

export interface EventBusEvent {
  type: string
  payload?: any
  timestamp: number
}

export type EventHandler<T = any> = (payload: T) => void

export function useEventBus() {
  const listenersRef = useRef<Map<string, Set<EventHandler>>>(new Map())
  const [events, setEvents] = useState<EventBusEvent[]>([])

  const emit = useCallback(<T = any>(type: string, payload?: T) => {
    const event: EventBusEvent = {
      type,
      payload,
      timestamp: Date.now()
    }

    setEvents(prev => [...prev, event])

    const listeners = listenersRef.current.get(type)
    if (listeners) {
      listeners.forEach(handler => {
        try {
          handler(payload)
        } catch (error) {
          console.error(`Error in event handler for ${type}:`, error)
        }
      })
    }
  }, [])

  const on = useCallback(<T = any>(type: string, handler: EventHandler<T>) => {
    if (!listenersRef.current.has(type)) {
      listenersRef.current.set(type, new Set())
    }
    listenersRef.current.get(type)!.add(handler as EventHandler)

    return () => {
      const listeners = listenersRef.current.get(type)
      if (listeners) {
        listeners.delete(handler as EventHandler)
        if (listeners.size === 0) {
          listenersRef.current.delete(type)
        }
      }
    }
  }, [])

  const off = useCallback((type: string, handler?: EventHandler) => {
    if (!handler) {
      listenersRef.current.delete(type)
      return
    }

    const listeners = listenersRef.current.get(type)
    if (listeners) {
      listeners.delete(handler)
      if (listeners.size === 0) {
        listenersRef.current.delete(type)
      }
    }
  }, [])

  const once = useCallback(<T = any>(type: string, handler: EventHandler<T>) => {
    const wrappedHandler: EventHandler<T> = (payload) => {
      handler(payload)
      off(type, wrappedHandler as EventHandler)
    }
    return on(type, wrappedHandler)
  }, [on, off])

  const clear = useCallback(() => {
    listenersRef.current.clear()
    setEvents([])
  }, [])

  const getListenerCount = useCallback((type?: string): number => {
    if (type) {
      return listenersRef.current.get(type)?.size || 0
    }
    return Array.from(listenersRef.current.values())
      .reduce((sum, listeners) => sum + listeners.size, 0)
  }, [])

  return {
    emit,
    on,
    off,
    once,
    clear,
    events,
    getListenerCount,
    eventTypes: Array.from(listenersRef.current.keys())
  }
}
