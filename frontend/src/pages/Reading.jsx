import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SPREADS } from '../data/spreads'
import { useSession } from '../context/SessionContext'
import { useStreaming } from '../hooks/useStreaming'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import SpreadLayout from '../components/SpreadLayout'
import QuestionForm from '../components/QuestionForm'
import OracleResponse from '../components/OracleResponse'

const MAJOR_ARCANA = [
  { name: 'El Loco', symbol: '🃏' },
  { name: 'El Mago', symbol: '🔮' },
  { name: 'La Sacerdotisa', symbol: '🌙' },
  { name: 'La Emperatriz', symbol: '🌸' },
  { name: 'El Emperador', symbol: '👑' },
  { name: 'El Sumo Sacerdote', symbol: '⛪' },
  { name: 'Los Enamorados', symbol: '💑' },
  { name: 'El Carro', symbol: '🏆' },
  { name: 'La Justicia', symbol: '⚖️' },
  { name: 'El Ermitaño', symbol: '🕯️' },
  { name: 'La Rueda de la Fortuna', symbol: '☸️' },
  { name: 'La Fuerza', symbol: '🦁' },
  { name: 'El Colgado', symbol: '🙃' },
  { name: 'La Muerte', symbol: '🌑' },
  { name: 'La Templanza', symbol: '🌊' },
  { name: 'El Diablo', symbol: '🔗' },
  { name: 'La Torre', symbol: '⚡' },
  { name: 'La Estrella', symbol: '⭐' },
  { name: 'La Luna', symbol: '🌕' },
  { name: 'El Sol', symbol: '☀️' },
  { name: 'El Juicio', symbol: '📯' },
  { name: 'El Mundo', symbol: '🌍' },
]

const MINOR_ARCANA = [
  // Bastos
  { name: 'As de Bastos', symbol: '🌿' },
  { name: 'Dos de Bastos', symbol: '🌿' },
  { name: 'Tres de Bastos', symbol: '🌿' },
  { name: 'Cuatro de Bastos', symbol: '🌿' },
  { name: 'Cinco de Bastos', symbol: '🌿' },
  { name: 'Seis de Bastos', symbol: '🌿' },
  { name: 'Siete de Bastos', symbol: '🌿' },
  { name: 'Ocho de Bastos', symbol: '🌿' },
  { name: 'Nueve de Bastos', symbol: '🌿' },
  { name: 'Diez de Bastos', symbol: '🌿' },
  { name: 'Sota de Bastos', symbol: '🌿' },
  { name: 'Caballo de Bastos', symbol: '🌿' },
  { name: 'Reina de Bastos', symbol: '🌿' },
  { name: 'Rey de Bastos', symbol: '🌿' },
  // Copas
  { name: 'As de Copas', symbol: '🍷' },
  { name: 'Dos de Copas', symbol: '🍷' },
  { name: 'Tres de Copas', symbol: '🍷' },
  { name: 'Cuatro de Copas', symbol: '🍷' },
  { name: 'Cinco de Copas', symbol: '🍷' },
  { name: 'Seis de Copas', symbol: '🍷' },
  { name: 'Siete de Copas', symbol: '🍷' },
  { name: 'Ocho de Copas', symbol: '🍷' },
  { name: 'Nueve de Copas', symbol: '🍷' },
  { name: 'Diez de Copas', symbol: '🍷' },
  { name: 'Sota de Copas', symbol: '🍷' },
  { name: 'Caballo de Copas', symbol: '🍷' },
  { name: 'Reina de Copas', symbol: '🍷' },
  { name: 'Rey de Copas', symbol: '🍷' },
  // Espadas
  { name: 'As de Espadas', symbol: '⚔️' },
  { name: 'Dos de Espadas', symbol: '⚔️' },
  { name: 'Tres de Espadas', symbol: '⚔️' },
  { name: 'Cuatro de Espadas', symbol: '⚔️' },
  { name: 'Cinco de Espadas', symbol: '⚔️' },
  { name: 'Seis de Espadas', symbol: '⚔️' },
  { name: 'Siete de Espadas', symbol: '⚔️' },
  { name: 'Ocho de Espadas', symbol: '⚔️' },
  { name: 'Nueve de Espadas', symbol: '⚔️' },
  { name: 'Diez de Espadas', symbol: '⚔️' },
  { name: 'Sota de Espadas', symbol: '⚔️' },
  { name: 'Caballo de Espadas', symbol: '⚔️' },
  { name: 'Reina de Espadas', symbol: '⚔️' },
  { name: 'Rey de Espadas', symbol: '⚔️' },
  // Pentáculos
  { name: 'As de Pentáculos', symbol: '🪙' },
  { name: 'Dos de Pentáculos', symbol: '🪙' },
  { name: 'Tres de Pentáculos', symbol: '🪙' },
  { name: 'Cuatro de Pentáculos', symbol: '🪙' },
  { name: 'Cinco de Pentáculos', symbol: '🪙' },
  { name: 'Seis de Pentáculos', symbol: '🪙' },
  { name: 'Siete de Pentáculos', symbol: '🪙' },
  { name: 'Ocho de Pentáculos', symbol: '🪙' },
  { name: 'Nueve de Pentáculos', symbol: '🪙' },
  { name: 'Diez de Pentáculos', symbol: '🪙' },
  { name: 'Sota de Pentáculos', symbol: '🪙' },
  { name: 'Caballo de Pentáculos', symbol: '🪙' },
  { name: 'Reina de Pentáculos', symbol: '🪙' },
  { name: 'Rey de Pentáculos', symbol: '🪙' },
]

const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA]

function drawCards(spread) {
  const shuffled = [...ALL_CARDS].sort(() => Math.random() - 0.5)
  return spread.positions.map((position, i) => ({
    ...shuffled[i],
    position,
    reversed: Math.random() < 0.33,
  }))
}

export default function Reading() {
  const { spreadId } = useParams()
  const navigate = useNavigate()
  const spread = SPREADS[spreadId]

  const {
    step, setStep,
    question, setQuestion,
    drawnCards, setDrawnCards,
    setCurrentSpread,
    resetReading,
  } = useSession()

  const { startReading } = useStreaming()
  const [revealedCount, setRevealedCount] = useState(0)

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
    const cards = drawCards(spread)
    setDrawnCards(cards)
    setStep('reveal')
  }

  function handleNoQuestion() {
    const cards = drawCards(spread)
    setDrawnCards(cards)
    setStep('reveal')
  }

  async function handleConsult() {
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
                <QuestionForm onSubmit={handleQuestionSubmit} />
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
                  className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                             bg-gradient-to-r from-mystic-purple via-purple-800 to-mystic-violet
                             hover:from-purple-700 hover:to-violet-700
                             text-mystic-text border border-mystic-gold/30
                             transition-all duration-300 hover:shadow-2xl hover:shadow-mystic-gold/20
                             hover:-translate-y-0.5 animate-glow"
                >
                  🔮 Consultar a la Pitonisa
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

            <OracleResponse onNewReading={handleNewReading} />
          </div>
        )}
      </main>
    </div>
  )
}
