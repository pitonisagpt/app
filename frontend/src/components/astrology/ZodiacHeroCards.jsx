/**
 * ZodiacHeroCards.jsx — Sol / Luna / Ascendente hero cards
 */
import OraclePulse, { PULSE_MESSAGES } from '../oracle/OraclePulse'

const SIGN_DATA = {
  Aries:       { symbol: '♈', element: 'Fuego',  modality: 'Cardinal', emoji: '🔥', ruling: 'Marte' },
  Taurus:      { symbol: '♉', element: 'Tierra', modality: 'Fija',     emoji: '🌿', ruling: 'Venus' },
  Gemini:      { symbol: '♊', element: 'Aire',   modality: 'Mutable',  emoji: '💨', ruling: 'Mercurio' },
  Cancer:      { symbol: '♋', element: 'Agua',   modality: 'Cardinal', emoji: '🌊', ruling: 'Luna' },
  Leo:         { symbol: '♌', element: 'Fuego',  modality: 'Fija',     emoji: '🔥', ruling: 'Sol' },
  Virgo:       { symbol: '♍', element: 'Tierra', modality: 'Mutable',  emoji: '🌿', ruling: 'Mercurio' },
  Libra:       { symbol: '♎', element: 'Aire',   modality: 'Cardinal', emoji: '💨', ruling: 'Venus' },
  Scorpio:     { symbol: '♏', element: 'Agua',   modality: 'Fija',     emoji: '🌊', ruling: 'Plutón' },
  Sagittarius: { symbol: '♐', element: 'Fuego',  modality: 'Mutable',  emoji: '🔥', ruling: 'Júpiter' },
  Capricorn:   { symbol: '♑', element: 'Tierra', modality: 'Cardinal', emoji: '🌿', ruling: 'Saturno' },
  Aquarius:    { symbol: '♒', element: 'Aire',   modality: 'Fija',     emoji: '💨', ruling: 'Urano' },
  Pisces:      { symbol: '♓', element: 'Agua',   modality: 'Mutable',  emoji: '🌊', ruling: 'Neptuno' },
}

// Also handle Spanish sign names from kerykeion
const SIGN_ALIASES = {
  Aries: 'Aries', Tauro: 'Taurus', Géminis: 'Gemini', Cáncer: 'Cancer',
  Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Escorpio: 'Scorpio',
  Sagitario: 'Sagittarius', Capricornio: 'Capricorn', Acuario: 'Aquarius', Piscis: 'Pisces',
}

const ELEMENT_GLOW = {
  Fuego:  'rgba(249,115,22,0.25)',
  Tierra: 'rgba(132,204,22,0.2)',
  Aire:   'rgba(56,189,248,0.2)',
  Agua:   'rgba(129,140,248,0.22)',
}
const ELEMENT_BORDER = {
  Fuego:  'rgba(249,115,22,0.35)',
  Tierra: 'rgba(132,204,22,0.28)',
  Aire:   'rgba(56,189,248,0.3)',
  Agua:   'rgba(129,140,248,0.32)',
}
const ELEMENT_TEXT = {
  Fuego:  '#fb923c',
  Tierra: '#a3e635',
  Aire:   '#38bdf8',
  Agua:   '#818cf8',
}

function getSignData(rawSign) {
  if (!rawSign) return null
  const canonical = SIGN_ALIASES[rawSign] || rawSign
  return SIGN_DATA[canonical] || null
}

function HeroCard({ icon, label, planet, deg, house, signRaw, insight, insightLoading }) {
  const sd = getSignData(signRaw)
  if (!sd) return null
  const glow   = ELEMENT_GLOW[sd.element]   || 'rgba(201,168,76,0.15)'
  const border = ELEMENT_BORDER[sd.element] || 'rgba(201,168,76,0.25)'
  const color  = ELEMENT_TEXT[sd.element]   || '#c9a84c'

  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden flex flex-col gap-3 transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        background: `radial-gradient(ellipse at 60% 0%, ${glow} 0%, #0f0f1e 70%)`,
        border: `1px solid ${border}`,
        boxShadow: `0 8px 32px ${glow}`,
      }}
    >
      {/* Top row: planet name + sign symbol */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] font-sans mb-0.5" style={{ color: `${color}99` }}>
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl leading-none">{icon}</span>
            <span className="font-display font-bold text-xl" style={{ color }}>{signRaw}</span>
          </div>
          {deg && (
            <p className="text-[11px] font-sans mt-0.5" style={{ color: `${color}70` }}>
              {deg}{house ? ` · ${house}` : ''}
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="text-4xl leading-none opacity-60 select-none">{sd.symbol}</span>
        </div>
      </div>

      {/* Element / Modality / Ruler badges */}
      <div className="flex flex-wrap gap-1.5">
        <Badge label={sd.element} emoji={sd.emoji} color={color} />
        <Badge label={sd.modality} color={color} />
        <Badge label={`⚡ ${sd.ruling}`} color={color} />
      </div>

      {/* Insight blurb */}
      {(insight || insightLoading) && (
        <div className="border-t pt-3 mt-1" style={{ borderColor: border }}>
          {insightLoading
            ? <OraclePulse messages={PULSE_MESSAGES.hero} compact />
            : <p className="text-[12px] font-sans leading-relaxed italic"
                 style={{ color: 'rgba(209,213,219,0.7)' }}>
                {insight}
              </p>
          }
        </div>
      )}
    </div>
  )
}

function Badge({ label, emoji, color }) {
  return (
    <span
      className="text-[10px] font-sans px-2 py-0.5 rounded-full"
      style={{ background: `${color}15`, color: `${color}cc`, border: `1px solid ${color}25` }}
    >
      {emoji ? `${emoji} ` : ''}{label}
    </span>
  )
}

export default function ZodiacHeroCards({ chart, insights, insightsLoading }) {
  if (!chart) return null
  const p = chart.planets

  const cards = [
    {
      icon: '☀️',
      label: 'Sol · Tu esencia',
      planet: 'sol',
      signRaw: p?.sol?.sign,
      deg: p?.sol?.deg,
      house: p?.sol?.house,
      insightKey: 'sol',
    },
    {
      icon: '🌙',
      label: 'Luna · Tu mundo interior',
      planet: 'luna',
      signRaw: p?.luna?.sign,
      deg: p?.luna?.deg,
      house: p?.luna?.house,
      insightKey: 'luna',
    },
    {
      icon: '⬆️',
      label: 'Ascendente · Tu imagen',
      planet: 'ascendente',
      signRaw: chart.ascendant?.split(' ')[0],
      deg: null,
      house: null,
      insightKey: 'ascendente',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {cards.map(c => (
        <HeroCard
          key={c.planet}
          icon={c.icon}
          label={c.label}
          planet={c.planet}
          signRaw={c.signRaw}
          deg={c.deg}
          house={c.house}
          insight={insights?.[c.insightKey]}
          insightLoading={insightsLoading && !insights?.[c.insightKey]}
        />
      ))}
    </div>
  )
}
