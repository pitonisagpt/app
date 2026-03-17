import json
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional
import anthropic
from services.transits_calc import calculate_transits

router = APIRouter()

SYSTEM_PROMPT = (
    "Eres Pitonisa, astróloga experta en tránsitos planetarios. Hablas en español con tono "
    "directo y práctico, usando 'tú'. Explicas qué está pasando en la vida de la persona ahora "
    "mismo en términos que cualquiera puede entender: no 'Saturno activa tu Mercurio natal en cuadratura' "
    "sino qué significa eso para las decisiones, conversaciones o situaciones que está viviendo hoy. "
    "Responde siempre en español."
)


class TransitosRequest(BaseModel):
    nombre:           str
    fecha_nacimiento: str           # YYYY-MM-DD
    hora_nacimiento:  Optional[str] = None  # HH:MM
    ciudad:           str


def _build_prompt(req: TransitosRequest, data: dict) -> str:
    aspects = data["aspects"][:3]
    count = len(aspects)

    if not aspects:
        transits_txt = "No se detectan tránsitos mayores exactos en este momento."
    else:
        transits_txt = "\n".join(
            f"- {a['transiting']} en {a['aspecto'].lower()} con tu {a['natal']} natal "
            f"(orbe: {a['orb']}°, intensidad: {a['intensity']}/4, duración: ~{a['duracion']})"
            for a in aspects
        )

    return f"""Eres Pitonisa. Lees los tránsitos planetarios activos hoy en la carta de {req.nombre}.

Tránsitos activos ahora:
{transits_txt}

Para cada tránsito, escribe un párrafo que:
- Diga qué planetas están involucrados y qué significa eso en lenguaje normal (sin jerga astrológica)
- Explique qué área de la vida de {req.nombre} está siendo tocada: trabajo, relaciones, decisiones, salud, dinero
- Dé una orientación concreta: qué hacer, qué evitar, qué aprovechar en este momento
- Indique cuánto tiempo dura esto en lenguaje natural ("esto se extiende hasta...", "en las próximas semanas...")

Al final, un párrafo de cierre con lo más importante que {req.nombre} necesita saber ahora mismo \
y qué actitud concreta le ayuda a navegar este período.

Habla directo a {req.nombre} usando "tú". Como una astróloga de confianza que te explica \
lo que está pasando sin complicarlo. Sin frases vacías. Sin encabezados, sin listas. \
Extensión: 350-480 palabras."""


async def _event_gen(req: TransitosRequest, data: dict):
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        yield f"data: {json.dumps({'__transits__': data['count']})}\n\n"

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


@router.post("/transitos")
async def transitos(req: TransitosRequest):
    try:
        parts = req.fecha_nacimiento.split("-")
        year, month, day = int(parts[0]), int(parts[1]), int(parts[2])
        hour, minute, birth_time_known = 12, 0, False
        if req.hora_nacimiento:
            h = req.hora_nacimiento.split(":")
            hour, minute, birth_time_known = int(h[0]), int(h[1]), True

        data = calculate_transits(req.nombre, year, month, day, hour, minute, req.ciudad, birth_time_known)
    except ValueError as e:
        return JSONResponse(status_code=400, content={"detail": str(e)})
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"detail": "Error al calcular los tránsitos. Verifica los datos e intenta de nuevo."},
        )

    return StreamingResponse(
        _event_gen(req, data),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
