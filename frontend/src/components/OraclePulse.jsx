import { useState, useEffect } from 'react'
import Waveform from './Waveform'

export const PULSE_MESSAGES = {
  insight: [
    'La Pitonisa contempla los astros...',
    'El velo se levanta lentamente...',
    'Las estrellas descifran su mensaje...',
    'La llama del oráculo ilumina...',
    'Los arquetipos despiertan en silencio...',
    'La conciencia cósmica se enfoca...',
    'El espejo del alma refleja la verdad...',
    'Los símbolos ancianos cobran voz...',
    'La intuición teje su respuesta...',
    'El tiempo se detiene para revelar...',
  ],
  planets: [
    'Calculando posiciones planetarias...',
    'El Sol revela tu propósito de vida...',
    'Los planetas alinean su energía...',
    'La Luna expone tu mundo interior...',
    'Mercurio descifra tu forma de pensar...',
    'Venus traza el mapa de tu corazón...',
    'Saturno pesa tus lecciones pendientes...',
    'Júpiter señala tu camino de expansión...',
    'Plutón toca las profundidades del alma...',
    'El Ascendente dibuja tu máscara real...',
  ],
  hero: [
    'Descifrando tu signo solar...',
    'Los arquetipos cobran vida...',
    'La Pitonisa lee tu firma astral...',
    'Tu Luna revela el mundo que nadie ve...',
    'El cosmos reconoce tu patrón único...',
    'La carta se abre como un mapa del alma...',
  ],
}

export default function OraclePulse({ messages = PULSE_MESSAGES.insight, interval = 1900, compact = false }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % messages.length), interval)
    return () => clearInterval(id)
  }, [messages, interval])

  return (
    <Waveform
      label={typeof messages[idx] === 'object' ? messages[idx].text : messages[idx]}
      className={compact ? '' : 'py-0.5'}
    />
  )
}
