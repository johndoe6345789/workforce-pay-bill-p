import { useState, useCallback, useRef, useEffect } from 'react'
import { useWebSocketConnection } from './use-websocket-connection'
import type { WebSocketOptions } from './use-websocket.types'

export type { WebSocketOptions } from './use-websocket.types'

export function useWebSocket(url: string | null, options: WebSocketOptions = {}) {
  const {
    reconnect = true, reconnectAttempts = 5, reconnectInterval = 3000,
    heartbeatInterval = 30000, heartbeatMessage = 'ping',
    onOpen = () => {}, onClose = () => {}, onError = () => {}, onMessage = () => {},
  } = options

  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const [reconnectCount, setReconnectCount] = useState(0)
  const mountedRef = useRef(true)

  const { connect, disconnect, wsRef } = useWebSocketConnection({
    url, reconnect, reconnectAttempts, reconnectInterval,
    heartbeatInterval, heartbeatMessage, onOpen, onClose, onError, onMessage,
    reconnectCount, setReadyState, setLastMessage, setReconnectCount, mountedRef,
  })

  const send = useCallback((data: string | ArrayBuffer | Blob) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(data)
      return true
    }
    return false
  }, [wsRef])

  const sendJson = useCallback(
    (data: unknown) => send(JSON.stringify(data)),
    [send]
  )

  useEffect(() => {
    void connect()
    return () => { mountedRef.current = false; disconnect() }
  }, [connect, disconnect])

  return {
    readyState, lastMessage, send, sendJson, connect, disconnect, reconnectCount,
    isConnecting: readyState === WebSocket.CONNECTING,
    isOpen: readyState === WebSocket.OPEN,
    isClosing: readyState === WebSocket.CLOSING,
    isClosed: readyState === WebSocket.CLOSED,
  }
}
