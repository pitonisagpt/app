import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import StarField from '../components/StarField'
import CardDisplay from '../components/CardDisplay'
import ModuleResult from '../components/ModuleResult'
import { useModuleStream } from '../hooks/useModuleStream'

// ── Full deck (78 cards) ─────────────────────────────────────────────────────
const MAJOR_ARCANA = [
  { name: 'El Loco', symbol: '🃏' }, { name: 'El Mago', symbol: '🔮' },
  { name: 'La Sacerdotisa', symbol: '🌙' }, { name: 'La Emperatriz', symbol: '🌸' },
  { name: 'El Emperador', symbol: '👑' }, { name: 'El Sumo Sacerdote', symbol: '⛪' },
  { name: 'Los Enamorados', symbol: '💑' }, { name: 'El Carro', symbol: '🏆' },
  { name: 'La Justicia', symbol: '⚖️' }, { name: 'El Ermitaño', symbol: '🕯️' },
  { name: 'La Rueda de la Fortuna', symbol: '☸️' }, { name: 'La Fuerza', symbol: '🦁' },
  { name: 'El Colgado', symbol: '🙃' }, { name: 'La Muerte', symbol: '🌑' },
  { name: 'La Templanza', symbol: '🌊' }, { name: 'El Diablo', symbol: '🔗' },
  { name: 'La Torre', symbol: '⚡' }, { name: 'La Estrella', symbol: '⭐' },
  { name: 'La Luna', symbol: '🌕' }, { name: 'El Sol', symbol: '☀️' },
  { name: 'El Juicio', symbol: '📯' }, { name: 'El Mundo', symbol: '🌍' },
]
const MINOR_ARCANA = [
  ...['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballo','Reina','Rey']
    .map(n => ({ name: `${n} de Bastos`, symbol: '🌿' })),
  ...['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballo','Reina','Rey']
    .map(n => ({ name: `${n} de Copas`, symbol: '🍷' })),
  ...['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballo','Reina','Rey']
    .map(n => ({ name: `${n} de Espadas`, symbol: '⚔️' })),
  ...['As','Dos','Tres','Cuatro','Cinco','Seis','Siete','Ocho','Nueve','Diez','Sota','Caballo','Reina','Rey']
    .map(n => ({ name: `${n} de Pentáculos`, symbol: '🪙' })),
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

function drawCards() {
  return [...ALL_CARDS].sort(() => Math.random() - 0.5).slice(0, 5).map((card, i) => ({
    ...card, position: POSICIONES[i], reversed: Math.random() < 0.33,
  }))
}

export default function VolveraEx() {
  const navigate = useNavigate()
  const { text, isStreaming, error, stream, reset } = useModuleStream()

  const [step, setStep]           = useState('form')   // form | cards | reading
  const [cards, setCards]         = useState([])
  const [revealedCount, setRevealed] = useState(0)
  const [form, setForm]           = useState({
    nombre: '', ex_nombre: '', tiempo: '', razon: '', contacto: '',
  })

  function handleFormSubmit(e) {
    e.preventDefault()
    const drawn = drawCards()
    setCards(drawn)
    setStep('cards')
    setRevealed(0)
    let i = 0
    const iv = setInterval(() => {
      i += 1
      setRevealed(i)
      if (i >= drawn.length) clearInterval(iv)
    }, 500)
  }

  async function handleConsult() {
    await stream('/api/volvera-ex', {
      nombre:    form.nombre,
      ex_nombre: form.ex_nombre,
      tiempo:    form.tiempo,
      razon:     form.razon,
      contacto:  form.contacto,
      cards:     cards.map(c => ({ name: c.name, symbol: c.symbol, position: c.position, reversed: c.reversed })),
    })
    setStep('reading')
  }

  function handleReset() {
    reset()
    setStep('form')
    setCards([])
    setRevealed(0)
    setForm({ nombre: '', ex_nombre: '', tiempo: '', razon: '', contacto: '' })
  }

  const allRevealed = revealedCount >= 5

  return (
    <div className="min-h-screen bg-mystic-bg relative overflow-hidden">
      <StarField count={80} />
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-900/8 rounded-full blur-3xl pointer-events-none" />
      <Navbar />

      <main className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full bg-rose-500/15 blur-xl scale-125 animate-glow" />
            <div className="text-5xl relative">💔</div>
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
        </div>

        {/* Step: form */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="space-y-5 max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Tu nombre</label>
                <input required maxLength={60} value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                  className="w-full bg-mystic-surface/60 border border-mystic-border/60 rounded-xl px-4 py-2.5 text-mystic-text text-sm placeholder:text-mystic-muted/40 focus:outline-none focus:border-rose-400/50"
                  placeholder="Tu nombre" />
              </div>
              <div>
                <label className="block text-mystic-muted/70 text-xs tracking-widest uppercase mb-1.5">Su nombre</label>
                <input required maxLength={60} value={form.ex_nombre}
                  onChange={e => setForm(f => ({ ...f, ex_nombre: e.target.value }))}
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

        {/* Step: cards */}
        {step === 'cards' && (
          <div>
            <div className="flex flex-wrap justify-center gap-4 py-4">
              {cards.map((card, i) => (
                <CardDisplay key={i} card={card} isRevealed={i < revealedCount}
                             isReversed={card.reversed} position={card.position} index={i} />
              ))}
            </div>
            {allRevealed && (
              <div className="text-center mt-10">
                <p className="text-mystic-muted/60 text-sm mb-5 italic font-serif tracking-wide">
                  Las cartas han hablado. ¿Deseas conocer su mensaje?
                </p>
                <button onClick={handleConsult}
                  className="py-3.5 px-12 rounded-xl font-semibold tracking-[0.15em] uppercase text-sm
                             bg-gradient-to-r from-rose-800 via-pink-800 to-rose-700
                             text-mystic-text border border-rose-600/30
                             transition-all duration-300 hover:shadow-2xl hover:shadow-rose-900/20 hover:-translate-y-0.5 animate-glow">
                  🔮 Consultar a la Pitonisa
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: reading */}
        {step === 'reading' && (
          <div>
            <div className="flex flex-wrap justify-center gap-4 py-4 mb-8">
              {cards.map((card, i) => (
                <CardDisplay key={i} card={card} isRevealed={true}
                             isReversed={card.reversed} position={card.position} index={i} />
              ))}
            </div>
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-rose-400/30" />
              <span className="text-rose-400/70 text-sm tracking-[0.3em] uppercase">La Lectura</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-rose-400/30" />
            </div>
            <ModuleResult text={text} isStreaming={isStreaming} error={error} onReset={handleReset} />
          </div>
        )}
      </main>
    </div>
  )
}
