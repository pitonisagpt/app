import { Link } from 'react-router-dom'
import { SPREADS } from '../../data/spreads'
import { MODULES } from '../../data/modules'

const BADGE_COLORS = {
  rose:    'bg-rose-900/30 border-rose-700/40 text-rose-300/80',
  emerald: 'bg-emerald-900/30 border-emerald-700/40 text-emerald-300/80',
  violet:  'bg-violet-900/30 border-violet-700/40 text-violet-300/80',
  blue:    'bg-blue-900/30 border-blue-700/40 text-blue-300/80',
  amber:   'bg-amber-900/30 border-amber-700/40 text-amber-300/80',
}

// Pre-built suggestion maps keyed by spread id or module id
const SPREAD_SUGGESTIONS = {
  'amor':              ['que-siente', 'volvera-ex', 'encontrar-amor'],
  'que-siente':        ['amor', 'volvera-ex', 'compatibilidad'],
  'encontrar-amor':    ['amor', 'que-siente', 'espejo-alma'],
  'si-o-no':           ['1-carta', 'oraculo', '3-cartas'],
  'si-no-2':           ['si-o-no', 'oraculo', '3-cartas'],
  '1-carta':           ['2-cartas', 'oraculo', 'encrucijada'],
  '2-cartas':          ['1-carta', 'favor-y-contra', 'oraculo'],
  'favor-y-contra':    ['encrucijada', 'oraculo', '3-cartas'],
  'encrucijada':       ['favor-y-contra', 'celta', 'oraculo'],
  'verdad-oculta':     ['oraculo', 'espejo-alma', 'celta'],
  '3-cartas':          ['oraculo', 'celta', 'gitano'],
  'oraculo':           ['celta', '3-cartas', 'estrella'],
  'celta':             ['oraculo', 'gitano', 'matriz-destino'],
  'lunar':             ['estrella', 'oraculo', 'carta-astral'],
  'estrella':          ['lunar', 'desarrollo-espiritual', 'oraculo'],
  'gitano':            ['celta', 'oraculo', 'matriz-destino'],
  'matriz-destino':    ['anyo-personal', 'carta-astral', 'verdadero-yo'],
  'verdadero-yo':      ['espejo-alma', 'mente-cuerpo-espiritu', 'carta-astral'],
  'espejo-alma':       ['verdadero-yo', 'sanacion-emocional', 'desarrollo-espiritual'],
  'mente-cuerpo-espiritu': ['espejo-alma', 'sanacion-emocional', 'desarrollo-espiritual'],
  'sanacion-emocional':    ['espejo-alma', 'desarrollo-espiritual', 'cabala'],
  'desarrollo-espiritual': ['sanacion-emocional', 'cabala', 'carta-astral'],
  'cabala':            ['desarrollo-espiritual', 'espejo-alma', 'matriz-destino'],
  'dinero':            ['anyo-personal', 'transitos', 'oraculo'],
}

const MODULE_SUGGESTIONS = {
  'volvera-ex':     ['amor', 'que-siente', 'compatibilidad'],
  'tarot-diario':   ['oraculo', 'anyo-personal', 'carta-astral'],
  'anyo-personal':  ['transitos', 'carta-astral', 'oraculo'],
  'compatibilidad': ['amor', 'que-siente', 'volvera-ex'],
  'transitos':      ['carta-astral', 'anyo-personal', '3-cartas'],
}

// Resolve an id to its full display data (spread or module or special)
function resolve(id) {
  if (id === 'carta-astral') {
    return {
      label: 'Carta Astral',
      icon: '⭐',
      to: '/carta-astral',
      description: 'Tu mapa natal completo con Sol, Luna, Ascendente y 10 planetas.',
      badge: 'Astrología',
      badgeColor: 'amber',
    }
  }
  if (SPREADS[id]) {
    const s = SPREADS[id]
    return {
      label: s.name,
      icon: s.icon,
      to: `/tirada/${id}`,
      description: s.description,
      badge: s.badge,
      badgeColor: s.badgeColor,
      cardCount: s.cardCount,
    }
  }
  const mod = MODULES.find(m => m.id === id)
  if (mod) {
    return {
      label: mod.name,
      icon: mod.icon,
      to: mod.path,
      description: mod.description,
      badge: mod.badge,
      badgeColor: mod.badgeColor,
    }
  }
  return null
}

export default function RelatedCTAs({ sourceId, sourceType = 'spread' }) {
  const ids = sourceType === 'spread'
    ? SPREAD_SUGGESTIONS[sourceId]
    : MODULE_SUGGESTIONS[sourceId]

  if (!ids?.length) return null

  const items = ids.map(resolve).filter(Boolean).slice(0, 3)
  if (!items.length) return null

  return (
    <div className="mt-8 animate-fadeIn">
      {/* Divider */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-border/40" />
        <span className="text-[10px] uppercase tracking-[0.3em] text-mystic-muted/40 font-sans">
          También podría interesarte
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-border/40" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map(({ label, icon, to, description, badge, badgeColor, cardCount }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-start gap-3 p-4 rounded-xl border border-mystic-border/50
                       bg-mystic-surface/50 hover:border-mystic-gold/40 hover:bg-mystic-card
                       transition-all duration-200 hover:-translate-y-0.5
                       hover:shadow-lg hover:shadow-mystic-purple/15"
          >
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center
                            bg-mystic-border/30 rounded-lg border border-mystic-border/60
                            group-hover:border-mystic-gold/30 group-hover:bg-mystic-gold/10
                            transition-all duration-200">
              <span className="text-xl" aria-hidden="true">{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <span className="text-mystic-accent font-display font-semibold text-xs leading-snug tracking-wide
                                 group-hover:text-mystic-gold transition-colors duration-200">
                  {label}
                </span>
                {badge && (
                  <span className={`text-[9px] border px-1.5 py-0.5 rounded-full tracking-wider uppercase font-sans ${BADGE_COLORS[badgeColor] || BADGE_COLORS.amber}`}>
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <p className="text-mystic-muted/60 text-[11px] font-sans leading-snug line-clamp-2">
                  {description}
                </p>
              )}
              {cardCount != null && (
                <span className="inline-block mt-1.5 text-[10px] text-mystic-gold/50 border border-mystic-gold/15
                                 px-2 py-0.5 rounded-full tracking-wider uppercase font-sans">
                  {cardCount} {cardCount === 1 ? 'carta' : 'cartas'}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
