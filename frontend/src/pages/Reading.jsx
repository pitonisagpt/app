import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { SPREADS } from '../data/spreads'
import { useSession } from '../context/SessionContext'
import { useStreaming } from '../hooks/useStreaming'
import Navbar from '../components/layout/Navbar'
import StarField from '../components/ui/StarField'
import SpreadLayout from '../components/oracle/SpreadLayout'
import QuestionForm from '../components/ui/QuestionForm'
import OracleResponse from '../components/oracle/OracleResponse'
import SeoHead from '../components/ui/SeoHead'

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

const MINOR_ARCANA = [
  // Bastos (Fuego — acción, pasión, creatividad)
  { id: 22, name: 'As de Bastos',       symbol: '🌱' },
  { id: 23, name: 'Dos de Bastos',      symbol: '🌿' },
  { id: 24, name: 'Tres de Bastos',     symbol: '🌲' },
  { id: 25, name: 'Cuatro de Bastos',   symbol: '🎉' },
  { id: 26, name: 'Cinco de Bastos',    symbol: '🥊' },
  { id: 27, name: 'Seis de Bastos',     symbol: '🏅' },
  { id: 28, name: 'Siete de Bastos',    symbol: '🛡️' },
  { id: 29, name: 'Ocho de Bastos',     symbol: '🚀' },
  { id: 30, name: 'Nueve de Bastos',    symbol: '🏰' },
  { id: 31, name: 'Diez de Bastos',     symbol: '🎒' },
  { id: 32, name: 'Sota de Bastos',     symbol: '🦊' },
  { id: 33, name: 'Caballo de Bastos',  symbol: '🐎' },
  { id: 34, name: 'Reina de Bastos',    symbol: '🌺' },
  { id: 35, name: 'Rey de Bastos',      symbol: '🦅' },
  // Copas (Agua — emociones, intuición, amor)
  { id: 36, name: 'As de Copas',        symbol: '💧' },
  { id: 37, name: 'Dos de Copas',       symbol: '💞' },
  { id: 38, name: 'Tres de Copas',      symbol: '🥂' },
  { id: 39, name: 'Cuatro de Copas',    symbol: '😔' },
  { id: 40, name: 'Cinco de Copas',     symbol: '😢' },
  { id: 41, name: 'Seis de Copas',      symbol: '🌹' },
  { id: 42, name: 'Siete de Copas',     symbol: '🌈' },
  { id: 43, name: 'Ocho de Copas',      symbol: '🚣' },
  { id: 44, name: 'Nueve de Copas',     symbol: '🍾' },
  { id: 45, name: 'Diez de Copas',      symbol: '🏡' },
  { id: 46, name: 'Sota de Copas',      symbol: '🧚' },
  { id: 47, name: 'Caballo de Copas',   symbol: '🦢' },
  { id: 48, name: 'Reina de Copas',     symbol: '🧜' },
  { id: 49, name: 'Rey de Copas',       symbol: '🐋' },
  // Espadas (Aire — mente, conflicto, verdad)
  { id: 50, name: 'As de Espadas',      symbol: '⚔️' },
  { id: 51, name: 'Dos de Espadas',     symbol: '😌' },
  { id: 52, name: 'Tres de Espadas',    symbol: '💔' },
  { id: 53, name: 'Cuatro de Espadas',  symbol: '😴' },
  { id: 54, name: 'Cinco de Espadas',   symbol: '🗡️' },
  { id: 55, name: 'Seis de Espadas',    symbol: '⛵' },
  { id: 56, name: 'Siete de Espadas',   symbol: '🦝' },
  { id: 57, name: 'Ocho de Espadas',    symbol: '🪢' },
  { id: 58, name: 'Nueve de Espadas',   symbol: '😰' },
  { id: 59, name: 'Diez de Espadas',    symbol: '💥' },
  { id: 60, name: 'Sota de Espadas',    symbol: '🦋' },
  { id: 61, name: 'Caballo de Espadas', symbol: '🌪️' },
  { id: 62, name: 'Reina de Espadas',   symbol: '🧊' },
  { id: 63, name: 'Rey de Espadas',     symbol: '🗺️' },
  // Pentáculos (Tierra — materia, trabajo, abundancia)
  { id: 64, name: 'As de Pentáculos',      symbol: '🪙' },
  { id: 65, name: 'Dos de Pentáculos',     symbol: '🔄' },
  { id: 66, name: 'Tres de Pentáculos',    symbol: '🏗️' },
  { id: 67, name: 'Cuatro de Pentáculos',  symbol: '🤑' },
  { id: 68, name: 'Cinco de Pentáculos',   symbol: '🚪' },
  { id: 69, name: 'Seis de Pentáculos',    symbol: '🎁' },
  { id: 70, name: 'Siete de Pentáculos',   symbol: '🌾' },
  { id: 71, name: 'Ocho de Pentáculos',    symbol: '🔨' },
  { id: 72, name: 'Nueve de Pentáculos',   symbol: '🦚' },
  { id: 73, name: 'Diez de Pentáculos',    symbol: '💎' },
  { id: 74, name: 'Sota de Pentáculos',    symbol: '📚' },
  { id: 75, name: 'Caballo de Pentáculos', symbol: '🐂' },
  { id: 76, name: 'Reina de Pentáculos',   symbol: '🌻' },
  { id: 77, name: 'Rey de Pentáculos',     symbol: '🏔️' },
]

const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA]

function drawCards(spread, forcedIds = []) {
  if (forcedIds.length > 0) {
    return spread.positions.map((position, i) => {
      const forced = forcedIds[i] ?? forcedIds[0]
      const card = ALL_CARDS.find(c => c.id === forced.id) || ALL_CARDS[0]
      return { ...card, position, reversed: forced.reversed }
    })
  }
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5)
  return spread.positions.map((position, i) => ({
    ...shuffled[i],
    position,
    reversed: Math.random() < 0.33,
  }))
}

export default function Reading() {
  const { spreadId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const spread = SPREADS[spreadId]

  // ?test=0,1r,2 forces specific card IDs — append "r" to reverse, e.g. ?test=0r,1,2r
  const forcedIds = (searchParams.get('test') || '')
    .split(',').filter(Boolean)
    .map(s => ({ id: parseInt(s), reversed: s.endsWith('r') }))
    .filter(({ id }) => !isNaN(id) && id >= 0)

  const {
    step, setStep,
    question, setQuestion,
    drawnCards, setDrawnCards,
    setCurrentSpread,
    resetReading,
  } = useSession()

  const { startReading } = useStreaming()
  const [revealedCount, setRevealedCount] = useState(0)
  const [consulting, setConsulting] = useState(false)

  useEffect(() => {
    if (!spread) {
      navigate('/')
      return
    }
    resetReading()
    setCurrentSpread(spread)
    setRevealedCount(0)
  }, [spreadId])

  // Flip cards one by one after entering reveal step
  useEffect(() => {
    if (step !== 'reveal' || drawnCards.length === 0) return
    setRevealedCount(0)
    let i = 0
    const interval = setInterval(() => {
      i += 1
      setRevealedCount(i)
      if (i >= drawnCards.length) clearInterval(interval)
    }, 400)
    return () => clearInterval(interval)
  }, [step])

  function handleStart() {
    setStep('question')
  }

  function handleQuestionSubmit(q) {
    const cards = drawCards(spread, forcedIds)
    setDrawnCards(cards)
    setStep('reveal')
  }

  function handleNoQuestion() {
    const cards = drawCards(spread, forcedIds)
    setDrawnCards(cards)
    setStep('reveal')
  }

  async function handleConsult() {
    if (consulting) return
    setConsulting(true)
    await startReading(
      spreadId,
      question || null,
      drawnCards.map(c => ({
        name: c.name,
        symbol: c.symbol,
        position: c.position,
        reversed: c.reversed,
      }))
    )
    setConsulting(false)
  }

  function handleNewReading() {
    resetReading()
    setRevealedCount(0)
    setQuestion('')
    setStep('intro')
  }

  if (!spread) return null

  const allFlipped = revealedCount >= spread.cardCount

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      {spread && (
        <SeoHead
          title={spread.name}
          description={`${spread.description} ${spread.cardCount} cartas. Consulta gratis con inteligencia artificial.`}
          path={`/tirada/${spreadId}`}
        />
      )}
      <StarField count={80} />
      {/* Ambient orb */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-mystic-purple/8 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Spread header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-mystic-gold/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">{spread.icon}</div>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-widest mb-2"
              style={{
                background: 'linear-gradient(90deg, #c9a84c, #e8c97e, #c9a84c)',
                backgroundSize: '200% auto',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'shimmer 4s linear infinite',
              }}>
            {spread.name}
          </h2>
          <p className="text-mystic-muted/70 text-sm tracking-wide">{spread.description}</p>
          <div className="mt-4 flex justify-center items-center gap-3">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-mystic-gold/40" />
            <span className="text-mystic-gold/60 text-xs">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-mystic-gold/40" />
          </div>
        </div>

        {/* Step: intro */}
        {step === 'intro' && (
          <div className="text-center py-8">
            <p className="text-mystic-text/80 mb-10 text-base leading-relaxed max-w-md mx-auto font-serif tracking-wide">
              Las cartas aguardan tu consulta. Concéntrate en tu pregunta y cuando estés listo, comienza.
            </p>
            <button
              onClick={handleStart}
              className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                         bg-gradient-to-r from-mystic-purple to-mystic-violet
                         hover:from-purple-700 hover:to-violet-700
                         text-mystic-text border border-mystic-border/60
                         transition-all duration-300 hover:shadow-xl hover:shadow-mystic-purple/40
                         hover:-translate-y-0.5"
            >
              🌟 Comenzar Consulta
            </button>
          </div>
        )}

        {/* Step: question */}
        {step === 'question' && (
          <div className="py-4">
            {spread.requiresQuestion ? (
              <div className="text-center mb-6">
                <p className="text-mystic-muted/70 mb-6 text-sm tracking-wide font-serif italic">
                  Formula tu pregunta con claridad y confianza.
                </p>
                <QuestionForm onSubmit={handleQuestionSubmit} suggestions={spread.suggestions || []} />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-mystic-text/80 mb-10 text-base leading-relaxed font-serif tracking-wide">
                  Esta tirada no requiere pregunta específica. Las cartas hablarán por sí solas.
                </p>
                <button
                  onClick={handleNoQuestion}
                  className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                             bg-gradient-to-r from-mystic-purple to-mystic-violet
                             hover:from-purple-700 hover:to-violet-700
                             text-mystic-text border border-mystic-border/60
                             transition-all duration-300 hover:shadow-xl hover:shadow-mystic-purple/40
                             hover:-translate-y-0.5"
                >
                  🃏 Revelar las Cartas
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: reveal */}
        {step === 'reveal' && (
          <div>
            <SpreadLayout
              cards={drawnCards}
              revealedCount={revealedCount}
              spread={spread}
            />
            {allFlipped && (
              <div className="text-center mt-10">
                <p className="text-mystic-muted/60 text-sm mb-5 italic font-serif tracking-wide">
                  Las cartas han hablado. ¿Deseas conocer su mensaje?
                </p>
                <button
                  onClick={handleConsult}
                  disabled={consulting}
                  className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                             bg-gradient-to-r from-mystic-purple via-purple-800 to-mystic-violet
                             hover:from-purple-700 hover:to-violet-700
                             text-mystic-text border border-mystic-gold/30
                             transition-all duration-300 hover:shadow-2xl hover:shadow-mystic-gold/20
                             hover:-translate-y-0.5 animate-glow
                             disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {consulting
                    ? <span className="flex items-center gap-3 justify-center">
                        <span className="flex items-center gap-[3px]" aria-hidden="true">
                          {[0.35,0.70,1,0.55,0.85,0.45,0.65,0.30,0.75].map((h, i) => (
                            <span key={i} className="w-[3px] rounded-full bg-mystic-gold/70 animate-waveform origin-center inline-block"
                              style={{ height: `${Math.round(h*12)}px`, animationDelay: `${(i*0.09).toFixed(2)}s` }} />
                          ))}
                        </span>
                        Consultando…
                      </span>
                    : '🔮 Consultar a la Pitonisa'
                  }
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: reading */}
        {step === 'reading' && (
          <div>
            <SpreadLayout
              cards={drawnCards}
              revealedCount={drawnCards.length}
              spread={spread}
            />

            {/* Divider */}
            <div className="flex items-center gap-4 my-10">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-gold/30" />
              <span className="text-mystic-gold/70 text-sm tracking-[0.3em] uppercase">La Lectura</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-gold/30" />
            </div>

            <OracleResponse onNewReading={handleNewReading} spreadId={spreadId} />
          </div>
        )}
      </main>
    </div>
  )
}
