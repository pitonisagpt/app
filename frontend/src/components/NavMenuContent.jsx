/**
 * NavMenuContent — shared navigation tree used by both
 * HamburgerMenu (mobile, slides from right) and SidebarMenu (desktop, slides from left).
 */
import { Link } from 'react-router-dom'
import { MODULES } from '../data/modules'
import { SPREADS, CATEGORIES } from '../data/spreads'

const BADGE_COLORS = {
  rose:    'bg-rose-900/30 border-rose-700/40 text-rose-300/80',
  emerald: 'bg-emerald-900/30 border-emerald-700/40 text-emerald-300/80',
  violet:  'bg-violet-900/30 border-violet-700/40 text-violet-300/80',
  blue:    'bg-blue-900/30 border-blue-700/40 text-blue-300/80',
  amber:   'bg-amber-900/30 border-amber-700/40 text-amber-300/80',
}

function SectionHeader({ icon, label }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-5 pb-2">
      <span className="text-base leading-none">{icon}</span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-mystic-gold/60 font-sans font-semibold">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-mystic-border/50 to-transparent" />
    </div>
  )
}

export default function NavMenuContent({ onClose }) {
  const grouped = Object.entries(CATEGORIES).map(([catKey, cat]) => ({
    catKey, cat,
    spreads: Object.entries(SPREADS).filter(([, s]) => s.category === catKey),
  })).filter(g => g.spreads.length > 0)

  return (
    <>
      {/* ── Carta Astral featured ── */}
      <div className="px-3 pt-4">
        <Link
          to="/carta-astral"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3.5 rounded-xl
                     border border-mystic-gold/25 bg-gradient-to-r from-mystic-purple/20 to-mystic-violet/10
                     hover:border-mystic-gold/50 hover:from-mystic-purple/30
                     transition-all duration-200 group"
        >
          <span className="text-2xl">⭐</span>
          <div className="flex-1 min-w-0">
            <p className="text-mystic-gold text-sm font-display font-semibold tracking-wide">Carta Astral</p>
            <p className="text-mystic-muted/55 text-[11px] font-sans">Tu mapa natal completo con IA</p>
          </div>
          <span className="text-[9px] bg-mystic-gold/15 border border-mystic-gold/30 text-mystic-gold/80
                           px-1.5 py-0.5 rounded-full font-sans tracking-wider uppercase flex-shrink-0">Nuevo</span>
        </Link>
      </div>

      {/* ── Módulos especiales ── */}
      <SectionHeader icon="🌟" label="Módulos Especiales" />
      <div className="px-3 space-y-1">
        {MODULES.map(mod => (
          <Link
            key={mod.id}
            to={mod.path}
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                       hover:bg-mystic-surface/70 border border-transparent
                       hover:border-mystic-border/50
                       transition-all duration-150 group"
          >
            <span className="text-xl w-8 text-center flex-shrink-0">{mod.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-mystic-accent/90 text-sm font-sans font-medium leading-snug">{mod.name}</p>
              <p className="text-mystic-muted/45 text-[10px] font-sans truncate">{mod.description}</p>
            </div>
            <span className={`text-[9px] border px-1.5 py-0.5 rounded-full tracking-wider uppercase font-sans flex-shrink-0 ${BADGE_COLORS[mod.badgeColor] || BADGE_COLORS.amber}`}>
              {mod.badge}
            </span>
          </Link>
        ))}
      </div>

      {/* ── Tiradas por categoría ── */}
      {grouped.map(({ catKey, cat, spreads }) => (
        <div key={catKey}>
          <SectionHeader icon={cat.icon} label={cat.label} />
          <div className="px-3 space-y-0.5">
            {spreads.map(([id, spread]) => (
              <Link
                key={id}
                to={`/tirada/${id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 rounded-xl
                           hover:bg-mystic-surface/70 border border-transparent
                           hover:border-mystic-border/50
                           transition-all duration-150"
              >
                <span className="text-base w-7 text-center flex-shrink-0">{spread.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-mystic-muted/80 text-xs font-sans leading-snug">{spread.name}</p>
                </div>
                <span className="text-[10px] text-mystic-muted/30 font-sans flex-shrink-0">
                  {spread.cardCount} {spread.cardCount === 1 ? 'carta' : 'cartas'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
