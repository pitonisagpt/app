/**
 * DistributionCharts.jsx — Element, Modality, Polarity & Quadrant distribution bars + donuts
 */

const ELEMENT_CONFIG = {
  Fuego:   { color: '#ef4444', bg: 'bg-red-500',    icon: '🔥', label: 'Fuego'  },
  Tierra:  { color: '#84cc16', bg: 'bg-lime-500',   icon: '🌍', label: 'Tierra' },
  Aire:    { color: '#38bdf8', bg: 'bg-sky-400',    icon: '💨', label: 'Aire'   },
  Agua:    { color: '#818cf8', bg: 'bg-indigo-400', icon: '💧', label: 'Agua'   },
}

const MODALITY_CONFIG = {
  Cardinal: { color: '#f59e0b', icon: '⚡', label: 'Cardinal' },
  Fija:     { color: '#a78bfa', icon: '🔒', label: 'Fija'     },
  Mutable:  { color: '#34d399', icon: '🌊', label: 'Mutable'  },
}

const POLARITY_CONFIG = {
  Masculino: { color: '#60a5fa', icon: '☀️', label: 'Masculino' },
  Femenino:  { color: '#f472b6', icon: '🌙', label: 'Femenino'  },
}

const QUADRANT_CONFIG = {
  'Q1 (Casas 1-3)':   { color: '#f87171', label: 'Q1 (1–3)' },
  'Q2 (Casas 4-6)':   { color: '#fbbf24', label: 'Q2 (4–6)' },
  'Q3 (Casas 7-9)':   { color: '#34d399', label: 'Q3 (7–9)' },
  'Q4 (Casas 10-12)': { color: '#818cf8', label: 'Q4 (10–12)' },
}

// ── Donut chart ───────────────────────────────────────────────────────────────

const DONUT_R   = 38
const DONUT_CX  = 50
const DONUT_CY  = 50
const DONUT_C   = 2 * Math.PI * DONUT_R   // circumference ≈ 238.76

function DonutChart({ segments, title, centerIcon }) {
  // segments: [{ label, value, color }]
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  if (total === 0) return null

  let offset = 0
  const arcs = segments.map(seg => {
    const pct    = seg.value / total
    const dash   = pct * DONUT_C
    const gap    = DONUT_C - dash
    const rotate = (offset / total) * 360 - 90 // start from top
    offset += seg.value
    return { ...seg, dash, gap, rotate }
  })

  const dominant = segments.reduce((a, b) => (a.value >= b.value ? a : b))

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 100 100" width="120" height="120" className="overflow-visible">
        {/* Track */}
        <circle
          cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={10}
        />
        {/* Glow blur ring for dominant */}
        <circle
          cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
          fill="none"
          stroke={dominant.color}
          strokeWidth={14}
          strokeOpacity={0.08}
          strokeDasharray={`${(dominant.value / total) * DONUT_C} ${DONUT_C}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${DONUT_CX} ${DONUT_CY})`}
        />
        {/* Segments */}
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={DONUT_CX} cy={DONUT_CY} r={DONUT_R}
            fill="none"
            stroke={arc.color}
            strokeWidth={10}
            strokeLinecap="butt"
            strokeDasharray={`${arc.dash} ${arc.gap}`}
            strokeDashoffset={0}
            transform={`rotate(${arc.rotate} ${DONUT_CX} ${DONUT_CY})`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        ))}
        {/* Center text */}
        <text x={DONUT_CX} y={DONUT_CY - 5} textAnchor="middle" fontSize={16} dominantBaseline="middle">
          {centerIcon || '✦'}
        </text>
        <text x={DONUT_CX} y={DONUT_CY + 11} textAnchor="middle" fontSize={7}
              fill={dominant.color} dominantBaseline="middle" fontWeight="bold">
          {dominant.label}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-col gap-1 w-full">
        {segments.map(seg => {
          const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0
          return (
            <div key={seg.label} className="flex items-center gap-2 text-[11px]">
              <span className="text-sm leading-none">{seg.icon || ''}</span>
              <span className="flex-1 text-slate-300">{seg.label}</span>
              <div className="w-16 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: seg.color }}
                />
              </div>
              <span className="w-8 text-right text-slate-500">{seg.value}</span>
            </div>
          )
        })}
      </div>

      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-sans">{title}</p>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

const DONUT_CONFIGS = [
  { key: 'elementos',   title: 'Elementos',   centerIcon: '🔥', segsKey: 'element_count',  cfg: ELEMENT_CONFIG  },
  { key: 'modalidades', title: 'Modalidades', centerIcon: '⚡', segsKey: 'modality_count', cfg: MODALITY_CONFIG },
  { key: 'polaridad',   title: 'Polaridad',   centerIcon: '☯', segsKey: 'polarity_count', cfg: POLARITY_CONFIG },
  { key: 'cuadrantes',  title: 'Cuadrantes',  centerIcon: '🏠', segsKey: 'quadrant_count', cfg: QUADRANT_CONFIG, labelKey: true },
]

export default function DistributionCharts({ chart, selectedEnergy, onSelectEnergy }) {
  if (!chart) return null

  const total = chart.dist_total ?? 10

  const elementSegs = Object.entries(chart.element_count ?? {}).map(([name, val]) => ({
    label: name, value: val, color: ELEMENT_CONFIG[name]?.color ?? '#888',
    icon: ELEMENT_CONFIG[name]?.icon,
  }))

  const allSegs = {
    elementos:   elementSegs,
    modalidades: Object.entries(chart.modality_count ?? {}).map(([name, val]) => ({
      label: name, value: val, color: MODALITY_CONFIG[name]?.color ?? '#888', icon: MODALITY_CONFIG[name]?.icon,
    })),
    polaridad:   Object.entries(chart.polarity_count ?? {}).map(([name, val]) => ({
      label: name, value: val, color: POLARITY_CONFIG[name]?.color ?? '#888', icon: POLARITY_CONFIG[name]?.icon,
    })),
    cuadrantes:  Object.entries(chart.quadrant_count ?? {}).map(([name, val]) => ({
      label: QUADRANT_CONFIG[name]?.label ?? name, value: val, color: QUADRANT_CONFIG[name]?.color ?? '#888',
    })),
  }

  return (
    <div className="space-y-6">
      {/* Donut row — each is clickable */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DONUT_CONFIGS.map(({ key, title, centerIcon }) => {
          const segs = allSegs[key]
          if (!segs?.length) return null
          const isSelected = selectedEnergy === key
          return (
            <button
              key={key}
              onClick={() => onSelectEnergy(isSelected ? null : key)}
              className={`rounded-2xl p-4 flex flex-col items-center gap-2 border transition-colors duration-200 w-full
                ${isSelected
                  ? 'border-mystic-gold/40 bg-mystic-surface/70'
                  : 'border-slate-700/40 bg-slate-800/40 hover:border-slate-600/60'}`}
            >
              <DonutChart segments={segs} title={title} centerIcon={centerIcon} />
              {isSelected && (
                <span className="text-[9px] uppercase tracking-widest text-mystic-gold/60 font-sans">
                  🔮 La Pitonisa revela
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Element keyword cards */}
      {elementSegs.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {elementSegs.map(seg => {
            const pct = total > 0 ? Math.round((seg.value / total) * 100) : 0
            const cfg = ELEMENT_CONFIG[seg.label]
            const keywords = {
              Fuego:  ['Pasión', 'Impulso', 'Liderazgo', 'Visión'],
              Tierra: ['Perseverancia', 'Practicidad', 'Lealtad', 'Sensatez'],
              Aire:   ['Intelecto', 'Comunicación', 'Curiosidad', 'Adaptación'],
              Agua:   ['Intuición', 'Empatía', 'Profundidad', 'Sensibilidad'],
            }
            const kw = keywords[seg.label] || []
            return (
              <div
                key={seg.label}
                className="rounded-xl p-3 flex flex-col gap-2"
                style={{ background: `${seg.color}10`, border: `1px solid ${seg.color}25` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{cfg?.icon}</span>
                  <span className="font-display font-bold text-lg" style={{ color: seg.color }}>{pct}%</span>
                </div>
                <p className="font-display font-semibold text-sm" style={{ color: seg.color }}>{seg.label}</p>
                <div className="flex flex-wrap gap-1">
                  {kw.slice(0, 2).map(k => (
                    <span key={k} className="text-[9px] px-1.5 py-0.5 rounded-full font-sans"
                          style={{ background: `${seg.color}15`, color: `${seg.color}bb` }}>
                      {k}
                    </span>
                  ))}
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
                  <div className="h-1 rounded-full" style={{ width: `${pct}%`, backgroundColor: seg.color }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
