import { useState } from 'react'
import { useSession } from '../context/SessionContext'

const MAX = 300

// Mirrors the backend injection pattern — blocks obvious attacks before they reach the API
const INJECTION_RE = /ignore\s*previous|ignora\s*las|olvida\s*(que|tus|las)|forget\s*(you|your|instructions)|system\s*prompt|prompt\s*del\s*sistema|act\s*as|actúa\s*como|pretend\s*(you|to)|finge\s*que|you\s*are\s*now|ahora\s*eres|jailbreak|DAN[\s:,]|bypass|override\s*(your|the|all)|nuevas\s*instrucciones|reveal\s*(your|the)\s*(prompt|instructions)|<script|javascript:|http[s]?:\/\/|www\./i

function validate(text) {
  if (!text.trim()) return null
  if (INJECTION_RE.test(text)) {
    return 'Las cartas rechazan esa consulta. Formula una pregunta genuina sobre tu vida o destino.'
  }
  return null
}

export default function QuestionForm({ onSubmit, placeholder = 'Escribe tu pregunta al oráculo...' }) {
  const { question, setQuestion } = useSession()
  const [touched, setTouched] = useState(false)

  const error = touched ? validate(question) : null
  const isBlocked = Boolean(validate(question))
  const atLimit = question.length >= MAX

  function handleChange(e) {
    setQuestion(e.target.value.slice(0, MAX))
    if (!touched) setTouched(true)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setTouched(true)
    if (!question.trim() || isBlocked) return
    onSubmit(question.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <textarea
          value={question}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          rows={3}
          maxLength={MAX}
          aria-label="Tu pregunta al oráculo"
          aria-describedby={error ? 'question-error' : undefined}
          className={`w-full bg-mystic-card border rounded-xl px-4 py-3.5 pr-16
                     text-mystic-text placeholder-mystic-muted/50 resize-none font-sans text-[14px] leading-relaxed
                     focus:outline-none focus:ring-2 transition-all duration-300 shadow-inner ${
                       error
                         ? 'border-red-500/60 focus:border-red-500/80 focus:ring-red-500/15'
                         : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'
                     }`}
          style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
        />
        <span
          className={`absolute bottom-3 right-3 text-[10px] tabular-nums font-sans ${
            atLimit ? 'text-red-400' : 'text-mystic-muted/50'
          }`}
          aria-live="polite"
        >
          {question.length}/{MAX}
        </span>
      </div>

      {error && (
        <p
          id="question-error"
          role="alert"
          className="mt-2 text-xs text-center tracking-wide font-sans animate-fadeIn"
          style={{ color: '#fca5a5' }}
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!question.trim() || isBlocked}
        className="mt-4 w-full py-3.5 px-6 rounded-xl font-display font-semibold tracking-[0.15em] uppercase text-sm
                   bg-gradient-to-r from-mystic-purple to-mystic-violet
                   hover:from-purple-700 hover:to-violet-700
                   disabled:opacity-35 disabled:cursor-not-allowed disabled:from-mystic-purple disabled:to-mystic-violet
                   text-mystic-text border border-mystic-border/60
                   transition-all duration-300 hover:shadow-xl hover:shadow-mystic-purple/40
                   hover:-translate-y-0.5 cursor-pointer
                   focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
      >
        Tirar las Cartas
      </button>
    </form>
  )
}
