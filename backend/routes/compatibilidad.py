import json
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional
import anthropic
from services.synastry import calculate_synastry

router = APIRouter()

SYSTEM_PROMPT = (
    "Eres Pitonisa, una vidente astróloga experta en sinastría. Hablas en español con tono "
    "místico y cálido, directamente al consultante usando 'tú'. Responde siempre en español."
)


class CompatibilidadRequest(BaseModel):
    nombre_a: str
    fecha_a:  str            # YYYY-MM-DD
    ciudad_a: Optional[str] = ""
    nombre_b: str
    fecha_b:  str            # YYYY-MM-DD
    ciudad_b: Optional[str] = ""


def _build_prompt(req: CompatibilidadRequest, data: dict) -> str:
    score    = data["score"]
    dominant = data["dominant"]
    harmony  = data["harmony"]
    tension  = data["tension"]

    dominant_txt = (
        f"{dominant['planeta_a']} de {req.nombre_a} en {dominant['aspecto'].lower()} "
        f"con {dominant['planeta_b']} de {req.nombre_b} (orbe: {dominant['orb']}°)"
        if dominant else "conexión sutil entre las cartas natales"
    )
    harmony_lines = "\n".join(
        f"- {a['planeta_a']} de {req.nombre_a} en {a['aspecto'].lower()} "
        f"con {a['planeta_b']} de {req.nombre_b} (orbe: {a['orb']}°)"
        for a in harmony
    ) or "- Sin aspectos armónicos exactos detectados"
    tension_lines = "\n".join(
        f"- {a['planeta_a']} de {req.nombre_a} en {a['aspecto'].lower()} "
        f"con {a['planeta_b']} de {req.nombre_b} (orbe: {a['orb']}°)"
        for a in tension
    ) or "- Sin tensiones planetarias destacadas"

    return f"""Eres Pitonisa. Estás leyendo la sinastría entre {req.nombre_a} y {req.nombre_b}.

Puntuación de compatibilidad energética: {score}%
Aspecto dominante de la conexión: {dominant_txt}

Aspectos de armonía entre las cartas:
{harmony_lines}

Aspectos de tensión y crecimiento:
{tension_lines}

Escribe una interpretación de 4 párrafos:

Primero — describe la naturaleza de su atracción y qué los une magnéticamente. \
Menciona el aspecto dominante y explica qué energía despierta en cada uno.

Segundo — los dones de esta unión: qué se potencian mutuamente, qué crean juntos \
que no podrían crear solos.

Tercero — sin dramatizar, el mayor desafío de esta relación y qué patrón energético \
necesitan comprender para no repetirlo.

Cuarto — termina con una pregunta reflexiva para {req.nombre_a} sobre lo que esta \
unión le enseña sobre sí mismo/a.

Habla directamente a {req.nombre_a} usando "tú". Menciona a {req.nombre_b} por nombre. \
Sin afirmaciones deterministas. Tono místico y cálido. Sin encabezados. 350-450 palabras."""


async def _event_gen(req: CompatibilidadRequest, data: dict):
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        yield f"data: {json.dumps({'__score__': data['score']})}\n\n"

        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_prompt(req, data)}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps(text)}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/compatibilidad")
async def compatibilidad(req: CompatibilidadRequest):
    try:
        a = [int(x) for x in req.fecha_a.split("-")]
        b = [int(x) for x in req.fecha_b.split("-")]
        data = calculate_synastry(
            req.nombre_a, a[0], a[1], a[2], req.ciudad_a or "",
            req.nombre_b, b[0], b[1], b[2], req.ciudad_b or "",
        )
    except ValueError as e:
        return JSONResponse(status_code=400, content={"detail": str(e)})
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Error al calcular la sinastría. Verifica los datos e intenta de nuevo."},
        )

    return StreamingResponse(
        _event_gen(req, data),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
