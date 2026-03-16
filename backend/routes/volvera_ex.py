import json
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, field_validator
from typing import List, Optional
import anthropic
from models.schemas import DrawnCard

router = APIRouter()

POSICIONES = [
    "Energía actual de {ex} hacia ti",
    "Lo que realmente siente en este momento",
    "El obstáculo entre vosotros",
    "Lo que el universo prepara",
    "La energía de los próximos 30 días",
]

SYSTEM_PROMPT = (
    "Eres Pitonisa, una vidente mística. Hablas en español con tono profundo, poético y empático, "
    "directamente al consultante usando 'tú'. Solo haces lecturas de tarot. "
    "Nunca das consejos médicos, legales o financieros. Responde siempre en español."
)


class VolveraExRequest(BaseModel):
    nombre:     str
    ex_nombre:  str
    tiempo:     str
    razon:      str
    contacto:   str
    cards:      List[DrawnCard]

    @field_validator("nombre", "ex_nombre")
    @classmethod
    def name_max_length(cls, v: str) -> str:
        if len(v.strip()) < 1:
            raise ValueError("El nombre no puede estar vacío")
        if len(v) > 60:
            raise ValueError("Nombre demasiado largo")
        return v.strip()

    @field_validator("cards")
    @classmethod
    def cards_count(cls, v: List[DrawnCard]) -> List[DrawnCard]:
        if len(v) != 5:
            raise ValueError("Se requieren exactamente 5 cartas")
        return v


def _build_prompt(req: VolveraExRequest) -> str:
    lines = "\n".join(
        f"- {POSICIONES[i].format(ex=req.ex_nombre)}: **{c.name}** ({c.symbol}) — "
        f"{'Invertida' if c.reversed else 'Derecha'}"
        for i, c in enumerate(req.cards)
    )
    return f"""Eres Pitonisa. {req.nombre} pregunta sobre el retorno de {req.ex_nombre}.

Contexto de la situación:
- Tiempo separados: {req.tiempo}
- Razón de la ruptura: {req.razon}
- Contacto actual: {req.contacto}

Las cartas reveladas son:
{lines}

Interpreta cada carta en un párrafo propio. Menciona el nombre de cada carta en negrita \
y conéctala directamente con {req.ex_nombre} y la situación específica de {req.nombre}.

Al final, un párrafo de síntesis que cierre con: "La pregunta más importante no es si \
{req.ex_nombre} volverá, sino..." y completa con algo que invite a {req.nombre} a \
reflexionar sobre su propio bienestar y crecimiento.

Habla directamente a {req.nombre} usando "tú". Tono empático, poético y honesto. \
No prometas el regreso ni lo descartes definitivamente — habla de energías y posibilidades. \
Sin encabezados, sin listas. Extensión total: 350-500 palabras."""


async def _event_gen(req: VolveraExRequest):
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_prompt(req)}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps(text)}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/volvera-ex")
async def volvera_ex(req: VolveraExRequest):
    return StreamingResponse(
        _event_gen(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
