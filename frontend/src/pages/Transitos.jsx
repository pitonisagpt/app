import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useUserProfile } from '../hooks/useUserProfile'
import StarField from '../components/ui/StarField'
import ModuleResult from '../components/oracle/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'
import SeoHead from '../components/ui/SeoHead'

const INTENSITY_LABEL = { 1: 'Suave', 2: 'Moderado', 3: 'Intenso', 4: 'Exacto' }
const INTENSITY_COLOR  = { 1: '#8cb8c8', 2: '#e8c97e', 3: '#e8a08c', 4: '#fca5a5' }

function TransitBadge({ intensity }) {
  const color = INTENSITY_COLOR[intensity] || '#8cb8c8'
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1,2,3,4].map(i => (
        <span key={i} className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: i <= intensity ? color : 'rgba(255,255,255,0.12)' }} />
      ))}
    </span>
  )
}

export default function Transitos() {
  const { text, isStreaming, error, meta, stream, reset } = useModuleStream()
  const { profile, updateProfile } = useUserProfile()

  const [step, setStep]           = useState('form')   // form | reading
  const [transitCount, setTransitCount] = useState(null)
  const [noHora, setNoHora]       = useState(false)
  const [form, setForm]           = useState({
    nombre:           profile.nombre           || '',
    fecha_nacimiento: profile.fecha_nacimiento || '',
    hora_nacimiento:  profile.hora_nacimiento  || '',
    ciudad:           profile.ciudad           || '',
  })

  useEffect(() => {
    if (meta?.__transits__ !== undefined) {
      setTransitCount(meta.__transits__)
      setStep('reading')
    }
  }, [meta])

  async function handleSubmit(e) {
    e.preventDefault()
    await stream('/api/transitos', {
      nombre:           form.nombre,
      fecha_nacimiento: form.fecha_nacimiento,
      hora_nacimiento:  noHora ? null : (form.hora_nacimiento || null),
      ciudad:           form.ciudad,
    })
  }

  function handleReset() {
    reset()
    setTransitCount(null)
    setStep('form')
    setForm({ nombre: '', fecha_nacimiento: '', hora_nacimiento: '', ciudad: '' })
  }

  const inputCls = "w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-amber-400/50"

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <SeoHead
        title="Tránsitos Planetarios"
        description="Qué planetas te afectan ahora mismo y por cuánto tiempo. Astrología en tiempo real con Swiss Ephemeris e interpretación con IA."
        path="/transitos"
      />
      <StarField count={80} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-900/6 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-amber-500/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">🪐</div>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest mb-2"
              style={{ background: 'linear-gradient(90deg, #e8c97e, #f5e0a8, #e8c97e)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            Tránsitos Planetarios
          </h2>
          <p className="text-mystic-muted/70 text-sm tracking-wide">Qué planetas te afectan ahora mismo y por cuánto tiempo.</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-amber-400/40" />
            <span className="text-amber-400/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-amber-400/40" />
          </div>
        </div>

        {/* Step: form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-5 max-w-md mx-auto">
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Tu nombre</label>
              <input required maxLength={60} value={form.nombre}
                onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); updateProfile({ nombre: e.target.value }) }}
                className={inputCls} placeholder="Tu nombre" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Fecha de nacimiento</label>
                <input required type="date" value={form.fecha_nacimiento}
                  onChange={e => { setForm(f => ({ ...f, fecha_nacimiento: e.target.value })); updateProfile({ fecha_nacimiento: e.target.value }) }}
                  className={inputCls} />
              </div>
              <div>
                <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">
                  Hora de nacimiento
                  <span className="normal-case text-mystic-muted/40 ml-1">(opcional)</span>
                </label>
                <input type="time" value={form.hora_nacimiento} disabled={noHora}
                  onChange={e => { setForm(f => ({ ...f, hora_nacimiento: e.target.value })); updateProfile({ hora_nacimiento: e.target.value }) }}
                  className={`${inputCls} ${noHora ? 'opacity-40 cursor-not-allowed' : ''}`} />
                <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                  <input type="checkbox" checked={noHora} onChange={e => setNoHora(e.target.checked)}
                    className="rounded accent-amber-400" />
                  <span className="text-mystic-muted/50 text-[10px] tracking-wide">No sé mi hora exacta</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Ciudad de nacimiento</label>
              <input required value={form.ciudad}
                onChange={e => { setForm(f => ({ ...f, ciudad: e.target.value })); updateProfile({ ciudad: e.target.value }) }}
                className={inputCls} placeholder="ej: Ciudad de México, México" />
            </div>

            <div className="text-center pt-2">
              <button type="submit" disabled={isStreaming}
                className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-amber-800 to-yellow-800
                           hover:from-amber-700 hover:to-yellow-700
                           text-mystic-text border border-amber-700/60
                           transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/40 hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {isStreaming ? 'Calculando tránsitos...' : '🪐 Ver mis Tránsitos'}
              </button>
            </div>
          </form>
        )}

        {/* Step: reading */}
        {step === 'reading' && (
          <div>
            {transitCount !== null && (
              <div className="text-center mb-6 animate-fadeIn">
                <p className="text-mystic-muted/60 text-xs tracking-widest uppercase font-sans">
                  {transitCount} tránsito{transitCount !== 1 ? 's' : ''} activo{transitCount !== 1 ? 's' : ''} detectado{transitCount !== 1 ? 's' : ''}
                </p>
              </div>
            )}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-400/30" />
              <span className="text-amber-400/70 text-sm tracking-[0.3em] uppercase">Mensaje Cósmico</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-400/30" />
            </div>
            <ModuleResult text={text} isStreaming={isStreaming} error={error} onReset={handleReset} moduleId="transitos" />
          </div>
        )}
      </main>
    </div>
  )
}
