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
    "Eres Pitonisa, una astróloga experta en tránsitos planetarios. Hablas en español con tono "
    "profundo y práctico, directamente al consultante usando 'tú'. Responde siempre en español."
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

    return f"""Eres Pitonisa. Lees los tránsitos planetarios actuales en la carta natal de {req.nombre}.

Tránsitos más significativos activos hoy:
{transits_txt}

Para cada uno de los {count} tránsitos, escribe un párrafo que:
- Mencione los planetas implicados con su simbolismo arquetípico
- Explique qué área de vida está siendo activada para {req.nombre}
- Dé orientación práctica: qué aprovechar o qué navegar con cuidado
- Indique la duración aproximada en lenguaje natural ("esta energía te acompañará...")

Al final, un párrafo de síntesis: "El mensaje del cosmos para {req.nombre} en este momento es..." \
y qué actitud o práctica puede ayudarle a fluir con estas energías.

Habla directamente a {req.nombre} usando "tú". Tono de astróloga experta pero accesible. \
Poético pero concreto. Sin encabezados, sin listas. Extensión: 350-500 palabras."""


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
