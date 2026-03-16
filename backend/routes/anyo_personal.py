import json
import os
from datetime import date
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import anthropic

router = APIRouter()

ARCHETYPES: dict[int, tuple[str, str]] = {
    1: ("El Año del Inicio",       "nuevos comienzos, identidad, siembra, independencia"),
    2: ("El Año de la Unión",      "paciencia, amor, colaboración, receptividad"),
    3: ("El Año de la Expresión",  "creatividad, comunicación, alegría, expansión social"),
    4: ("El Año de la Construcción","disciplina, estructura, trabajo, cimientos sólidos"),
    5: ("El Año del Cambio",       "libertad, aventura, transformación, nuevas experiencias"),
    6: ("El Año del Hogar",        "amor, responsabilidad, familia, armonía, servicio"),
    7: ("El Año del Alma",         "introspección, espiritualidad, sabiduría interior, soledad fértil"),
    8: ("El Año del Poder",        "abundancia, éxito material, reconocimiento, liderazgo"),
    9: ("El Año del Cierre",       "soltar, completar ciclos, compasión, preparación para lo nuevo"),
}

SYSTEM_PROMPT = (
    "Eres Pitonisa, una vidente mística y numeróloga. Hablas en español con tono profético "
    "y esperanzador, directamente al consultante usando 'tú'. Responde siempre en español."
)


class AnyoPersonalRequest(BaseModel):
    nombre:           str
    fecha_nacimiento: str  # YYYY-MM-DD


def _reduce(n: int) -> int:
    while n > 9:
        n = sum(int(d) for d in str(n))
    return n


def _calculate(day: int, month: int) -> int:
    return _reduce(day + month + date.today().year)


def _build_prompt(nombre: str, numero: int, archetype: tuple) -> str:
    nombre_arch, keywords = archetype
    return f"""Eres Pitonisa. {nombre} está viviendo su Año Personal {numero}: "{nombre_arch}".
Palabras clave de este año: {keywords}.

Genera una predicción profunda y personal para {nombre}. \
Integra el número {numero} y su arquetipo a lo largo de toda la lectura.

Interpreta las 6 áreas de vida, cada una en su propio párrafo. \
No uses encabezados: introduce cada área naturalmente \
(ej: "En el territorio del amor...", "Tu camino laboral este año...").

Áreas a cubrir (en este orden):
1. Amor y relaciones
2. Trabajo y vocación
3. Dinero y abundancia
4. Salud y energía vital
5. Familia y vínculos cercanos
6. Crecimiento espiritual

Después de las 6 áreas, escribe un párrafo de cierre que incluya:
- El mes de mayor energía este año (entre enero y diciembre) y por qué
- El mayor desafío y la fortaleza interior que lo supera
- Un mantra de una sola oración para este año, original y poderoso

Habla directamente a {nombre} usando "tú". Usa frases como "las energías te invitan a...", \
"el universo te prepara para...", "hay una ventana de oportunidad en...". \
Sin afirmaciones de certeza absoluta. Sin encabezados, sin listas. \
Tono profético pero esperanzador. Extensión: 450-600 palabras."""


async def _event_gen(req: AnyoPersonalRequest, numero: int, archetype: tuple):
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        # First event: computed numerology data
        yield f"data: {json.dumps({'__anyo__': numero, '__nombre__': archetype[0]})}\n\n"

        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1200,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": _build_prompt(req.nombre, numero, archetype)}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps(text)}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/anyo-personal")
async def anyo_personal(req: AnyoPersonalRequest):
    parts = req.fecha_nacimiento.split("-")
    day, month = int(parts[2]), int(parts[1])
    numero = _calculate(day, month)
    archetype = ARCHETYPES[numero]
    return StreamingResponse(
        _event_gen(req, numero, archetype),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
