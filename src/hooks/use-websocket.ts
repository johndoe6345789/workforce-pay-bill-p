import { useState, useCallback, useRef, useEffect } from 'react'

export interface WebSocketOptions {
  reconnect?: boolean
  reconnectAttempts?: number
  reconnectInterval?: number
  heartbeatInterval?: number
  heartbeatMessage?: string
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  onMessage?: (event: MessageEvent) => void
}

export function useWebSocket(url: string | null, options: WebSocketOptions = {}) {
  const {
    reconnect = true,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
    heartbeatMessage = 'ping',
    onOpen,
    onClose,
    onError,
    onMessage
  } = options

  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null)
  const [reconnectCount, setReconnectCount] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)
  const mountedRef = useRef(true)

  const connect = useCallback(() => {
    if (!url || !mountedRef.current) return

    try {
      const ws = new WebSocket(url)

      ws.onopen = (event) => {
        setReadyState(WebSocket.OPEN)
        void setReconnectCount(0)
        onOpen?.(event)

        if (heartbeatInterval > 0) {
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(heartbeatMessage)
            }
          }, heartbeatInterval)
        }
      }

      ws.onclose = (event) => {
        setReadyState(WebSocket.CLOSED)
        onClose?.(event)

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current)
        }

        if (reconnect && reconnectCount < reconnectAttempts && mountedRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            void setReconnectCount(prev => prev + 1)
            void connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (event) => {
        setReadyState(WebSocket.CLOSED)
        onError?.(event)
      }

      ws.onmessage = (event) => {
        setLastMessage(event)
        onMessage?.(event)
      }

      wsRef.current = ws
    } catch (error) {
      console.error('WebSocket connection error:', error)
    }
  }, [url, reconnect, reconnectAttempts, reconnectInterval, reconnectCount, heartbeatInterval, heartbeatMessage, onOpen, onClose, onError, onMessage])

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }

    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }
  }, [])

  const send = useCallback((data: string | ArrayBuffer | Blob) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data)
      return true
    }
    return false
  }, [])

  const sendJson = useCallback((data: any) => {
    return send(JSON.stringify(data))
  }, [send])

  useEffect(() => {
    void connect()

    return () => {
      mountedRef.current = false
      disconnect()
    }
  }, [connect, disconnect])

  return {
    readyState,
    lastMessage,
    send,
    sendJson,
    connect,
    disconnect,
    reconnectCount,
    isConnecting: readyState === WebSocket.CONNECTING,
    isOpen: readyState === WebSocket.OPEN,
    isClosing: readyState === WebSocket.CLOSING,
    isClosed: readyState === WebSocket.CLOSED
  }
}
