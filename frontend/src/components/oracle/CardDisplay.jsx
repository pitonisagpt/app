import { useState } from 'react'

const CARD_GRADIENTS = [
  ['#C4B4E0', '#E8D8C8'],
  ['#D4C8F0', '#EDE0D0'],
  ['#B8C8E8', '#D8E0F0'],
  ['#E8C8C8', '#F0D8D8'],
  ['#C8E0C8', '#D8EDD8'],
  ['#E8D8B8', '#F0E8CC'],
  ['#C4B4E0', '#D8D0F0'],
]

function CardFront({ card, isReversed, grad }) {
  const [imgError, setImgError] = useState(false)
  const hasImage = card?.id !== undefined && !imgError

  return (
    <div
      className={`w-full h-full flex flex-col items-center justify-center gap-2 p-2 relative
                  ${isReversed ? 'rotate-180' : ''}`}
      style={{ background: hasImage ? '#E8D8C8' : `linear-gradient(160deg, ${grad[0]}, ${grad[1]})` }}
    >
      {/* Inner border */}
      <div className="absolute inset-1.5 rounded-lg border border-mystic-gold/25 pointer-events-none z-10" />

      {hasImage ? (
        <>
          <img
            src={`/cards/${card.id}.png`}
            alt={card.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            style={{ objectPosition: 'center top' }}
          />
          <div className="absolute bottom-0 inset-x-0 z-10 px-2 pb-2 pt-6 rounded-b-xl"
               style={{ background: 'linear-gradient(to top, rgba(46,60,20,0.82) 60%, transparent)' }}>
            <span className="block text-sm text-mystic-accent/95 text-center font-semibold leading-tight tracking-wide">
              {card?.name}
            </span>
            {isReversed && (
              <span className="block text-center mt-1">
                <span className="text-[10px] text-mystic-gold/80 border border-mystic-gold/50 bg-mystic-card/70 px-2 py-0.5 rounded-full tracking-widest uppercase">
                  invertida
                </span>
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <span className="text-7xl leading-none drop-shadow-lg">{card?.symbol}</span>
          <span className="text-sm text-mystic-accent/90 text-center font-semibold leading-tight tracking-wide px-2">
            {card?.name}
          </span>
          {isReversed && (
            <span className="text-[10px] text-mystic-gold/70 border border-mystic-gold/35 bg-mystic-card/60 px-2 py-0.5 rounded-full tracking-widest uppercase">
              invertida
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default function CardDisplay({ card, isRevealed, isReversed, position, index = 0, size = 'md' }) {
  const grad = CARD_GRADIENTS[index % CARD_GRADIENTS.length]
  const w = size === 'lg' ? 260 : 100
  const h = size === 'lg' ? 420 : 160

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="card-container" style={{ width: `${w}px`, height: `${h}px` }}>
        <div className={`card-inner ${isRevealed ? 'flipped' : ''}`}>

          {/* Card back */}
          <div className="card-face card-back w-full h-full rounded-xl overflow-hidden"
               style={{ boxShadow: '0 4px 20px rgba(91,107,224,0.15), 0 2px 8px rgba(46,60,20,0.10)' }}>
            <img
              src="/cards/back.png"
              alt="Pytonia"
              className="w-full h-full object-cover select-none"
            />
          </div>

          {/* Card front */}
          <div className="card-face card-front w-full h-full rounded-xl overflow-hidden"
               style={{ border: '1px solid rgba(91,107,224,0.45)', boxShadow: '0 8px 28px rgba(91,107,224,0.18), 0 2px 8px rgba(46,60,20,0.10)' }}>
            <CardFront card={card} isReversed={isReversed} grad={grad} />
          </div>

        </div>
      </div>

      {position && (
        <span className="text-[11px] text-mystic-muted/60 uppercase tracking-[0.18em] text-center font-sans leading-tight max-w-[240px]">
          {position}
        </span>
      )}
    </div>
  )
}
