import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

/**
 * Generic SSE streaming hook for the 5 special modules.
 * Handles meta events (objects with __xxx__ keys) separately from text chunks.
 */
export function useModuleStream() {
  const [text, setText]           = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError]         = useState(null)
  const [meta, setMeta]           = useState(null)

  async function stream(endpoint, body, onMeta) {
    setText('')
    setIsStreaming(true)
    setError(null)
    setMeta(null)

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.detail || 'El oráculo no puede responder en este momento.')
      }

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop()

        for (const part of parts) {
          for (const line of part.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6)
            if (raw === '[DONE]') {
              setIsStreaming(false)
              return
            }
            try {
              const parsed = JSON.parse(raw)
              if (parsed && typeof parsed === 'object' && parsed.__error__) {
                throw new Error(parsed.__error__)
              }
              // Object events carry metadata (card, score, numero, etc.)
              if (parsed && typeof parsed === 'object') {
                setMeta(parsed)
                onMeta?.(parsed)
              } else {
                // String chunks are oracle text
                setText(prev => prev + parsed)
              }
            } catch (e) {
              if (e.message && !e.message.includes('JSON')) throw e
              // Ignore malformed SSE chunks
            }
          }
        }
      }
    } catch (err) {
      setError(err.message || 'Error desconocido')
    } finally {
      setIsStreaming(false)
    }
  }

  function reset() {
    setText('')
    setIsStreaming(false)
    setError(null)
    setMeta(null)
  }

  return { text, isStreaming, error, meta, stream, reset }
}
