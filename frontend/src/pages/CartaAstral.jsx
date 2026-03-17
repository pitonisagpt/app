import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserProfile, profileToCartaAstral, cartaAstralToProfile } from '../hooks/useUserProfile'
import StarField from '../components/StarField'
import Navbar from '../components/Navbar'
import OracleMarkdown from '../components/OracleMarkdown'
import ChartWheel from '../components/ChartWheel'
import DistributionCharts from '../components/DistributionCharts'
import ZodiacHeroCards from '../components/ZodiacHeroCards'
import PatternCards from '../components/PatternCards'
import OraclePulse, { PULSE_MESSAGES } from '../components/OraclePulse'
import { useTypewriter } from '../hooks/useTypewriter'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const MONTHS = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

const PLANET_ICONS = {
  sol: '☀️', luna: '🌙', mercurio: '☿', venus: '♀', marte: '♂',
  jupiter: '♃', saturno: '♄', urano: '⛢', neptuno: '♆', pluton: '♇',
}
const PLANET_LABEL = {
  sol: 'Sol', luna: 'Luna', mercurio: 'Mercurio', venus: 'Venus', marte: 'Marte',
  jupiter: 'Júpiter', saturno: 'Saturno', urano: 'Urano', neptuno: 'Neptuno', pluton: 'Plutón',
}
const ELEMENT_COLOR = {
  Fuego: '#f97316', Tierra: '#84cc16', Aire: '#38bdf8', Agua: '#818cf8',
}

const ASPECT_TYPE_COLOR = {
  harmonious: 'text-green-400',
  tense:      'text-red-400',
  neutral:    'text-amber-400',
}

const EXTRA_LABEL = {
  chiron:     { label: 'Quirón',      icon: '⚷' },
  lilith:     { label: 'Lilith',      icon: '⚸' },
  north_node: { label: 'Nodo Norte',  icon: '☊' },
}

const TABS = [
  { id: 'Rueda',    icon: '🔵', label: 'Rueda',    short: 'Mapa visual' },
  { id: 'Planetas', icon: '🪐', label: 'Planetas', short: 'Posiciones' },
  { id: 'Aspectos', icon: '✴️', label: 'Aspectos', short: 'Ángulos' },
  { id: 'Casas',    icon: '🏠', label: 'Casas',    short: '12 áreas' },
  { id: 'Energía',  icon: '⚡', label: 'Energía',  short: 'Elementos' },
  { id: 'Patrones', icon: '🌀', label: 'Patrones', short: 'Figuras' },
]

const TAB_INFO = {
  Rueda: {
    title: 'Rueda Natal',
    desc: 'La representación visual de tu carta. Cada planeta ocupa su posición exacta en el zodíaco al momento de tu nacimiento.',
    hint: 'Los planetas más cerca del borde exterior son tus energías más visibles; los del centro, más internas.',
  },
  Planetas: {
    title: 'Posiciones Planetarias',
    desc: 'Cada planeta rige un área de tu vida: el Sol tu identidad, la Luna tus emociones, Venus el amor, Marte la acción…',
    hint: 'Los planetas retrógrados (℞) expresan su energía hacia adentro, con más reflexión e intensidad interior.',
  },
  Aspectos: {
    title: 'Aspectos entre Planetas',
    desc: 'Los ángulos que forman los planetas entre sí crean tensiones (cuadraturas, oposiciones) o flujos de energía (trígonos, sextiles).',
    hint: 'Un orbe pequeño significa que el aspecto es muy exacto y su influencia más fuerte en tu personalidad.',
  },
  Casas: {
    title: 'Las 12 Casas Astrológicas',
    desc: 'Las casas dividen el cielo en 12 áreas temáticas de tu vida. Los ángulos (ASC, IC, DSC, MC) son los puntos más poderosos.',
    hint: 'La Casa 1 (Ascendente) define tu apariencia y primera impresión; la Casa 10 (MC) tu carrera y legado.',
  },
  Energía: {
    title: 'Distribución de Energía',
    desc: 'Muestra qué elementos (Fuego, Tierra, Aire, Agua) y modalidades (Cardinal, Fijo, Mutable) dominan tu carta natal.',
    hint: 'El elemento dominante revela tu temperamento natural; la modalidad, cómo inicias, sostienes o adaptas energía.',
  },
  Patrones: {
    title: 'Patrones y Figuras',
    desc: 'Configuraciones geométricas formadas por varios planetas simultáneamente. Son los "temas mayores" de tu destino.',
    hint: 'Un Gran Trígono aporta talentos naturales; una T-Cuadrada, tensión creativa que impulsa el crecimiento.',
  },
}

// ── Insight card shown at the bottom of each tab ─────────────────────────────
function InsightCard({ text, loading }) {
  if (!text && !loading) return null
  return (
    <div className="mt-5 relative rounded-xl border border-mystic-gold/20 bg-mystic-surface/50 p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple/5 to-transparent pointer-events-none" />
      <div className="flex items-start gap-3">
        <span className="text-xl select-none mt-0.5" aria-hidden="true">🔮</span>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-[0.25em] text-mystic-gold/60 font-sans mb-2">
            La Pitonisa revela
          </p>
          {loading
            ? <OraclePulse messages={PULSE_MESSAGES.insight} />
            : <p className="text-mystic-muted/80 text-sm font-sans leading-relaxed italic">{text}</p>
          }
        </div>
      </div>
    </div>
  )
}

// ── Per-planet reading card ───────────────────────────────────────────────────
function PlanetReadingCard({ icon, title, subtitle, insightKey, insights, insightsLoading }) {
  const text = insights?.[insightKey]
  const loading = insightsLoading && !text
  if (!text && !loading) return null
  return (
    <div className="rounded-xl border border-mystic-border/40 bg-mystic-surface/40 p-4 flex gap-3">
      <span className="text-2xl mt-0.5 select-none">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-mystic-accent text-sm">{title}</p>
        {subtitle && <p className="text-[10px] text-mystic-muted/50 font-sans uppercase tracking-wider mt-0.5">{subtitle}</p>}
        <div className="mt-2">
          {loading
            ? <OraclePulse messages={PULSE_MESSAGES.planets} />
            : <p className="text-mystic-muted/75 text-sm font-sans leading-relaxed italic">{text}</p>
          }
        </div>
      </div>
    </div>
  )
}

// ── Birth chart summary grid ─────────────────────────────────────────────────
function ChartSummary({ chart, insights, insightsLoading, tab, setTab }) {
  const planets = chart.planets
  const elemColor = ELEMENT_COLOR[chart.dominant_element] || '#e8c97e'

  return (
    <div className="mb-8 animate-fadeInUp">
      {/* Header */}
      <div className="text-center mb-5">
        <p className="font-display text-mystic-gold/80 text-sm tracking-[0.2em] uppercase mb-1">
          Carta Natal de
        </p>
        <h2 className="font-display text-2xl text-mystic-accent font-bold tracking-wide">
          {chart.name}
        </h2>
        <p className="text-mystic-muted/70 text-xs font-sans mt-1 tracking-wider">
          {chart.birth_date} · {chart.birth_time !== 'desconocida' ? chart.birth_time : 'hora no indicada'} · {chart.birth_city}
        </p>
        {!chart.birth_time_known && (
          <p className="text-mystic-muted/50 text-[11px] font-sans mt-1 italic">
            * Ascendente y Casas calculados con mediodía solar (hora desconocida)
          </p>
        )}
      </div>

      {/* Key angles row */}
      <div className="flex justify-center gap-5 mb-5 flex-wrap">
        {[
          { label: 'Ascendente', value: chart.ascendant },
          { label: 'MC',         value: chart.midheaven },
          { label: 'Elemento',   value: chart.dominant_element, color: elemColor },
          { label: 'Modalidad',  value: chart.dominant_modality },
        ].map(({ label, value, color }, i, arr) => (
          <div key={label} className="flex items-center gap-5">
            <div className="text-center">
              <p className="text-[10px] text-mystic-muted/60 uppercase tracking-widest font-sans mb-1">{label}</p>
              <p className="font-display font-semibold" style={{ color: color || '#c9a84c' }}>{value}</p>
            </div>
            {i < arr.length - 1 && <div className="w-px h-8 bg-mystic-border/40" />}
          </div>
        ))}
      </div>

      {/* Sol / Luna / ASC hero cards */}
      <ZodiacHeroCards chart={chart} insights={insights} insightsLoading={insightsLoading} />

      {/* ── Explorer section ───────────────────────────────────────── */}
      <div className="rounded-2xl border border-mystic-border/50 bg-mystic-surface/30 overflow-hidden mt-8">

        {/* Section header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-mystic-border/40 bg-mystic-surface/40">
          <div className="w-1.5 h-1.5 rounded-full bg-mystic-gold/60 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-mystic-gold/70 font-sans font-medium">
            Explorar tu carta
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-mystic-border/40 to-transparent" />
        </div>

        {/* Tab grid — full width, 3 cols mobile / 6 desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-px bg-mystic-border/30">
          {TABS.map(t => {
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`relative flex flex-col items-center gap-1.5 py-4 px-2
                  transition-all duration-200 cursor-pointer group
                  ${active
                    ? 'bg-mystic-purple/30 text-mystic-gold'
                    : 'bg-mystic-surface/60 text-mystic-muted/60 hover:bg-mystic-surface/90 hover:text-mystic-muted'
                  }`}
              >
                {/* Active indicator line */}
                {active && (
                  <span className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-mystic-gold/80 to-transparent" />
                )}
                <span className="text-2xl leading-none">{t.icon}</span>
                <span className={`text-[11px] font-sans font-semibold tracking-wider uppercase
                  ${active ? 'text-mystic-gold' : 'text-mystic-muted/70 group-hover:text-mystic-muted'}`}>
                  {t.label}
                </span>
                <span className={`text-[10px] font-sans leading-none
                  ${active ? 'text-mystic-gold/60' : 'text-mystic-muted/35 group-hover:text-mystic-muted/50'}`}>
                  {t.short}
                </span>
                {/* Click hint on inactive */}
                {!active && (
                  <span className="absolute bottom-1.5 right-2 text-[8px] text-mystic-muted/25 group-hover:text-mystic-gold/40 transition-colors font-sans tracking-wider">
                    TAP
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Active tab description */}
        {TAB_INFO[tab] && (
          <div className="px-4 py-3 border-b border-mystic-border/30 bg-mystic-surface/20 animate-fadeIn">
            <p className="text-mystic-muted/70 text-xs font-sans leading-relaxed">
              {TAB_INFO[tab].desc}
            </p>
            <p className="text-mystic-gold/45 text-[11px] font-sans leading-relaxed mt-1 italic">
              💡 {TAB_INFO[tab].hint}
            </p>
          </div>
        )}

        {/* Tab content */}
        <div className="p-3 pt-4">

      {/* Tab: Rueda */}
      {tab === 'Rueda' && (
        <div className="animate-fadeIn">
          <ChartWheel chart={chart} />
          <InsightCard text={insights?.rueda} loading={insightsLoading && !insights?.rueda} />
        </div>
      )}

      {/* Tab: Planetas */}
      {tab === 'Planetas' && (
        <div className="animate-fadeIn space-y-4">
          {/* Personal planet readings */}
          <PlanetReadingCard icon="☀️" title={`Sol en ${planets.sol?.sign}`} subtitle="Tu identidad y propósito consciente"
            insightKey="sol" insights={insights} insightsLoading={insightsLoading} />
          <PlanetReadingCard icon="🌙" title={`Luna en ${planets.luna?.sign}`} subtitle="Tu mundo emocional e interior"
            insightKey="luna" insights={insights} insightsLoading={insightsLoading} />
          <PlanetReadingCard icon="♀ ♂" title={`Venus en ${planets.venus?.sign} · Marte en ${planets.marte?.sign}`} subtitle="Amor, atracción y pasión"
            insightKey="venus_marte" insights={insights} insightsLoading={insightsLoading} />
          <PlanetReadingCard icon="♃ ♄" title={`Júpiter en ${planets.jupiter?.sign} · Saturno en ${planets.saturno?.sign}`} subtitle="Expansión, límites y karma"
            insightKey="saturno_jupiter" insights={insights} insightsLoading={insightsLoading} />

          {/* Planet grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {Object.entries(planets).map(([key, pl]) => (
              <div
                key={key}
                className="bg-mystic-surface/60 border border-mystic-border/50 rounded-xl p-3 text-center
                           hover:border-mystic-gold/30 transition-colors duration-200"
              >
                <div className="text-lg mb-1" aria-hidden="true">{PLANET_ICONS[key]}</div>
                <p className="text-[10px] text-mystic-muted/60 uppercase tracking-wider font-sans">{PLANET_LABEL[key]}</p>
                <p className="text-mystic-accent text-sm font-display font-semibold mt-0.5">{pl.sign}</p>
                <p className="text-mystic-muted/50 text-[10px] font-sans">{pl.deg}</p>
                {pl.house && <p className="text-mystic-muted/40 text-[10px] font-sans">{pl.house}</p>}
                {pl.retrograde && (
                  <span className="text-[9px] text-amber-400/70 font-sans">℞ retr.</span>
                )}
              </div>
            ))}
          </div>

          {/* Extra points */}
          {chart.extra_points && Object.keys(chart.extra_points).length > 0 && (
            <div>
              <p className="text-[10px] text-mystic-muted/50 uppercase tracking-widest font-sans mb-2">Puntos adicionales</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(chart.extra_points).map(([key, pt]) => {
                  const cfg = EXTRA_LABEL[key]
                  if (!cfg || !pt) return null
                  return (
                    <div key={key}
                      className="bg-mystic-surface/40 border border-mystic-border/40 rounded-xl p-2.5 text-center">
                      <span className="text-base">{cfg.icon}</span>
                      <p className="text-[10px] text-mystic-muted/60 font-sans mt-0.5">{cfg.label}</p>
                      <p className="text-mystic-accent text-xs font-display font-semibold">{pt.sign}</p>
                      <p className="text-mystic-muted/40 text-[10px] font-sans">{pt.deg}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {chart.retrograde_planets.length > 0 && (
            <p className="text-center text-mystic-muted/50 text-[11px] font-sans mt-2 italic">
              Planetas retrógrados: {chart.retrograde_planets.join(', ')}
            </p>
          )}
          <InsightCard text={insights?.planetas} loading={insightsLoading && !insights?.planetas} />
        </div>
      )}

      {/* Tab: Aspectos */}
      {tab === 'Aspectos' && (
        <div className="animate-fadeIn">
          {chart.aspects && chart.aspects.length > 0 ? (
            <div className="bg-mystic-surface/40 border border-mystic-border/40 rounded-xl overflow-hidden">
              <table className="w-full text-xs font-sans">
                <thead>
                  <tr className="border-b border-mystic-border/40">
                    <th className="text-left px-3 py-2 text-mystic-muted/50 uppercase tracking-wider font-normal">Planeta 1</th>
                    <th className="text-center px-3 py-2 text-mystic-muted/50 uppercase tracking-wider font-normal">Aspecto</th>
                    <th className="text-left px-3 py-2 text-mystic-muted/50 uppercase tracking-wider font-normal">Planeta 2</th>
                    <th className="text-right px-3 py-2 text-mystic-muted/50 uppercase tracking-wider font-normal">Orbe</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.aspects.map((asp, i) => {
                    const p1label = PLANET_LABEL[asp.planet1] || asp.planet1
                    const p2label = PLANET_LABEL[asp.planet2] || asp.planet2
                    return (
                      <tr key={i} className="border-b border-mystic-border/20 hover:bg-mystic-surface/40 transition-colors">
                        <td className="px-3 py-2 text-mystic-text">
                          {PLANET_ICONS[asp.planet1] || ''} {p1label}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span className={`font-semibold ${ASPECT_TYPE_COLOR[asp.type] || 'text-mystic-muted'}`}>
                            {asp.symbol} {asp.aspect}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-mystic-text">
                          {PLANET_ICONS[asp.planet2] || ''} {p2label}
                        </td>
                        <td className="px-3 py-2 text-right text-mystic-muted/50">{asp.orb}°</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-mystic-muted/50 text-sm py-8">No se encontraron aspectos mayores.</p>
          )}
          <InsightCard text={insights?.aspectos} loading={insightsLoading && !insights?.aspectos} />
        </div>
      )}

      {/* Tab: Casas */}
      {tab === 'Casas' && (
        <div className="animate-fadeIn">
          {chart.house_cusps && chart.house_cusps.length >= 12 ? (
            <div className="bg-mystic-surface/40 border border-mystic-border/40 rounded-xl overflow-hidden">
              <table className="w-full text-xs font-sans">
                <thead>
                  <tr className="border-b border-mystic-border/40">
                    <th className="text-left px-3 py-2 text-mystic-muted/50 uppercase tracking-wider font-normal">Casa</th>
                    <th className="text-right px-3 py-2 text-mystic-muted/50 uppercase tracking-wider font-normal">Cúspide</th>
                    <th className="text-left px-3 py-2 text-mystic-muted/50 uppercase tracking-wider font-normal">Significado</th>
                  </tr>
                </thead>
                <tbody>
                  {chart.house_cusps.map((lon, i) => {
                    const signIdx = Math.floor((lon % 360) / 30)
                    const signNames = ['Aries','Tauro','Géminis','Cáncer','Leo','Virgo',
                                       'Libra','Escorpio','Sagitario','Capricornio','Acuario','Piscis']
                    const deg = (lon % 30).toFixed(1)
                    const HOUSE_MEANING = [
                      'Personalidad','Recursos','Comunicación','Hogar','Creatividad','Salud',
                      'Relaciones','Transformación','Filosofía','Carrera','Amistades','Inconsciente',
                    ]
                    const isAngle = [0, 3, 6, 9].includes(i)
                    return (
                      <tr key={i} className={`border-b border-mystic-border/20 ${isAngle ? 'bg-mystic-purple/10' : 'hover:bg-mystic-surface/40'} transition-colors`}>
                        <td className={`px-3 py-2 font-semibold ${isAngle ? 'text-mystic-gold' : 'text-mystic-muted/70'}`}>
                          Casa {i + 1}
                          {i === 0 && <span className="ml-1 text-[9px] text-mystic-gold/60">ASC</span>}
                          {i === 3 && <span className="ml-1 text-[9px] text-mystic-gold/60">IC</span>}
                          {i === 6 && <span className="ml-1 text-[9px] text-mystic-gold/60">DSC</span>}
                          {i === 9 && <span className="ml-1 text-[9px] text-mystic-gold/60">MC</span>}
                        </td>
                        <td className="px-3 py-2 text-right text-mystic-accent font-display">
                          {deg}° {signNames[signIdx]}
                        </td>
                        <td className="px-3 py-2 text-mystic-muted/50">{HOUSE_MEANING[i]}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-mystic-muted/50 text-sm py-8">Casas no disponibles.</p>
          )}
          <InsightCard text={insights?.casas} loading={insightsLoading && !insights?.casas} />
        </div>
      )}

      {/* Tab: Energía */}
      {tab === 'Energía' && (
        <div className="animate-fadeIn">
          <DistributionCharts chart={chart} />
          <InsightCard text={insights?.energia} loading={insightsLoading && !insights?.energia} />
        </div>
      )}

      {/* Tab: Patrones */}
      {tab === 'Patrones' && (
        <div className="animate-fadeIn">
          <PatternCards chart={chart} />
          <InsightCard text={insights?.patrones} loading={insightsLoading && !insights?.patrones} />
        </div>
      )}

        </div>{/* /Tab content */}
      </div>{/* /Explorer section */}
    </div>
  )
}

// ── Oracle loading indicator (reused from OracleResponse pattern) ────────────
const ORACLE_PHASES = [
  { icon: '⭐', text: 'Consultando los astros en el momento de tu nacimiento...' },
  { icon: '🌙', text: 'Los planetas revelan su posición exacta...' },
  { icon: '🔮', text: 'La Pitonisa interpreta tu carta natal...' },
  { icon: '✨', text: 'Las estrellas descifran tu destino...' },
]

function LoadingOracle({ phase }) {
  return (
    <div className="flex flex-col items-center gap-5 py-14">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-mystic-gold/25 blur-2xl scale-150 animate-glow" />
        <span className="text-5xl animate-float-slow relative select-none block" aria-hidden="true">
          {phase.icon}
        </span>
      </div>
      <p className="text-mystic-muted/80 text-sm tracking-[0.2em] uppercase font-sans text-center animate-fadeIn">
        {phase.text}
      </p>
      <div className="flex gap-2">
        {[0,1,2,3].map(i => (
          <div key={i} className="w-1 h-1 rounded-full bg-mystic-gold/40 animate-pulse-slow"
               style={{ animationDelay: `${i*0.25}s` }} />
        ))}
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function CartaAstral() {
  const currentYear = new Date().getFullYear()
  const { profile, updateProfile } = useUserProfile()

  const [form, setForm] = useState(() => ({
    name: '', day: '', month: '', year: '', hour: '', minute: '', city: '',
    birthTimeKnown: true,
    ...profileToCartaAstral(profile),
  }))
  const [error, setError]             = useState('')
  const [loading, setLoading]         = useState(false)
  const [chart, setChart]             = useState(null)
  const [readingText, setReading]     = useState('')
  const [streaming, setStreaming]     = useState(false)
  const [phaseIdx, setPhaseIdx]       = useState(0)
  const [insights, setInsights]       = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [chartTab, setChartTab]       = useState('Rueda')

  const displayedText = useTypewriter(readingText, streaming)

  function setField(key, val) {
    setForm(f => {
      const next = { ...f, [key]: val }
      updateProfile(cartaAstralToProfile(next))
      return next
    })
    setError('')
  }

  function validate() {
    if (!form.name.trim())               return 'Por favor ingresa tu nombre.'
    if (!form.day)                       return 'Por favor selecciona el día de nacimiento.'
    if (!form.month)                     return 'Por favor selecciona el mes de nacimiento.'
    if (!form.year)                      return 'Por favor ingresa el año de nacimiento.'
    if (!form.city.trim())               return 'Por favor ingresa tu ciudad de nacimiento.'
    if (form.birthTimeKnown && form.hour === '') return 'Por favor selecciona la hora de nacimiento (o desmarca "Conozco mi hora exacta").'
    if (form.birthTimeKnown && form.minute === '') return 'Por favor selecciona los minutos (o desmarca "Conozco mi hora exacta").'
    return null
  }

  // Which fields have a validation issue (for red-border feedback after first submit attempt)
  const [submitted, setSubmitted] = useState(false)
  function fieldErr(key) {
    if (!submitted) return false
    if (key === 'name')   return !form.name.trim()
    if (key === 'day')    return !form.day
    if (key === 'month')  return !form.month
    if (key === 'year')   return !form.year
    if (key === 'city')   return !form.city.trim()
    if (key === 'hour')   return form.birthTimeKnown && form.hour === ''
    if (key === 'minute') return form.birthTimeKnown && form.minute === ''
    return false
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    const err = validate()
    if (err) { setError(err); return }

    setError('')
    setChart(null)
    setReading('')
    setInsights(null)
    setInsightsLoading(false)
    setLoading(true)
    setStreaming(false)
    setPhaseIdx(0)

    // Cycle loading phases
    const phaseTimer = setInterval(() => {
      setPhaseIdx(p => (p + 1) % ORACLE_PHASES.length)
    }, 2200)

    try {
      const payload = {
        name:  form.name.trim(),
        day:   parseInt(form.day),
        month: parseInt(form.month),
        year:  parseInt(form.year),
        city:  form.city.trim(),
        birth_time_known: form.birthTimeKnown,
        ...(form.birthTimeKnown && {
          hour:   form.hour !== '' ? parseInt(form.hour) : 12,
          minute: form.minute !== '' ? parseInt(form.minute) : 0,
        }),
      }

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30_000)

      let response
      try {
        response = await fetch(`${API_BASE}/api/carta-astral`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      } finally {
        clearTimeout(timeout)
      }

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        throw new Error(body.detail || 'Error al calcular la carta astral.')
      }

      clearInterval(phaseTimer)
      setLoading(false)
      setStreaming(true)

      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\n\n')
        buffer = parts.pop()

        for (const part of parts) {
          for (const line of part.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6)
            if (raw === '[DONE]') { setStreaming(false); return }
            try {
              const parsed = JSON.parse(raw)
              if (parsed?.__chart__) {
                setChart(parsed.__chart__)
                setInsightsLoading(true)
              } else if (parsed?.__insights__) {
                setInsights(parsed.__insights__)
                setInsightsLoading(false)
              } else if (parsed?.__error__) {
                throw new Error(parsed.__error__)
              } else if (typeof parsed === 'string') {
                setReading(prev => prev + parsed)
              }
            } catch (parseErr) {
              if (parseErr.message && !parseErr.message.includes('JSON')) throw parseErr
            }
          }
        }
      }
    } catch (err) {
      clearInterval(phaseTimer)
      if (err.name === 'AbortError') {
        setError('La consulta tardó demasiado. Por favor verifica tu conexión e intenta de nuevo.')
      } else {
        setError(err.message || 'Error inesperado. Por favor intenta de nuevo.')
      }
    } finally {
      clearInterval(phaseTimer)
      setLoading(false)
      setStreaming(false)
    }
  }

  function handleReset() {
    setChart(null)
    setReading('')
    setError('')
    setStreaming(false)
    setLoading(false)
    setInsights(null)
    setInsightsLoading(false)
  }

  const showResult = chart || loading || streaming || displayedText

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <StarField count={100} />
      <div className="absolute top-20 left-1/4 w-80 h-80 bg-mystic-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-mystic-gold/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative" role="img" aria-label="Carta astral">⭐</div>
          </div>
          <h1
            className="text-3xl md:text-4xl font-display font-bold tracking-widest uppercase mb-2"
            style={{
              background: 'linear-gradient(90deg, #c9a84c, #e8c97e, #c9a84c)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'shimmer 4s linear infinite',
            }}
          >
            Carta Astral
          </h1>
          <p className="text-mystic-muted/70 text-sm tracking-wide font-sans max-w-md mx-auto">
            Descubre los secretos que las estrellas guardaron para ti en el instante en que llegaste a este mundo.
          </p>
          <div className="flex justify-center items-center gap-3 mt-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-mystic-gold/40" />
            <span className="text-mystic-gold/60 text-xs" aria-hidden="true">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-mystic-gold/40" />
          </div>
        </div>

        {!showResult ? (
          /* ── Birth data form ─────────────────────────────────────── */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-mystic-muted/70 text-xs uppercase tracking-widest font-sans mb-1.5">
                Tu nombre
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="Nombre o apodo..."
                maxLength={80}
                className={`w-full bg-mystic-card rounded-xl px-4 py-3
                           text-mystic-text placeholder-mystic-muted/40 font-sans text-sm
                           focus:outline-none focus:ring-2 transition-all duration-200
                           border ${fieldErr('name') ? 'border-red-500/70 focus:border-red-400/80 focus:ring-red-500/10' : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'}`}
                style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
              />
            </div>

            {/* Birth date */}
            <div>
              <label className="block text-mystic-muted/70 text-xs uppercase tracking-widest font-sans mb-1.5">
                Fecha de nacimiento
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <select
                    value={form.day}
                    onChange={e => setField('day', e.target.value)}
                    className={`w-full rounded-xl px-3 py-3 text-mystic-text font-sans text-sm
                               focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                               border ${fieldErr('day') ? 'border-red-500/70 focus:border-red-400/80 focus:ring-red-500/10' : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'}`}
                    style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
                  >
                    <option value="">Día</option>
                    {Array.from({length: 31}, (_, i) => i+1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={form.month}
                    onChange={e => setField('month', e.target.value)}
                    className={`w-full rounded-xl px-3 py-3 text-mystic-text font-sans text-sm
                               focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                               border ${fieldErr('month') ? 'border-red-500/70 focus:border-red-400/80 focus:ring-red-500/10' : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'}`}
                    style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
                  >
                    <option value="">Mes</option>
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i+1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={form.year}
                    onChange={e => setField('year', e.target.value)}
                    placeholder="Año"
                    min={1900}
                    max={currentYear}
                    className={`w-full rounded-xl px-3 py-3 text-mystic-text placeholder-mystic-muted/40 font-sans text-sm
                               focus:outline-none focus:ring-2 transition-all duration-200
                               border ${fieldErr('year') ? 'border-red-500/70 focus:border-red-400/80 focus:ring-red-500/10' : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'}`}
                    style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
                  />
                </div>
              </div>
            </div>

            {/* Birth time toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => setField('birthTimeKnown', !form.birthTimeKnown)}
                  className={`w-10 h-5 rounded-full border transition-all duration-200 flex items-center px-0.5 cursor-pointer ${
                    form.birthTimeKnown
                      ? 'bg-mystic-gold/30 border-mystic-gold/60'
                      : 'bg-mystic-border/40 border-mystic-border'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    form.birthTimeKnown ? 'bg-mystic-gold translate-x-5' : 'bg-mystic-muted/60 translate-x-0'
                  }`} />
                </div>
                <span className="text-mystic-muted/70 text-xs uppercase tracking-widest font-sans select-none">
                  Conozco mi hora exacta de nacimiento
                </span>
              </label>
            </div>

            {/* Birth time inputs */}
            {form.birthTimeKnown && (
              <div className="animate-fadeIn">
                <label className="block text-mystic-muted/70 text-xs uppercase tracking-widest font-sans mb-1.5">
                  Hora de nacimiento
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-xs">
                  <div>
                    <select
                      value={form.hour}
                      onChange={e => setField('hour', e.target.value)}
                      className={`w-full rounded-xl px-3 py-3 text-mystic-text font-sans text-sm
                                 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                                 border ${fieldErr('hour') ? 'border-red-500/70 focus:border-red-400/80 focus:ring-red-500/10' : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'}`}
                      style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
                    >
                      <option value="">Hora</option>
                      {Array.from({length: 24}, (_, i) => i).map(h => (
                        <option key={h} value={h}>{String(h).padStart(2,'0')}:00</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <select
                      value={form.minute}
                      onChange={e => setField('minute', e.target.value)}
                      className={`w-full rounded-xl px-3 py-3 text-mystic-text font-sans text-sm
                                 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer
                                 border ${fieldErr('minute') ? 'border-red-500/70 focus:border-red-400/80 focus:ring-red-500/10' : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'}`}
                      style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
                    >
                      <option value="">Min</option>
                      {[0,5,10,15,20,25,30,35,40,45,50,55].map(m => (
                        <option key={m} value={m}>{String(m).padStart(2,'0')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* City */}
            <div>
              <label className="block text-mystic-muted/70 text-xs uppercase tracking-widest font-sans mb-1.5">
                Ciudad de nacimiento
              </label>
              <input
                type="text"
                value={form.city}
                onChange={e => setField('city', e.target.value)}
                placeholder="ej: Bogotá, Madrid, Ciudad de México..."
                maxLength={100}
                className={`w-full bg-mystic-card rounded-xl px-4 py-3
                           text-mystic-text placeholder-mystic-muted/40 font-sans text-sm
                           focus:outline-none focus:ring-2 transition-all duration-200
                           border ${fieldErr('city') ? 'border-red-500/70 focus:border-red-400/80 focus:ring-red-500/10' : 'border-mystic-border/80 focus:border-mystic-gold/60 focus:ring-mystic-gold/15'}`}
                style={{ background: 'linear-gradient(135deg, #101026, #14143a)' }}
              />
              <p className="text-mystic-muted/40 text-[11px] font-sans mt-1">
                Se usa para calcular latitud, longitud y zona horaria exactas.
              </p>
            </div>

            {error && (
              <p role="alert" className="text-center text-xs font-sans animate-fadeIn" style={{ color: '#fca5a5' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-display font-semibold tracking-[0.18em] uppercase text-sm
                         bg-gradient-to-r from-mystic-purple to-mystic-violet
                         hover:from-purple-700 hover:to-violet-700
                         text-mystic-text border border-mystic-border/60
                         transition-all duration-300 hover:shadow-2xl hover:shadow-mystic-purple/40
                         hover:-translate-y-0.5 cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
            >
              Calcular mi Carta Astral
            </button>
          </form>
        ) : (
          /* ── Results ───────────────────────────────────────────────── */
          <div>
            {loading && !chart && (
              <LoadingOracle phase={ORACLE_PHASES[phaseIdx]} />
            )}

            {chart && <ChartSummary chart={chart} insights={insights} insightsLoading={insightsLoading} tab={chartTab} setTab={setChartTab} />}

            {chartTab === 'Rueda' && (displayedText || (streaming && chart)) && (
              <div className="w-full">
                {/* Header bar */}
                <div className="flex items-center gap-3 mb-2 px-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-gold/35" />
                  <span className="text-mystic-gold/70 text-[11px] tracking-[0.35em] uppercase font-display whitespace-nowrap">
                    La Interpretación Astral
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-gold/35" />
                </div>

                <div
                  className="relative bg-mystic-surface/90 backdrop-blur-sm rounded-2xl p-7 border transition-all duration-700"
                  style={{
                    borderColor: streaming ? 'rgba(201,168,76,0.40)' : 'rgba(201,168,76,0.18)',
                    boxShadow: streaming
                      ? '0 0 60px rgba(201,168,76,0.10), 0 25px 50px rgba(0,0,0,0.4)'
                      : '0 25px 50px rgba(0,0,0,0.35)',
                  }}
                >
                  {['top-3 left-3','top-3 right-3','bottom-3 left-3','bottom-3 right-3'].map(pos => (
                    <span key={pos} className={`absolute ${pos} text-mystic-gold/20 text-xs leading-none select-none`} aria-hidden="true">✦</span>
                  ))}
                  {displayedText
                    ? <OracleMarkdown text={displayedText} isStreaming={streaming} />
                    : <LoadingOracle phase={ORACLE_PHASES[phaseIdx]} />
                  }
                </div>

                <div className="flex items-center gap-3 mt-2 px-2">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-border/40" />
                  <span className="text-mystic-border/50 text-[10px] tracking-widest select-none" aria-hidden="true">✦ ✦ ✦</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-border/40" />
                </div>
              </div>
            )}

            {/* Tema de Vida — shown after streaming completes, only on Rueda tab */}
            {chartTab === 'Rueda' && !streaming && displayedText && insights?.tema_vida && (
              <div className="mt-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-3 px-1">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-gold/30" />
                  <span className="text-mystic-gold/60 text-[11px] tracking-[0.3em] uppercase font-display whitespace-nowrap">Tu Tema de Vida</span>
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-gold/30" />
                </div>
                <div className="relative rounded-2xl p-6 overflow-hidden"
                     style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.18) 0%, #0f0f1e 70%)', border: '1px solid rgba(201,168,76,0.25)' }}>
                  <div className="absolute top-3 left-3 text-mystic-gold/15 text-sm select-none">✦</div>
                  <div className="absolute top-3 right-3 text-mystic-gold/15 text-sm select-none">✦</div>
                  <p className="text-center text-3xl mb-3 select-none">🌟</p>
                  <p className="text-mystic-muted/85 text-sm font-sans leading-relaxed italic text-center max-w-xl mx-auto">
                    {insights.tema_vida}
                  </p>
                </div>
              </div>
            )}

            {chartTab === 'Rueda' && !streaming && displayedText && (
              <div className="mt-10 flex justify-center gap-4 animate-fadeIn">
                <button
                  onClick={handleReset}
                  className="group relative overflow-hidden py-3.5 px-10 rounded-xl
                             font-display font-semibold tracking-[0.18em] uppercase text-sm
                             border border-mystic-gold/40 text-mystic-gold/90
                             hover:border-mystic-gold hover:text-mystic-gold
                             transition-all duration-300 hover:shadow-xl hover:shadow-mystic-gold/15
                             cursor-pointer focus:outline-none focus:ring-2 focus:ring-mystic-gold/40"
                >
                  Nueva Carta
                </button>
                <Link
                  to="/"
                  className="py-3.5 px-10 rounded-xl font-display font-semibold tracking-[0.18em] uppercase text-sm
                             border border-mystic-border/60 text-mystic-muted/70
                             hover:border-mystic-border hover:text-mystic-muted
                             transition-all duration-300 cursor-pointer text-center"
                >
                  Ver Tiradas
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
