import json
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import ValidationError
from models.schemas import ReadingRequest
from services.claude_service import stream_interpretation

router = APIRouter()


async def event_generator(reading: ReadingRequest):
    try:
        async for chunk in stream_interpretation(reading):
            yield f"data: {json.dumps(chunk)}\n\n"
    except Exception as e:
        import traceback
        traceback.print_exc()
        yield f"data: {json.dumps({'__error__': str(e)})}\n\n"
    yield "data: [DONE]\n\n"


@router.post("/interpret")
async def interpret(raw_request: Request):
    # Parse body manually to return mystic-flavored errors instead of FastAPI's default 422
    try:
        body = await raw_request.json()
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"detail": "Petición inválida. El oráculo no puede leer esta consulta."},
        )

    try:
        reading = ReadingRequest(**body)
    except ValidationError as exc:
        first = exc.errors()[0]
        msg = first.get("msg", "")

        if "disallowed content" in msg or "Invalid spread" in msg:
            user_msg = "Las cartas rechazan esta consulta. Formula una pregunta genuina sobre tu vida o destino."
        elif "exceeds" in msg or "too long" in msg:
            user_msg = "Tu pregunta es demasiado larga. El oráculo pide brevedad y claridad."
        elif "Too many cards" in msg or "At least one" in msg:
            user_msg = "La tirada recibida no es válida. Por favor, recarga la página e intenta de nuevo."
        else:
            user_msg = "Consulta inválida. Por favor, intenta de nuevo."

        return JSONResponse(status_code=422, content={"detail": user_msg})

    return StreamingResponse(
        event_generator(reading),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
