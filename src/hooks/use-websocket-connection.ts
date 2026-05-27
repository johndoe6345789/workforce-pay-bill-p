import { useCallback, useRef } from 'react'
import type { MutableRefObject } from 'react'

export interface WsConnectionParams {
  url: string | null
  reconnect: boolean
  reconnectAttempts: number
  reconnectInterval: number
  heartbeatInterval: number
  heartbeatMessage: string
  reconnectCount: number
  onOpen: (e: Event) => void
  onClose: (e: CloseEvent) => void
  onError: (e: Event) => void
  onMessage: (e: MessageEvent) => void
  setReadyState: (state: number) => void
  setLastMessage: (event: MessageEvent) => void
  setReconnectCount: (updater: (prev: number) => number) => void
  mountedRef: MutableRefObject<boolean>
}

export function useWebSocketConnection(p: WsConnectionParams) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const connect = useCallback(() => {
    if (!p.url || !p.mountedRef.current) return
    try {
      const ws = new WebSocket(p.url)

      ws.onopen = event => {
        p.setReadyState(WebSocket.OPEN)
        p.setReconnectCount(() => 0)
        p.onOpen(event)
        if (p.heartbeatInterval > 0) {
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) ws.send(p.heartbeatMessage)
          }, p.heartbeatInterval)
        }
      }

      ws.onclose = event => {
        p.setReadyState(WebSocket.CLOSED)
        p.onClose(event)
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
        if (p.reconnect && p.reconnectCount < p.reconnectAttempts && p.mountedRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            p.setReconnectCount(prev => prev + 1)
            connect()
          }, p.reconnectInterval)
        }
      }

      ws.onerror = event => { p.setReadyState(WebSocket.CLOSED); p.onError(event) }
      ws.onmessage = event => { p.setLastMessage(event); p.onMessage(event) }
      wsRef.current = ws
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }, [p])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
  }, [])

  return { connect, disconnect, wsRef }
}
