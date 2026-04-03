import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useUserProfile } from '../hooks/useUserProfile'
import Navbar from '../components/layout/Navbar'
import StarField from '../components/ui/StarField'
import { LeafDivider } from '../components/ui/Sprite'
import CardDisplay from '../components/oracle/CardDisplay'
import ModuleResult from '../components/oracle/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'
import SeoHead from '../components/ui/SeoHead'

// ── Full deck (78 cards) ─────────────────────────────────────────────────────
const MAJOR_ARCANA = [
  { id: 0,  name: 'El Loco',                symbol: '🃏' },
  { id: 1,  name: 'El Mago',                symbol: '🔮' },
  { id: 2,  name: 'La Sacerdotisa',         symbol: '🌙' },
  { id: 3,  name: 'La Emperatriz',          symbol: '🌸' },
  { id: 4,  name: 'El Emperador',           symbol: '👑' },
  { id: 5,  name: 'El Sumo Sacerdote',      symbol: '⛪' },
  { id: 6,  name: 'Los Enamorados',         symbol: '💑' },
  { id: 7,  name: 'El Carro',               symbol: '🏆' },
  { id: 8,  name: 'La Justicia',            symbol: '⚖️' },
  { id: 9,  name: 'El Ermitaño',            symbol: '🕯️' },
  { id: 10, name: 'La Rueda de la Fortuna', symbol: '☸️' },
  { id: 11, name: 'La Fuerza',              symbol: '🦁' },
  { id: 12, name: 'El Colgado',             symbol: '🙃' },
  { id: 13, name: 'La Muerte',              symbol: '🌑' },
  { id: 14, name: 'La Templanza',           symbol: '🌊' },
  { id: 15, name: 'El Diablo',              symbol: '🔗' },
  { id: 16, name: 'La Torre',               symbol: '⚡' },
  { id: 17, name: 'La Estrella',            symbol: '⭐' },
  { id: 18, name: 'La Luna',                symbol: '🌕' },
  { id: 19, name: 'El Sol',                 symbol: '☀️' },
  { id: 20, name: 'El Juicio',              symbol: '📯' },
  { id: 21, name: 'El Mundo',               symbol: '🌍' },
]
const BASTOS_SYMBOLS  = ['🌱','🌿','🌲','🎉','🥊','🏅','🛡️','🚀','🏰','🎒','🦊','🐎','🌺','🦅']
const COPAS_SYMBOLS   = ['💧','💞','🥂','😔','😢','🌹','🌈','🚣','🍾','🏡','🧚','🦢','🧜','🐋']
const ESPADAS_SYMBOLS = ['⚔️','😌','💔','😴','🗡️','⛵','🦝','🪢','😰','💥','🦋','🌪️','🧊','🗺️']
const PENTS_SYMBOLS   = ['🪙','🔄','🏗️','🤑','🚪','🎁','🌾','🔨','🦚','💎','📚','🐂','🌻','🏔️']
const RANKS = ['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballo','Reina','Rey']

const MINOR_ARCANA = [
  ...RANKS.map((n, i) => ({ id: 22 + i, name: `${n} de Bastos`,     symbol: BASTOS_SYMBOLS[i]  })),
  ...RANKS.map((n, i) => ({ id: 36 + i, name: `${n} de Copas`,      symbol: COPAS_SYMBOLS[i]   })),
  ...RANKS.map((n, i) => ({ id: 50 + i, name: `${n} de Espadas`,    symbol: ESPADAS_SYMBOLS[i] })),
  ...RANKS.map((n, i) => ({ id: 64 + i, name: `${n} de Pentáculos`, symbol: PENTS_SYMBOLS[i]   })),
]
const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA]

const POSICIONES = [
  'Energía actual de tu ex hacia ti',
  'Lo que realmente siente ahora',
  'El obstáculo entre vosotros',
  'Lo que el universo prepara',
  'La energía de los próximos 30 días',
]

const TIEMPO_OPTIONS = [
  'Menos de 1 semana', '1-4 semanas', '1-3 meses', '3-6 meses', 'Más de 6 meses',
]
const RAZON_OPTIONS = [
  'Decidimos alejarnos', 'Me dejó sin explicación', 'Hubo una tercera persona',
  'La distancia nos separó', 'Tuvimos una pelea grave', 'Se fue apagando solo',
]
const CONTACTO_OPTIONS = ['Sí, hablamos seguido', 'A veces, de vez en cuando', 'No, sin contacto']

function drawCards(forcedIds = []) {
  if (forcedIds.length > 0) {
    return POSICIONES.map((position, i) => {
      const forced = forcedIds[i] ?? forcedIds[0]
      const card = ALL_CARDS.find(c => c.id === forced.id) || ALL_CARDS[0]
      return { ...card, position, reversed: forced.reversed }
    })
  }
  return [...ALL_CARDS].sort(() => Math.random() - 0.5).slice(0, 5).map((card, i) => ({
    ...card, position: POSICIONES[i], reversed: Math.random() < 0.33,
  }))
}

const CARD_MARKERS = ['[C1]', '[C2]', '[C3]', '[C4]', '[C5]', '[CIERRE]']

function parseCardSections(fullText) {
  const cardTexts = ['', '', '', '', '']
  let closingText = ''
  let currentIdx = -1
  let currentStart = 0

  for (let i = 0; i < CARD_MARKERS.length; i++) {
    const pos = fullText.indexOf(CARD_MARKERS[i])
    if (pos === -1) break
    if (currentIdx >= 0) {
      const chunk = fullText.slice(currentStart, pos).trim()
      if (currentIdx < 5) cardTexts[currentIdx] = chunk
      else closingText = chunk
    }
    currentIdx = i
    currentStart = pos + CARD_MARKERS[i].length
  }
  if (currentIdx >= 0) {
    const chunk = fullText.slice(currentStart).trim()
    if (currentIdx < 5) cardTexts[currentIdx] = chunk
    else closingText = chunk
  }
  return { cardTexts, closingText }
}

export default function VolveraEx() {
  const [searchParams] = useSearchParams()
  const forcedIds = (searchParams.get('test') || '')
    .split(',').filter(Boolean)
    .map(s => ({ id: parseInt(s), reversed: s.endsWith('r') }))
    .filter(({ id }) => !isNaN(id) && id >= 0)
  const { text, isStreaming, error, stream, reset } = useModuleStream()
  const { profile, updateProfile } = useUserProfile()

  const [step, setStep]                 = useState('form')
  const [cards, setCards]               = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flippedCards, setFlippedCards] = useState([])
  const [showGlow, setShowGlow]         = useState(false)
  const [shakeCard, setShakeCard]       = useState(false)
  const [cardKey, setCardKey]           = useState(0)
  const [form, setForm] = useState({
    nombre:    profile.nombre    || '',
    ex_nombre: profile.ex_nombre || '',
    tiempo:    '',
    razon:     '',
    contacto:  '',
  })

  const { cardTexts, closingText } = useMemo(() => parseCardSections(text), [text])

  function handleFormSubmit(e) {
    e.preventDefault()
    const drawn = drawCards(forcedIds)
    setCards(drawn)
    setFlippedCards(new Array(drawn.length).fill(false))
    setCurrentIndex(0)
    setShowGlow(false)
    setShakeCard(false)
    setCardKey(0)
    setStep('cards')
    // Fire API immediately — streams in background while user reveals cards
    stream('/api/volvera-ex', {
      nombre:    form.nombre,
      ex_nombre: form.ex_nombre,
      tiempo:    form.tiempo,
      razon:     form.razon,
      contacto:  form.contacto,
      cards:     drawn.map(c => ({ name: c.name, symbol: c.symbol, position: c.position, reversed: c.reversed })),
    })
  }

  function handleFlip() {
    const updated = [...flippedCards]
    updated[currentIndex] = true
    setFlippedCards(updated)
    setShowGlow(true)
    setTimeout(() => setShowGlow(false), 650)
    if (cards[currentIndex]?.reversed) {
      setTimeout(() => { setShakeCard(true); setTimeout(() => setShakeCard(false), 600) }, 420)
    }
  }

  function handleNext() {
    setShakeCard(false)
    setShowGlow(false)
    setTimeout(() => {
      setCurrentIndex(i => i + 1)
      setCardKey(k => k + 1)
    }, 80)
  }

  function handleReset() {
    reset()
    setStep('form')
    setCards([])
    setCurrentIndex(0)
    setFlippedCards([])
    setShowGlow(false)
    setShakeCard(false)
    setCardKey(0)
    setForm({ nombre: profile.nombre || '', ex_nombre: profile.ex_nombre || '', tiempo: '', razon: '', contacto: '' })
  }

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <SeoHead
        title="¿Volverá mi ex?"
        description="Las cartas revelan la energía entre tú y quien se fue. Tirada de tarot especializada para relaciones pasadas, con lectura del oráculo."
        path="/volvera-ex"
      />
      <StarField count={80} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-900/8 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full blur-3xl scale-125 animate-pulse-slow pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(232,140,140,0.25) 0%, transparent 70%)' }} />
            <img
              src="/modules/01_volvera_mi_ex.png"
              alt="¿Volverá mi ex?"
              className="relative w-36 h-36 object-contain animate-float-slow select-none"
              style={{ mixBlendMode: 'multiply' }}
            />
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest mb-2"
              style={{ background: 'linear-gradient(90deg, #e88c8c, #f5b8b8, #e88c8c)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
            ¿Volverá mi ex?
          </h2>
          <p className="text-mystic-muted/70 text-sm tracking-wide">Las cartas saben lo que tu corazón no se atreve a preguntar.</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-rose-400/40" />
            <span className="text-rose-400/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-rose-400/40" />
          </div>
          <LeafDivider className="my-4 opacity-50" />
        </div>

        {/* Step: form */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-5 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Tu nombre</label>
                <input required maxLength={60} value={form.nombre}
                  onChange={e => { setForm(f => ({ ...f, nombre: e.target.value })); updateProfile({ nombre: e.target.value }) }}
                  className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-rose-400/50"
                  placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Su nombre</label>
                <input required maxLength={60} value={form.ex_nombre}
                  onChange={e => { setForm(f => ({ ...f, ex_nombre: e.target.value })); updateProfile({ ex_nombre: e.target.value }) }}
                  className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-rose-400/50"
                  placeholder="Nombre de tu ex" />
              </div>
            </div>

            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Tiempo separados</label>
              <select required value={form.tiempo} onChange={e => setForm(f => ({ ...f, tiempo: e.target.value }))}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm focus:outline-none focus:border-rose-400/50">
                <option value="">Selecciona...</option>
                {TIEMPO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Razón de la ruptura</label>
              <select required value={form.razon} onChange={e => setForm(f => ({ ...f, razon: e.target.value }))}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm focus:outline-none focus:border-rose-400/50">
                <option value="">Selecciona...</option>
                {RAZON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">¿Hay contacto actualmente?</label>
              <select required value={form.contacto} onChange={e => setForm(f => ({ ...f, contacto: e.target.value }))}
                className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm focus:outline-none focus:border-rose-400/50">
                <option value="">Selecciona...</option>
                {CONTACTO_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="text-center pt-2">
              <button type="submit"
                className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                           bg-gradient-to-r from-rose-800 to-pink-800 hover:from-rose-700 hover:to-pink-700
                           text-mystic-text border border-rose-700/60
                           transition-all duration-300 hover:shadow-xl hover:shadow-rose-900/40 hover:-translate-y-0.5">
                💔 Revelar las Cartas
              </button>
            </div>
          </form>
        )}

        {/* Step: cards — one at a time reveal */}
        {step === 'cards' && cards.length > 0 && (() => {
          const card = cards[currentIndex]
          const isFlipped = flippedCards[currentIndex]
          return (
            <div className="flex flex-col items-center">

              {/* Progress dots */}
              <div className="flex items-center gap-2 mb-8">
                {cards.map((_, i) => (
                  <div key={i} className="transition-all duration-500"
                       style={{
                         width:  i === currentIndex ? '24px' : i < currentIndex ? '8px' : '8px',
                         height: '8px',
                         borderRadius: '9999px',
                         background: i < currentIndex ? '#8070C8' : i === currentIndex ? '#F0A05A' : 'rgba(196,180,224,0.3)',
                         boxShadow: i === currentIndex ? '0 0 8px rgba(240,160,90,0.6)' : 'none',
                       }} />
                ))}
              </div>

              {/* Counter + position */}
              <p className="text-[10px] uppercase tracking-[0.3em] text-mystic-muted/45 mb-2 font-sans">
                Carta {currentIndex + 1} de {cards.length}
              </p>
              <p className="text-base font-serif italic text-mystic-muted/70 mb-8 text-center px-4 leading-snug">
                {card.position}
              </p>

              {/* Card with glow burst + shake */}
              <div key={cardKey} className="relative animate-card-enter">
                {showGlow && (
                  <div className="absolute inset-0 rounded-2xl pointer-events-none z-20 animate-glow-burst"
                       style={{
                         background: card.reversed
                           ? 'radial-gradient(circle, rgba(204,80,80,0.45), transparent 70%)'
                           : 'radial-gradient(circle, rgba(91,107,224,0.40), transparent 70%)',
                         filter: 'blur(18px)',
                       }} />
                )}
                <div className={shakeCard ? 'animate-shake-once' : ''}>
                  <CardDisplay
                    card={card}
                    isRevealed={isFlipped}
                    isReversed={card.reversed}
                    index={currentIndex}
                    size="lg"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-10 text-center min-h-[120px] flex flex-col items-center justify-start">
                {!isFlipped ? (
                  <button
                    onClick={handleFlip}
                    className="group relative py-4 px-14 rounded-2xl font-semibold tracking-[0.18em] uppercase text-sm
                               border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl animate-card-back-shimmer"
                    style={{
                      background: 'linear-gradient(135deg, rgba(196,180,224,0.35), rgba(91,107,224,0.20))',
                      borderColor: 'rgba(91,107,224,0.40)',
                      color: 'rgba(91,107,224,0.85)',
                      boxShadow: '0 4px 20px rgba(91,107,224,0.18)',
                    }}
                  >
                    <span className="mr-2 group-hover:animate-pulse">✦</span>
                    Revelar carta
                  </button>
                ) : (
                  <div className="animate-fadeInUp flex flex-col items-center w-full max-w-sm gap-4">
                    {/* Per-card reading text */}
                    {cardTexts[currentIndex] ? (
                      <p className="text-mystic-text/80 text-sm font-serif leading-relaxed text-center px-2
                                    animate-fadeIn">
                        {cardTexts[currentIndex]}
                      </p>
                    ) : isStreaming ? (
                      <div className="flex items-center gap-2 text-mystic-muted/50 text-xs font-sans">
                        <span className="flex gap-[3px]">
                          {[0.35,0.7,1,0.55,0.85].map((h, j) => (
                            <span key={j} className="w-[2px] rounded-full bg-mystic-violet/50 animate-waveform origin-center inline-block"
                              style={{ height: `${Math.round(h*10)}px`, animationDelay: `${(j*0.1).toFixed(1)}s` }} />
                          ))}
                        </span>
                        Las cartas hablan…
                      </div>
                    ) : null}

                    {card.reversed && (
                      <p className="text-[11px] text-rose-500/75 border border-rose-400/30 bg-rose-50/60
                                    px-4 py-1.5 rounded-full font-sans tracking-wide">
                        🔄 Carta invertida — energía bloqueada o en transformación
                      </p>
                    )}

                    {currentIndex < cards.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="py-3.5 px-10 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                                   border border-mystic-border/50 bg-mystic-surface/60 text-mystic-muted/80
                                   transition-all duration-300 hover:border-mystic-gold/50 hover:text-mystic-text hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        Siguiente carta →
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-4 w-full">
                        {/* Closing text */}
                        {closingText ? (
                          <p className="text-mystic-muted/75 text-sm font-serif italic leading-relaxed text-center px-2 animate-fadeIn">
                            {closingText}
                          </p>
                        ) : isStreaming ? (
                          <div className="flex items-center gap-2 text-mystic-muted/40 text-xs font-sans">
                            <span className="animate-pulse">✦</span> Cerrando la lectura…
                          </div>
                        ) : null}
                        <button
                          onClick={() => setStep('reading')}
                          className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                                     bg-gradient-to-r from-rose-800 via-pink-800 to-rose-700
                                     text-mystic-text border border-rose-600/30
                                     transition-all duration-300 hover:shadow-2xl hover:shadow-rose-900/20 hover:-translate-y-0.5"
                        >
                          Ver lectura completa →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Step: reading — full summary */}
        {step === 'reading' && (
          <div>
            <div className="overflow-x-auto pb-2 -mx-4 px-4 mb-6">
              <div className="flex gap-3 justify-start md:justify-center w-max md:w-full mx-auto py-2">
                {cards.map((card, i) => (
                  <CardDisplay key={i} card={card} isRevealed={true}
                               isReversed={card.reversed} index={i} size="md" />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-400/30" />
              <span className="text-rose-400/70 text-sm tracking-[0.3em] uppercase font-sans">La Lectura</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-400/30" />
            </div>
            {/* Clean text: all card sections + closing, markers stripped */}
            <ModuleResult
              text={[...cardTexts, closingText].filter(Boolean).join('\n\n')}
              isStreaming={false}
              error={error}
              onReset={handleReset}
              moduleId="volvera-ex"
            />
          </div>
        )}
      </main>
    </div>
  )
}
