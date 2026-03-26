import { useState } from 'react'

const CARD_GRADIENTS = [
  ['#1a1040', '#2d1b69'],
  ['#1a0a2e', '#3b1255'],
  ['#0d1f3c', '#1a3a6e'],
  ['#1a0a0a', '#4a1515'],
  ['#0a1a0a', '#1a3a1a'],
  ['#1a1500', '#3d3000'],
  ['#0d0d30', '#1a1a55'],
]

function CardFront({ card, isReversed, grad }) {
  const [imgError, setImgError] = useState(false)
  const hasImage = card?.id !== undefined && !imgError

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-1.5 p-2 relative
                  ${isReversed ? 'rotate-180' : ''}`}
      style={{ background: hasImage ? '#0a0a1a' : `linear-gradient(160deg, ${grad[0]}, ${grad[1]})` }}
    >
      {/* Inner gold border */}
      <div className="absolute inset-1 rounded-lg border border-mystic-gold/20 pointer-events-none z-10" />

      {hasImage ? (
        <>
          <img
            src={`/cards/${card.id}.png`}
            alt={card.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            style={{ objectPosition: 'center top' }}
          />
          {/* Name overlay at bottom */}
          <div className="absolute bottom-0 inset-x-0 z-10 px-1.5 pb-1.5 pt-4 rounded-b-xl"
               style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 60%, transparent)' }}>
            <span className="block text-[9px] text-mystic-accent/95 text-center font-semibold leading-tight tracking-wide">
              {card?.name}
            </span>
            {isReversed && (
              <span className="block text-center mt-0.5">
                <span className="text-[7px] text-mystic-gold/70 border border-mystic-gold/40 bg-black/40 px-1.5 py-0.5 rounded-full tracking-widest uppercase">
                  inv
                </span>
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <span className="text-4xl leading-none drop-shadow-lg">{card?.symbol}</span>
          <span className="text-[9px] text-mystic-accent/90 text-center font-semibold leading-tight tracking-wide px-1">
            {card?.name}
          </span>
          {isReversed && (
            <span className="text-[7px] text-mystic-gold/60 border border-mystic-gold/30 bg-black/30 px-1.5 py-0.5 rounded-full tracking-widest uppercase">
              inv
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default function CardDisplay({ card, isRevealed, isReversed, position, index = 0 }) {
  const grad = CARD_GRADIENTS[index % CARD_GRADIENTS.length]

  return (
    <div className="flex flex-col items-center gap-2">
      {position && (
        <span className="text-[9px] text-mystic-muted/70 uppercase tracking-[0.2em] text-center font-medium">
          {position}
        </span>
      )}

      <div className="card-container" style={{ width: '100px', height: '160px' }}>
        <div className={`card-inner ${isRevealed ? 'flipped' : ''}`}>

          {/* Card back */}
          <div className="card-face card-back w-full h-full rounded-xl border border-mystic-border/80 overflow-hidden shadow-lg">
            <div className="w-full h-full flex items-center justify-center relative"
                 style={{ background: 'linear-gradient(145deg, #12122a, #1a1040)' }}>
              <svg viewBox="0 0 100 160" className="absolute inset-0 w-full h-full">
                <defs>
                  <radialGradient id="backGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#c9a84c" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#c9a84c" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect width="100" height="160" fill="url(#backGlow)" />
                <rect x="5" y="5" width="90" height="150" rx="6" fill="none" stroke="#c9a84c" strokeOpacity="0.25" strokeWidth="1" />
                <rect x="9" y="9" width="82" height="142" rx="4" fill="none" stroke="#c9a84c" strokeOpacity="0.12" strokeWidth="0.5" />
                {[...Array(9)].map((_, i) => (
                  <text key={i} x={(i % 3) * 30 + 20} y={Math.floor(i / 3) * 45 + 35}
                        fontSize="12" textAnchor="middle" fill="#c9a84c" opacity="0.35">✦</text>
                ))}
              </svg>
              <div className="relative z-10 text-center">
                <div className="text-3xl mb-1 opacity-90">🔮</div>
                <div className="w-8 h-px bg-mystic-gold/50 mx-auto" />
              </div>
            </div>
          </div>

          {/* Card front */}
          <div className="card-face card-front w-full h-full rounded-xl overflow-hidden shadow-xl"
               style={{ border: '1px solid rgba(201,168,76,0.5)' }}>
            <CardFront card={card} isReversed={isReversed} grad={grad} />
          </div>

        </div>
      </div>
    </div>
  )
}
