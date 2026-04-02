import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useUserProfile } from '../hooks/useUserProfile'
import StarField from '../components/ui/StarField'
import ModuleResult from '../components/oracle/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'
import SeoHead from '../components/ui/SeoHead'
import Sprite, { LeafDivider } from '../components/ui/Sprite'

const NUMBER_COLORS = {
  1: '#e88c8c', 2: '#8cb8e8', 3: '#C4B4E0', 4: '#8cc8a0',
  5: '#c88ce8', 6: '#e8a08c', 7: '#8cb8c8', 8: '#e8d88c', 9: '#c8a0e8',
}

export default function AnyoPersonal() {
  const { text, isStreaming, error, meta, stream, reset } = useModuleStream()
  const { profile, updateProfile } = useUserProfile()

  const [step, setStep]   = useState('form')   // form | number | reading
  const [numero, setNumero] = useState(null)
  const [archetype, setArchetype] = useState('')
  const [form, setForm]   = useState({
    nombre: profile.nombre || '',
    fecha_nacimiento: profile.fecha_nacimiento || '',
  })

  useEffect(() => {
    if (meta?.__anyo__) {
      setNumero(meta.__anyo__)
      setArchetype(meta.__nombre__ || '')
      setStep('reading')
    }
  }, [meta])

  async function handleSubmit(e) {
    e.preventDefault()
    await stream('/api/anyo-personal', {
      nombre:           form.nombre,
      fecha_nacimiento: form.fecha_nacimiento,
    })
  }

  function handleReset() {
    reset()
    setNumero(null)
    setArchetype('')
    setStep('form')
  }

  const color = NUMBER_COLORS[numero] || '#F0A05A'

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <SeoHead
        title="Predicción del Año"
        description="Tu número rector y lo que los próximos 12 meses reservan para ti. Numerología personal con interpretación de inteligencia artificial."
        path="/anyo-personal"
      />
      <StarField count={80} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-mystic-purple/8 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-violet-500/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">🔢</div>
          </div>
          <Sprite name="sun-warm" className="opacity-70 mx-auto" style={{ transform: 'scale(0.85)' }} />
          <h2 className="text-2xl font-display font-bold tracking-widest mb-2"
              style={{ background: 'linear-gradient(90deg, #5B6BE0, #8070C8, #5B6BE0)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            Predicción del Año Personal
          </h2>
          <p className="text-mystic-muted/70 text-sm tracking-wide">Tu energía personal para {new Date().getFullYear()} · cambia cada año.</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-mystic-purple/40" />
            <span className="text-mystic-purple/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-mystic-purple/40" />
          </div>
          <LeafDivider className="my-4 opacity-50" />
        </div>

        {/* Step: form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Tu nombre</label>
              <input required maxLength={60} value={form.nombre}
                onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); updateProfile({ nombre: e.target.value }) }}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-violet-400/50"
                placeholder="Tu nombre" />
            </div>
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Fecha de nacimiento</label>
              <input required type="date" value={form.fecha_nacimiento}
                onChange={e => { setForm(f => ({ ...f, fecha_nacimiento: e.target.value })); updateProfile({ fecha_nacimiento: e.target.value }) }}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm focus:outline-none focus:border-violet-400/50" />
            </div>
            <div className="text-center pt-2">
              <button type="submit" disabled={isStreaming}
                className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-mystic-purple to-mystic-violet
                           hover:from-mystic-purple/80 hover:to-mystic-violet/80
                           text-mystic-text border border-mystic-purple/40
                           transition-all duration-300 hover:shadow-xl hover:shadow-mystic-purple/20 hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {isStreaming ? 'Calculando...' : '🔢 Revelar mi Año Personal'}
              </button>
            </div>
          </form>
        )}

        {/* Step: reading — number revealed + streaming text */}
        {(step === 'reading' || (isStreaming && !numero)) && (
          <div>
            {/* Big number reveal */}
            {numero && (
              <div className="text-center mb-10 animate-fadeIn">
                <div className="relative inline-block">
                  <div className="absolute inset-0 rounded-full blur-3xl scale-150"
                       style={{ background: `${color}22` }} />
                  <span className="relative font-display font-bold leading-none select-none"
                        style={{ fontSize: '9rem', color, textShadow: `0 0 60px ${color}60, 0 0 120px ${color}30` }}>
                    {numero}
                  </span>
                </div>
                <p className="text-mystic-muted/80 text-base tracking-[0.2em] uppercase font-sans mt-2">{archetype}</p>
                <div className="flex justify-center gap-1.5 mt-3">
                  {Array.from({ length: numero }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: color, opacity: 0.6 }} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-purple/30" />
              <span className="text-mystic-purple/70 text-sm tracking-[0.3em] uppercase">Tu Predicción</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-purple/30" />
            </div>

            <ModuleResult text={text} isStreaming={isStreaming} error={error} onReset={handleReset} moduleId="anyo-personal" />
          </div>
        )}
      </main>
    </div>
  )
}
