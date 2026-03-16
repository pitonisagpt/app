/**
 * ChartWheel.jsx — SVG natal chart wheel
 *
 * Coordinate system:
 *  - ASC is fixed at the LEFT (180° in standard SVG polar coords).
 *  - Zodiac runs COUNTER-CLOCKWISE (as in real astrology charts).
 *  - Formula: svgAngleDeg = 180 - angleFromAsc
 *             x = CX + R * cos(rad)
 *             y = CY - R * sin(rad)   ← y-flip so CCW is correct visually
 */

const CX = 200, CY = 200
const R_OUTER      = 188   // outer edge of zodiac ring
const R_ZODIAC     = 165   // inner edge of zodiac ring / outer edge of house ring
const R_HOUSES     = 148   // inner edge of house ring
const R_HOUSE_INNER = 58   // inner circle (aspect area boundary)
const R_PLANETS    = 132   // planet glyph ring
const R_ASPECT     = 92    // aspect line endpoints
const R_LABEL      = 176   // sign glyph mid-ring radius

// ── Zodiac signs ────────────────────────────────────────────────────────────

const SIGNS = [
  { name: "Aries",       symbol: "♈", color: "#e05252" },
  { name: "Taurus",      symbol: "♉", color: "#5a9c5a" },
  { name: "Gemini",      symbol: "♊", color: "#d4a017" },
  { name: "Cancer",      symbol: "♋", color: "#5a8fc2" },
  { name: "Leo",         symbol: "♌", color: "#e07c30" },
  { name: "Virgo",       symbol: "♍", color: "#6aaa6a" },
  { name: "Libra",       symbol: "♎", color: "#c25a8f" },
  { name: "Scorpio",     symbol: "♏", color: "#7a4a9c" },
  { name: "Sagittarius", symbol: "♐", color: "#d44040" },
  { name: "Capricorn",   symbol: "♑", color: "#4a7a6a" },
  { name: "Aquarius",    symbol: "♒", color: "#4a7ac2" },
  { name: "Pisces",      symbol: "♓", color: "#8a5ab0" },
]

// Planet glyphs
const GLYPHS = {
  sol:      "☉", luna:    "☽", mercurio: "☿", venus:  "♀",
  marte:    "♂", jupiter: "♃", saturno:  "♄", urano:  "⛢",
  neptuno:  "♆", pluton:  "♇", chiron:   "⚷", lilith: "⚸",
  north_node: "☊",
}

const PLANET_COLORS = {
  sol: "#f4a800", luna: "#c8c8e0", mercurio: "#a0a0ff",
  venus: "#ff80b0", marte: "#ff5050", jupiter: "#c060c0",
  saturno: "#8080c0", urano: "#40c0c0", neptuno: "#6080ff",
  pluton: "#c06060", chiron: "#80c080", lilith: "#c06080",
  north_node: "#c0a000",
}

// Aspect line colors
const ASPECT_COLORS = {
  harmonious: "#22c55e",  // green
  tense:      "#ef4444",  // red
  neutral:    "#f59e0b",  // amber
}

// ── Math helpers ─────────────────────────────────────────────────────────────

function lonToXY(lon, ascLon, radius) {
  const angleFromAsc = ((lon - ascLon) % 360 + 360) % 360
  const svgAngleDeg  = 180 - angleFromAsc
  const rad = (svgAngleDeg * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  }
}

function sectorPath(ascLon, startLon, endLon, rInner, rOuter) {
  const p1o = lonToXY(startLon, ascLon, rOuter)
  const p2o = lonToXY(endLon,   ascLon, rOuter)
  const p1i = lonToXY(startLon, ascLon, rInner)
  const p2i = lonToXY(endLon,   ascLon, rInner)
  // large-arc: each sector is 30° → never > 180° → flag = 0
  return [
    `M ${f(p1o.x)} ${f(p1o.y)}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${f(p2o.x)} ${f(p2o.y)}`,
    `L ${f(p2i.x)} ${f(p2i.y)}`,
    `A ${rInner} ${rInner} 0 0 0 ${f(p1i.x)} ${f(p1i.y)}`,
    "Z",
  ].join(" ")
}

const f = (n) => n.toFixed(2)

// ── Components ───────────────────────────────────────────────────────────────

function ZodiacRing({ ascLon }) {
  return SIGNS.map((sign, i) => {
    const startLon = i * 30        // Aries = 0°, Taurus = 30°, …
    const endLon   = startLon + 30
    const midLon   = startLon + 15
    const path = sectorPath(ascLon, startLon, endLon, R_ZODIAC, R_OUTER)
    const lp   = lonToXY(midLon, ascLon, R_LABEL)
    return (
      <g key={sign.name}>
        <path d={path} fill={sign.color} fillOpacity={0.18} stroke="#444" strokeWidth={0.4} />
        <text
          x={f(lp.x)} y={f(lp.y)}
          textAnchor="middle" dominantBaseline="central"
          fontSize={11} fill={sign.color} fontWeight="bold"
        >
          {sign.symbol}
        </text>
      </g>
    )
  })
}

function HouseLines({ ascLon, houseCusps }) {
  if (!houseCusps || houseCusps.length < 12) return null
  return houseCusps.map((lon, i) => {
    const inner = lonToXY(lon, ascLon, R_HOUSE_INNER)
    const outer = lonToXY(lon, ascLon, R_ZODIAC)
    const isAngle = [0, 3, 6, 9].includes(i)
    return (
      <line
        key={i}
        x1={f(inner.x)} y1={f(inner.y)}
        x2={f(outer.x)} y2={f(outer.y)}
        stroke={isAngle ? "#fff" : "#666"}
        strokeWidth={isAngle ? 1.2 : 0.6}
        strokeDasharray={isAngle ? undefined : "2 2"}
      />
    )
  })
}

function HouseNumbers({ ascLon, houseCusps }) {
  if (!houseCusps || houseCusps.length < 12) return null
  const R_NUM = (R_HOUSES + R_HOUSE_INNER) / 2 + 2
  return houseCusps.map((lon, i) => {
    const nextLon = houseCusps[(i + 1) % 12]
    // mid-point between two cusps (handle wrap-around)
    let mid = lon + (((nextLon - lon) % 360 + 360) % 360) / 2
    const p = lonToXY(mid, ascLon, R_NUM)
    return (
      <text
        key={i}
        x={f(p.x)} y={f(p.y)}
        textAnchor="middle" dominantBaseline="central"
        fontSize={6.5} fill="#aaa"
      >
        {i + 1}
      </text>
    )
  })
}

function AspectLines({ ascLon, planets, aspects }) {
  if (!aspects || !planets) return null
  return aspects.map((asp, idx) => {
    const p1 = planets[asp.planet1]
    const p2 = planets[asp.planet2]
    if (!p1 || !p2) return null
    const a = lonToXY(p1.abs_longitude, ascLon, R_ASPECT)
    const b = lonToXY(p2.abs_longitude, ascLon, R_ASPECT)
    const color = ASPECT_COLORS[asp.type] || "#888"
    return (
      <line
        key={idx}
        x1={f(a.x)} y1={f(a.y)}
        x2={f(b.x)} y2={f(b.y)}
        stroke={color} strokeWidth={0.7} strokeOpacity={0.6}
      />
    )
  })
}

function PlanetGlyphs({ ascLon, planets, extraPoints }) {
  const all = { ...(planets || {}), ...(extraPoints || {}) }
  // Deduplicate overlapping planets with a simple nudge
  const placed = {}
  const MIN_DEG = 8
  return Object.entries(all).map(([key, pl]) => {
    if (!pl || pl.abs_longitude == null) return null
    const glyph = GLYPHS[key]
    if (!glyph) return null

    // nudge if too close to another placed planet
    let lon = pl.abs_longitude
    Object.keys(placed).forEach((k) => {
      let diff = ((lon - placed[k]) % 360 + 360) % 360
      if (diff > 180) diff = 360 - diff
      if (diff < MIN_DEG) lon += MIN_DEG
    })
    placed[key] = lon

    const p = lonToXY(lon, ascLon, R_PLANETS)
    const color = PLANET_COLORS[key] || "#ccc"
    const retro = pl.retrograde ? " ℞" : ""
    return (
      <g key={key}>
        <circle
          cx={f(p.x)} cy={f(p.y)} r={9}
          fill="#1a1a2e" fillOpacity={0.85}
          stroke={color} strokeWidth={0.8}
        />
        <text
          x={f(p.x)} y={f(p.y)}
          textAnchor="middle" dominantBaseline="central"
          fontSize={9} fill={color}
        >
          {glyph}{retro}
        </text>
      </g>
    )
  })
}

function AngleLabels({ ascLon, midheavenLon }) {
  const asc = lonToXY(ascLon, ascLon, R_ZODIAC + 6)
  const desc = lonToXY((ascLon + 180) % 360, ascLon, R_ZODIAC + 6)
  const mc = midheavenLon != null ? lonToXY(midheavenLon, ascLon, R_ZODIAC + 6) : null
  const ic = midheavenLon != null ? lonToXY((midheavenLon + 180) % 360, ascLon, R_ZODIAC + 6) : null

  const labels = [
    { p: asc,  label: "ASC" },
    { p: desc, label: "DSC" },
    ...(mc ? [{ p: mc, label: "MC" }, { p: ic, label: "IC" }] : []),
  ]

  return labels.map(({ p, label }) => (
    <text
      key={label}
      x={f(p.x)} y={f(p.y)}
      textAnchor="middle" dominantBaseline="central"
      fontSize={7} fill="#e2e8f0" fontWeight="bold"
    >
      {label}
    </text>
  ))
}

function InnerCircle() {
  return (
    <>
      <circle cx={CX} cy={CY} r={R_HOUSE_INNER} fill="#0f0f1a" stroke="#444" strokeWidth={0.6} />
      <circle cx={CX} cy={CY} r={R_HOUSES}      fill="none"    stroke="#444" strokeWidth={0.5} />
      <circle cx={CX} cy={CY} r={R_ZODIAC}      fill="none"    stroke="#555" strokeWidth={0.7} />
      <circle cx={CX} cy={CY} r={R_OUTER}       fill="none"    stroke="#555" strokeWidth={0.7} />
    </>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function ChartWheel({ chart }) {
  if (!chart) return null

  const ascLon       = chart.ascendant_lon  ?? 0
  const midheavenLon = chart.midheaven_lon  ?? null
  const planets      = chart.planets        ?? {}
  const extraPoints  = chart.extra_points   ?? {}
  const aspects      = chart.aspects        ?? []
  const houseCusps   = chart.house_cusps    ?? []

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        viewBox="0 0 400 400"
        width="100%"
        style={{ maxWidth: 420 }}
        className="drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]"
      >
        {/* Background */}
        <circle cx={CX} cy={CY} r={R_OUTER} fill="#0d0d1f" />

        {/* Layers */}
        <ZodiacRing       ascLon={ascLon} />
        <InnerCircle />
        <HouseLines       ascLon={ascLon} houseCusps={houseCusps} />
        <HouseNumbers     ascLon={ascLon} houseCusps={houseCusps} />
        <AspectLines      ascLon={ascLon} planets={planets} aspects={aspects} />
        <PlanetGlyphs     ascLon={ascLon} planets={planets} extraPoints={extraPoints} />
        <AngleLabels      ascLon={ascLon} midheavenLon={midheavenLon} />

        {/* Center decoration */}
        <circle cx={CX} cy={CY} r={14} fill="#1a1a2e" stroke="#6d28d9" strokeWidth={1} />
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fontSize={12} fill="#a78bfa">✦</text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
        <span><span className="text-green-400">—</span> Trígono / Sextil</span>
        <span><span className="text-red-400">—</span> Cuadratura / Oposición</span>
        <span><span className="text-amber-400">—</span> Conjunción</span>
      </div>
    </div>
  )
}
