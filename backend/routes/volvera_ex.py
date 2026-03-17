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
    "Eres Pitonisa, una vidente directa y empática. Hablas en español con tono cercano y honesto, "
    "como una amiga que te dice lo que ve sin rodeos pero con cariño, usando 'tú'. "
    "Solo haces lecturas de tarot. Nunca das consejos médicos, legales o financieros. "
    "Responde siempre en español. Evita frases vacías como 'las energías te invitan' o "
    "'el universo prepara'. Habla de situaciones reales y emociones concretas."
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
    return f"""Eres Pitonisa. {req.nombre} pregunta si {req.ex_nombre} va a volver.

Contexto:
- Llevan separados: {req.tiempo}
- La razón fue: {req.razon}
- Contacto actual: {req.contacto}

Cartas:
{lines}

Interpreta cada carta en un párrafo propio. Menciona el nombre de cada carta en negrita \
y conecta lo que muestra con algo concreto de la situación entre {req.nombre} y {req.ex_nombre}: \
lo que probablemente está sintiendo cada uno, qué está en medio de los dos, cómo puede evolucionar esto.

Sé directa y honesta — no prometas nada que las cartas no digan, pero tampoco seas evasiva. \
Si la carta muestra algo difícil, dilo con cariño. Si muestra posibilidad, dilo con claridad.

Cierra con un párrafo que diga: "La pregunta más importante aquí no es si {req.ex_nombre} va a \
volver, sino..." y completa con algo real sobre lo que {req.nombre} necesita para estar bien, \
con o sin {req.ex_nombre}.

Habla directo a {req.nombre} usando "tú". Sin frases vacías como "las energías sugieren" o \
"el universo conspira". Habla de personas reales en situaciones reales. \
Sin encabezados, sin listas. Extensión: 350-480 palabras."""


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
