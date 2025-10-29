import { useCallback, useEffect, useRef, useState } from 'react'

interface UseRealtimeOptions<TData = unknown> {
  url: string
  autoConnect?: boolean
  onMessage?: (data: TData) => void
  onError?: (event: Event) => void
}

export const useRealtime = <TData = unknown>({
  url,
  autoConnect = true,
  onMessage,
  onError,
}: UseRealtimeOptions<TData>) => {
  const socketRef = useRef<WebSocket | null>(null)
  const [isConnected, setConnected] = useState(false)

  const connect = useCallback(() => {
    if (socketRef.current) return
    const socket = new WebSocket(url)
    socketRef.current = socket

    socket.addEventListener('open', () => setConnected(true))
    socket.addEventListener('close', () => {
      setConnected(false)
      socketRef.current = null
    })
    socket.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data) as TData
        onMessage?.(data)
      } catch (error) {
        console.error('Failed to parse realtime payload', error)
      }
    })
    socket.addEventListener('error', (event) => onError?.(event))
  }, [onMessage, onError, url])

  const disconnect = useCallback(() => {
    socketRef.current?.close()
    socketRef.current = null
  }, [])

  const send = useCallback(
    (payload: unknown) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify(payload))
      }
    },
    []
  )

  useEffect(() => {
    if (autoConnect) {
      connect()
      return () => disconnect()
    }
    return () => undefined
  }, [autoConnect, connect, disconnect])

  return {
    isConnected,
    connect,
    disconnect,
    send,
  }
}

