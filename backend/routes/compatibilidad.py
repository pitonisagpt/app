import asyncio
import json
import os
import re
from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional
import anthropic
from services.synastry import calculate_synastry

router = APIRouter()

SYSTEM_PROMPT = (
    "Eres Pitonisa, una astróloga experta en sinastría y relaciones de pareja. "
    "Hablas en español con tono directo, cálido y honesto, usando 'tú'. "
    "Evitas el lenguaje abstracto y místico: hablas de dinámicas reales de pareja, "
    "de cómo se complementan o chocan dos personas en la vida cotidiana. "
    "Responde siempre en español."
)

INSIGHTS_SYSTEM = (
    "Eres Pitonisa, astróloga experta en sinastría. Generas interpretaciones breves, directas y muy "
    "personales en español. Cada texto debe sonar concreto y reconocible, sin relleno poético. "
    "Habla en segunda persona dirigiéndote a la persona A (el/la que consulta). "
    "Responde ÚNICAMENTE con un objeto JSON válido y nada más, sin bloques de código ni texto fuera del JSON."
)


# ── Models ────────────────────────────────────────────────────────────────────

class CompatibilidadRequest(BaseModel):
    nombre_a:     str
    fecha_a:      str             # YYYY-MM-DD
    ciudad_a:     Optional[str] = ""
    hora_a:       Optional[str] = ""   # "HH:MM" or ""
    hora_a_known: bool = False
    nombre_b:     str
    fecha_b:      str             # YYYY-MM-DD
    ciudad_b:     Optional[str] = ""
    hora_b:       Optional[str] = ""
    hora_b_known: bool = False


class OverlayReadingRequest(BaseModel):
    nombre_a:   str
    nombre_b:   str
    planet:     str   # Spanish name, e.g. "Venus"
    planet_key: str   # e.g. "venus"
    sign:       str   # e.g. "Escorpio"
    house:      int   # 1–12
    meaning:    str   # e.g. "relaciones y pareja"


# ── Helpers ────────────────────────────────────────────────────────────────────

def _parse_time(t: Optional[str]):
    if t and ":" in t:
        parts = t.split(":")
        try:
            return int(parts[0]), int(parts[1])
        except ValueError:
            pass
    return 12, 0


# ── Insights (single Haiku call, parallel to Sonnet) ─────────────────────────

def _build_insights_prompt(data: dict, nombre_a: str, nombre_b: str) -> str:
    dominant = data["dominant"]
    harmony  = data["harmony"][:3]
    tension  = data["tension"][:2]

    dom_txt = (
        f"{dominant['planeta_a']} de {nombre_a} {dominant['symbol']} "
        f"{dominant['planeta_b']} de {nombre_b} ({dominant['aspecto']}, {dominant['orb']}°)"
    ) if dominant else "sin aspecto dominante exacto"

    harm_txt = "; ".join(
        f"{a['planeta_a']} {a['symbol']} {a['planeta_b']} ({a['orb']}°)" for a in harmony
    ) or "ninguno exacto"
    tens_txt = "; ".join(
        f"{a['planeta_a']} {a['symbol']} {a['planeta_b']} ({a['orb']}°)" for a in tension
    ) or "ninguno exacto"

    overlays = data.get("overlays", [])
    key_ov = [o for o in overlays if o["planet"] in {"Venus", "Marte", "Sol", "Luna"} and o["house"] in {5, 7, 8}][:3]
    ov_txt = "; ".join(f"{o['planet']} de {nombre_b} en Casa {o['house']}" for o in key_ov) or "sin overlays clave"

    score = data["score"]

    return f"""Sinastría entre {nombre_a} (A) y {nombre_b} (B).
Puntuación: {score}%
Aspecto dominante: {dom_txt}
Aspectos armónicos: {harm_txt}
Aspectos de tensión: {tens_txt}
Overlays clave (planetas de B en casas de A): {ov_txt}

Genera exactamente este JSON. Cada valor: 55–75 palabras, directo, segunda persona (dirigido a {nombre_a}), muy concreto:
{{
  "rueda": "qué revela la geometría global de esta sinastría — el patrón de fondo de esta relación",
  "aspectos": "qué dicen los aspectos inter-carta sobre la dinámica real entre {nombre_a} y {nombre_b}: dónde fluye y dónde roza",
  "casas": "qué áreas de la vida de {nombre_a} activa {nombre_b} con más fuerza y cómo se vive eso en el día a día",
  "dominant": "explicación personal y concreta del aspecto más exacto entre sus cartas — qué significa eso para {nombre_a} en esta relación"
}}"""


async def _generate_insights(data: dict, nombre_a: str, nombre_b: str) -> dict:
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        msg = await client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=1000,
            system=INSIGHTS_SYSTEM,
            messages=[{"role": "user", "content": _build_insights_prompt(data, nombre_a, nombre_b)}],
        )
        text = msg.content[0].text.strip()
        match = re.search(r"\{[\s\S]*\}", text)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return {}


# ── Main prompt ───────────────────────────────────────────────────────────────

def _build_prompt(req: CompatibilidadRequest, data: dict) -> str:
    score    = data["score"]
    dominant = data["dominant"]
    harmony  = data["harmony"]
    tension  = data["tension"]
    overlays = data.get("overlays", [])

    dominant_txt = (
        f"{dominant['planeta_a']} de {req.nombre_a} {dominant['symbol']} "
        f"{dominant['planeta_b']} de {req.nombre_b} — {dominant['aspecto']} (orbe: {dominant['orb']}°)"
        if dominant else "conexión sutil entre las cartas natales"
    )
    harmony_lines = "\n".join(
        f"  · {a['planeta_a']} {a['symbol']} {a['planeta_b']} — {a['aspecto']} ({a['orb']}°)"
        for a in harmony
    ) or "  · Sin aspectos armónicos exactos"

    tension_lines = "\n".join(
        f"  · {a['planeta_a']} {a['symbol']} {a['planeta_b']} — {a['aspecto']} ({a['orb']}°)"
        for a in tension
    ) or "  · Sin tensiones planetarias destacadas"

    key_planets = {"Venus", "Marte", "Sol", "Luna", "Mercurio"}
    key_houses  = {7, 5, 8, 1, 4}
    top_overlays = [
        f"  · {o['planet']} de {req.nombre_b} en tu Casa {o['house']} ({o['meaning']})"
        for o in overlays
        if o["planet"] in key_planets or o["house"] in key_houses
    ][:5]
    overlay_section = (
        f"\nDónde {req.nombre_b} aterriza en tu vida:\n" + "\n".join(top_overlays) + "\n"
        if top_overlays else ""
    )

    return f"""Estás leyendo la sinastría entre {req.nombre_a} y {req.nombre_b}.

Compatibilidad: {score}%
Conexión principal: {dominant_txt}

Aspectos de armonía:
{harmony_lines}

Aspectos de tensión:
{tension_lines}
{overlay_section}
Escribe 4–5 párrafos:

1. Qué conecta a {req.nombre_a} y {req.nombre_b}: la atracción magnética, qué sienten juntos, \
qué les engancha. Menciona el aspecto dominante con significado concreto de pareja.

2. Qué funciona bien entre ellos: cómo se complementan, qué se dan sin esfuerzo. \
Usa los aspectos armónicos con situaciones reales (conversaciones, proyectos, intimidad, viajes).

3. El principal punto de fricción: qué patrón repiten, dónde chocan habitualmente. \
Usa las tensiones. Honesto y útil, sin dramatizar.

4. Una o dos casas/overlays más significativas: qué área de la vida de {req.nombre_a} \
activa {req.nombre_b} y cómo se vive eso.

5. Una pregunta directa para {req.nombre_a}: qué le está mostrando esta relación sobre \
sí misma/o, qué está aprendiendo de ella.

Habla a {req.nombre_a} con "tú". Menciona a {req.nombre_b} por nombre. \
Sin encabezados. 450–550 palabras."""


# ── Overlay reading (on-demand, like HouseOracle) ─────────────────────────────

OVERLAY_SYSTEM = """Eres Pitonisa, astróloga experta en sinastría.
Interpretas qué significa que el planeta de una persona caiga en una casa de su pareja — en español, segunda persona, tono directo y personal.
Habla de cómo se vive esto en situaciones concretas de pareja: momentos cotidianos, sensaciones, dinámicas reales.
FORMATO: 2–3 párrafos fluidos. Usa **negrita** para conceptos clave. Máximo 180 palabras.
NO empieces con el nombre de la casa ni con "Esta posición".
NO uses: "las energías te invitan", "el cosmos susurra", "vibra en frecuencia"."""

HOUSE_AREAS_ES = [
    "tu identidad y la energía que proyectas al mundo",
    "tu dinero, valores y autoestima",
    "tu mente, comunicación y entorno cercano",
    "tu hogar, familia y mundo emocional íntimo",
    "tu creatividad, romance y alegría",
    "tu salud, rutinas y trabajo cotidiano",
    "tus relaciones serias, pareja y compromisos",
    "tu sexualidad, poder y transformaciones profundas",
    "tus creencias, filosofía y expansión",
    "tu carrera, reputación y vocación",
    "tus amistades, grupos y sueños colectivos",
    "tu inconsciente, espiritualidad y sombras",
]


async def _stream_overlay_reading(req: OverlayReadingRequest):
    area = HOUSE_AREAS_ES[req.house - 1] if 1 <= req.house <= 12 else "esta área de tu vida"
    prompt = (
        f"Sinastría: {req.planet} de {req.nombre_b} (en {req.sign}) cae en la Casa {req.house} "
        f"de {req.nombre_a} — el área de {area}.\n\n"
        f"Interpreta qué activa {req.nombre_b} en esta área de la vida de {req.nombre_a}. "
        f"Sé muy concreto/a: cómo se siente {req.nombre_a}, qué situaciones aparecen, "
        f"si es una influencia que inspira o que reta."
    )
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    async with client.messages.stream(
        model="claude-haiku-4-5-20251001",
        max_tokens=450,
        system=OVERLAY_SYSTEM,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        async for text in stream.text_stream:
            yield text


async def _overlay_event_gen(req: OverlayReadingRequest):
    try:
        async for chunk in _stream_overlay_reading(req):
            yield f"data: {json.dumps(chunk)}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/compatibilidad/overlay-reading")
async def overlay_reading(req: OverlayReadingRequest):
    return StreamingResponse(
        _overlay_event_gen(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ── Main event generator ──────────────────────────────────────────────────────

async def _event_gen(req: CompatibilidadRequest, data: dict):
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        # 1 — score for the meter
        yield f"data: {json.dumps({'__score__': data['score']})}\n\n"

        # 2 — chart data for biwheel + tabs
        yield f"data: {json.dumps({'__synastry__': {'chart_a': data['chart_a'], 'chart_b': data['chart_b'], 'aspects': data['aspects'][:40], 'overlays': data['overlays']}})}\n\n"

        # 3 — kick off tab insights in parallel
        insights_task = asyncio.create_task(
            _generate_insights(data, req.nombre_a, req.nombre_b)
        )

        # 4 — stream main interpretation
        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1200,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_prompt(req, data)}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps(text)}\n\n"

        # 5 — send insights before DONE
        try:
            insights = await insights_task
            if insights:
                yield f"data: {json.dumps({'__synastry_insights__': insights})}\n\n"
        except Exception:
            pass

    except Exception as e:
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


# ── Route ─────────────────────────────────────────────────────────────────────

@router.post("/compatibilidad")
async def compatibilidad(req: CompatibilidadRequest):
    loop = asyncio.get_event_loop()
    try:
        a = [int(x) for x in req.fecha_a.split("-")]
        b = [int(x) for x in req.fecha_b.split("-")]
        ha, ma = _parse_time(req.hora_a if req.hora_a_known else "")
        hb, mb = _parse_time(req.hora_b if req.hora_b_known else "")
        data = await loop.run_in_executor(
            None,
            lambda: calculate_synastry(
                req.nombre_a, a[0], a[1], a[2], req.ciudad_a or "",
                req.nombre_b, b[0], b[1], b[2], req.ciudad_b or "",
                hour_a=ha, minute_a=ma,
                hour_b=hb, minute_b=mb,
            ),
        )
    except ValueError as e:
        return JSONResponse(status_code=400, content={"detail": str(e)})
    except Exception:
        return JSONResponse(status_code=500, content={"detail": "Error al calcular la sinastría. Verifica los datos e intenta de nuevo."})

    return StreamingResponse(
        _event_gen(req, data),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
