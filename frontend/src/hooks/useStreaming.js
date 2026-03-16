import { useSession } from '../context/SessionContext'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export function useStreaming() {
  const { setReadingText, setIsStreaming, setStep, addToHistory, currentSpread } = useSession()

  async function startReading(spreadId, questionText, cards) {
    setReadingText('')
    setIsStreaming(true)
    setStep('reading')

    try {
      const response = await fetch(`${API_BASE}/api/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          spread_id: spreadId,
          question: questionText || null,
          cards,
        }),
      })

      if (!response.ok) {
        // Surface mystic-flavored validation errors from the backend
        if (response.status === 422 || response.status === 400) {
          const body = await response.json().catch(() => ({}))
          throw new Error(body.detail || 'Consulta rechazada por el oráculo.')
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // SSE events are separated by \n\n — process only complete events
        const parts = buffer.split('\n\n')
        buffer = parts.pop() // keep incomplete trailing chunk

        for (const part of parts) {
          for (const line of part.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6)
            if (raw === '[DONE]') {
              setIsStreaming(false)
              addToHistory({
                spread: currentSpread,
                question: questionText,
                summary: accumulated.slice(0, 120) + '…',
                timestamp: new Date().toISOString(),
              })
              return
            }
            try {
              const parsed = JSON.parse(raw)
              if (parsed && typeof parsed === 'object' && parsed.__error__) {
                throw new Error(`API error: ${parsed.__error__}`)
              }
              const text = parsed
              accumulated += text
              setReadingText(prev => prev + text)
            } catch (parseErr) {
              if (parseErr.message.startsWith('API error:')) throw parseErr
              console.warn('Malformed SSE chunk:', raw)
            }
          }
        }
      }
    } catch (err) {
      console.error('Streaming error:', err)
      setReadingText('Lo siento, las estrellas no están alineadas en este momento. Por favor, intenta de nuevo.')
    } finally {
      setIsStreaming(false)
    }
  }

  return { startReading }
}
