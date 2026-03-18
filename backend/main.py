import os
from dotenv import load_dotenv

load_dotenv()           # picks up backend/.env if present
load_dotenv("../.env")  # falls back to project root .env

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.readings import router as readings_router
from routes.carta_astral import router as carta_astral_router
from routes.volvera_ex import router as volvera_ex_router
from routes.tarot_diario import router as tarot_diario_router
from routes.anyo_personal import router as anyo_personal_router
from routes.compatibilidad import router as compatibilidad_router
from routes.transitos import router as transitos_router
from routes.moon import router as moon_router
from routes.retrograde import router as retrograde_router

app = FastAPI(title="Pitonisa GPT API")

_raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173")
allowed_origins = [o.strip() for o in _raw_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(readings_router,      prefix="/api")
app.include_router(carta_astral_router,  prefix="/api")
app.include_router(volvera_ex_router,    prefix="/api")
app.include_router(tarot_diario_router,  prefix="/api")
app.include_router(anyo_personal_router, prefix="/api")
app.include_router(compatibilidad_router, prefix="/api")
app.include_router(transitos_router,     prefix="/api")
app.include_router(moon_router,          prefix="/api")
app.include_router(retrograde_router,    prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}
