import json
import os
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, field_validator
from typing import Optional
import anthropic

router = APIRouter()

EMOCIONES_VALIDAS = {"miedo", "angustia", "confusión", "paz", "alegría", "amor", "tristeza", "extrañeza"}

SYSTEM_PROMPT_SIMBOLOS = (
    "Eres un intérprete experto del lenguaje simbólico de los sueños. "
    "Analizas sueños usando la técnica de la continuidad (los sueños reflejan las preocupaciones actuales) "
    "y un diccionario arquetípico dinámico basado en Jung. "
    "Respondes SOLO con JSON válido, sin texto adicional, sin markdown."
)

SYSTEM_PROMPT_INTERPRETACION = (
    "Eres Pitonisa, intérprete de los mensajes del inconsciente profundo. Hablas en español con tono íntimo, "
    "directo y sin misticismo vacío. Tu lectura conecta lo que el sueño muestra con lo que la persona vive ahora. "
    "Usas el método de la continuidad: los sueños son el lenguaje del inconsciente sobre preocupaciones reales actuales. "
    "Hablas de emociones concretas, no de 'energías cósmicas'. Responde siempre en español."
)


class SuenosRequest(BaseModel):
    nombre: str
    sueno: str
    emocion: str
    recurrente: bool = False
    signo_sol: Optional[str] = None

    @field_validator("nombre")
    @classmethod
    def validate_nombre(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 1:
            raise ValueError("El nombre no puede estar vacío")
        if len(v) > 60:
            raise ValueError("Nombre demasiado largo")
        return v

    @field_validator("sueno")
    @classmethod
    def validate_sueno(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 15:
            raise ValueError("Describe el sueño con al menos 15 caracteres")
        if len(v) > 1500:
            raise ValueError("Descripción demasiado larga")
        return v

    @field_validator("emocion")
    @classmethod
    def validate_emocion(cls, v: str) -> str:
        if v not in EMOCIONES_VALIDAS:
            raise ValueError("Emoción no válida")
        return v


def _build_simbolos_prompt(req: SuenosRequest) -> str:
    contexto = f" Signo solar: {req.signo_sol}." if req.signo_sol else ""
    recurrente_txt = " Es un sueño recurrente." if req.recurrente else ""
    return f"""Sueño de {req.nombre}: "{req.sueno}"

Emoción predominante: {req.emocion}.{recurrente_txt}{contexto}

Identifica los 3 símbolos más significativos de este sueño y el arquetipo central que lo rige.
Para cada símbolo asigna su significado arquetípico específico para esta persona (técnica de la continuidad).

Responde EXACTAMENTE con este JSON (sin markdown, sin texto extra):
{{"simbolos":[{{"simbolo":"nombre del símbolo","arquetipo":"arquetipo junguiano","significado":"qué revela sobre su vida actual en máx 8 palabras"}},{{"simbolo":"...","arquetipo":"...","significado":"..."}},{{"simbolo":"...","arquetipo":"...","significado":"..."}}],"arquetipo_central":"arquetipo Jung principal de este sueño"}}"""


def _build_interpretacion_prompt(req: SuenosRequest, simbolos_data: dict) -> str:
    simbolos_txt = "\n".join(
        f"- {s['simbolo']} → {s['arquetipo']}: {s['significado']}"
        for s in simbolos_data.get("simbolos", [])
    )
    arquetipo_central = simbolos_data.get("arquetipo_central", "Lo Desconocido")
    recurrente_txt = (
        "Es un sueño recurrente — el inconsciente insiste en algo sin resolver. "
        if req.recurrente else ""
    )
    contexto_astral = f"Su signo solar es {req.signo_sol}. " if req.signo_sol else ""

    return f"""Eres Pitonisa. {req.nombre} te cuenta este sueño: "{req.sueno}"

Emoción predominante al despertar: {req.emocion}. {recurrente_txt}{contexto_astral}
Símbolos identificados:
{simbolos_txt}

Arquetipo central: {arquetipo_central}

Interpreta este sueño usando la técnica de la continuidad: conecta cada símbolo con algo que {req.nombre} \
probablemente está viviendo, postergando o evitando ahora mismo. No inventes detalles pero sé directa \
sobre lo que el inconsciente parece señalar.

Estructura (sin títulos, párrafos corridos):
1. Párrafo de entrada: qué le está diciendo este sueño a {req.nombre} sobre su momento actual
2. Un párrafo por cada símbolo: qué representa en el contexto de su vida
3. Párrafo de continuación consciente: cómo {req.nombre} podría terminar este sueño de forma sana si lo imaginara despierto/a — qué acción simbólica resolvería la tensión
4. Cierra con una sola pregunta reflexiva concreta dirigida a {req.nombre} sobre algo que vale la pena llevar al día de hoy

Habla directo a {req.nombre} usando "tú". Sin frases como "las energías te invitan" o "el universo prepara". \
Habla de situaciones y emociones reales. Sin encabezados, sin listas. Extensión: 420-520 palabras."""


async def _extract_simbolos(client: anthropic.AsyncAnthropic, req: SuenosRequest) -> dict:
    msg = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=400,
        system=SYSTEM_PROMPT_SIMBOLOS,
        messages=[{"role": "user", "content": _build_simbolos_prompt(req)}],
    )
    raw = msg.content[0].text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    return json.loads(raw.strip())


async def _event_gen(req: SuenosRequest):
    client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    try:
        simbolos_data = await _extract_simbolos(client, req)
        yield f"data: {json.dumps({'__simbolos__': simbolos_data})}\n\n"

        async with client.messages.stream(
            model="claude-haiku-4-5-20251001",
            max_tokens=1200,
            system=SYSTEM_PROMPT_INTERPRETACION,
            messages=[{"role": "user", "content": _build_interpretacion_prompt(req, simbolos_data)}],
        ) as stream:
            async for text in stream.text_stream:
                yield f"data: {json.dumps(text)}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/suenos")
async def interpretar_sueno(req: SuenosRequest):
    return StreamingResponse(
        _event_gen(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
