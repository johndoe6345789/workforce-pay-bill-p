import { useState, useEffect, useRef } from 'react'

export interface UseIntervalOptions {
  enabled?: boolean
  immediate?: boolean
}

export function useInterval(
  callback: () => void,
  delay: number | null,
  options: UseIntervalOptions = {}
) {
  const { enabled = true, immediate = false } = options
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled || delay === null) {
      return
    }

    if (immediate) {
      savedCallback.current()
    }

    const id = setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => clearInterval(id)
  }, [delay, enabled, immediate])
}

export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)

  useInterval(
    () => {
      setSeconds((prev) => {
        if (prev <= 0) {
          setIsRunning(false)
          return 0
        }
        return prev - 1
      })
    },
    isRunning ? 1000 : null
  )

  const start = () => {
    setIsRunning(true)
  }

  const pause = () => {
    setIsRunning(false)
  }

  const reset = (newSeconds?: number) => {
    setSeconds(newSeconds ?? initialSeconds)
    setIsRunning(false)
  }

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    minutes: Math.floor(seconds / 60),
    remainingSeconds: seconds % 60,
    isFinished: seconds === 0
  }
}
