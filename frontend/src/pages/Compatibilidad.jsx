import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useUserProfile } from '../hooks/useUserProfile'
import StarField from '../components/StarField'
import ModuleResult from '../components/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'

function ScoreMeter({ score }) {
  const color = score >= 70 ? '#86efac' : score >= 45 ? '#e8c97e' : '#fca5a5'
  const label = score >= 75 ? 'Alta afinidad' : score >= 50 ? 'Conexión real' : score >= 35 ? 'Con desafíos' : 'Energía compleja'

  return (
    <div className="text-center my-8 animate-fadeIn">
      <div className="relative inline-block mb-3">
        <svg width="180" height="100" viewBox="0 0 180 100">
          {/* Background arc */}
          <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
          {/* Score arc */}
          <path
            d="M 15 90 A 75 75 0 0 1 165 90"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 235} 235`}
            style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
          />
          <text x="90" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color} fontFamily="serif">
            {score}%
          </text>
        </svg>
      </div>
      <p className="text-sm tracking-widest uppercase font-sans" style={{ color }}>{label}</p>
    </div>
  )
}

export default function Compatibilidad() {
  const { text, isStreaming, error, meta, stream, reset } = useModuleStream()
  const { profile, updateProfile } = useUserProfile()

  const [step, setStep]   = useState('form')   // form | reading
  const [score, setScore] = useState(null)
  const [form, setForm]   = useState({
    nombre_a: profile.nombre           || '',
    fecha_a:  profile.fecha_nacimiento || '',
    ciudad_a: profile.ciudad           || '',
    nombre_b: profile.nombre_b         || '',
    fecha_b:  profile.fecha_b          || '',
    ciudad_b: profile.ciudad_b         || '',
  })

  useEffect(() => {
    if (meta?.__score__ !== undefined) {
      setScore(meta.__score__)
      setStep('reading')
    }
  }, [meta])

  async function handleSubmit(e) {
    e.preventDefault()
    await stream('/api/compatibilidad', form)
  }

  function handleReset() {
    reset()
    setScore(null)
    setStep('form')
    setForm({ nombre_a: '', fecha_a: '', ciudad_a: '', nombre_b: '', fecha_b: '', ciudad_b: '' })
  }

  const inputCls = "w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-blue-400/50"

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <StarField count={80} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/8 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-blue-500/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">💞</div>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest mb-2"
              style={{ background: 'linear-gradient(90deg, #8cb8e8, #b8d8f8, #8cb8e8)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            Compatibilidad Amorosa
          </h2>
          <p className="text-mystic-muted/70 text-sm tracking-wide">Sinastría astral: descubre qué os une y qué os reta.</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-blue-400/40" />
            <span className="text-blue-400/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-blue-400/40" />
          </div>
        </div>

        {/* Step: form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Persona A */}
              <div className="bg-mystic-surface/40 border border-mystic-border/40 rounded-2xl p-5 space-y-4">
                <h3 className="text-blue-300/80 text-xs tracking-widest uppercase font-sans">Tú</h3>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Nombre</label>
                  <input required value={form.nombre_a} onChange={e => { setForm(f => ({ ...f, nombre_a: e.target.value })); updateProfile({ nombre: e.target.value }) }}
                    className={inputCls} placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Fecha de nacimiento</label>
                  <input required type="date" value={form.fecha_a} onChange={e => { setForm(f => ({ ...f, fecha_a: e.target.value })); updateProfile({ fecha_nacimiento: e.target.value }) }}
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Ciudad de nacimiento <span className="normal-case text-mystic-muted/40">(opcional)</span></label>
                  <input value={form.ciudad_a} onChange={e => { setForm(f => ({ ...f, ciudad_a: e.target.value })); updateProfile({ ciudad: e.target.value }) }}
                    className={inputCls} placeholder="ej: Madrid, España" />
                </div>
              </div>

              {/* Persona B */}
              <div className="bg-mystic-surface/40 border border-mystic-border/40 rounded-2xl p-5 space-y-4">
                <h3 className="text-pink-300/80 text-xs tracking-widest uppercase font-sans">La otra persona</h3>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Nombre</label>
                  <input required value={form.nombre_b} onChange={e => { setForm(f => ({ ...f, nombre_b: e.target.value })); updateProfile({ nombre_b: e.target.value }) }}
                    className={inputCls} placeholder="Su nombre" />
                </div>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Fecha de nacimiento</label>
                  <input required type="date" value={form.fecha_b} onChange={e => { setForm(f => ({ ...f, fecha_b: e.target.value })); updateProfile({ fecha_b: e.target.value }) }}
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Ciudad de nacimiento <span className="normal-case text-mystic-muted/40">(opcional)</span></label>
                  <input value={form.ciudad_b} onChange={e => { setForm(f => ({ ...f, ciudad_b: e.target.value })); updateProfile({ ciudad_b: e.target.value }) }}
                    className={inputCls} placeholder="ej: Barcelona, España" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" disabled={isStreaming}
                className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-blue-800 to-indigo-800
                           hover:from-blue-700 hover:to-indigo-700
                           text-mystic-text border border-blue-700/60
                           transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {isStreaming ? 'Calculando sinastría...' : '💞 Calcular Compatibilidad'}
              </button>
            </div>
          </form>
        )}

        {/* Step: reading */}
        {step === 'reading' && (
          <div>
            {score !== null && <ScoreMeter score={score} />}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-400/30" />
              <span className="text-blue-400/70 text-sm tracking-[0.3em] uppercase">La Sinastría</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-400/30" />
            </div>
            <ModuleResult text={text} isStreaming={isStreaming} error={error} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  )
}
