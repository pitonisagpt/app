# Pitonisa GPT — CLAUDE.md

Oráculo de tarot, astrología y numerología con IA. Interpretaciones personales en español, streaming en tiempo real, cálculo astronómico real.

---

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python) + Uvicorn |
| IA principal | Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) |
| IA carta astral | Claude Sonnet 4.6 (stream) + Haiku (insights paralelos) |
| Astrología | kerykeion + pyswisseph (Swiss Ephemeris / JPL DE431) |
| Geocodificación | OpenStreetMap Nominatim + timezonefinder |
| Streaming | Server-Sent Events (SSE) |
| Persistencia | localStorage (perfil, streak, cachés) |
| Routing | React Router v6 |
| SEO | react-helmet-async |

---

## Correr en desarrollo local

```bash
# Backend (puerto 8000)
cd backend && uvicorn main:app --reload

# Frontend (puerto 5173)
cd frontend && npm run dev
```

Variable de entorno requerida en `.env` en la raíz del proyecto:
```
ANTHROPIC_API_KEY=sk-...
```

---

## Arquitectura del backend

### Patrón de módulo estándar

Cada módulo especial sigue este patrón en `backend/routes/<nombre>.py`:

1. `BaseModel` Pydantic para validar el request
2. `SYSTEM_PROMPT` como constante string
3. `_build_prompt(req)` → string con el prompt de usuario
4. `_event_gen(req)` → generador async que emite SSE
5. `@router.post(...)` que devuelve `StreamingResponse`

### Meta-eventos SSE

Antes del texto streamed, algunos módulos emiten un evento JSON con datos computados:

```python
yield f"data: {json.dumps({'__clave__': valor})}\n\n"
```

El frontend detecta objetos con claves `__xxx__` como meta-eventos y los separa del texto. Esto permite revelar datos calculados (número, puntuación, símbolos) visualmente antes de que llegue la interpretación.

### Módulos y sus endpoints

| Archivo | Endpoint | Meta-evento | Modelo |
|---|---|---|---|
| `readings.py` | `POST /api/interpret` | — | Haiku |
| `tarot_diario.py` | `POST /api/tarot-diario` | — | Haiku |
| `volvera_ex.py` | `POST /api/volvera-ex` | — | Haiku |
| `anyo_personal.py` | `POST /api/anyo-personal` | `__anyo__`, `__nombre__` | Haiku |
| `compatibilidad.py` | `POST /api/compatibilidad` | `__score__` | Haiku |
| `transitos.py` | `POST /api/transitos` | `__count__` | Haiku |
| `suenos.py` | `POST /api/suenos` | `__simbolos__` | Haiku × 2 |
| `carta_astral.py` | `POST /api/carta-astral` | — | Sonnet + Haiku paralelo |
| `moon.py` | `GET /api/moon-phase` | — | — (cálculo puro) |
| `retrograde.py` | `GET /api/retrograde-planets` | — | — (cálculo puro) |

### Registro de rutas

Cada router nuevo se registra en `backend/main.py`:
```python
from routes.nuevo import router as nuevo_router
app.include_router(nuevo_router, prefix="/api")
```

---

## Arquitectura del frontend

### Patrón de página de módulo

Cada página especial sigue este patrón:

```jsx
const { text, isStreaming, error, meta, stream, reset } = useModuleStream()
const { profile, updateProfile } = useUserProfile()

// Detectar meta-evento
useEffect(() => {
  if (meta?.__clave__) { /* actualizar estado local */ }
}, [meta])

// Submit
async function handleSubmit(e) {
  e.preventDefault()
  await stream('/api/endpoint', { ...payload })
}
```

### Hooks clave

| Hook | Descripción |
|---|---|
| `useModuleStream` | SSE streaming genérico — separa meta-eventos de texto |
| `useUserProfile` | Lee/escribe perfil en localStorage (`pitonisa_profile`) |
| `useTypewriter` | Suaviza los chunks SSE a ~250 chars/seg |
| `useTarotStreak` | Racha diaria con hitos y localStorage |
| `useMoonPhase` | Fase lunar con caché 1h en localStorage |
| `useRetrogradePlanets` | Planetas retrógrados con caché 12h |

### Perfil de usuario (`localStorage`)

Clave: `pitonisa_profile`. Campos disponibles:

```js
{
  nombre, fecha_nacimiento, hora_nacimiento, ciudad,
  nombre_pareja, fecha_nacimiento_pareja,
  signo_sol, signo_luna, signo_ascendente
}
```

Los signos se guardan automáticamente al calcular la carta astral. Todos los formularios pre-rellenan desde el perfil.

### Componentes reutilizables

| Componente | Uso |
|---|---|
| `ModuleResult` | Contenedor del resultado con fases de carga, typewriter y botón reset |
| `SeoHead` | Tags SEO + OG por página vía react-helmet-async |
| `StarField` | Fondo de estrellas animado (prop `count`) |
| `Navbar` | Navegación global |
| `OracleMarkdown` | Renderiza el texto del oráculo con markdown mínimo |
| `Waveform` | Animación de onda mientras hay streaming activo |
| `RelatedCTAs` | CTAs relacionados al final de cada lectura |

### Registro de rutas

Cada página nueva se registra en `frontend/src/App.jsx`:
```jsx
import NuevaPagina from './pages/NuevaPagina'
<Route path="/nueva-ruta" element={<NuevaPagina />} />
```

Y su card en el home se añade a `frontend/src/data/modules.js`.

---

## Módulos especiales — referencia rápida

### `/tarot-diario`
Carta diaria determinista: SHA-256(nombre + fecha_nacimiento + fecha). Racha diaria con hitos en 3/7/14/21/30/60/100/365 días.

### `/volvera-ex`
5 cartas. Inputs: nombre propio, nombre del ex, tiempo separados, razón, contacto actual.

### `/compatibilidad`
Sinastría de dos cartas natales. Meta-evento: `__score__` (0–100%). Inputs: datos completos de ambas personas (nombre, fecha, hora, ciudad).

### `/transitos`
Planetas actuales sobre mapa natal. Meta-evento: `__count__` (número de tránsitos activos). Hora de nacimiento opcional.

### `/anyo-personal`
Número rector calculado con numerología pitagórica (preserva maestros 11/22/33). Meta-evento: `__anyo__` + `__nombre__` (arquetipo del año).

### `/suenos`
Dos llamadas Haiku secuenciales:
1. Extracción de 3 símbolos + arquetipo central → JSON (meta-evento `__simbolos__`)
2. Interpretación streaming 420–520 palabras

Metodología: Técnica de la Continuidad + Diccionario Arquetípico dinámico (Jung). Ver `SUENOS.md` para prompts completos y guía de refinamiento.

### `/carta-astral`
Motor: kerykeion + pyswisseph. 10 planetas + puntos extras + 12 casas (Placidus) + aspectos. Dos modelos en paralelo: Sonnet (stream principal) + Haiku (17 insights en JSON para 6 tabs). Visualización: 6 tabs (Rueda SVG, Planetas, Aspectos, Casas, Energía, Patrones).

---

## Convenciones de código

### Prompts
- Siempre en español
- Sin frases vacías: nunca "las energías te invitan", "el universo prepara", "los astros sugieren"
- Hablar de "tú" directo al usuario
- Extensión objetivo especificada en el prompt (ej. "420-520 palabras")
- Sin encabezados ni listas en el output — párrafos corridos

### Modelos
- **Haiku** para la mayoría de módulos (costo bajo, suficiente)
- **Sonnet** solo para carta astral (interpretación principal, mayor complejidad)
- Si una interpretación resulta superficial, subir esa llamada puntual a Sonnet

### Validación
- Pydantic en todos los endpoints
- `field_validator` para sanitizar strings (strip, longitud máxima)
- Enums explícitos para campos de selección (ej. `emocion` en sueños)

### SSE
- Formato: `data: {json}\n\n`
- Meta-eventos: objetos JSON con claves `__xxx__`
- Fin del stream: `data: [DONE]\n\n`
- Errores: `data: {"__error__": "mensaje"}\n\n`

### Comportamientos globales del frontend
- **Copy attribution** (`App.jsx`): al copiar texto fuera de inputs/textareas, se antepone `Pitonisa GPT dice:\n"..."` y se añade la URL de la app al final
- **Onboarding** (`OnboardingModal`): se muestra en la primera visita, pide nombre y fecha de nacimiento

---

## Documentación de módulos

| Archivo | Contenido |
|---|---|
| `docs/MVP.md` | Estado completo del producto — todas las funcionalidades |
| `docs/SUENOS.md` | Metodología, prompts y guía de refinamiento del módulo de sueños |
| `docs/CARTAS.md` | Referencia del mazo de tarot (78 cartas) |
| `docs/PROMPTS_CARTAS.md` | Prompts especializados por tirada |
