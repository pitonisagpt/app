/**
 * Waveform — animated gold bars that indicate the oracle is speaking/generating.
 * Use anywhere a streaming/loading indicator is needed.
 */
const BARS = [0.35, 0.70, 1, 0.55, 0.85, 0.45, 0.65, 0.30, 0.75]

export default function Waveform({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="status" aria-label={label || 'Generando respuesta'}>
      <div className="flex items-center gap-[3px]" aria-hidden="true">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="w-[3px] rounded-full bg-mystic-gold/55 animate-waveform origin-center"
            style={{
              height: `${Math.round(h * 14)}px`,
              animationDelay: `${(i * 0.09).toFixed(2)}s`,
            }}
          />
        ))}
      </div>
      {label && (
        <span className="text-mystic-muted/50 text-[11px] font-sans italic tracking-wide">
          {label}
        </span>
      )}
    </div>
  )
}
