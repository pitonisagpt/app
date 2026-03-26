import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import { useUserProfile } from '../hooks/useUserProfile'
import StarField from '../components/ui/StarField'
import ModuleResult from '../components/oracle/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'
import SeoHead from '../components/ui/SeoHead'
import SynastryWheel from '../components/astrology/SynastryWheel'
import Waveform from '../components/oracle/Waveform'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

// ── Shared helpers ────────────────────────────────────────────────────────────

function renderMarkdown(text) {
  return text
    .replace(/^#{1,3}\s+(.+)$/gm, '<span class="font-semibold text-mystic-accent/90">$1</span>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-mystic-accent font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em class="text-mystic-accent/80">$1</em>')
}

// ── Score meter ───────────────────────────────────────────────────────────────

function ScoreMeter({ score }) {
  const color = score >= 70 ? '#86efac' : score >= 45 ? '#e8c97e' : '#fca5a5'
  const label = score >= 75 ? 'Alta afinidad' : score >= 50 ? 'Conexión real' : score >= 35 ? 'Con desafíos' : 'Energía compleja'
  return (
    <div className="text-center animate-fadeIn">
      <div className="relative inline-block mb-2">
        <svg width="160" height="90" viewBox="0 0 180 100">
          <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 15 90 A 75 75 0 0 1 165 90" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 235} 235`}
                style={{ filter: `drop-shadow(0 0 8px ${color}80)` }} />
          <text x="90" y="75" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color} fontFamily="serif">{score}%</text>
        </svg>
      </div>
      <p className="text-xs tracking-widest uppercase font-sans" style={{ color }}>{label}</p>
    </div>
  )
}

// ── InsightCard (tab-level AI summary) ───────────────────────────────────────

function InsightCard({ text, loading, label = 'La Pitonisa revela' }) {
  if (!text && !loading) return null
  return (
    <div className="mt-5 relative rounded-xl border border-mystic-gold/20 bg-mystic-surface/50 p-4 overflow-hidden animate-fadeIn">
      <div className="absolute inset-0 bg-gradient-to-br from-mystic-purple/5 to-transparent pointer-events-none" />
      <div className="flex items-start gap-3">
        <span className="text-xl select-none mt-0.5">🔮</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-mystic-gold/60 font-sans mb-2">{label}</p>
          {loading
            ? <div className="space-y-1.5">
                {[72, 90, 55].map(w => (
                  <div key={w} className="h-2.5 rounded-full bg-mystic-border/20 animate-pulse" style={{ width: `${w}%` }} />
                ))}
              </div>
            : <p className="text-mystic-muted/80 text-sm font-sans leading-relaxed italic">{text}</p>
          }
        </div>
      </div>
    </div>
  )
}

// ── Aspect descriptions (synastry context) ───────────────────────────────────

const ASPECT_SYNASTRY_INFO = {
  'Conjunción':  { badge: 'Fusión',      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',   desc: 'Sus planetas se fusionan en un punto del cielo. La energía del planeta de {B} se mezcla directamente con la de {A} — puede crear una conexión magnética o intensificar lo que ya existe entre los dos.' },
  'Trígono':     { badge: 'Flujo',       color: 'bg-green-500/15 text-green-300 border-green-500/30',    desc: 'Armonía natural entre estos dos planetas. Lo que {B} expresa fluye sin fricción hacia {A} — es uno de los lazos más fáciles y nutritivos que pueden tener.' },
  'Sextil':      { badge: 'Puerta',      color: 'bg-sky-500/15 text-sky-300 border-sky-500/30',          desc: 'Oportunidad latente. Se llevan bien con un poco de esfuerzo consciente — este vínculo mejora con el tiempo y la intención mutua.' },
  'Cuadratura':  { badge: 'Tensión',     color: 'bg-red-500/15 text-red-300 border-red-500/30',          desc: 'Fricción activa entre estas energías. {B} activa algo en {A} que puede ser estimulante o irritante — pero esta tensión suele ser lo que hace la relación apasionada e intensa.' },
  'Oposición':   { badge: 'Polaridad',   color: 'bg-orange-500/15 text-orange-300 border-orange-500/30', desc: 'Energías opuestas que se atraen como imanes. {A} y {B} se completan en este punto — cada uno tiene lo que al otro le falta, lo que crea tanto atracción como desafío.' },
  'Quincuncio':  { badge: 'Ajuste',      color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', desc: 'Estos dos planetas no hablan el mismo idioma. Requiere adaptación constante de ambos — como si siempre hubiera algo que calibrar para que encajen.' },
}

const ASPECT_TYPE_COLOR = { harmonious: 'text-green-400', tense: 'text-red-400', neutral: 'text-amber-400' }

const PLANET_GLYPH = {
  Sol: '☉', Luna: '☽', Mercurio: '☿', Venus: '♀', Marte: '♂',
  'Júpiter': '♃', Saturno: '♄', Urano: '⛢', Neptuno: '♆', 'Plutón': '♇',
  'Quirón': '⚷', 'Nodo Norte': '☊',
}

// ── Aspects tab ───────────────────────────────────────────────────────────────

function AspectosTab({ aspects, nameA, nameB, insights, insightsLoading }) {
  const [openIdx, setOpenIdx] = useState(null)
  const [filter, setFilter]   = useState('all')

  if (!aspects || aspects.length === 0) return (
    <p className="text-mystic-muted/40 text-sm text-center py-8">Sin aspectos calculados.</p>
  )

  const counts = { harmonious: 0, tense: 0, neutral: 0 }
  aspects.forEach(a => { if (counts[a.tipo] !== undefined) counts[a.tipo]++ })

  const filtered = filter === 'all' ? aspects : aspects.filter(a => a.tipo === filter)

  return (
    <div className="animate-fadeIn space-y-3">

      {/* Info header */}
      <p className="text-mystic-muted/45 text-xs font-sans leading-snug px-1">
        Los aspectos inter-carta muestran cómo los planetas de <span className="text-blue-300/70">{nameA}</span> y <span className="text-pink-300/70">{nameB}</span> interactúan entre sí — dónde fluye la relación y dónde genera tensión.
      </p>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all',        label: `Todos (${aspects.length})` },
          { key: 'harmonious', label: `Armónicos (${counts.harmonious})` },
          { key: 'tense',      label: `Tensión (${counts.tense})` },
          { key: 'neutral',    label: `Neutros (${counts.neutral})` },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`text-[10px] font-sans uppercase tracking-widest px-3 py-1 rounded-full border transition-all
              ${filter === f.key
                ? 'border-mystic-gold/50 bg-mystic-gold/10 text-mystic-gold'
                : 'border-mystic-border/40 text-mystic-muted/50 hover:border-mystic-border/70'
              }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Accordion list */}
      <div className="space-y-1.5">
        {filtered.map((asp, i) => {
          const info   = ASPECT_SYNASTRY_INFO[asp.aspecto] || {}
          const isOpen = openIdx === i
          const gA     = PLANET_GLYPH[asp.planeta_a] || ''
          const gB     = PLANET_GLYPH[asp.planeta_b] || ''
          const desc   = info.desc
            ? info.desc.replace(/\{A\}/g, nameA).replace(/\{B\}/g, nameB)
            : null
          return (
            <div key={i}
              className={`rounded-xl border transition-colors duration-200 overflow-hidden
                ${isOpen ? 'border-mystic-gold/30 bg-mystic-surface/70' : 'border-mystic-border/40 bg-mystic-surface/40 hover:border-mystic-border/60'}`}>
              <button onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center gap-2 px-3 py-2.5 text-left">
                {/* Planet A */}
                <span className="text-xs font-sans flex-1 flex items-center gap-1 min-w-0">
                  <span className="shrink-0 opacity-70">{gA}</span>
                  <span className="truncate text-mystic-accent/80 font-medium">{asp.planeta_a}</span>
                  <span className="text-[9px] text-blue-300/50 shrink-0">({nameA})</span>
                </span>
                {/* Aspect */}
                <span className="flex flex-col items-center shrink-0 gap-0.5 min-w-[76px]">
                  <span className={`font-semibold text-xs ${ASPECT_TYPE_COLOR[asp.tipo] || 'text-mystic-muted'}`}>
                    {asp.symbol} {asp.aspecto}
                  </span>
                  {info.badge && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-sans uppercase tracking-wider ${info.color}`}>
                      {info.badge}
                    </span>
                  )}
                </span>
                {/* Planet B */}
                <span className="text-xs font-sans flex-1 flex items-center justify-end gap-1 min-w-0">
                  <span className="text-[9px] text-pink-300/50 shrink-0">({nameB})</span>
                  <span className="truncate text-right text-mystic-accent/80 font-medium">{asp.planeta_b}</span>
                  <span className="shrink-0 opacity-70">{gB}</span>
                  <span className="text-mystic-muted/40 shrink-0 w-8 text-right">{asp.orb}°</span>
                </span>
                <span className={`text-mystic-muted/40 shrink-0 transition-transform duration-200 text-[10px] ${isOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isOpen && desc && (
                <div className="px-4 pb-3 pt-0">
                  <p className="text-mystic-muted/70 text-xs font-sans leading-relaxed italic border-t border-mystic-border/30 pt-2.5">
                    <span className="font-semibold text-mystic-accent not-italic">
                      {gA} {asp.planeta_a} {asp.symbol} {asp.planeta_b} {gB}:
                    </span>{' '}
                    {desc}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <InsightCard
        text={insights?.aspectos}
        loading={insightsLoading && !insights?.aspectos}
        label="La Pitonisa sobre los aspectos de esta sinastría"
      />
    </div>
  )
}

// ── Overlay oracle (on-demand LLM, like HouseOracle) ─────────────────────────

function OverlayOracle({ overlay, nombreA, nombreB }) {
  const [text, setText]           = useState('')
  const [streaming, setStreaming] = useState(false)
  const [error, setError]         = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function run() {
      setStreaming(true)
      setText('')
      setError(null)
      try {
        const res = await fetch(`${API_BASE}/api/compatibilidad/overlay-reading`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            nombre_a:   nombreA,
            nombre_b:   nombreB,
            planet:     overlay.planet,
            planet_key: overlay.key,
            sign:       overlay.sign,
            house:      overlay.house,
            meaning:    overlay.meaning,
          }),
        })
        if (!res.ok) throw new Error('Sin respuesta del oráculo.')
        const reader  = res.body.getReader()
        const decoder = new TextDecoder()
        let buf = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done || controller.signal.aborted) break
          buf += decoder.decode(value, { stream: true })
          const parts = buf.split('\n\n')
          buf = parts.pop()
          for (const part of parts) {
            for (const line of part.split('\n')) {
              if (!line.startsWith('data: ')) continue
              const raw = line.slice(6)
              if (raw === '[DONE]') break
              try {
                const parsed = JSON.parse(raw)
                if (parsed?.__error__) throw new Error(parsed.__error__)
                if (typeof parsed === 'string') setText(p => p + parsed)
              } catch (e) {
                if (e.message && !e.message.includes('JSON')) throw e
              }
            }
          }
        }
      } catch (e) {
        if (e.name === 'AbortError') return
        setError('Los astros tardaron demasiado… inténtalo de nuevo.')
      } finally {
        if (!controller.signal.aborted) setStreaming(false)
      }
    }

    run()
    return () => controller.abort()
  }, []) // eslint-disable-line

  if (error) return <p className="text-red-400/70 text-xs italic">{error}</p>

  return (
    <div>
      {streaming && !text && <Waveform label="La Pitonisa consulta la sinastría…" className="py-1" />}
      {text && (
        <div className="text-mystic-muted/80 text-xs font-sans leading-relaxed space-y-2">
          {text.split('\n\n').map((para, pi) => (
            <p key={pi} dangerouslySetInnerHTML={{ __html: renderMarkdown(para) }} />
          ))}
          {streaming && <span className="inline-block w-0.5 h-3.5 bg-mystic-gold/70 animate-pulse ml-0.5 translate-y-0.5" />}
        </div>
      )}
    </div>
  )
}

// ── Casas tab ─────────────────────────────────────────────────────────────────

const HOUSE_ICON   = ['🏠','💰','💬','🏡','🎨','⚕️','💑','🔮','🌍','🏆','👥','🌙']
const HOUSE_LABEL  = ['Casa 1','Casa 2','Casa 3','Casa 4','Casa 5','Casa 6','Casa 7','Casa 8','Casa 9','Casa 10','Casa 11','Casa 12']
const HOUSE_ANGLES = { 1: 'ASC', 4: 'IC', 7: 'DSC', 10: 'MC' }

const OVERLAY_HIGHLIGHTS = {
  venus:   { 7: 'Atracción y amor', 5: 'Romance y placer', 8: 'Conexión erótica', 1: 'Primera impresión poderosa' },
  marte:   { 7: 'Tensión sexual', 1: 'Energía que te activa', 8: 'Pasión intensa', 5: 'Juego y seducción' },
  sol:     { 7: 'Admiración mutua', 1: 'Presencia que inspira', 10: 'Apoyo en tu carrera', 5: 'Brillo y alegría' },
  luna:    { 4: 'Hogar compartido', 7: 'Cuidado emocional', 12: 'Vínculo inconsciente', 1: 'Comodidad inmediata' },
  jupiter: { 9: 'Crecimiento conjunto', 2: 'Abundancia compartida', 5: 'Alegría y expansión', 7: 'Suerte en la relación' },
  saturno: { 7: 'Compromiso serio', 10: 'Estructura y apoyo', 4: 'Responsabilidad familiar', 1: 'Madurez y constancia' },
  mercurio:{ 3: 'Comunicación fluida', 9: 'Expansión intelectual', 7: 'Diálogo en la pareja' },
}

function CasasTab({ overlays, nameA, nameB, insights, insightsLoading }) {
  const [openKey, setOpenKey] = useState(null)

  if (!overlays || overlays.length === 0) return (
    <p className="text-mystic-muted/40 text-sm text-center py-8">Sin datos de casas disponibles.</p>
  )

  // Group by house
  const byHouse = {}
  overlays.forEach(o => {
    if (!byHouse[o.house]) byHouse[o.house] = []
    byHouse[o.house].push(o)
  })

  // Show only houses that have planets (sorted)
  const houses = Object.entries(byHouse).sort((a, b) => +a[0] - +b[0])

  return (
    <div className="animate-fadeIn space-y-3">
      <p className="text-mystic-muted/45 text-xs font-sans leading-snug px-1">
        Planetas de <span className="text-pink-300/70">{nameB}</span> en las casas de <span className="text-blue-300/70">{nameA}</span> — áreas de la vida de {nameA} que {nameB} activa, toca o transforma.
      </p>

      <div className="space-y-1.5">
        {houses.map(([houseNum, planets]) => {
          const h        = +houseNum
          const isAngle  = [1, 4, 7, 10].includes(h)
          const uniqueKey = `house-${h}`
          const isOpen   = openKey === uniqueKey

          return (
            <div key={h}
              className={`rounded-xl border transition-colors duration-200 overflow-hidden
                ${isOpen
                  ? 'border-mystic-gold/40 bg-mystic-surface/70'
                  : isAngle
                    ? 'border-mystic-gold/20 bg-mystic-purple/8 hover:border-mystic-gold/30'
                    : 'border-mystic-border/40 bg-mystic-surface/40 hover:border-mystic-border/60'
                }`}>

              <button onClick={() => setOpenKey(isOpen ? null : uniqueKey)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left">
                {/* House badge */}
                <div className="flex-shrink-0 flex flex-col items-center w-10">
                  <span className="text-[8px] font-sans uppercase tracking-wider text-mystic-muted/40">Casa</span>
                  <span className={`font-display font-bold text-sm ${isAngle ? 'text-mystic-gold' : 'text-mystic-accent/80'}`}>{h}</span>
                  {HOUSE_ANGLES[h] && <span className="text-[8px] text-mystic-gold/50">{HOUSE_ANGLES[h]}</span>}
                </div>

                {/* Planets pills */}
                <div className="flex-1 flex flex-wrap gap-1.5 min-w-0">
                  {planets.map(o => {
                    const highlight = OVERLAY_HIGHLIGHTS[o.key]?.[h]
                    return (
                      <span key={o.key}
                        className="inline-flex items-center gap-1 text-[10px] font-sans
                                   border border-pink-500/25 bg-pink-900/12 text-pink-300/80
                                   px-2 py-0.5 rounded-full">
                        {PLANET_GLYPH[o.planet] || ''} {o.planet}
                        {highlight && <span className="text-[9px] text-pink-400/55 hidden sm:inline"> · {highlight}</span>}
                      </span>
                    )
                  })}
                </div>

                {/* Area */}
                <span className="text-mystic-muted/50 text-[10px] font-sans shrink-0 hidden sm:block max-w-[120px] text-right truncate">
                  {HOUSE_ICON[h - 1]} {planets[0]?.meaning}
                </span>

                <span className={`text-mystic-muted/40 shrink-0 transition-transform duration-200 text-[10px] ${isOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-mystic-border/30 pt-3 space-y-4">
                    {planets.map(o => (
                      <div key={o.key}>
                        <p className="text-[10px] uppercase tracking-widest text-mystic-gold/50 font-sans mb-2 flex items-center gap-1.5">
                          <span>🔮</span>
                          {PLANET_GLYPH[o.planet] || ''} {o.planet} de {nameB} en tu Casa {h} · {o.meaning}
                        </p>
                        <OverlayOracle overlay={o} nombreA={nameA} nombreB={nameB} key={`${o.key}-${h}`} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <InsightCard
        text={insights?.casas}
        loading={insightsLoading && !insights?.casas}
        label="La Pitonisa sobre los planetas en tus casas"
      />
    </div>
  )
}

// ── Rueda tab ─────────────────────────────────────────────────────────────────

function RuedaTab({ synastry, insights, insightsLoading, nameA, nameB, text, isStreaming, error, onReset }) {
  return (
    <div className="animate-fadeIn space-y-4">
      {synastry ? (
        <SynastryWheel chartA={synastry.chart_a} chartB={synastry.chart_b} aspects={synastry.aspects} />
      ) : (
        <div className="flex items-center justify-center h-64">
          <div className="text-mystic-muted/40 text-sm animate-pulse">Calculando rueda…</div>
        </div>
      )}
      <InsightCard
        text={insights?.rueda}
        loading={insightsLoading && !insights?.rueda}
        label="La Pitonisa sobre la geometría de esta sinastría"
      />
      {insights?.dominant && (
        <div className="px-4 py-3 rounded-xl border border-blue-500/20 bg-blue-900/10">
          <p className="text-[9px] uppercase tracking-[0.3em] text-blue-400/50 font-sans mb-1">Conexión principal</p>
          <p className="text-mystic-muted/75 text-xs font-sans leading-snug italic">{insights.dominant}</p>
        </div>
      )}
      <ModuleResult text={text} isStreaming={isStreaming} error={error} onReset={onReset} moduleId="compatibilidad" />
    </div>
  )
}

// ── Time input ────────────────────────────────────────────────────────────────

const SELECT_CLS = `w-full rounded-xl px-3 py-2.5 text-mystic-text font-sans text-sm
  focus:outline-none focus:ring-2 focus:ring-blue-500/15 transition-all duration-200 cursor-pointer
  border border-mystic-border/80 focus:border-blue-400/60`
const SELECT_STYLE = { background: 'linear-gradient(135deg, #101026, #14143a)' }

function TimeInput({ label, hour, minute, known, onHourChange, onMinuteChange, onKnownChange }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-3 cursor-pointer"
        onClick={() => onKnownChange(!known)}>
        <div className={`w-9 h-[18px] rounded-full border transition-all duration-200 flex items-center px-0.5 shrink-0 ${
          known ? 'bg-blue-500/25 border-blue-400/50' : 'bg-mystic-border/40 border-mystic-border'
        }`}>
          <div className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
            known ? 'bg-blue-400 translate-x-[18px]' : 'bg-mystic-muted/60 translate-x-0'
          }`} />
        </div>
        <span className="text-mystic-muted/70 text-xs uppercase tracking-widest font-sans select-none">
          {label} conocida
        </span>
      </label>

      {known && (
        <div className="grid grid-cols-2 gap-2 animate-fadeIn">
          <select value={hour} onChange={e => onHourChange(e.target.value)}
            className={SELECT_CLS} style={SELECT_STYLE}>
            <option value="">Hora</option>
            {Array.from({ length: 24 }, (_, i) => i).map(h => (
              <option key={h} value={h}>{String(h).padStart(2, '0')}:00</option>
            ))}
          </select>
          <select value={minute} onChange={e => onMinuteChange(e.target.value)}
            className={SELECT_CLS} style={SELECT_STYLE}>
            <option value="">Min</option>
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
              <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'Rueda',    icon: '🔵', desc: 'Mapa + lectura' },
  { id: 'Aspectos', icon: '✴️', desc: 'Ángulos' },
  { id: 'Casas',    icon: '🏠', desc: 'Áreas de vida' },
]

const TAB_INFO = {
  Rueda:    { hint: 'El círculo interior es tu carta. El anillo exterior muestra los planetas de la otra persona. La lectura completa aparece debajo.' },
  Aspectos: { hint: 'Los aspectos exactos (orbe pequeño) son los más poderosos. Un trígono fluye sin esfuerzo; una cuadratura crea pasión.' },
  Casas:    { hint: 'Cuando el Sol de alguien cae en tu Casa 7, esa persona activa directamente tu área de relaciones. Haz clic en cada casa para la lectura.' },
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Compatibilidad() {
  const { text, isStreaming, error, meta, stream, reset } = useModuleStream()
  const { profile, updateProfile } = useUserProfile()

  const [step, setStep]             = useState('form')
  const [score, setScore]           = useState(null)
  const [synastry, setSynastry]     = useState(null)
  const [insights, setInsights]     = useState(null)
  const [insightsLoading, setInsightsLoading] = useState(false)
  const [activeTab, setActiveTab]   = useState('Rueda')

  const [form, setForm] = useState({
    nombre_a:     profile.nombre           || '',
    fecha_a:      profile.fecha_nacimiento || '',
    ciudad_a:     profile.ciudad           || '',
    hora_a_h:     '',
    hora_a_m:     '',
    hora_a_known: false,
    nombre_b:     profile.nombre_b || '',
    fecha_b:      profile.fecha_b  || '',
    ciudad_b:     profile.ciudad_b || '',
    hora_b_h:     '',
    hora_b_m:     '',
    hora_b_known: false,
  })

  useEffect(() => {
    if (meta?.__score__ !== undefined) {
      setScore(meta.__score__)
      setStep('results')
      setInsightsLoading(true)
    }
    if (meta?.__synastry__)          setSynastry(meta.__synastry__)
    if (meta?.__synastry_insights__) { setInsights(meta.__synastry_insights__); setInsightsLoading(false) }
  }, [meta])

  // When streaming stops and no insights arrived yet, stop the loading spinner
  useEffect(() => {
    if (!isStreaming && insightsLoading && insights) setInsightsLoading(false)
    if (!isStreaming && insightsLoading) {
      const t = setTimeout(() => setInsightsLoading(false), 8000)
      return () => clearTimeout(t)
    }
  }, [isStreaming, insightsLoading, insights])

  async function handleSubmit(e) {
    e.preventDefault()
    const body = {
      nombre_a:     form.nombre_a,
      fecha_a:      form.fecha_a,
      ciudad_a:     form.ciudad_a,
      hora_a_known: form.hora_a_known,
      hora_a:       form.hora_a_known && form.hora_a_h !== '' ? `${form.hora_a_h}:${form.hora_a_m !== '' ? String(form.hora_a_m).padStart(2,'0') : '00'}` : '',
      nombre_b:     form.nombre_b,
      fecha_b:      form.fecha_b,
      ciudad_b:     form.ciudad_b,
      hora_b_known: form.hora_b_known,
      hora_b:       form.hora_b_known && form.hora_b_h !== '' ? `${form.hora_b_h}:${form.hora_b_m !== '' ? String(form.hora_b_m).padStart(2,'0') : '00'}` : '',
    }
    await stream('/api/compatibilidad', body)
  }

  function handleReset() {
    reset()
    setScore(null)
    setSynastry(null)
    setInsights(null)
    setInsightsLoading(false)
    setActiveTab('Rueda')
    setStep('form')
  }

  const inputCls = "w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-blue-400/50"

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <SeoHead
        title="Compatibilidad Amorosa"
        description="Sinastría astral completa: biwheel interactivo, aspectos inter-carta con IA y análisis de casas. Descubre qué os une y qué os reta."
        path="/compatibilidad"
      />
      <StarField count={80} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-900/8 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-blue-500/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">💞</div>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest mb-2"
              style={{ background: 'linear-gradient(90deg, #8cb8e8, #b8d8f8, #8cb8e8)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            Compatibilidad Amorosa
          </h2>
          <p className="text-mystic-muted/70 text-sm tracking-wide">Sinastría astral completa · biwheel · aspectos · casas con IA</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-blue-400/40" />
            <span className="text-blue-400/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-blue-400/40" />
          </div>
        </div>

        {/* ── FORM ─────────────────────────────────────────────────────────── */}
        {step === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* A */}
              <div className="bg-mystic-surface/40 border border-blue-900/30 rounded-2xl p-5 space-y-4">
                <h3 className="text-blue-300/80 text-xs tracking-widest uppercase font-sans">✦ Tú</h3>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widests uppercase mb-1.5">Nombre</label>
                  <input required value={form.nombre_a}
                    onChange={e => { setForm(f => ({ ...f, nombre_a: e.target.value })); updateProfile({ nombre: e.target.value }) }}
                    className={inputCls} placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widests uppercase mb-1.5">Fecha de nacimiento</label>
                  <input required type="date" value={form.fecha_a}
                    onChange={e => { setForm(f => ({ ...f, fecha_a: e.target.value })); updateProfile({ fecha_nacimiento: e.target.value }) }}
                    className={inputCls} />
                </div>
                <TimeInput label="Hora"
                  hour={form.hora_a_h} minute={form.hora_a_m} known={form.hora_a_known}
                  onHourChange={v => setForm(f => ({ ...f, hora_a_h: v }))}
                  onMinuteChange={v => setForm(f => ({ ...f, hora_a_m: v }))}
                  onKnownChange={v => setForm(f => ({ ...f, hora_a_known: v }))} />
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widests uppercase mb-1.5">
                    Ciudad <span className="normal-case text-mystic-muted/40">(opcional)</span>
                  </label>
                  <input value={form.ciudad_a}
                    onChange={e => { setForm(f => ({ ...f, ciudad_a: e.target.value })); updateProfile({ ciudad: e.target.value }) }}
                    className={inputCls} placeholder="ej: Madrid, España" />
                </div>
              </div>

              {/* B */}
              <div className="bg-mystic-surface/40 border border-pink-900/30 rounded-2xl p-5 space-y-4">
                <h3 className="text-pink-300/80 text-xs tracking-widest uppercase font-sans">✦ La otra persona</h3>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widests uppercase mb-1.5">Nombre</label>
                  <input required value={form.nombre_b}
                    onChange={e => { setForm(f => ({ ...f, nombre_b: e.target.value })); updateProfile({ nombre_b: e.target.value }) }}
                    className={inputCls} placeholder="Su nombre" />
                </div>
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widests uppercase mb-1.5">Fecha de nacimiento</label>
                  <input required type="date" value={form.fecha_b}
                    onChange={e => { setForm(f => ({ ...f, fecha_b: e.target.value })); updateProfile({ fecha_b: e.target.value }) }}
                    className={inputCls} />
                </div>
                <TimeInput label="Hora"
                  hour={form.hora_b_h} minute={form.hora_b_m} known={form.hora_b_known}
                  onHourChange={v => setForm(f => ({ ...f, hora_b_h: v }))}
                  onMinuteChange={v => setForm(f => ({ ...f, hora_b_m: v }))}
                  onKnownChange={v => setForm(f => ({ ...f, hora_b_known: v }))} />
                <div>
                  <label className="block text-mystic-muted/70 text-xs tracking-widests uppercase mb-1.5">
                    Ciudad <span className="normal-case text-mystic-muted/40">(opcional)</span>
                  </label>
                  <input value={form.ciudad_b}
                    onChange={e => { setForm(f => ({ ...f, ciudad_b: e.target.value })); updateProfile({ ciudad_b: e.target.value }) }}
                    className={inputCls} placeholder="ej: Barcelona, España" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <button type="submit" disabled={isStreaming}
                className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-blue-800 to-indigo-800 hover:from-blue-700 hover:to-indigo-700
                           text-mystic-text border border-blue-700/60
                           transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-0.5
                           disabled:opacity-50 disabled:cursor-not-allowed">
                {isStreaming ? 'Calculando sinastría...' : '💞 Calcular Compatibilidad'}
              </button>
            </div>
          </form>
        )}

        {/* ── RESULTS ──────────────────────────────────────────────────────── */}
        {step === 'results' && (
          <div className="animate-fadeIn">

            {/* Score + names */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-center">
                <span className="text-[10px] font-sans uppercase tracking-widest text-blue-300/60 block mb-0.5">Tú</span>
                <span className="font-display font-bold text-mystic-accent/90">{form.nombre_a}</span>
              </div>
              {score !== null && <ScoreMeter score={score} />}
              <div className="text-center">
                <span className="text-[10px] font-sans uppercase tracking-widest text-pink-300/60 block mb-0.5">La otra persona</span>
                <span className="font-display font-bold text-mystic-accent/90">{form.nombre_b}</span>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 mb-2 p-1 bg-mystic-surface/40 rounded-xl border border-mystic-border/30">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-lg transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-mystic-border/50 text-mystic-accent border border-mystic-border/60'
                      : 'text-mystic-muted/50 hover:text-mystic-muted/80'
                    }`}>
                  <div className="text-base leading-none mb-0.5">{tab.icon}</div>
                  <div className="text-[10px] font-sans uppercase tracking-widest">{tab.id}</div>
                </button>
              ))}
            </div>

            {/* Tab hint */}
            <p className="text-mystic-muted/35 text-[10px] font-sans text-center mb-5 px-2 leading-snug">
              {TAB_INFO[activeTab]?.hint}
            </p>

            {/* Tab content */}
            {activeTab === 'Rueda' && (
              <RuedaTab synastry={synastry} insights={insights} insightsLoading={insightsLoading}
                nameA={form.nombre_a} nameB={form.nombre_b}
                text={text} isStreaming={isStreaming} error={error} onReset={handleReset} />
            )}
            {activeTab === 'Aspectos' && (
              <AspectosTab aspects={synastry?.aspects} nameA={form.nombre_a} nameB={form.nombre_b}
                insights={insights} insightsLoading={insightsLoading} />
            )}
            {activeTab === 'Casas' && (
              <CasasTab overlays={synastry?.overlays} nameA={form.nombre_a} nameB={form.nombre_b}
                insights={insights} insightsLoading={insightsLoading} />
            )}

            {/* Footer */}
            <div className="mt-8 flex items-center justify-center">
              <button onClick={handleReset}
                className="text-[10px] font-sans uppercase tracking-widest text-mystic-muted/25 hover:text-mystic-gold/50 transition-colors">
                Nueva consulta
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
