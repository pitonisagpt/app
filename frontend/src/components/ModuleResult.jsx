import { useState, useEffect } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import OracleMarkdown from './OracleMarkdown'
import Waveform from './Waveform'
import RelatedCTAs from './RelatedCTAs'

const PHASES = [
  { icon: '🕯️', text: 'La Pitonisa enciende las velas...' },
  { icon: '🌙', text: 'Los espíritus consultan el cosmos...' },
  { icon: '🔮', text: 'El oráculo contempla tu destino...' },
  { icon: '✨', text: 'Los arcanos revelan sus secretos...' },
  { icon: '🌀', text: 'La energía se concentra en tu pregunta...' },
  { icon: '🪬', text: 'La Pitonisa escucha lo invisible...' },
  { icon: '🌌', text: 'El cosmos organiza su mensaje...' },
  { icon: '⚡', text: 'La verdad emerge desde las sombras...' },
  { icon: '🫀', text: 'La lectura late al ritmo de tu historia...' },
  { icon: '🌿', text: 'La sabiduría antigua toma forma...' },
  { icon: '🔺', text: 'Los patrones ocultos se hacen visibles...' },
  { icon: '🃏', text: 'Las cartas conocen lo que aún no ves...' },
]

/**
 * Standalone oracle display for the special modules.
 * Does NOT depend on SessionContext — receives text/isStreaming as props.
 */
export default function ModuleResult({ text, isStreaming, error, onReset, moduleId }) {
  const displayed = useTypewriter(text, isStreaming)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [phaseKey,   setPhaseKey]   = useState(0)

  useEffect(() => {
    if (!isStreaming || text) return
    const id = setInterval(() => {
      setPhaseIndex(p => (p + 1) % PHASES.length)
      setPhaseKey(k => k + 1)
    }, 1800)
    return () => clearInterval(id)
  }, [isStreaming, text])

  useEffect(() => {
    if (isStreaming && !text) { setPhaseIndex(0); setPhaseKey(0) }
  }, [isStreaming]) // eslint-disable-line react-hooks/exhaustive-deps

  // Error state
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400/80 text-sm mb-6 font-serif italic">{error}</p>
        <button
          onClick={onReset}
          className="py-3 px-8 rounded-xl text-sm font-semibold tracking-widest uppercase
                     border border-mystic-gold/40 text-mystic-gold/80
                     hover:border-mystic-gold hover:text-mystic-gold transition-all duration-300"
        >
          Intentar de nuevo
        </button>
      </div>
    )
  }

  // Loading — waiting for first chunk
  if (isStreaming && !text) {
    const phase = PHASES[phaseIndex]
    return (
      <div className="flex flex-col items-center gap-7 py-16">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-mystic-gold/25 blur-2xl scale-150 animate-glow" />
          <span className="text-5xl animate-float-slow relative select-none block">{phase.icon}</span>
        </div>
        <div key={phaseKey} className="text-center animate-fadeIn">
          <p className="text-mystic-muted/80 text-sm tracking-[0.22em] uppercase font-sans">{phase.text}</p>
        </div>
        <Waveform />
      </div>
    )
  }

  if (!displayed && !isStreaming) return null

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
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

      {/* Oracle card */}
      <div
        className="relative bg-mystic-surface/90 backdrop-blur-sm rounded-2xl p-7 pt-10 border transition-all duration-700"
        style={{
          borderColor: isStreaming ? 'rgba(201,168,76,0.40)' : 'rgba(201,168,76,0.18)',
          boxShadow: isStreaming
            ? '0 0 60px rgba(201,168,76,0.10), 0 0 120px rgba(123,45,139,0.12), 0 25px 50px rgba(0,0,0,0.4)'
            : '0 25px 50px rgba(0,0,0,0.35)',
        }}
      >
        {['top-3 left-3','top-3 right-3','bottom-3 left-3','bottom-3 right-3'].map(pos => (
          <span key={pos} className={`absolute ${pos} text-mystic-gold/20 text-xs leading-none select-none`} aria-hidden="true">✦</span>
        ))}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-md transition-all duration-700"
                 style={{ background: isStreaming ? 'rgba(201,168,76,0.45)' : 'rgba(201,168,76,0.15)', transform: isStreaming ? 'scale(1.5)' : 'scale(1)' }} />
            <div className="relative bg-mystic-card border border-mystic-gold/40 rounded-full w-9 h-9 flex items-center justify-center text-lg select-none">🔮</div>
          </div>
        </div>
        <OracleMarkdown text={displayed} isStreaming={isStreaming} />
      </div>

      {/* Bottom ornament */}
      <div className="flex items-center gap-3 mt-2 px-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-border/40" />
        <span className="text-mystic-border/50 text-[10px] tracking-widest select-none" aria-hidden="true">✦ ✦ ✦</span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-border/40" />
      </div>

      {/* Related CTAs */}
      {!isStreaming && displayed && (
        <RelatedCTAs sourceId={moduleId} sourceType="module" />
      )}

      {/* Reset button */}
      {!isStreaming && displayed && (
        <div className="mt-6 text-center animate-fadeIn">
          <button
            onClick={onReset}
            className="group relative overflow-hidden py-3.5 px-12 rounded-xl
                       font-display font-semibold tracking-[0.18em] uppercase text-sm
                       border border-mystic-gold/40 text-mystic-gold/90
                       hover:border-mystic-gold hover:text-mystic-gold
                       transition-all duration-300 hover:shadow-xl hover:shadow-mystic-gold/15
                       cursor-pointer focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
          >
            <span className="relative z-10">Nueva Consulta</span>
            <span className="absolute inset-y-0 -left-full group-hover:left-full w-1/2
                             transition-all duration-700 ease-in-out pointer-events-none skew-x-[-12deg]"
                  aria-hidden="true"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.14), transparent)' }} />
          </button>
        </div>
      )}
    </div>
  )
}
