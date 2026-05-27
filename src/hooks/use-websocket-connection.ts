import { useCallback, useRef } from 'react'
import type { WebSocketOptions } from './use-websocket.types'

interface ConnectionParams
  extends Required<
    Pick<
      WebSocketOptions,
      | 'reconnect'
      | 'reconnectAttempts'
      | 'reconnectInterval'
      | 'heartbeatInterval'
      | 'heartbeatMessage'
      | 'onOpen'
      | 'onClose'
      | 'onError'
      | 'onMessage'
    >
  > {
  url: string | null
  reconnectCount: number
  setReadyState: (state: number) => void
  setLastMessage: (event: MessageEvent) => void
  setReconnectCount: (updater: (prev: number) => number) => void
  mountedRef: React.MutableRefObject<boolean>
}

export function useWebSocketConnection({
  url,
  reconnect,
  reconnectAttempts,
  reconnectInterval,
  heartbeatInterval,
  heartbeatMessage,
  onOpen,
  onClose,
  onError,
  onMessage,
  reconnectCount,
  setReadyState,
  setLastMessage,
  setReconnectCount,
  mountedRef,
}: ConnectionParams) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const connect = useCallback(() => {
    if (!url || !mountedRef.current) return
    try {
      const ws = new WebSocket(url)

      ws.onopen = event => {
        setReadyState(WebSocket.OPEN)
        setReconnectCount(() => 0)
        onOpen(event)
        if (heartbeatInterval > 0) {
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) ws.send(heartbeatMessage)
          }, heartbeatInterval)
        }
      }

      ws.onclose = event => {
        setReadyState(WebSocket.CLOSED)
        onClose(event)
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
        if (reconnect && reconnectCount < reconnectAttempts && mountedRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectCount(prev => prev + 1)
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = event => {
        setReadyState(WebSocket.CLOSED)
        onError(event)
      }

      ws.onmessage = event => {
        setLastMessage(event)
        onMessage(event)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }, [
    url, reconnect, reconnectAttempts, reconnectInterval, reconnectCount,
    heartbeatInterval, heartbeatMessage, onOpen, onClose, onError, onMessage,
    setReadyState, setLastMessage, setReconnectCount, mountedRef,
  ])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
    if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current)
  }, [])

  return { connect, disconnect, wsRef }
}
