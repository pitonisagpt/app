import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import CardDisplay from '../components/CardDisplay'
import ModuleResult from '../components/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'

const LS_KEY = 'pitonisa_daily_profile'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function TarotDiario() {
  const { text, isStreaming, error, meta, stream, reset } = useModuleStream()

  const [step, setStep]   = useState('form')  // form | reading
  const [card, setCard]   = useState(null)
  const [reversed, setReversed] = useState(false)
  const [form, setForm]   = useState({ nombre: '', fecha_nacimiento: '' })

  // Restore saved profile from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null')
      if (saved?.nombre && saved?.fecha_nacimiento) {
        setForm(saved)
      }
    } catch { /* ignore */ }
  }, [])

  // Extract card from SSE meta event
  useEffect(() => {
    if (meta?.__card__) {
      setCard(meta.__card__)
      setReversed(meta.__reversed__ ?? false)
    }
  }, [meta])

  async function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem(LS_KEY, JSON.stringify(form))
    setStep('reading')
    await stream('/api/tarot-diario', {
      nombre:           form.nombre,
      fecha_nacimiento: form.fecha_nacimiento,
    })
  }

  function handleReset() {
    reset()
    setCard(null)
    setStep('form')
  }

  // Friendly date for display
  const today = new Date()
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
  const fechaDisplay = `${today.getDate()} de ${meses[today.getMonth()]} · ${today.getFullYear()}`

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <StarField count={80} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-900/8 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">🌅</div>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest mb-1"
              style={{ background: 'linear-gradient(90deg, #c9a84c, #e8c97e, #c9a84c)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            Tarot del Día
          </h2>
          <p className="text-mystic-muted/60 text-xs tracking-widest uppercase font-sans">{fechaDisplay}</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-mystic-gold/40" />
            <span className="text-mystic-gold/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-mystic-gold/40" />
          </div>
        </div>

        {/* Step: form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Tu nombre</label>
              <input required maxLength={60} value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-mystic-gold/50"
                placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Fecha de nacimiento</label>
              <input required type="date" value={form.fecha_nacimiento}
                onChange={e => setForm(f => ({ ...f, fecha_nacimiento: e.target.value }))}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm focus:outline-none focus:border-mystic-gold/50" />
              <p className="text-mystic-muted/40 text-[10px] mt-1.5 tracking-wide">
                Usada para personalizar tu carta — no la guardamos.
              </p>
            </div>
            <div className="text-center pt-2">
              <button type="submit"
                className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-mystic-purple to-mystic-violet
                           hover:from-purple-700 hover:to-violet-700
                           text-mystic-text border border-mystic-border/60
                           transition-all duration-300 hover:shadow-xl hover:shadow-mystic-purple/40 hover:-translate-y-0.5">
                🌅 Revelar mi Carta del Día
              </button>
            </div>
          </form>
        )}

        {/* Step: reading */}
        {step === 'reading' && (
          <div>
            {/* Card reveal */}
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <CardDisplay
                  card={card || { name: '...', symbol: '✨' }}
                  isRevealed={!!card}
                  isReversed={reversed}
                  position="Tu carta de hoy"
                  index={0}
                />
                {card && (
                  <div className="mt-3">
                    <p className="text-mystic-accent font-display text-base tracking-wider">{card.name}</p>
                    {reversed && (
                      <span className="text-xs text-mystic-muted/60 tracking-widest uppercase">Invertida</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-gold/30" />
              <span className="text-mystic-gold/70 text-sm tracking-[0.3em] uppercase">El Mensaje del Día</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-gold/30" />
            </div>

            <ModuleResult text={text} isStreaming={isStreaming} error={error} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  )
}
