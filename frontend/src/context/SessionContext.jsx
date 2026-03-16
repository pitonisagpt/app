import { createContext, useContext, useState } from 'react'

const SessionContext = createContext(null)

export function SessionProvider({ children }) {
  const [currentSpread, setCurrentSpread] = useState(null)
  const [question, setQuestion] = useState('')
  const [drawnCards, setDrawnCards] = useState([])
  const [readingText, setReadingText] = useState('')
  const [step, setStep] = useState('intro')
  const [history, setHistory] = useState([])
  const [isStreaming, setIsStreaming] = useState(false)

  function resetReading() {
    setQuestion('')
    setDrawnCards([])
    setReadingText('')
    setStep('intro')
    setIsStreaming(false)
  }

  function addToHistory(entry) {
    setHistory(prev => [entry, ...prev].slice(0, 5))
  }

  return (
    <SessionContext.Provider
      value={{
        currentSpread, setCurrentSpread,
        question, setQuestion,
        drawnCards, setDrawnCards,
        readingText, setReadingText,
        step, setStep,
        history, addToHistory,
        isStreaming, setIsStreaming,
        resetReading,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside SessionProvider')
  return ctx
}
