import { useState, useEffect } from 'react'
import { updateProfile } from '../../hooks/useUserProfile'

const STORAGE_KEY = 'pitonisa_onboarding_done'

export function useShowOnboarding() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setShow(true)
  }, [])
  return [show, () => setShow(false)]
}

const STEPS = [
  {
    icon: '🔮',
    title: 'El oráculo te espera',
    subtitle: 'Para personalizar tu experiencia, cuéntame un poco sobre ti.',
  },
  {
    icon: '🌙',
    title: '¿Cuándo naciste?',
    subtitle: 'Tu fecha me permite calcular tu carta astral, tarot del día y predicciones personalizadas.',
  },
]

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0)
  const [nombre, setNombre] = useState('')
  const [fecha, setFecha] = useState('')
  const [leaving, setLeaving] = useState(false)

  function dismiss() {
    setLeaving(true)
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, '1')
      onClose()
    }, 300)
  }

  function handleStep1(e) {
    e.preventDefault()
    if (nombre.trim()) {
      updateProfile({ nombre: nombre.trim() })
      setStep(1)
    }
  }

  function handleStep2(e) {
    e.preventDefault()
    if (fecha) updateProfile({ fecha_nacimiento: fecha })
    dismiss()
  }

  function handleSkip() {
    if (step === 0 && nombre.trim()) updateProfile({ nombre: nombre.trim() })
    if (step === 1 && fecha) updateProfile({ fecha_nacimiento: fecha })
    dismiss()
  }

  const current = STEPS[step]

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center px-4
                     transition-opacity duration-300 ${leaving ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleSkip} />

      {/* Modal */}
      <div className="relative w-full max-w-sm bg-mystic-surface border border-mystic-border/60
                      rounded-2xl shadow-2xl shadow-black/50 overflow-hidden">

        {/* Ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48
                        bg-mystic-gold/10 rounded-full blur-3xl pointer-events-none" />

        {/* Progress bar */}
        <div className="h-0.5 bg-mystic-border/30">
          <div
            className="h-full bg-gradient-to-r from-mystic-gold/60 to-mystic-gold/30 transition-all duration-500"
            style={{ width: step === 0 ? '50%' : '100%' }}
          />
        </div>

        <div className="p-8 relative">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <div key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= step ? 'w-6 bg-mystic-gold/70' : 'w-3 bg-mystic-border/40'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleSkip}
              className="text-mystic-muted/40 text-[11px] font-sans tracking-widest uppercase
                         hover:text-mystic-muted/70 transition-colors duration-200"
            >
              Saltar
            </button>
          </div>

          {/* Icon */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="absolute inset-0 rounded-full bg-mystic-gold/15 blur-xl scale-150" />
              <span className="text-4xl relative block leading-none animate-float-slow">
                {current.icon}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-lg tracking-widest mb-2"
                style={{
                  background: 'linear-gradient(90deg, #c9a84c, #e8c97e, #c9a84c)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 4s linear infinite',
                }}>
              {current.title}
            </h2>
            <p className="text-mystic-muted/60 text-xs font-sans leading-relaxed tracking-wide">
              {current.subtitle}
            </p>
          </div>

          {/* Step 0 — Nombre */}
          {step === 0 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <input
                autoFocus
                required
                maxLength={60}
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre"
                className="w-full bg-mystic-bg/60 border border-mystic-border/60 rounded-xl
                           px-4 py-3 text-mystic-text text-sm text-center
                           placeholder:text-mystic-muted/30
                           focus:outline-none focus:border-mystic-gold/50
                           transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={!nombre.trim()}
                className="w-full py-3 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-mystic-purple to-mystic-violet
                           text-mystic-text border border-mystic-border/40
                           transition-all duration-300 hover:shadow-xl hover:shadow-mystic-purple/30
                           hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed
                           disabled:hover:translate-y-0"
              >
                Continuar →
              </button>
            </form>
          )}

          {/* Step 1 — Fecha */}
          {step === 1 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <input
                autoFocus
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className="w-full bg-mystic-bg/60 border border-mystic-border/60 rounded-xl
                           px-4 py-3 text-mystic-text text-sm text-center
                           focus:outline-none focus:border-mystic-gold/50
                           transition-colors duration-200"
              />
              <p className="text-mystic-muted/35 text-[10px] text-center font-sans tracking-wide">
                Solo se guarda en tu dispositivo · nunca la compartimos
              </p>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-mystic-gold/80 to-amber-700/80
                           text-mystic-bg border border-mystic-gold/40
                           transition-all duration-300 hover:shadow-xl hover:shadow-mystic-gold/20
                           hover:-translate-y-0.5"
              >
                ✨ Comenzar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
