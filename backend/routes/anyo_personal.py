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
    "Eres Pitonisa, numeróloga experta. Hablas en español con tono directo y esperanzador, "
    "usando 'tú'. Describes lo que le espera a una persona este año en términos concretos y reconocibles: "
    "no 'las energías del 4 te invitan a construir', sino 'este es un año de trabajo duro y resultados reales'. "
    "Responde siempre en español."
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
    return f"""Eres Pitonisa. {nombre} está en su Año Personal {numero}: "{nombre_arch}".
Temas principales de este año: {keywords}.

Escribe una lectura personal y concreta para {nombre} sobre lo que le trae este año.
Integra el número {numero} y su significado a lo largo de toda la lectura.

Cubre las 6 áreas de vida, cada una en párrafo propio, sin usar títulos — introdúcelas
con frases naturales como "En el amor, este año..." o "Laboralmente, lo que viene para ti...".

Áreas (en este orden):
1. Amor y relaciones
2. Trabajo y vocación
3. Dinero y finanzas
4. Salud y bienestar
5. Familia y vínculos cercanos
6. Desarrollo personal

Cierra con un párrafo que diga:
- Cuál será el mes más intenso o importante del año y por qué
- El principal obstáculo que {nombre} probablemente va a enfrentar y cómo superarlo
- Una frase corta que resuma bien lo que es este año para {nombre}

Habla directo a {nombre} usando "tú". Sé concreta: en vez de "hay oportunidades de crecimiento", \
di qué tipo de oportunidades y en qué contexto. Nada de "las energías te invitan" — habla de \
situaciones reales que una persona vive. Sin predicciones absolutas, pero sí con claridad. \
Sin encabezados, sin listas. Extensión: 450-580 palabras."""


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
