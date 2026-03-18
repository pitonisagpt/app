import { Link } from 'react-router-dom'
import { useMoonPhase } from '../hooks/useMoonPhase'

export default function MoonPhase() {
  const { data, loading } = useMoonPhase()

  if (loading || !data) return null

  const isSpecial = data.phase === 'Luna Llena' || data.phase === 'Luna Nueva'
  const nextSoon  = data.next_phase_days <= 2

  return (
    <Link
      to="/tirada/lunar"
      className="group relative flex flex-col items-center text-center gap-3 px-5 py-6 rounded-2xl
                 border bg-mystic-surface/60 backdrop-blur-sm w-full h-full
                 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl overflow-hidden"
      style={{
        borderColor: isSpecial ? 'rgba(201,168,76,0.35)' : 'rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
           style={{ background: isSpecial ? 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.07), transparent 70%)' : 'radial-gradient(ellipse at 50% 0%, rgba(148,103,189,0.07), transparent 70%)' }} />

      {/* Moon emoji */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
             style={{ background: isSpecial ? 'rgba(201,168,76,0.30)' : 'rgba(200,185,220,0.15)', transform: 'scale(2.5)' }} />
        <span className={`text-5xl leading-none relative block select-none ${isSpecial ? 'animate-float-slow' : ''}`}>
          {data.emoji}
        </span>
      </div>

      {/* Phase name */}
      <div>
        <p className="font-display font-bold text-sm tracking-wide leading-tight mb-0.5"
           style={isSpecial ? {
             background: 'linear-gradient(90deg, #c9a84c, #e8c97e, #c9a84c)',
             backgroundSize: '200% auto',
             WebkitBackgroundClip: 'text',
             WebkitTextFillColor: 'transparent',
             animation: 'shimmer 4s linear infinite',
           } : { color: 'rgba(224,210,180,0.85)' }}>
          {data.phase}
        </p>
        <p className="text-mystic-muted/55 text-[11px] font-sans">en {data.moon_sign}</p>
      </div>

      {/* Illumination bar */}
      <div className="w-full px-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-sans text-mystic-muted/35 uppercase tracking-widest">Iluminación</span>
          <span className="text-[9px] font-sans text-mystic-muted/50">{data.illumination}%</span>
        </div>
        <div className="w-full h-1 rounded-full bg-mystic-border/25 overflow-hidden">
          <div className="h-full rounded-full"
               style={{
                 width: `${data.illumination}%`,
                 background: isSpecial ? 'linear-gradient(90deg, #c9a84c, #e8c97e)' : 'rgba(200,185,160,0.5)',
               }} />
        </div>
      </div>

      {/* Next phase */}
      <span className={`text-[10px] font-sans px-3 py-1 rounded-full border tracking-wide
        ${nextSoon ? 'border-mystic-gold/40 bg-mystic-gold/10 text-mystic-gold/80' : 'border-mystic-border/25 text-mystic-muted/40'}`}>
        {data.next_phase_days === 0 ? `✦ ${data.next_phase} hoy` : `${data.next_phase} en ${data.next_phase_days} ${data.next_phase_days === 1 ? 'día' : 'días'}`}
      </span>

      {/* CTA */}
      <p className="text-[9px] font-sans text-mystic-muted/25 tracking-widest uppercase mt-auto
                    group-hover:text-mystic-gold/50 transition-colors duration-200">
        Tirada Lunar →
      </p>
    </Link>
  )
}
