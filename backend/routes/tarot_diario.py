import json
import os
import hashlib
from datetime import date
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import anthropic
from data.cards import ALL_CARDS

router = APIRouter()

MESES_ES = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
]

SYSTEM_PROMPT = (
    "Eres Pitonisa, una vidente mística. Hablas en español con tono cálido y poético, "
    "directamente al consultante usando 'tú'. Solo haces lecturas de tarot. Responde siempre en español."
)


class TarotDiarioRequest(BaseModel):
    nombre:           str
    fecha_nacimiento: str  # YYYY-MM-DD


def _get_daily_card(nombre: str, fecha_nacimiento: str) -> tuple[dict, bool]:
    today = date.today()
    seed = f"{nombre.lower().strip()}{fecha_nacimiento}{today.isoformat()}"
    h = int(hashlib.sha256(seed.encode()).hexdigest(), 16)
    card = ALL_CARDS[h % len(ALL_CARDS)]
    reversed_ = (h // len(ALL_CARDS)) % 4 == 0
    return card, reversed_


def _build_prompt(nombre: str, card: dict, reversed_: bool) -> str:
    today = date.today()
    fecha_larga = f"{today.day} de {MESES_ES[today.month - 1]} de {today.year}"
    orientacion = "Invertida" if reversed_ else "Derecha"
    return f"""Hoy es {fecha_larga} y la carta del día para {nombre} es \
**{card['name']}** ({card['symbol']}), en posición {orientacion}.

Escribe el mensaje diario en 3 párrafos:

Primero — saluda la energía del día. Explica qué vibración trae esta carta \
específicamente para {nombre} en este día y qué área de vida ilumina.

Segundo — un consejo práctico y concreto para hoy: qué observar, qué conversación \
tener, qué soltar o abrazar. Conecta el consejo directamente con el simbolismo de \
**{card['name']}**.

Tercero — una afirmación de una sola oración que {nombre} puede repetir durante \
el día. Que sea memorable, poética y compartible.

Tono: cálido, cotidiano pero místico. Como una mentora que te conoce hace años. \
Usa "tú" siempre. Sin encabezados, sin listas. Extensión: 200-280 palabras."""


async def _event_gen(req: TarotDiarioRequest, card: dict, reversed_: bool):
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        # First event: card metadata so the frontend can display it immediately
        yield f"data: {json.dumps({'__card__': card, '__reversed__': reversed_})}\n\n"

        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=512,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_prompt(req.nombre, card, reversed_)}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps(text)}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/tarot-diario")
async def tarot_diario(req: TarotDiarioRequest):
    card, reversed_ = _get_daily_card(req.nombre, req.fecha_nacimiento)
    return StreamingResponse(
        _event_gen(req, card, reversed_),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
