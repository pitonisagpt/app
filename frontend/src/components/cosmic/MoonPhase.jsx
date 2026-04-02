import { Link } from 'react-router-dom'
import { useMoonPhase } from '../../hooks/useMoonPhase'

export default function MoonPhase() {
  const { data, loading } = useMoonPhase()

  if (loading || !data) return null

  const isFullMoon = data.phase === 'Luna Llena'
  const isSpecial  = isFullMoon || data.phase === 'Luna Nueva'
  const nextSoon   = data.next_phase_days <= 2

  return (
    <Link
      to="/tirada/lunar"
      className="group relative flex flex-col w-full h-full rounded-3xl overflow-hidden
                 border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
      style={{
        borderColor: isSpecial ? 'rgba(240,160,90,0.40)' : 'rgba(196,180,224,0.30)',
        boxShadow: isFullMoon
          ? '0 8px 40px rgba(240,160,90,0.18), 0 2px 8px rgba(46,60,20,0.06)'
          : '0 8px 32px rgba(46,60,20,0.07)',
        background: isFullMoon
          ? 'linear-gradient(180deg, rgba(255,245,225,0.90) 0%, rgba(237,224,208,0.95) 100%)'
          : 'rgba(237,224,208,0.85)',
        backdropFilter: 'blur(12px)',
        minHeight: '320px',
      }}
    >
      {/* Ambient halo behind illustration */}
      {isFullMoon && (
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse at 50% 40%, rgba(240,200,120,0.28) 0%, transparent 65%)' }} />
      )}

      {/* Illustration — fills top 2/3 */}
      <div className="relative flex-1 flex items-center justify-center py-6 px-4">
        {isFullMoon && (
          <>
            <div className="absolute rounded-full pointer-events-none animate-pulse-slow"
                 style={{ width: '220px', height: '220px', background: 'radial-gradient(circle, rgba(240,200,120,0.20) 0%, transparent 70%)' }} />
            <div className="absolute rounded-full border pointer-events-none animate-pulse-slow"
                 style={{ width: '200px', height: '200px', borderColor: 'rgba(240,160,90,0.18)' }} />
          </>
        )}

        {isFullMoon ? (
          <img
            src="/moon_1.png"
            alt="Luna Llena"
            className="relative z-10 animate-float-slow select-none object-contain"
            style={{
              width: '180px',
              height: '180px',
              filter: 'drop-shadow(0 8px 24px rgba(240,160,90,0.40))',
            }}
          />
        ) : (
          <span className={`text-9xl leading-none relative z-10 select-none ${isSpecial ? 'animate-float-slow' : ''}`}>
            {data.emoji}
          </span>
        )}
      </div>

      {/* Info footer */}
      <div className="px-5 pb-5 pt-2 flex flex-col gap-3"
           style={{ borderTop: '1px solid rgba(196,180,224,0.20)' }}>

        {/* Phase + sign */}
        <div className="text-center">
          <p className="font-display font-bold text-base tracking-widest leading-tight mb-0.5"
             style={isSpecial ? {
               background: 'linear-gradient(90deg, #F0A05A, #C4B4E0, #F0A05A)',
               backgroundSize: '200% auto',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               animation: 'shimmer 4s linear infinite',
             } : { color: 'rgba(46,60,20,0.80)' }}>
            {data.phase}
          </p>
          <p className="text-mystic-muted/60 text-[11px] font-sans tracking-wide">en {data.moon_sign}</p>
        </div>

        {/* Illumination bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-sans text-mystic-muted/40 uppercase tracking-widest">Iluminación</span>
            <span className="text-[9px] font-sans font-semibold"
                  style={{ color: isSpecial ? 'rgba(240,160,90,0.75)' : 'rgba(91,107,224,0.65)' }}>
              {data.illumination}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden"
               style={{ background: 'rgba(196,180,224,0.20)' }}>
            <div className="h-full rounded-full transition-all duration-700"
                 style={{
                   width: `${data.illumination}%`,
                   background: isSpecial
                     ? 'linear-gradient(90deg, #F0A05A, #C4B4E0)'
                     : 'linear-gradient(90deg, #8070C8, #C4B4E0)',
                   boxShadow: isSpecial ? '0 0 6px rgba(240,160,90,0.4)' : 'none',
                 }} />
          </div>
        </div>

        {/* Next phase + CTA row */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-sans px-2.5 py-1 rounded-full border tracking-wide
            ${nextSoon
              ? 'border-mystic-gold/50 bg-mystic-gold/10 text-mystic-gold/90'
              : 'border-mystic-border/30 text-mystic-muted/45'}`}>
            {data.next_phase_days === 0
              ? `✦ ${data.next_phase} hoy`
              : `${data.next_phase} en ${data.next_phase_days}d`}
          </span>
          <span className="text-[9px] font-sans text-mystic-muted/30 tracking-widest uppercase
                           group-hover:text-mystic-gold/60 transition-colors duration-300">
            Tirada Lunar →
          </span>
        </div>
      </div>
    </Link>
  )
}
