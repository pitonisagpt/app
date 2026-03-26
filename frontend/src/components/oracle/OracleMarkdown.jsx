/**
 * OracleMarkdown — renders Claude's streaming text as beautiful mystic prose.
 *
 * Handles whatever markdown Claude produces (even after system-prompt instructions):
 *   **bold**   → gold accent text
 *   *italic*   → poetic italic
 *   ---        → ornamental divider
 *   # / ##     → styled section title (stripped of # prefix)
 *   SÍ/NO/TAL VEZ as standalone paragraph → large verdict display
 *   plain text → flowing mystic paragraph
 */

// ── Inline formatter ─────────────────────────────────────────────────────────
// Converts **bold** and *italic* markers into styled spans within a single string.
function InlineText({ text }) {
  const parts = []
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Plain text before this match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[0].startsWith('**')) {
      // **bold** → gold accent
      parts.push(
        <strong
          key={match.index}
          className="font-semibold"
          style={{ color: '#e8c97e' }}
        >
          {match[2]}
        </strong>
      )
    } else {
      // *italic* → poetic italic, slightly muted
      parts.push(
        <em
          key={match.index}
          className="italic"
          style={{ color: 'rgba(226,217,243,0.80)' }}
        >
          {match[3]}
        </em>
      )
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return <>{parts}</>
}

// ── Block classifier ─────────────────────────────────────────────────────────
function classifyBlock(raw) {
  const text = raw.trim()

  if (!text) return null

  // Horizontal rule
  if (/^(-{3,}|\*{3,}|_{3,})$/.test(text)) {
    return { type: 'divider' }
  }

  // Headings — strip the # prefix and treat as a section title
  const headingMatch = text.match(/^#{1,3}\s+(.+)/)
  if (headingMatch) {
    // Remove any leading emoji that Claude likes to add to headings
    return { type: 'heading', content: headingMatch[1] }
  }

  // Verdict line (yes/no spreads) — standalone SÍ / SI / NO / TAL VEZ
  if (/^(SÍ|SI|NO|TAL\s+VEZ)[.!]?$/i.test(text)) {
    return { type: 'verdict', content: text.replace(/[.!]$/, '').toUpperCase() }
  }

  return { type: 'paragraph', content: text }
}

// ── Styled block renderers ────────────────────────────────────────────────────
function OracleDivider() {
  return (
    <div className="flex items-center gap-3 my-1" aria-hidden="true">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-mystic-gold/25" />
      <span className="text-mystic-gold/35 text-[11px] tracking-[0.4em]">✦ ✦ ✦</span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-mystic-gold/25" />
    </div>
  )
}

function OracleHeading({ content }) {
  return (
    <h3
      className="font-display text-mystic-gold/85 text-base tracking-[0.18em] uppercase text-center animate-fadeIn"
      style={{ textShadow: '0 0 20px rgba(201,168,76,0.3)' }}
    >
      <InlineText text={content} />
    </h3>
  )
}

const VERDICT_STYLES = {
  'SÍ':      { color: '#86efac', glow: 'rgba(134,239,172,0.35)' }, // green
  'SI':      { color: '#86efac', glow: 'rgba(134,239,172,0.35)' },
  'NO':      { color: '#fca5a5', glow: 'rgba(252,165,165,0.35)' }, // red
  'TAL VEZ': { color: '#e8c97e', glow: 'rgba(232,201,126,0.35)' }, // gold
}

function OracleVerdict({ content }) {
  const style = VERDICT_STYLES[content] || VERDICT_STYLES['TAL VEZ']
  return (
    <div className="text-center py-4 animate-fadeIn">
      <span
        className="font-display text-5xl font-bold tracking-[0.25em]"
        style={{
          color: style.color,
          textShadow: `0 0 30px ${style.glow}, 0 0 60px ${style.glow}`,
        }}
      >
        {content}
      </span>
    </div>
  )
}

function OracleParagraph({ content, isLast, isStreaming }) {
  return (
    <p className="text-mystic-text leading-[1.9] font-sans text-[15.5px] tracking-wide animate-fadeInUp"
       style={{ animationFillMode: 'both' }}>
      <InlineText text={content} />
      {isLast && isStreaming && (
        <span
          className="inline-block w-[2px] h-[0.9em] ml-[3px] bg-mystic-gold/85 align-middle animate-blink rounded-sm"
          aria-hidden="true"
        />
      )}
    </p>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function OracleMarkdown({ text, isStreaming }) {
  const rawBlocks = text.split(/\n\n+/)
  const blocks = rawBlocks.map(classifyBlock).filter(Boolean)

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const isLast = i === blocks.length - 1

        if (block.type === 'divider') {
          return <OracleDivider key={i} />
        }
        if (block.type === 'heading') {
          return <OracleHeading key={i} content={block.content} />
        }
        if (block.type === 'verdict') {
          return <OracleVerdict key={i} content={block.content} />
        }
        return (
          <OracleParagraph
            key={i}
            content={block.content}
            isLast={isLast}
            isStreaming={isStreaming}
          />
        )
      })}
    </div>
  )
}
