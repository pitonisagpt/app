import React from 'react'
import CardDisplay from './CardDisplay'

// Defined outside SpreadLayout so React doesn't remount it on every parent re-render
// (caused flickering/re-animation during streaming)
const CardSlot = React.memo(function CardSlot({ card, isRevealed, position, index }) {
  return (
    <CardDisplay
      card={card}
      isRevealed={isRevealed}
      isReversed={card?.reversed}
      position={position}
      index={index}
    />
  )
})

export default function SpreadLayout({ cards, revealedCount, spread }) {
  const count = spread.cardCount

  function slot(i) {
    return (
      <CardSlot
        key={i}
        card={cards[i]}
        isRevealed={i < revealedCount}
        position={spread.positions[i]}
        index={i}
      />
    )
  }

  // 1 card — centered
  if (count === 1) {
    return <div className="flex justify-center py-4">{slot(0)}</div>
  }

  // 2 cards — side by side
  if (count === 2) {
    return (
      <div className="flex justify-center gap-8 py-4">
        {slot(0)}{slot(1)}
      </div>
    )
  }

  // 3 cards — row
  if (count === 3) {
    return (
      <div className="flex justify-center gap-6 py-4 flex-wrap">
        {slot(0)}{slot(1)}{slot(2)}
      </div>
    )
  }

  // 5 cards — cross layout
  if (count === 5) {
    return (
      <div className="py-4">
        <div className="flex justify-center gap-6 mb-4">{slot(0)}{slot(1)}</div>
        <div className="flex justify-center mb-4">{slot(2)}</div>
        <div className="flex justify-center gap-6">{slot(3)}{slot(4)}</div>
      </div>
    )
  }

  // 6 cards — 2×3 grid
  if (count === 6) {
    return (
      <div className="py-4">
        <div className="flex justify-center gap-4 mb-4">{slot(0)}{slot(1)}{slot(2)}</div>
        <div className="flex justify-center gap-4">{slot(3)}{slot(4)}{slot(5)}</div>
      </div>
    )
  }

  // Fallback — wrap
  return (
    <div className="flex flex-wrap justify-center gap-4 py-4">
      {Array.from({ length: count }, (_, i) => slot(i))}
    </div>
  )
}
