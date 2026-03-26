import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useUserProfile } from '../hooks/useUserProfile'
import StarField from '../components/ui/StarField'
import ModuleResult from '../components/oracle/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'
import SeoHead from '../components/ui/SeoHead'

const EMOCIONES = [
  { value: 'miedo',      label: 'Miedo',      color: 'border-slate-500/50 text-slate-300 hover:border-slate-400 hover:bg-slate-800/40' },
  { value: 'angustia',   label: 'Angustia',   color: 'border-red-700/50 text-red-300 hover:border-red-500 hover:bg-red-900/30' },
  { value: 'confusión',  label: 'Confusión',  color: 'border-amber-600/50 text-amber-300 hover:border-amber-400 hover:bg-amber-900/30' },
  { value: 'paz',        label: 'Paz',        color: 'border-emerald-600/50 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-900/30' },
  { value: 'alegría',    label: 'Alegría',    color: 'border-yellow-500/50 text-yellow-300 hover:border-yellow-400 hover:bg-yellow-900/30' },
  { value: 'amor',       label: 'Amor',       color: 'border-rose-600/50 text-rose-300 hover:border-rose-400 hover:bg-rose-900/30' },
  { value: 'tristeza',   label: 'Tristeza',   color: 'border-blue-600/50 text-blue-300 hover:border-blue-400 hover:bg-blue-900/30' },
  { value: 'extrañeza',  label: 'Extrañeza',  color: 'border-violet-500/50 text-violet-300 hover:border-violet-400 hover:bg-violet-900/30' },
]

const EMOCION_SELECTED = {
  miedo:     'border-slate-400 bg-slate-800/60 text-slate-200',
  angustia:  'border-red-500 bg-red-900/40 text-red-200',
  confusión:  'border-amber-400 bg-amber-900/40 text-amber-200',
  paz:       'border-emerald-400 bg-emerald-900/40 text-emerald-200',
  alegría:   'border-yellow-400 bg-yellow-900/40 text-yellow-200',
  amor:      'border-rose-400 bg-rose-900/40 text-rose-200',
  tristeza:  'border-blue-400 bg-blue-900/40 text-blue-200',
  extrañeza: 'border-violet-400 bg-violet-900/40 text-violet-200',
}

export default function Suenos() {
  const { text, isStreaming, error, meta, stream, reset } = useModuleStream()
  const { profile, updateProfile } = useUserProfile()

  const [step, setStep]           = useState('form')
  const [simbolosData, setSimbolosData] = useState(null)
  const [form, setForm]           = useState({
    nombre:     profile.nombre || '',
    sueno:      '',
    emocion:    '',
    recurrente: false,
  })

  useEffect(() => {
    if (meta?.__simbolos__) {
      setSimbolosData(meta.__simbolos__)
      setStep('reading')
    }
  }, [meta])

  async function handleSubmit(e) {
    e.preventDefault()
    await stream('/api/suenos', {
      nombre:     form.nombre,
      sueno:      form.sueno,
      emocion:    form.emocion,
      recurrente: form.recurrente,
      signo_sol:  profile.signo_sol || null,
    })
  }

  function handleReset() {
    reset()
    setSimbolosData(null)
    setStep('form')
    setForm(f => ({ ...f, sueno: '', emocion: '', recurrente: false }))
  }

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <SeoHead
        title="Interpretación de Sueños"
        description="Descubre qué te dice tu inconsciente. Interpretación arquetípica personalizada con inteligencia artificial."
        path="/suenos"
      />
      <StarField count={90} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-indigo-500/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">🌙</div>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest mb-2"
              style={{ background: 'linear-gradient(90deg, #818cf8, #c4b5fd, #818cf8)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            Interpretación de Sueños
          </h2>
          <p className="text-mystic-muted/70 text-sm tracking-wide">Tu inconsciente habla mientras duermes · descifra el mensaje.</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-indigo-400/40" />
            <span className="text-indigo-400/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-indigo-400/40" />
          </div>
        </div>

        {/* Form */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
            {/* Name */}
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Tu nombre</label>
              <input
                required maxLength={60} value={form.nombre}
                onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); updateProfile({ nombre: e.target.value }) }}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-indigo-400/50"
                placeholder="Tu nombre"
              />
            </div>

            {/* Dream description */}
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Cuéntame tu sueño</label>
              <textarea
                required minLength={15} maxLength={1500} value={form.sueno}
                onChange={e => setForm(f => ({ ...f, sueno: e.target.value }))}
                rows={5}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-3 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-indigo-400/50 resize-none leading-relaxed"
                placeholder="Describe lo que recuerdas con el mayor detalle posible: qué ocurrió, quién estaba, dónde, qué sentiste..."
              />
              <p className="text-mystic-muted/40 text-[11px] text-right mt-1">{form.sueno.length}/1500</p>
            </div>

            {/* Emotion */}
            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-2">¿Cómo te despertaste?</label>
              <div className="grid grid-cols-4 gap-2">
                {EMOCIONES.map(em => (
                  <button
                    key={em.value} type="button"
                    onClick={() => setForm(f => ({ ...f, emocion: em.value }))}
                    className={`py-2 px-2 rounded-xl text-xs font-sans tracking-wide border transition-all duration-200
                      ${form.emocion === em.value ? EMOCION_SELECTED[em.value] : `bg-mystic-surface/40 ${em.color}`}`}
                  >
                    {em.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Recurrent toggle */}
            <div className="flex items-center justify-between bg-mystic-surface/40 border border-mystic-border/50 rounded-xl px-4 py-3">
              <span className="text-mystic-muted/80 text-sm">¿Es un sueño recurrente?</span>
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, recurrente: !f.recurrente }))}
                className={`relative w-11 h-6 rounded-full border transition-all duration-300 focus:outline-none
                  ${form.recurrente ? 'bg-indigo-600/70 border-indigo-500/60' : 'bg-mystic-border/40 border-mystic-border/40'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white/90 shadow-sm transition-transform duration-300 ${form.recurrente ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="submit"
                disabled={isStreaming || !form.emocion || form.sueno.length < 15}
                className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-indigo-800 to-violet-800
                           hover:from-indigo-700 hover:to-violet-700
                           text-mystic-text border border-indigo-700/60
                           transition-all duration-300 hover:shadow-xl hover:shadow-indigo-900/40 hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isStreaming ? 'Interpretando...' : '🌙 Descifrar mi Sueño'}
              </button>
            </div>
          </form>
        )}

        {/* Reading — symbols reveal + streaming */}
        {(step === 'reading' || (isStreaming && !simbolosData)) && (
          <div>
            {simbolosData && (
              <div className="mb-10 animate-fadeIn">
                {/* Central archetype */}
                <div className="text-center mb-8">
                  <p className="text-indigo-300/60 text-[11px] tracking-[0.3em] uppercase mb-1">Arquetipo central</p>
                  <h3 className="font-display font-bold text-2xl tracking-wide"
                      style={{ color: '#a5b4fc', textShadow: '0 0 40px rgba(165,180,252,0.4)' }}>
                    {simbolosData.arquetipo_central}
                  </h3>
                </div>

                {/* Symbol cards */}
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {(simbolosData.simbolos || []).map((s, i) => (
                    <div key={i}
                         className="bg-mystic-surface/70 border border-indigo-500/20 rounded-xl p-3 text-center
                                    hover:border-indigo-400/40 transition-all duration-300"
                         style={{ animationDelay: `${i * 120}ms` }}>
                      <p className="text-mystic-text/90 text-sm font-semibold mb-0.5 leading-snug">{s.simbolo}</p>
                      <p className="text-indigo-300/70 text-[10px] tracking-widest uppercase mb-1">{s.arquetipo}</p>
                      <p className="text-mystic-muted/60 text-[11px] italic leading-snug">{s.significado}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-indigo-400/30" />
                  <span className="text-indigo-400/70 text-sm tracking-[0.3em] uppercase">Tu Lectura</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-indigo-400/30" />
                </div>
              </div>
            )}

            <ModuleResult text={text} isStreaming={isStreaming} error={error} onReset={handleReset} moduleId="suenos" />
          </div>
        )}
      </main>
    </div>
  )
}
