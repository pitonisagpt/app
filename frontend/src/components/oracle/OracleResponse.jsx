import { useState, useEffect } from 'react'
import { useSession } from '../context/SessionContext'
import { useTypewriter } from '../hooks/useTypewriter'
import OracleMarkdown from './OracleMarkdown'
import Waveform from './Waveform'
import RelatedCTAs from './RelatedCTAs'

const ORACLE_PHASES = [
  { icon: '🕯️', text: 'La Pitonisa enciende las velas...' },
  { icon: '🌙', text: 'Los espíritus despiertan en la oscuridad...' },
  { icon: '🔮', text: 'El oráculo contempla tu destino...' },
  { icon: '✨', text: 'Las cartas revelan sus secretos...' },
  { icon: '🃏', text: 'Los arcanos mayores toman la palabra...' },
  { icon: '🌀', text: 'La energía de la tirada se condensa...' },
  { icon: '🪬', text: 'La Pitonisa escucha lo que no se dice...' },
  { icon: '🌌', text: 'El universo organiza su respuesta...' },
  { icon: '⚡', text: 'La verdad emerge desde las sombras...' },
  { icon: '🫀', text: 'Las cartas pulsan al ritmo de tu pregunta...' },
  { icon: '🌿', text: 'La sabiduría ancestral despierta...' },
  { icon: '🔺', text: 'Los símbolos se alinean para ti...' },
]

// Renders text split by paragraphs with smooth fade-in per paragraph

export default function OracleResponse({ onNewReading, spreadId }) {
  const { readingText, isStreaming } = useSession()
  const displayedText = useTypewriter(readingText, isStreaming)

  const [phaseIndex, setPhaseIndex] = useState(0)
  const [phaseKey, setPhaseKey] = useState(0)

  // Cycle through mystical phases while waiting for the first chunk
  useEffect(() => {
    if (!isStreaming || readingText) return
    const id = setInterval(() => {
      setPhaseIndex(p => (p + 1) % ORACLE_PHASES.length)
      setPhaseKey(k => k + 1)
    }, 1800)
    return () => clearInterval(id)
  }, [isStreaming, readingText])

  // Reset phases when a new streaming session starts
  useEffect(() => {
    if (isStreaming && !readingText) {
      setPhaseIndex(0)
      setPhaseKey(0)
    }
  }, [isStreaming]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Phase 1: Waiting for first chunk ─────────────────────────────
  if (isStreaming && !readingText) {
    const phase = ORACLE_PHASES[phaseIndex]
    return (
      <div className="flex flex-col items-center gap-7 py-16">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-mystic-gold/25 blur-2xl scale-150 animate-glow" />
          <span
            className="text-5xl animate-float-slow relative select-none block"
            role="img"
            aria-label="Oráculo activo"
          >
            {phase.icon}
          </span>
        </div>

        <div key={phaseKey} className="text-center animate-fadeIn">
          <p className="text-mystic-muted/80 text-sm tracking-[0.22em] uppercase font-sans">
            {phase.text}
          </p>
        </div>

        <Waveform />
      </div>
    )
  }

  // ── Nothing to show yet ───────────────────────────────────────────
  if (!displayedText && !isStreaming) return null

  // ── Phase 2 & 3: Oracle speaking / done ──────────────────────────
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header bar with live waveform */}
      <div className="flex items-center gap-3 mb-2 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-gold/35" />
        <div className="flex items-center gap-2.5">
          {isStreaming && <Waveform />}
          <span className="text-mystic-gold/70 text-[11px] tracking-[0.35em] uppercase font-display whitespace-nowrap">
            El Oráculo Habla
          </span>
          {isStreaming && <Waveform />}
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-gold/35" />
      </div>

      {/* Main oracle card */}
      <div
        className="relative bg-mystic-surface/90 backdrop-blur-sm rounded-2xl p-7 pt-10
                   border transition-all duration-700"
        style={{
          borderColor: isStreaming ? 'rgba(201,168,76,0.40)' : 'rgba(201,168,76,0.18)',
          boxShadow: isStreaming
            ? '0 0 60px rgba(201,168,76,0.10), 0 0 120px rgba(123,45,139,0.12), 0 25px 50px rgba(0,0,0,0.4)'
            : '0 25px 50px rgba(0,0,0,0.35)',
        }}
      >
        {/* Corner ornaments */}
        {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map(pos => (
          <span key={pos} className={`absolute ${pos} text-mystic-gold/20 text-xs leading-none select-none`} aria-hidden="true">
            ✦
          </span>
        ))}

        {/* Crystal ball badge — glows while streaming */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div
              className="absolute inset-0 rounded-full blur-md transition-all duration-700"
              style={{
                background: isStreaming ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.15)',
                transform: isStreaming ? 'scale(1.5)' : 'scale(1)',
              }}
            />
            <div className="relative bg-mystic-card border border-mystic-gold/40 rounded-full w-9 h-9
                            flex items-center justify-center text-lg select-none">
              🔮
            </div>
          </div>
        </div>

        {/* The oracle's words */}
        <OracleMarkdown text={displayedText} isStreaming={isStreaming} />
      </div>

      {/* Bottom ornament */}
      <div className="flex items-center gap-3 mt-2 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-border/40" />
        <span className="text-mystic-border/50 text-[10px] tracking-widest select-none" aria-hidden="true">✦ ✦ ✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-border/40" />
      </div>

      {/* Related CTAs */}
      {!isStreaming && displayedText && (
        <RelatedCTAs sourceId={spreadId} sourceType="spread" />
      )}

      {/* Nueva consulta — only after streaming finishes */}
      {!isStreaming && displayedText && (
        <div className="mt-6 text-center animate-fadeIn">
          <button
            onClick={onNewReading}
            className="group relative overflow-hidden py-3.5 px-12 rounded-xl
                       font-display font-semibold tracking-[0.18em] uppercase text-sm
                       border border-mystic-gold/40 text-mystic-gold/90
                       hover:border-mystic-gold hover:text-mystic-gold
                       transition-all duration-300 hover:shadow-xl hover:shadow-mystic-gold/15
                       cursor-pointer focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
            aria-label="Hacer una nueva consulta"
          >
            <span className="relative z-10">Nueva Consulta</span>
            {/* Shine sweep on hover */}
            <span
              className="absolute inset-y-0 -left-full group-hover:left-full w-1/2
                         transition-all duration-700 ease-in-out pointer-events-none skew-x-[-12deg]"
              aria-hidden="true"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.14), transparent)' }}
            />
          </button>
        </div>
      )}
    </div>
  )
}
