import { Link } from 'react-router-dom'
import { useRetrogradePlanets } from '../hooks/useRetrogradePlanets'

const PLANET_CONFIG = {
  mercury: {
    bg:     'rgba(100,116,139,0.10)',
    border: 'rgba(148,163,184,0.22)',
    glow:   'rgba(148,163,184,0.15)',
    symbol: '#94a3b8',
    badge:  'border-slate-500/40 bg-slate-800/40 text-slate-300/80',
    advice: 'Evita firmar contratos y revisa mensajes antes de enviar. Ideal para retomar proyectos pendientes.',
  },
  venus: {
    bg:     'rgba(159,18,57,0.10)',
    border: 'rgba(251,113,133,0.22)',
    glow:   'rgba(251,113,133,0.15)',
    symbol: '#fb7185',
    badge:  'border-rose-500/40 bg-rose-900/30 text-rose-300/80',
    advice: 'Revisa tus relaciones con honestidad. Momento para sanar vínculos y reconectar con lo que valoras.',
  },
  mars: {
    bg:     'rgba(127,29,29,0.10)',
    border: 'rgba(248,113,113,0.22)',
    glow:   'rgba(248,113,113,0.15)',
    symbol: '#f87171',
    badge:  'border-red-500/40 bg-red-900/30 text-red-300/80',
    advice: 'Frena la impulsividad. Usa esta energía para planificar y preparar en lugar de actuar.',
  },
  jupiter: {
    bg:     'rgba(120,53,15,0.10)',
    border: 'rgba(252,211,77,0.22)',
    glow:   'rgba(252,211,77,0.15)',
    symbol: '#fcd34d',
    badge:  'border-amber-500/40 bg-amber-900/25 text-amber-300/80',
    advice: 'Pausa en la expansión. Consolida lo ya logrado antes de abrirte a nuevas oportunidades.',
  },
  saturn: {
    bg:     'rgba(101,80,0,0.10)',
    border: 'rgba(202,138,4,0.22)',
    glow:   'rgba(202,138,4,0.15)',
    symbol: '#ca8a04',
    badge:  'border-yellow-600/40 bg-yellow-900/25 text-yellow-300/80',
    advice: 'Revisa estructuras y compromisos. Momento para redefinir límites y responsabilidades.',
  },
  uranus: {
    bg:     'rgba(22,78,99,0.10)',
    border: 'rgba(34,211,238,0.22)',
    glow:   'rgba(34,211,238,0.15)',
    symbol: '#22d3ee',
    badge:  'border-cyan-500/40 bg-cyan-900/25 text-cyan-300/80',
    advice: 'Los cambios se interiorizan. Procesa las revoluciones que ocurren dentro de ti.',
  },
  neptune: {
    bg:     'rgba(23,37,84,0.10)',
    border: 'rgba(96,165,250,0.22)',
    glow:   'rgba(96,165,250,0.15)',
    symbol: '#60a5fa',
    badge:  'border-blue-500/40 bg-blue-900/25 text-blue-300/80',
    advice: 'Tu intuición mira hacia adentro. Ideal para meditación, sueños y trabajo espiritual.',
  },
  pluto: {
    bg:     'rgba(46,16,101,0.10)',
    border: 'rgba(167,139,250,0.22)',
    glow:   'rgba(167,139,250,0.15)',
    symbol: '#a78bfa',
    badge:  'border-violet-500/40 bg-violet-900/25 text-violet-300/80',
    advice: 'Transformación profunda en curso. Deja ir lo que ya no sirve a tu evolución.',
  },
}

function PlanetCard({ planet }) {
  const c = PLANET_CONFIG[planet.attr] || PLANET_CONFIG.mercury
  return (
    <div
      className="relative flex items-start gap-4 p-4 rounded-2xl border overflow-hidden"
      style={{ background: c.bg, borderColor: c.border, boxShadow: `0 0 30px ${c.glow}` }}
    >
      {/* Ambient glow top-left */}
      <div
        className="absolute -top-4 -left-4 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{ background: c.glow }}
      />

      {/* Symbol column */}
      <div className="relative flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{ borderColor: c.border, background: `${c.symbol}18` }}
        >
          <span
            className="font-serif text-2xl leading-none select-none"
            style={{ color: c.symbol, textShadow: `0 0 16px ${c.symbol}80` }}
          >
            {planet.symbol}
          </span>
        </div>
        {/* Retrograde symbol */}
        <span className="text-[9px] font-sans tracking-widest opacity-50" style={{ color: c.symbol }}>
          ℞
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + badge row */}
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="font-display font-bold text-sm tracking-wide text-mystic-accent/90">
            {planet.name}
          </span>
          <span className={`text-[9px] font-sans uppercase tracking-widest px-2 py-0.5 rounded-full border ${c.badge}`}>
            Retrógrado
          </span>
          {planet.until && (
            <span
              className="text-[10px] font-sans px-2 py-0.5 rounded-full border tracking-wide"
              style={{ borderColor: c.border, color: `${c.symbol}bb` }}
            >
              hasta el {planet.until}
            </span>
          )}
        </div>

        {/* Meaning */}
        <p className="text-mystic-muted/75 text-[12px] font-sans leading-snug mb-1.5 capitalize">
          {planet.meaning}.
        </p>

        {/* Advice */}
        <p className="text-mystic-muted/45 text-[11px] font-sans leading-relaxed italic">
          {PLANET_CONFIG[planet.attr]?.advice}
        </p>
      </div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-[100px] rounded-2xl bg-mystic-surface/40 border border-mystic-border/15" />
    </div>
  )
}

function EmptyState() {
  return (
    <div
      className="relative flex items-center gap-4 w-full px-5 py-4 rounded-2xl border overflow-hidden"
      style={{
        background:   'rgba(6,78,59,0.08)',
        borderColor:  'rgba(52,211,153,0.20)',
        boxShadow:    '0 0 30px rgba(52,211,153,0.06)',
      }}
    >
      <div
        className="absolute -top-6 -left-6 w-20 h-20 rounded-full blur-2xl pointer-events-none"
        style={{ background: 'rgba(52,211,153,0.10)' }}
      />
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border border-emerald-600/25 bg-emerald-900/20">
        <span className="text-2xl leading-none select-none">✦</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold text-sm tracking-wide text-emerald-300/85 mb-0.5">
          Cielo directo — energía favorable
        </p>
        <p className="text-mystic-muted/55 text-[11px] font-sans leading-snug">
          Todos los planetas fluyen en directo. Es momento ideal para tomar decisiones, firmar acuerdos y avanzar con claridad.
        </p>
      </div>
      <span className="text-emerald-400/30 text-xs flex-shrink-0">→</span>
    </div>
  )
}

export default function RetrogradeBanner() {
  const { retrogrades, loading, error } = useRetrogradePlanets()

  if (error) return null

  const hasMany = retrogrades.length > 1

  return (
    <div className="w-full animate-fadeIn">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="flex-1 h-px"
          style={{
            background: loading || retrogrades.length === 0
              ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.06))'
              : 'linear-gradient(to right, transparent, rgba(239,68,68,0.25))',
          }}
        />
        <span
          className="text-[9px] font-sans uppercase tracking-[0.3em] whitespace-nowrap"
          style={{
            color: loading || retrogrades.length === 0
              ? 'rgba(255,255,255,0.22)'
              : 'rgba(239,68,68,0.60)',
          }}
        >
          {loading
            ? 'Clima planetario'
            : retrogrades.length === 0
              ? '✦ Clima planetario'
              : `⚠ ${retrogrades.length === 1 ? '1 planeta retrógrado' : `${retrogrades.length} planetas retrógrados`}`
          }
        </span>
        <div
          className="flex-1 h-px"
          style={{
            background: loading || retrogrades.length === 0
              ? 'linear-gradient(to left, transparent, rgba(255,255,255,0.06))'
              : 'linear-gradient(to left, transparent, rgba(239,68,68,0.25))',
          }}
        />
      </div>

      {/* Content */}
      {loading && <Skeleton />}

      {!loading && retrogrades.length === 0 && <EmptyState />}

      {!loading && retrogrades.length > 0 && (
        <div className={`grid gap-3 ${hasMany ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
          {retrogrades.map(p => <PlanetCard key={p.attr} planet={p} />)}
        </div>
      )}

      {/* CTA */}
      {!loading && (
        <div className="mt-3 text-center">
          <Link
            to="/transitos"
            className="text-[10px] font-sans uppercase tracking-widest
                       text-mystic-muted/25 hover:text-mystic-gold/50 transition-colors duration-200"
          >
            Ver mis tránsitos personales →
          </Link>
        </div>
      )}
    </div>
  )
}
