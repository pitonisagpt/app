import CardDisplay from './CardDisplay'

export default function SpreadLayout({ cards, revealedCount, spread }) {
  const count = spread.cardCount

  function CardSlot({ index }) {
    const card = cards[index]
    const isRevealed = index < revealedCount
    return (
      <CardDisplay
        key={index}
        card={card}
        isRevealed={isRevealed}
        isReversed={card?.reversed}
        position={spread.positions[index]}
        index={index}
      />
    )
  }

  // 1 card — centered
  if (count === 1) {
    return (
      <div className="flex justify-center py-4">
        <CardSlot index={0} />
      </div>
    )
  }

  // 2 cards — side by side
  if (count === 2) {
    return (
      <div className="flex justify-center gap-8 py-4">
        <CardSlot index={0} />
        <CardSlot index={1} />
      </div>
    )
  }

  // 3 cards — row
  if (count === 3) {
    return (
      <div className="flex justify-center gap-6 py-4 flex-wrap">
        <CardSlot index={0} />
        <CardSlot index={1} />
        <CardSlot index={2} />
      </div>
    )
  }

  // 5 cards — cross layout
  if (count === 5) {
    return (
      <div className="py-4">
        {/* Top row */}
        <div className="flex justify-center gap-6 mb-4">
          <CardSlot index={0} />
          <CardSlot index={1} />
        </div>
        {/* Center */}
        <div className="flex justify-center mb-4">
          <CardSlot index={2} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-center gap-6">
          <CardSlot index={3} />
          <CardSlot index={4} />
        </div>
      </div>
    )
  }

  // 6 cards — Celtic cross
  if (count === 6) {
    return (
      <div className="py-4">
        {/* Top row */}
        <div className="flex justify-center gap-4 mb-4">
          <CardSlot index={0} />
          <CardSlot index={1} />
          <CardSlot index={2} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-center gap-4">
          <CardSlot index={3} />
          <CardSlot index={4} />
          <CardSlot index={5} />
        </div>
      </div>
    )
  }

  // Fallback — wrap
  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      {Array.from({ length: count }, (_, i) => (
        <CardSlot key={i} index={i} />
      ))}
    </div>
  )
}
