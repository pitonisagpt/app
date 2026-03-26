import { Link } from 'react-router-dom'
import StarField from '../components/ui/StarField'
import { SPREADS, CATEGORIES } from '../data/spreads'
import { MODULES } from '../data/modules'
import { useTarotStreak } from '../hooks/useTarotStreak'
import { useUserProfile } from '../hooks/useUserProfile'
import MoonPhase from '../components/cosmic/MoonPhase'
import RetrogradeBanner from '../components/cosmic/RetrogradeBanner'
import NumerologyPortrait from '../components/cosmic/NumerologyPortrait'
import SeoHead from '../components/ui/SeoHead'

const BADGE_COLORS = {
  rose:    'bg-rose-900/30 border-rose-700/40 text-rose-300/80',
  emerald: 'bg-emerald-900/30 border-emerald-700/40 text-emerald-300/80',
  violet:  'bg-violet-900/30 border-violet-700/40 text-violet-300/80',
  blue:    'bg-blue-900/30 border-blue-700/40 text-blue-300/80',
  amber:   'bg-amber-900/30 border-amber-700/40 text-amber-300/80',
}

function ModuleCard({ mod, streak }) {
  const badgeCls = BADGE_COLORS[mod.badgeColor] || BADGE_COLORS.amber
  return (
    <Link
      to={mod.path}
      className="group block relative bg-mystic-surface/70 border border-mystic-border/70 rounded-2xl p-5
                 hover:border-mystic-gold/50 hover:bg-mystic-card cursor-pointer
                 transition-all duration-300 backdrop-blur-md
                 hover:shadow-2xl hover:shadow-mystic-purple/25
                 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-mystic-gold/0 to-mystic-purple/0
                      group-hover:from-mystic-gold/5 group-hover:to-mystic-purple/10
                      transition-all duration-300 pointer-events-none" />
      <div className="flex items-start gap-4 relative">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center
                        bg-mystic-border/40 rounded-xl border border-mystic-border
                        group-hover:border-mystic-gold/30 group-hover:bg-mystic-gold/10
                        transition-all duration-300">
          <span className="text-2xl" aria-hidden="true">{mod.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-mystic-accent font-display font-semibold text-sm leading-snug tracking-wide">
              {mod.name}
            </h3>
            <span className={`text-[9px] border px-1.5 py-0.5 rounded-full tracking-wider uppercase font-sans ${badgeCls}`}>
              {mod.badge}
            </span>
          </div>
          <p className="text-mystic-muted text-xs leading-relaxed font-sans">{mod.description}</p>
          <div className="mt-3 flex items-center gap-2">
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-sans
                               text-amber-400/80 border border-amber-700/40 bg-amber-900/20
                               px-2 py-0.5 rounded-full tracking-wide">
                🔥 {streak} {streak === 1 ? 'día' : 'días'}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center justify-end">
            <span className="flex items-center gap-1 text-mystic-gold/60 text-xs group-hover:text-mystic-gold
                             transition-colors duration-200 font-sans tracking-wider">
              Consultar
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                   className="w-3 h-3 inline-block group-hover:translate-x-1 transition-transform duration-200">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="w-3 h-3 inline-block group-hover:translate-x-1 transition-transform duration-200"
         aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function SpreadCard({ id, spread }) {
  return (
    <Link
      to={`/tirada/${id}`}
      className="group block relative bg-mystic-surface/70 border border-mystic-border/70 rounded-2xl p-5
                 hover:border-mystic-gold/50 hover:bg-mystic-card cursor-pointer
                 transition-all duration-300 backdrop-blur-md
                 hover:shadow-2xl hover:shadow-mystic-purple/25
                 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-mystic-gold/0 to-mystic-purple/0
                      group-hover:from-mystic-gold/5 group-hover:to-mystic-purple/10
                      transition-all duration-300 pointer-events-none" />

      <div className="flex items-start gap-4 relative">
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center
                        bg-mystic-border/40 rounded-xl border border-mystic-border
                        group-hover:border-mystic-gold/30 group-hover:bg-mystic-gold/10
                        transition-all duration-300">
          <span className="text-2xl" aria-hidden="true">{spread.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-mystic-accent font-display font-semibold text-sm leading-snug mb-1 tracking-wide">
            {spread.name}
          </h3>
          <p className="text-mystic-muted text-xs leading-relaxed font-sans">
            {spread.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {spread.badge && (
              <span className={`text-[9px] border px-1.5 py-0.5 rounded-full tracking-wider uppercase font-sans ${BADGE_COLORS[spread.badgeColor] || BADGE_COLORS.amber}`}>
                {spread.badge}
              </span>
            )}
            <span className="text-[10px] text-mystic-gold/50 border border-mystic-gold/15
                             px-2 py-0.5 rounded-full tracking-wider uppercase font-sans">
              {spread.cardCount} {spread.cardCount === 1 ? 'carta' : 'cartas'}
            </span>
            <span className="flex items-center gap-1 text-mystic-gold/60 text-xs ml-auto group-hover:text-mystic-gold
                             transition-colors duration-200 font-sans tracking-wider">
              Consultar <ArrowRightIcon />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Home() {
  const { streak } = useTarotStreak()
  const { profile } = useUserProfile()

  const hasSigns = profile.signo_sol || profile.signo_luna || profile.signo_ascendente

  const grouped = Object.entries(CATEGORIES).map(([catKey, cat]) => ({
    catKey,
    cat,
    spreads: Object.entries(SPREADS).filter(([, s]) => s.category === catKey),
  }))

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <SeoHead
        description="Tarot, astrología y numerología con inteligencia artificial. Carta astral, tiradas personalizadas y lecturas del oráculo. Consulta gratis."
        path="/"
      />
      <StarField />

      {/* Ambient orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-mystic-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-80 h-80 bg-mystic-violet/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 text-center py-14 md:py-20 px-4">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute w-24 h-24 rounded-full bg-mystic-gold/20 blur-2xl animate-glow" />
          <span className="text-6xl md:text-7xl animate-float relative leading-none" role="img" aria-label="Bola de cristal">🔮</span>
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-display font-bold tracking-widest uppercase mb-3"
          style={{
            background: 'linear-gradient(90deg, #c9a84c, #e8c97e, #c9a84c, #9d7a30, #c9a84c)',
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 4s linear infinite',
          }}
        >
          Pitonisa GPT
        </h1>
        <p className="text-mystic-muted text-base tracking-[0.25em] uppercase mb-6 font-sans">
          Tu Oráculo con Inteligencia Artificial
        </p>
        <div className="flex justify-center items-center gap-3">
          <div className="w-20 h-px bg-gradient-to-r from-transparent to-mystic-gold/60" />
          <span className="text-mystic-gold text-sm" aria-hidden="true">✦</span>
          <div className="w-20 h-px bg-gradient-to-l from-transparent to-mystic-gold/60" />
        </div>
        {/* Sign profile — shown if carta astral was calculated before */}
        {hasSigns ? (
          <div className="mt-5 flex flex-col items-center gap-1.5 animate-fadeIn">
            {profile.nombre && (
              <p className="text-mystic-muted/50 text-[11px] font-sans tracking-widest uppercase">
                Hola, {profile.nombre}
              </p>
            )}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {profile.signo_sol && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-sans
                                 text-mystic-accent/80 border border-mystic-border/50
                                 bg-mystic-surface/50 px-3 py-1 rounded-full tracking-wide">
                  ☀️ {profile.signo_sol}
                </span>
              )}
              {profile.signo_luna && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-sans
                                 text-mystic-accent/80 border border-mystic-border/50
                                 bg-mystic-surface/50 px-3 py-1 rounded-full tracking-wide">
                  🌙 {profile.signo_luna}
                </span>
              )}
              {profile.signo_ascendente && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-sans
                                 text-mystic-accent/80 border border-mystic-border/50
                                 bg-mystic-surface/50 px-3 py-1 rounded-full tracking-wide">
                  ↑ {profile.signo_ascendente}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-mystic-muted/60 text-xs tracking-widest mt-5 uppercase font-sans">
            {Object.keys(SPREADS).length} tiradas · {MODULES.length + 1} módulos · Tarot · Astrología · Numerología
          </p>
        )}
      </header>

      {/* ✦ Tu cielo ahora — cosmic dashboard */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-8">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-violet-500/20" />
          <span className="text-[10px] font-sans uppercase tracking-[0.35em] text-violet-400/45 whitespace-nowrap">
            ✦ Tu cielo ahora
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-violet-500/20" />
        </div>

        {/* Moon + Numerology side by side */}
        <div className={`grid gap-3 mb-3 ${profile.fecha_nacimiento ? 'grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'}`}>
          <MoonPhase />
          {profile.fecha_nacimiento && <NumerologyPortrait profile={profile} />}
        </div>

        {/* Retrograde row — full width below */}
        <RetrogradeBanner nombre={profile.nombre} />
      </div>

      {/* Featured: Carta Astral */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-6">
        <Link
          to="/carta-astral"
          className="group flex items-center gap-5 bg-mystic-surface/70 border border-mystic-gold/25
                     rounded-2xl p-5 backdrop-blur-md cursor-pointer
                     hover:border-mystic-gold/60 hover:shadow-2xl hover:shadow-mystic-gold/10
                     transition-all duration-300 hover:-translate-y-0.5
                     focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
        >
          <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center
                          bg-gradient-to-br from-mystic-gold/20 to-mystic-purple/20
                          rounded-xl border border-mystic-gold/30 group-hover:border-mystic-gold/60
                          transition-all duration-300">
            <span className="text-3xl" aria-hidden="true">⭐</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-mystic-gold font-display font-bold text-sm tracking-[0.15em] uppercase">
                Carta Astral
              </h2>
              <span className="text-[10px] bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold/80
                               px-2 py-0.5 rounded-full font-sans tracking-wider uppercase">Nuevo</span>
            </div>
            <p className="text-mystic-muted text-xs font-sans leading-relaxed">
              Tu mapa natal completo: Sol, Luna, Ascendente, 10 planetas con sus casas y aspectos.
              Calculado con Swiss Ephemeris (NASA/JPL). Interpretación personal con IA.
            </p>
          </div>
          <div className="flex-shrink-0 text-mystic-gold/50 group-hover:text-mystic-gold transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Módulos Especiales */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 mb-10">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xl" aria-hidden="true">🌟</span>
          <h2 className="text-mystic-accent/90 font-display text-sm font-semibold tracking-[0.2em] uppercase">
            Módulos Especiales
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-mystic-border/60 to-transparent" />
          <span className="text-mystic-muted/40 text-xs font-sans tracking-wide">
            {MODULES.length} módulos
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(mod => (
            <ModuleCard key={mod.id} mod={mod} streak={mod.id === 'tarot-diario' ? streak : 0} />
          ))}
        </div>
      </div>

      {/* Grouped spread sections */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-24 space-y-14">
        {grouped.map(({ catKey, cat, spreads }) =>
          spreads.length === 0 ? null : (
            <section key={catKey} aria-labelledby={`cat-${catKey}`}>
              {/* Category header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                <h2
                  id={`cat-${catKey}`}
                  className="text-mystic-accent/90 font-display text-sm font-semibold tracking-[0.2em] uppercase"
                >
                  {cat.label}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-mystic-border/60 to-transparent" />
                <span className="text-mystic-muted/40 text-xs font-sans tracking-wide">
                  {spreads.length} tirada{spreads.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {spreads.map(([id, spread]) => (
                  <SpreadCard key={id} id={id} spread={spread} />
                ))}
              </div>
            </section>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 border-t border-mystic-border/30">
        <div className="flex justify-center items-center gap-3 mb-2">
          <div className="w-12 h-px bg-mystic-border/60" />
          <span className="text-mystic-border text-xs" aria-hidden="true">✦</span>
          <div className="w-12 h-px bg-mystic-border/60" />
        </div>
        <p className="text-mystic-muted/50 text-[11px] tracking-wide font-sans">
          Sitio de entretenimiento — Las lecturas no sustituyen consejos profesionales
        </p>
      </footer>
    </div>
  )
}
