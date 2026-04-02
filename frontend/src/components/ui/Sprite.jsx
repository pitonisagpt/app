/**
 * Sprite — renders an element from the tarot spritesheet.
 *
 * Usage:
 *   <Sprite name="cat-meditating" />
 *   <Sprite name="infinity-blue" className="opacity-70" />
 *   <Sprite name="moon-stars" style={{ transform: 'scale(0.8)' }} />
 */
export default function Sprite({ name, className = '', style = {}, ...props }) {
  return (
    <div
      className={`tarot-asset ${name} ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  )
}

/** Full-width ornamental divider */
export function LeafDivider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-3 w-full ${className}`}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mystic-gold/30 to-mystic-gold/50" />
      <Sprite name="infinity-blue" className="opacity-50" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-mystic-gold/30 to-mystic-gold/50" />
    </div>
  )
}

/** Centered infinity symbol */
export function InfinitySymbol({ className = '' }) {
  return <Sprite name="infinity-blue" className={className} />
}
