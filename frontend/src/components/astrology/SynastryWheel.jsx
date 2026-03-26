/**
 * SynastryWheel.jsx — Biwheel SVG for synastry charts.
 *
 * Layout (all radii from center CX=230, CY=230):
 *
 *   Inner wheel  (person A)
 *     R_OUTER_A   = 162  — outer edge of A's zodiac ring
 *     R_ZODIAC_A  = 142  — inner edge of A's zodiac ring
 *     R_HOUSES_A  = 128  — inner edge of house number ring
 *     R_CORE      =  52  — inner core circle
 *     R_PLANETS_A = 108  — A's planet glyphs
 *     R_ASPECT_A  =  76  — inner end of inter-aspect lines
 *     R_LABEL_A   = 152  — A's zodiac sign labels
 *
 *   Outer ring (person B)
 *     R_SEP       = 198  — separator ring between A and B
 *     R_OUTER_B   = 224  — outer boundary of SVG chart
 *     R_PLANETS_B = 184  — B's planet glyphs
 *     R_ASPECT_B  = 184  — outer end of inter-aspect lines (same)
 *
 * Coordinate system: ASC of person A is fixed at LEFT (standard astrology).
 * Both A and B planets use A's ascendant as reference angle.
 */

const CX = 230, CY = 230

// Inner (A)
const R_OUTER_A   = 162
const R_ZODIAC_A  = 142
const R_HOUSES_A  = 128
const R_CORE      =  52
const R_PLANETS_A = 108
const R_ASPECT_A  =  76
const R_LABEL_A   = 152

// Outer (B)
const R_SEP       = 198
const R_OUTER_B   = 224
const R_PLANETS_B = 184

const SIGNS = [
  { name: "Aries",       symbol: "♈", color: "#e05252" },
  { name: "Tauro",       symbol: "♉", color: "#5a9c5a" },
  { name: "Géminis",     symbol: "♊", color: "#d4a017" },
  { name: "Cáncer",      symbol: "♋", color: "#5a8fc2" },
  { name: "Leo",         symbol: "♌", color: "#e07c30" },
  { name: "Virgo",       symbol: "♍", color: "#6aaa6a" },
  { name: "Libra",       symbol: "♎", color: "#c25a8f" },
  { name: "Escorpio",    symbol: "♏", color: "#7a4a9c" },
  { name: "Sagitario",   symbol: "♐", color: "#d44040" },
  { name: "Capricornio", symbol: "♑", color: "#4a7a6a" },
  { name: "Acuario",     symbol: "♒", color: "#4a7ac2" },
  { name: "Piscis",      symbol: "♓", color: "#8a5ab0" },
]

const GLYPHS = {
  sol: "☉", luna: "☽", mercurio: "☿", venus: "♀",
  marte: "♂", jupiter: "♃", saturno: "♄", urano: "⛢",
  neptuno: "♆", pluton: "♇", chiron: "⚷", north_node: "☊",
}

const COLORS_A = {
  sol: "#f4a800", luna: "#c8c8e0", mercurio: "#a0a0ff",
  venus: "#ff80b0", marte: "#ff5050", jupiter: "#c060c0",
  saturno: "#8080c0", urano: "#40c0c0", neptuno: "#6080ff",
  pluton: "#c06060", chiron: "#80c080", north_node: "#c0a000",
}

// B's planets use a shifted pink/teal palette to distinguish from A
const COLORS_B = {
  sol: "#ffd580", luna: "#e8e8ff", mercurio: "#c0c8ff",
  venus: "#ffb0d8", marte: "#ff9090", jupiter: "#e090ff",
  saturno: "#b0b8f0", urano: "#80f0f0", neptuno: "#90b0ff",
  pluton: "#e090a0", chiron: "#a0e0a0", north_node: "#e0d060",
}

const ASPECT_COLORS = {
  harmonious: "#22c55e",
  tense:      "#ef4444",
  neutral:    "#f59e0b",
}

// ── Math ──────────────────────────────────────────────────────────────────────

const f = (n) => n.toFixed(2)

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
  return [
    `M ${f(p1o.x)} ${f(p1o.y)}`,
    `A ${rOuter} ${rOuter} 0 0 1 ${f(p2o.x)} ${f(p2o.y)}`,
    `L ${f(p2i.x)} ${f(p2i.y)}`,
    `A ${rInner} ${rInner} 0 0 0 ${f(p1i.x)} ${f(p1i.y)}`,
    "Z",
  ].join(" ")
}

// ── Inner chart components (person A) ─────────────────────────────────────────

function ZodiacRingA({ ascLon }) {
  return SIGNS.map((sign, i) => {
    const startLon = i * 30
    const path = sectorPath(ascLon, startLon, startLon + 30, R_ZODIAC_A, R_OUTER_A)
    const lp   = lonToXY(startLon + 15, ascLon, R_LABEL_A)
    return (
      <g key={sign.name}>
        <path d={path} fill={sign.color} fillOpacity={0.18} stroke="#444" strokeWidth={0.4} />
        <text x={f(lp.x)} y={f(lp.y)}
              textAnchor="middle" dominantBaseline="central"
              fontSize={10} fill={sign.color} fontWeight="bold">
          {sign.symbol}
        </text>
      </g>
    )
  })
}

function HouseLinesA({ ascLon, houseCusps }) {
  if (!houseCusps || houseCusps.length < 12) return null
  return houseCusps.map((lon, i) => {
    const inner = lonToXY(lon, ascLon, R_CORE)
    const outer = lonToXY(lon, ascLon, R_ZODIAC_A)
    const isAngle = [0, 3, 6, 9].includes(i)
    return (
      <line key={i}
            x1={f(inner.x)} y1={f(inner.y)}
            x2={f(outer.x)} y2={f(outer.y)}
            stroke={isAngle ? "#fff" : "#555"}
            strokeWidth={isAngle ? 1.2 : 0.5}
            strokeDasharray={isAngle ? undefined : "2 2"} />
    )
  })
}

function HouseNumbersA({ ascLon, houseCusps }) {
  if (!houseCusps || houseCusps.length < 12) return null
  const R_NUM = (R_HOUSES_A + R_CORE) / 2 + 4
  return houseCusps.map((lon, i) => {
    const nextLon = houseCusps[(i + 1) % 12]
    let mid = lon + (((nextLon - lon) % 360 + 360) % 360) / 2
    const p = lonToXY(mid, ascLon, R_NUM)
    return (
      <text key={i} x={f(p.x)} y={f(p.y)}
            textAnchor="middle" dominantBaseline="central"
            fontSize={6} fill="#888">
        {i + 1}
      </text>
    )
  })
}

function AngleLabelsA({ ascLon, midheavenLon }) {
  const labels = [
    { lon: ascLon,               label: "ASC" },
    { lon: (ascLon + 180) % 360, label: "DSC" },
  ]
  if (midheavenLon != null) {
    labels.push({ lon: midheavenLon,               label: "MC" })
    labels.push({ lon: (midheavenLon + 180) % 360, label: "IC" })
  }
  return labels.map(({ lon, label }) => {
    const p = lonToXY(lon, ascLon, R_ZODIAC_A + 6)
    return (
      <text key={label} x={f(p.x)} y={f(p.y)}
            textAnchor="middle" dominantBaseline="central"
            fontSize={6.5} fill="#e2e8f0" fontWeight="bold">
        {label}
      </text>
    )
  })
}

function PlanetGlyphsA({ ascLon, planets }) {
  const placed = {}
  const MIN_DEG = 8
  return Object.entries(planets || {}).map(([key, pl]) => {
    if (!pl || pl.abs_longitude == null) return null
    const glyph = GLYPHS[key]
    if (!glyph) return null

    let lon = pl.abs_longitude
    Object.values(placed).forEach(plon => {
      let diff = ((lon - plon) % 360 + 360) % 360
      if (diff > 180) diff = 360 - diff
      if (diff < MIN_DEG) lon += MIN_DEG
    })
    placed[key] = lon

    const p = lonToXY(lon, ascLon, R_PLANETS_A)
    const color = COLORS_A[key] || "#ccc"
    return (
      <g key={key}>
        <circle cx={f(p.x)} cy={f(p.y)} r={8}
                fill="#0d0d1f" fillOpacity={0.9}
                stroke={color} strokeWidth={0.8} />
        <text x={f(p.x)} y={f(p.y)}
              textAnchor="middle" dominantBaseline="central"
              fontSize={8} fill={color}>
          {glyph}{pl.retrograde ? "ℛ" : ""}
        </text>
      </g>
    )
  })
}

// ── Outer ring (person B) ──────────────────────────────────────────────────────

function SeparatorRing({ ascLon }) {
  // Thin ring dividing A from B — tick marks every 30°
  const ticks = Array.from({ length: 12 }, (_, i) => i * 30)
  return (
    <>
      <circle cx={CX} cy={CY} r={R_SEP} fill="none" stroke="#4a3a6a" strokeWidth={1} />
      <circle cx={CX} cy={CY} r={R_OUTER_B} fill="none" stroke="#4a3a6a" strokeWidth={0.6} />
      {ticks.map(lon => {
        const outer = lonToXY(lon, ascLon, R_OUTER_B)
        const inner = lonToXY(lon, ascLon, R_SEP - 4)
        return (
          <line key={lon}
                x1={f(inner.x)} y1={f(inner.y)}
                x2={f(outer.x)} y2={f(outer.y)}
                stroke="#4a3a6a" strokeWidth={0.8} />
        )
      })}
    </>
  )
}

function PlanetGlyphsB({ ascLon, planets, name }) {
  const placed = {}
  const MIN_DEG = 9
  return Object.entries(planets || {}).map(([key, pl]) => {
    if (!pl || pl.abs_longitude == null) return null
    const glyph = GLYPHS[key]
    if (!glyph) return null

    let lon = pl.abs_longitude
    Object.values(placed).forEach(plon => {
      let diff = ((lon - plon) % 360 + 360) % 360
      if (diff > 180) diff = 360 - diff
      if (diff < MIN_DEG) lon += MIN_DEG
    })
    placed[key] = lon

    const p = lonToXY(lon, ascLon, R_PLANETS_B)
    const color = COLORS_B[key] || "#eee"
    return (
      <g key={key}>
        <circle cx={f(p.x)} cy={f(p.y)} r={8.5}
                fill="#0d0d1f" fillOpacity={0.9}
                stroke={color} strokeWidth={1}
                strokeDasharray="3 1.5" />
        <text x={f(p.x)} y={f(p.y)}
              textAnchor="middle" dominantBaseline="central"
              fontSize={8.5} fill={color}>
          {glyph}
        </text>
      </g>
    )
  })
}

// ── Inter-aspect lines ─────────────────────────────────────────────────────────

function InterAspectLines({ ascLon, planetsA, planetsB, aspects }) {
  if (!aspects || !planetsA || !planetsB) return null

  // Only draw lines for the closest 12 aspects to keep the chart readable
  const top = [...aspects]
    .filter(a => planetsA[a.key_a] && planetsB[a.key_b])
    .slice(0, 12)

  return top.map((asp, idx) => {
    const pA = planetsA[asp.key_a]
    const pB = planetsB[asp.key_b]
    const a = lonToXY(pA.abs_longitude, ascLon, R_ASPECT_A)
    const b = lonToXY(pB.abs_longitude, ascLon, R_PLANETS_B)
    const color = ASPECT_COLORS[asp.tipo] || "#888"
    return (
      <line key={idx}
            x1={f(a.x)} y1={f(a.y)}
            x2={f(b.x)} y2={f(b.y)}
            stroke={color} strokeWidth={0.7} strokeOpacity={0.5} />
    )
  })
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function SynastryWheel({ chartA, chartB, aspects }) {
  if (!chartA || !chartB) return null

  const ascLon      = chartA.ascendant_lon ?? 0
  const mcLon       = chartA.midheaven_lon ?? null
  const planetsA    = chartA.planets       ?? {}
  const planetsB    = chartB.planets       ?? {}
  const houseCusps  = chartA.house_cusps   ?? []
  const nameA       = chartA.name          ?? "A"
  const nameB       = chartB.name          ?? "B"

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 460 460"
        width="100%"
        style={{ maxWidth: 460 }}
        className="drop-shadow-[0_0_24px_rgba(139,92,246,0.25)]"
      >
        {/* Background */}
        <circle cx={CX} cy={CY} r={R_OUTER_B} fill="#0d0d1f" />

        {/* Outer B ring background (subtle tint) */}
        <circle cx={CX} cy={CY} r={R_SEP} fill="none" />
        <path
          d={`M ${CX + R_SEP} ${CY} A ${R_SEP} ${R_SEP} 0 1 0 ${CX - R_SEP} ${CY} A ${R_SEP} ${R_SEP} 0 1 0 ${CX + R_SEP} ${CY} Z
              M ${CX + R_OUTER_B} ${CY} A ${R_OUTER_B} ${R_OUTER_B} 0 1 1 ${CX - R_OUTER_B} ${CY} A ${R_OUTER_B} ${R_OUTER_B} 0 1 1 ${CX + R_OUTER_B} ${CY} Z`}
          fill="rgba(219,39,119,0.04)"
        />

        {/* Inner A: zodiac ring */}
        <ZodiacRingA ascLon={ascLon} />

        {/* Inner A: structure circles */}
        <circle cx={CX} cy={CY} r={R_CORE}     fill="#0f0f1a" stroke="#444" strokeWidth={0.6} />
        <circle cx={CX} cy={CY} r={R_HOUSES_A} fill="none"    stroke="#444" strokeWidth={0.4} />
        <circle cx={CX} cy={CY} r={R_ZODIAC_A} fill="none"    stroke="#555" strokeWidth={0.6} />
        <circle cx={CX} cy={CY} r={R_OUTER_A}  fill="none"    stroke="#555" strokeWidth={0.6} />

        {/* Inner A: houses and angles */}
        <HouseLinesA   ascLon={ascLon} houseCusps={houseCusps} />
        <HouseNumbersA ascLon={ascLon} houseCusps={houseCusps} />
        <AngleLabelsA  ascLon={ascLon} midheavenLon={mcLon} />

        {/* Inter-aspect lines (behind glyphs) */}
        <InterAspectLines ascLon={ascLon} planetsA={planetsA} planetsB={planetsB} aspects={aspects} />

        {/* A's planets (inner) */}
        <PlanetGlyphsA ascLon={ascLon} planets={planetsA} />

        {/* Separator ring */}
        <SeparatorRing ascLon={ascLon} />

        {/* B's planets (outer ring) */}
        <PlanetGlyphsB ascLon={ascLon} planets={planetsB} name={nameB} />

        {/* Center decoration */}
        <circle cx={CX} cy={CY} r={14} fill="#1a1a2e" stroke="#6d28d9" strokeWidth={1} />
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fontSize={12} fill="#a78bfa">✦</text>

        {/* Name labels — A bottom-left, B bottom-right */}
        <text x={CX - R_OUTER_B + 8} y={CY + R_OUTER_B - 10}
              fontSize={8} fill="rgba(200,185,220,0.7)" fontFamily="sans-serif">
          {nameA}
        </text>
        <text x={CX + R_OUTER_B - 8} y={CY + R_OUTER_B - 10}
              textAnchor="end" fontSize={8} fill="rgba(255,150,200,0.7)" fontFamily="sans-serif">
          {nameB}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-slate-400">
        <span>
          <span className="inline-block w-3 h-3 rounded-full border border-[#a0a0ff] mr-1 align-middle" />
          {nameA}
        </span>
        <span>
          <span className="inline-block w-3 h-3 rounded-full border border-dashed border-[#c0c8ff] mr-1 align-middle" />
          {nameB}
        </span>
        <span><span className="text-green-400">—</span> Armónico</span>
        <span><span className="text-red-400">—</span> Tensión</span>
        <span><span className="text-amber-400">—</span> Conjunción</span>
      </div>
    </div>
  )
}
