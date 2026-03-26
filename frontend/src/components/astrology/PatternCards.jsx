/**
 * PatternCards.jsx — Chart ruler, stelliums, aspect patterns,
 *                    dignities, hemisphere & sect cards
 */

// ── Constants ─────────────────────────────────────────────────────────────────

const PLANET_ICON = {
  sol: '☀️', luna: '🌙', mercurio: '☿', venus: '♀', marte: '♂',
  jupiter: '♃', saturno: '♄', urano: '⛢', neptuno: '♆', pluton: '♇',
  chiron: '⚷', lilith: '⚸', north_node: '☊',
}
const PLANET_LABEL = {
  sol: 'Sol', luna: 'Luna', mercurio: 'Mercurio', venus: 'Venus', marte: 'Marte',
  jupiter: 'Júpiter', saturno: 'Saturno', urano: 'Urano', neptuno: 'Neptuno', pluton: 'Plutón',
  chiron: 'Quirón', lilith: 'Lilith', north_node: 'Nodo Norte',
}
const PLANET_COLOR = {
  sol: '#f4a800', luna: '#c8c8e0', mercurio: '#a0a0ff', venus: '#ff80b0',
  marte: '#ff5050', jupiter: '#c060c0', saturno: '#8080c0', urano: '#40c0c0',
  neptuno: '#6080ff', pluton: '#c06060', chiron: '#80c080', lilith: '#c06080',
  north_node: '#c0a000',
}

const DIGNITY_CFG = {
  domicilio:   { label: 'Domicilio',   icon: '✨', color: '#22c55e', bg: 'rgba(34,197,94,0.12)',  desc: 'En casa' },
  exaltacion:  { label: 'Exaltación',  icon: '⬆️', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', desc: 'En su máximo poder' },
  detrimento:  { label: 'Detrimento',  icon: '⬇️', color: '#f97316', bg: 'rgba(249,115,22,0.12)', desc: 'En tensión' },
  caida:       { label: 'Caída',       icon: '📉', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  desc: 'En mínima expresión' },
  neutral:     { label: 'Neutral',     icon: '—',  color: '#64748b', bg: 'transparent',            desc: '' },
}

const PATTERN_CFG = {
  'Gran Trígono':      { color: '#22c55e', glow: 'rgba(34,197,94,0.2)',   bg: 'rgba(34,197,94,0.08)'  },
  'Cruz en T':         { color: '#f97316', glow: 'rgba(249,115,22,0.2)',  bg: 'rgba(249,115,22,0.08)' },
  'Cruz Mayor':        { color: '#ef4444', glow: 'rgba(239,68,68,0.25)',  bg: 'rgba(239,68,68,0.08)'  },
  'Dedo del Destino':  { color: '#a78bfa', glow: 'rgba(167,139,250,0.25)',bg: 'rgba(167,139,250,0.08)'},
}

const EXTRA_ICON = {
  fortuna: '⊕', vertex: '✕', ceres: '⚳', juno: '⚵', vesta: '⚶', pallas: '⚴',
  south_node: '☋',
}
const EXTRA_LABEL = {
  fortuna: 'Parte de Fortuna', vertex: 'Vértice', ceres: 'Ceres',
  juno: 'Juno', vesta: 'Vesta', pallas: 'Palas', south_node: 'Nodo Sur',
}
const EXTRA_DESC = {
  fortuna:    'El punto de mayor abundancia y suerte material en la carta.',
  vertex:     'El eje del destino — encuentros y eventos fatídicos.',
  ceres:      'Cómo nutres y eres nutrido — el amor incondicional.',
  juno:       'El arquetipo de la unión — compromisos y lealtad.',
  vesta:      'La llama interior — lo sagrado y la dedicación.',
  pallas:     'La sabiduría estratégica — el intelecto creativo.',
  south_node: 'El talento kármico del pasado — lo que ya dominas.',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ children }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-sans mb-3">{children}</p>
  )
}

// Chart Ruler
function ChartRulerCard({ ruler }) {
  if (!ruler || !ruler.planet) return null
  const color = PLANET_COLOR[ruler.planet] || '#c9a84c'
  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: `radial-gradient(ellipse at 30% 0%, ${color}18 0%, #0f0f1e 65%)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 8px 32px ${color}14`,
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-4xl leading-none">{PLANET_ICON[ruler.planet]}</span>
          <span className="text-[10px] font-sans" style={{ color: `${color}99` }}>Rector</span>
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.25em] font-sans text-slate-500 mb-1">
            Planeta Rector de tu Carta
          </p>
          <p className="font-display font-bold text-xl" style={{ color }}>
            {PLANET_LABEL[ruler.planet]}
          </p>
          <p className="font-sans text-sm text-slate-300 mt-0.5">
            en {ruler.sign} · {ruler.house}
            {ruler.retrograde && <span className="ml-2 text-amber-400/70 text-xs">℞ retrógrado</span>}
          </p>
          <p className="text-slate-500 text-xs font-sans mt-2 leading-relaxed">
            Este planeta es el guardián de toda tu carta — su posición tiñe cada aspecto de tu vida.
          </p>
        </div>
      </div>
    </div>
  )
}

// Sect (Day / Night birth)
function SectCard({ isDiurnal }) {
  if (isDiurnal === null || isDiurnal === undefined) return null
  const icon   = isDiurnal ? '☀️' : '🌙'
  const name   = isDiurnal ? 'Diurna' : 'Nocturna'
  const color  = isDiurnal ? '#f4a800' : '#818cf8'
  const strong = isDiurnal
    ? 'Sol, Júpiter y Saturno son tus planetas de secta — brillan con más fuerza en tu carta.'
    : 'Luna, Venus y Marte son tus planetas de secta — operan con mayor profundidad e intensidad.'

  return (
    <div
      className="rounded-xl p-4 flex items-center gap-4"
      style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
    >
      <span className="text-3xl select-none">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-widest font-sans text-slate-500 mb-0.5">Carta de Secta</p>
        <p className="font-display font-semibold text-base" style={{ color }}>Naciste bajo una carta {name}</p>
        <p className="text-slate-400 text-xs font-sans mt-1 leading-relaxed">{strong}</p>
      </div>
    </div>
  )
}

// Stelliums
function StelliumCard({ stellium }) {
  return (
    <div className="rounded-xl p-4 border border-mystic-purple/30 bg-mystic-purple/5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">⚡</span>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-sans text-slate-500">Estelión en</p>
          <p className="font-display font-bold text-mystic-accent">{stellium.sign}</p>
        </div>
        <span className="ml-auto text-2xl font-display font-bold text-mystic-purple/60">{stellium.count}✦</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {stellium.planets.map(key => (
          <span
            key={key}
            className="flex items-center gap-1 text-xs font-sans px-2 py-1 rounded-full"
            style={{ background: `${PLANET_COLOR[key] || '#888'}18`, color: PLANET_COLOR[key] || '#aaa', border: `1px solid ${PLANET_COLOR[key] || '#888'}30` }}
          >
            {PLANET_ICON[key]} {PLANET_LABEL[key] || key}
          </span>
        ))}
      </div>
      <p className="text-slate-500 text-xs font-sans mt-2">
        Una concentración excepcional de energía en {stellium.sign} — un área de intensidad vital y propósito concentrado.
      </p>
    </div>
  )
}

// Aspect Patterns
function AspectPatternCard({ pattern }) {
  const cfg = PATTERN_CFG[pattern.type] || { color: '#a78bfa', glow: 'rgba(167,139,250,0.2)', bg: 'rgba(167,139,250,0.08)' }
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, boxShadow: `0 4px 20px ${cfg.glow}` }}
    >
      <div className="flex items-start gap-3">
        <span
          className="text-2xl leading-none mt-0.5 font-bold select-none"
          style={{ color: cfg.color }}
        >
          {pattern.symbol}
        </span>
        <div className="flex-1">
          <p className="font-display font-bold text-sm" style={{ color: cfg.color }}>{pattern.type}</p>
          <p className="text-slate-400 text-xs font-sans mt-0.5 leading-relaxed">{pattern.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {pattern.planets.map(key => (
              <span key={key} className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-slate-800/60 text-slate-300">
                {PLANET_ICON[key] || ''} {PLANET_LABEL[key] || key}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Dignity grid
function DigtitiesGrid({ planets, dignities }) {
  if (!planets || !dignities) return null
  const notable = Object.entries(dignities).filter(([, d]) => d !== 'neutral')
  const neutral = Object.entries(dignities).filter(([, d]) => d === 'neutral')

  return (
    <div>
      <SectionTitle>Dignidades Planetarias</SectionTitle>
      {notable.length === 0 && (
        <p className="text-slate-500 text-xs font-sans italic">Todos los planetas están en posición neutral.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {notable.map(([key, dignity]) => {
          const cfg = DIGNITY_CFG[dignity]
          const pl  = planets[key]
          return (
            <div
              key={key}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ background: cfg.bg, border: `1px solid ${cfg.color}25` }}
            >
              <span className="text-lg">{PLANET_ICON[key]}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-slate-200">{PLANET_LABEL[key]}</p>
                <p className="text-xs font-sans text-slate-400 truncate">{pl?.sign}</p>
              </div>
              <span
                className="text-[10px] font-sans px-2 py-0.5 rounded-full shrink-0"
                style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30` }}
              >
                {cfg.icon} {cfg.label}
              </span>
            </div>
          )
        })}
      </div>
      {neutral.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {neutral.map(([key]) => (
            <span key={key} className="text-[11px] text-slate-600 font-sans">
              {PLANET_ICON[key]} {PLANET_LABEL[key]}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Hemisphere
function HemisphereCard({ hemi }) {
  if (!hemi) return null
  const HEMI_CFG = {
    norte: { label: 'Norte (Casas 1–6)',  desc: 'Mundo interior y vida privada', color: '#818cf8', icon: '⬇️' },
    sur:   { label: 'Sur (Casas 7–12)',   desc: 'Vida pública y mundo exterior',  color: '#f59e0b', icon: '⬆️' },
    este:  { label: 'Este (Casas 10–3)',  desc: 'Energía independiente y propia', color: '#22c55e', icon: '⬅️' },
    oeste: { label: 'Oeste (Casas 4–9)', desc: 'Energía relacional y receptiva',  color: '#38bdf8', icon: '➡️' },
  }
  const total = hemi.norte + hemi.sur || 1
  return (
    <div>
      <SectionTitle>Énfasis Hemisférico</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {['norte','sur','este','oeste'].map(key => {
          const cfg = HEMI_CFG[key]
          const val = hemi[key] || 0
          const pct = Math.round((val / total) * 100)
          const isDominant = hemi.dominant === key
          return (
            <div
              key={key}
              className="rounded-xl p-3"
              style={{
                background: isDominant ? `${cfg.color}12` : 'rgba(15,15,30,0.4)',
                border: `1px solid ${isDominant ? cfg.color + '30' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">{cfg.icon}</span>
                <span className="font-display font-bold text-base" style={{ color: cfg.color }}>{val}</span>
              </div>
              <p className="text-[11px] font-display font-semibold text-slate-300 leading-tight">{cfg.label}</p>
              <p className="text-[10px] font-sans text-slate-500 mt-0.5 leading-tight">{cfg.desc}</p>
              <div className="mt-2 w-full bg-slate-700/40 rounded-full h-1.5 overflow-hidden">
                <div className="h-1.5 rounded-full transition-all duration-700"
                     style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Extra points (fortuna, vertex, asteroids)
function ExtraPointsGrid({ extraPoints }) {
  if (!extraPoints) return null
  const SHOWN = ['fortuna', 'vertex', 'south_node', 'ceres', 'juno', 'vesta', 'pallas']
  const items = SHOWN.filter(k => extraPoints[k])
  if (items.length === 0) return null

  return (
    <div>
      <SectionTitle>Puntos Especiales</SectionTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {items.map(key => {
          const pt = extraPoints[key]
          return (
            <div
              key={key}
              className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3 flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl leading-none">{EXTRA_ICON[key] || '●'}</span>
                <span className="text-[10px] text-slate-500 font-sans">{pt.deg}</span>
              </div>
              <p className="text-[11px] font-display font-semibold text-slate-300">{EXTRA_LABEL[key] || key}</p>
              <p className="text-mystic-accent text-xs font-display">{pt.sign}</p>
              {pt.house && <p className="text-slate-500 text-[10px] font-sans">{pt.house}</p>}
              {EXTRA_DESC[key] && (
                <p className="text-slate-600 text-[10px] font-sans leading-tight mt-0.5">{EXTRA_DESC[key]}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function PatternCards({ chart }) {
  if (!chart) return null

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ChartRulerCard ruler={chart.chart_ruler} />
        <SectCard isDiurnal={chart.is_diurnal} />
      </div>

      {chart.stelliums?.length > 0 && (
        <div>
          <SectionTitle>Esteliones — Concentración de Energía</SectionTitle>
          <div className="space-y-2">
            {chart.stelliums.map((s, i) => <StelliumCard key={i} stellium={s} />)}
          </div>
        </div>
      )}

      {chart.aspect_patterns?.length > 0 && (
        <div>
          <SectionTitle>Configuraciones Especiales</SectionTitle>
          <div className="space-y-2">
            {chart.aspect_patterns.map((p, i) => <AspectPatternCard key={i} pattern={p} />)}
          </div>
        </div>
      )}

      <DigtitiesGrid planets={chart.planets} dignities={chart.planet_dignities} />

      <HemisphereCard hemi={chart.hemisphere_counts} />

      <ExtraPointsGrid extraPoints={chart.extra_points} />
    </div>
  )
}
