import { Link } from 'react-router-dom'
import { useNumerology } from '../../hooks/useNumerology'

export default function NumerologyPortrait({ profile }) {
  const { lifePath, destiny, soul, lifePathInfo } = useNumerology(profile)

  if (!lifePath || !lifePathInfo) return null

  const isMaster = lifePath === 11 || lifePath === 22 || lifePath === 33

  return (
    <Link
      to="/anyo-personal"
      className="group relative flex flex-col items-center text-center gap-3 px-5 py-6 rounded-2xl
                 border bg-mystic-surface/60 backdrop-blur-sm w-full h-full
                 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl overflow-hidden"
      style={{
        borderColor: isMaster ? 'rgba(201,168,76,0.40)' : 'rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
      }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(123,45,189,0.10), transparent 70%)' }} />

      {/* Number badge */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
             style={{ background: isMaster ? 'rgba(201,168,76,0.25)' : 'rgba(148,100,220,0.20)', transform: 'scale(2.5)' }} />
        <div className="relative w-14 h-14 rounded-2xl border flex flex-col items-center justify-center bg-mystic-bg/60"
             style={{ borderColor: isMaster ? 'rgba(201,168,76,0.45)' : 'rgba(148,100,220,0.35)' }}>
          <span className={`font-display font-bold leading-none ${lifePath >= 10 ? 'text-xl' : 'text-2xl'} ${lifePathInfo.color}`}>
            {lifePath}
          </span>
          {isMaster && (
            <span className="text-[7px] font-sans tracking-widest text-mystic-gold/60 uppercase">maestro</span>
          )}
        </div>
      </div>

      {/* Label + title */}
      <div>
        <span className="text-[9px] font-sans uppercase tracking-widest text-mystic-muted/35">
          Número de Vida
        </span>
        <p className="font-display font-bold text-sm tracking-wide leading-tight mt-0.5
                      text-mystic-accent/90 group-hover:text-mystic-gold transition-colors duration-200">
          {lifePathInfo.title}
        </p>
        <span className="text-[10px] font-sans border px-2 py-0.5 rounded-full tracking-wider uppercase
                         border-mystic-border/35 text-mystic-muted/45 inline-block mt-1">
          {lifePathInfo.keyword}
        </span>
      </div>

      {/* Description */}
      <p className="text-mystic-muted/55 text-[11px] font-sans leading-relaxed line-clamp-3">
        {profile.nombre
          ? <><span className="text-mystic-accent/70 font-medium">{profile.nombre.split(' ')[0]}</span>{', '}{lifePathInfo.desc.charAt(0).toLowerCase() + lifePathInfo.desc.slice(1)}</>
          : lifePathInfo.desc}
      </p>

      {/* Secondary numbers */}
      {(destiny || soul) && (
        <div className="flex items-center gap-3">
          {destiny && (
            <span className="text-[10px] font-sans text-mystic-muted/40">
              Destino <span className="text-mystic-muted/65 font-semibold">{destiny}</span>
            </span>
          )}
          {soul && (
            <span className="text-[10px] font-sans text-mystic-muted/40">
              Alma <span className="text-mystic-muted/65 font-semibold">{soul}</span>
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      <p className="text-[9px] font-sans text-mystic-muted/25 tracking-widest uppercase mt-auto
                    group-hover:text-mystic-gold/50 transition-colors duration-200">
        Ver predicción →
      </p>
    </Link>
  )
}
