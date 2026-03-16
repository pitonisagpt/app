/**
 * OraclePulse — animated cycling text loader.
 * Replaces boring dots with mystical rotating messages.
 * Usage: <OraclePulse messages={MY_MESSAGES} />
 */
import { useState, useEffect } from 'react'

export const PULSE_MESSAGES = {
  insight: [
    { icon: '🔮', text: 'La Pitonisa contempla los astros...' },
    { icon: '✨', text: 'Los arquetipos despiertan en el cosmos...' },
    { icon: '🌙', text: 'El velo se levanta lentamente...' },
    { icon: '⭐', text: 'Las estrellas descifran su mensaje...' },
    { icon: '🕯️', text: 'La llama del oráculo ilumina...' },
  ],
  planets: [
    { icon: '🪐', text: 'Calculando posiciones planetarias...' },
    { icon: '☀️', text: 'El Sol revela tu propósito...' },
    { icon: '🌙', text: 'La Luna expone tu mundo interior...' },
    { icon: '✨', text: 'Los planetas alinean su energía...' },
    { icon: '🔭', text: 'La cámara celeste enfoca tu carta...' },
  ],
  hero: [
    { icon: '✨', text: 'Descifrando tu signo...' },
    { icon: '🔮', text: 'Los arquetipos cobran vida...' },
    { icon: '🌌', text: 'El cosmos revela tu esencia...' },
    { icon: '⭐', text: 'La Pitonisa lee tu firma astral...' },
  ],
}

export default function OraclePulse({ messages = PULSE_MESSAGES.insight, interval = 1900, compact = false }) {
  const [idx, setIdx] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIdx(i => (i + 1) % messages.length)
      setKey(k => k + 1)
    }, interval)
    return () => clearInterval(id)
  }, [messages, interval])

  const msg = messages[idx]

  if (compact) {
    return (
      <div key={key} className="flex items-center gap-1.5 animate-fadeIn">
        <span className="text-xs select-none leading-none">{msg.icon}</span>
        <span className="text-mystic-muted/55 text-[11px] font-sans italic tracking-wide">
          {msg.text}
        </span>
      </div>
    )
  }

  return (
    <div key={key} className="flex items-center gap-2 py-0.5 animate-fadeIn">
      <span className="text-base select-none leading-none">{msg.icon}</span>
      <span className="text-mystic-muted/65 text-xs font-sans italic tracking-wide">
        {msg.text}
      </span>
    </div>
  )
}
