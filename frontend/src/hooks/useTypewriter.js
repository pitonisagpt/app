import { useState, useEffect, useRef } from 'react'

/**
 * Smooths raw streaming text into a typewriter effect.
 * During streaming: displays text character-by-character at ~250 chars/sec.
 * When streaming ends: snaps to the full text immediately.
 */
export function useTypewriter(targetText, isStreaming, charsPerStep = 8) {
  const [displayed, setDisplayed] = useState('')
  const stateRef = useRef({ target: '', pos: 0 })

  // Keep the target reference current on every render
  // (no deps so it always stays in sync with the latest targetText)
  stateRef.current.target = targetText

  // When streaming stops → snap to full text instantly
  useEffect(() => {
    if (!isStreaming && targetText) {
      setDisplayed(targetText)
      stateRef.current.pos = targetText.length
    }
  }, [isStreaming, targetText])

  // Stable typewriter interval — created once when streaming starts, cleaned up when it ends
  useEffect(() => {
    if (!isStreaming) return

    stateRef.current.pos = 0
    setDisplayed('')

    const id = setInterval(() => {
      const { target, pos } = stateRef.current
      if (pos < target.length) {
        const next = Math.min(pos + charsPerStep, target.length)
        stateRef.current.pos = next
        setDisplayed(target.slice(0, next))
      }
    }, 32) // ~250 chars/sec — fast enough to not lag behind Claude's stream

    return () => clearInterval(id)
  }, [isStreaming]) // eslint-disable-line react-hooks/exhaustive-deps

  return displayed
}
