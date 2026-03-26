# Pitonisa GPT — Estado actual del producto

> Oráculo de tarot, astrología y numerología con Inteligencia Artificial. Interpretaciones personales, streaming en tiempo real y cálculo astronómico de precisión.

---

## Lo que hace la app

Pitonisa GPT combina tres disciplinas esotéricas —**Tarot**, **Astrología** y **Numerología**— con Claude (Anthropic) para generar lecturas únicas, personalizadas y en español, con una experiencia visual oscura e inmersiva.

---

## 1. Tiradas de Tarot

### Cómo funciona

1. El usuario elige una tirada desde el home
2. Ingresa su pregunta (si la tirada la requiere)
3. Las cartas se revelan animadamente una a una
4. La Pitonisa interpreta en tiempo real vía streaming — el texto aparece palabra por palabra

### Mazo

78 cartas: **22 Arcanos Mayores** (El Loco → El Mundo) + **56 Arcanos Menores** (Bastos, Copas, Espadas, Pentáculos). Posibilidad de salir en posición invertida (~33% de probabilidad). Modo de prueba disponible vía `?test=0,1r,2` en la URL.

### Tiradas disponibles — 30+ en total

**Consultas Rápidas**
| Tirada | Cartas | Descripción |
|---|---|---|
| Pregúntale al Tarot | 1 | Respuesta directa a una pregunta |
| Pregúntale 2 Cartas | 2 | Carta principal + complementaria |
| Tarot Sí o No | 1 | Veredicto SÍ / NO / TAL VEZ + interpretación |
| Sí o No de 2 Cartas | 2 | Carta de Luz y Carta de Sombra con veredicto |
| A Favor y En Contra | 2 | Fuerzas que impulsan y obstaculizan |
| Tarot Encrucijada | 5 | Decisión, dos caminos, consideración y resultado |
| Tarot Verdad Oculta | 4 | Apariencia, verdad oculta, lo que no ves, revelación |

**Amor y Relaciones**
| Tirada | Cartas | Descripción |
|---|---|---|
| Tarot del Amor | 3 | Tú, la otra persona, la relación |
| ¿Qué siente por mí? | 4 | Sentimientos, pensamientos, intenciones, futuro |
| Encontrar el Amor | 4 | Energía amorosa, soltar, atracción, consejo |

**Autoconocimiento**
| Tirada | Cartas | Descripción |
|---|---|---|
| Conoce tu Verdadero Yo | 5 | Identidad, potencial, sombra, propósito, plenitud |
| Tarot Espejo del Alma | 5 | Alma, proyección, interior, herida, don espiritual |
| Mente · Cuerpo · Espíritu | 3 | Tres dimensiones del ser |

**Tiempo y Destino**
| Tirada | Cartas | Descripción |
|---|---|---|
| Pasado · Presente · Futuro | 3 | Lectura temporal clásica |
| El Oráculo | 5 | Presente, futuro cercano, influencia oculta, consejo, resultado |
| Cruz Celta | 6 | Situación, desafío, base, pasado, posibilidad, resultado |
| Tarot Lunar | 4 | Una posición por cada fase de la luna |
| Tarot Estrella | 5 | Luz interna, guía, don para otros, deseo, esperanza |
| Tarot Gitano | 5 | Camino recorrido, destino, influencia ancestral, consejo |
| Matriz del Destino | 5 | Energía vital, misión, karma, talentos, destino final |

**Espiritualidad**
| Tirada | Cartas | Descripción |
|---|---|---|
| Sanación Emocional | 4 | Herida, origen, camino de sanación, poder curativo |
| Desarrollo Espiritual | 4 | Nivel actual, próxima lección, guía, destino espiritual |
| Tarot Cábala | 5 | 5 Sefirot: Kether, Chokmah, Binah, Chesed, Geburah |

**Abundancia**
| Tirada | Cartas | Descripción |
|---|---|---|
| Tarot del Dinero | 3 | Energía actual, obstáculo, consejo |

### Personalización de la IA por tirada

Cada tirada temática activa una voz distinta en el prompt de Claude:
- **Gitano** → voz ancestral, metáforas de camino y fuego
- **Cábala** → solemnidad del maestro cabalístico, Árbol de la Vida
- **Lunar** → poesía de las mareas y los ciclos femeninos
- **Estrella** → guía de luz cósmica, esperanzadora
- **Matriz del Destino** → karma, contratos de alma, numerología
- **Espejo del Alma** → profundidad psicológica, introspección sin juicio

---

## 2. Módulos Especiales

### Tarot del Día · `/tarot-diario`

- Carta diaria **determinista**: misma carta para el mismo usuario en el mismo día (hash SHA-256 de nombre + fecha_nacimiento + fecha)
- Arcanos Mayores + Menores, con posición invertida
- **Racha diaria (streak)**: contador de días consecutivos con badge 🔥, mejor racha histórica en localStorage
- **Hitos de racha**: celebraciones en 3, 7, 14, 21, 30, 60, 100 y 365 días con colores únicos
- "Vuelve mañana" nudge al terminar la lectura
- "Ya consultaste hoy" aviso si el usuario regresa el mismo día

### ¿Volverá mi ex? · `/volvera-ex`

- Tirada de 5 cartas especializada en relaciones pasadas
- Inputs: nombre, tiempo separados, razón de la ruptura, si hay contacto actual
- Animación de fases del oráculo al pulsar "Consultar" (igual que TarotDiario)
- Guardia anti-doble-click durante la consulta

### Compatibilidad Amorosa · `/compatibilidad`

- Cálculo de sinastría de dos cartas natales
- **Puntaje de compatibilidad 0–100%** emitido como meta-evento antes del streaming
- Interpretación personalizada con IA en streaming
- Inputs para ambas personas: nombre, fecha, hora y ciudad

### Tránsitos Planetarios · `/transitos`

- Planetas actuales en tránsito sobre el mapa natal del usuario
- Número de tránsitos activos emitido como meta-evento
- Hora de nacimiento opcional (usa mediodía solar si no se tiene)
- Calcula posiciones actuales vía Swiss Ephemeris

### Predicción del Año Personal · `/anyo-personal`

- **Número rector del año** calculado por numerología pitagórica (dígitos de fecha de nacimiento)
- Número emitido como meta-evento → revelan visualmente antes de que llegue el texto
- Arquetipo del año (ej. "El Año del Poder") en el encabezado
- Dot-row con tantos puntos como el número personal
- Interpretación en streaming con IA

---

## 3. Carta Astral · `/carta-astral`

Cálculo astronómico real del cielo en el momento exacto del nacimiento, seguido de una interpretación personalizada con IA.

### Datos que el usuario ingresa

- Nombre, fecha de nacimiento, hora (opcional), ciudad de nacimiento

### Cálculo astronómico

- **Motor:** Swiss Ephemeris (JPL/NASA DE431) vía `kerykeion`
- **Geocodificación:** OpenStreetMap Nominatim → lat/lng + zona horaria exacta
- **10 planetas:** Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón
- **Puntos extra:** Quirón, Nodo Norte, Nodo Sur, Lilith, Parte de Fortuna, Vértice, Ceres, Juno, Vesta, Palas
- **12 casas astrológicas** (sistema Placidus)
- **Aspectos mayores:** Conjunción, Sextil, Cuadratura, Trígono, Oposición, Quincuncio
- Al cargar la carta, guarda automáticamente signo Sol, Luna y Ascendente en el perfil del usuario

### Interpretación con IA — dos modelos en paralelo

| Tarea | Modelo | Output |
|---|---|---|
| Interpretación principal | Claude Sonnet 4.6 | 700–900 palabras en streaming SSE |
| Insights de tabs | Claude Haiku 4.5 | **Una sola llamada** → JSON estructurado con 17 claves |

Los 17 insights cubren: rueda, planetas, aspectos, casas, energía, Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón, Ascendente, tema_vida, patrones (+ Quirón, Lilith, Nodo Norte si están presentes).

La llamada a Haiku se lanza como `asyncio.create_task` **en paralelo** con el stream de Sonnet — los insights están listos para cuando termina la interpretación principal, sin añadir latencia extra al usuario.

### Visualizaciones — 6 tabs

**Tab 1 · Rueda** — SVG interactivo 400×400px: anillo zodiacal con 12 signos en colores, líneas de casas, glyphs de planetas, líneas de aspectos (verde = armoniosos, rojo = tensos, ámbar = neutros), etiquetas ASC/DSC/MC/IC, leyenda.

**Tab 2 · Planetas** — Cards de interpretación IA para Sol, Luna, Venus+Marte, Júpiter+Saturno; grid con los 10 planetas (signo, grados, casa, retrógrado); grid de puntos adicionales.

**Tab 3 · Aspectos** — Tabla completa de aspectos: ícono, nombre, tipo (armónico / tenso / neutro), orbe en grados.

**Tab 4 · Casas** — Tabla de las 12 casas con cúspide (grados + signo) y significado de vida; casas angulares destacadas en dorado.

**Tab 5 · Energía** — Donuts SVG con distribución de Elementos, Modalidades, Polaridad y Cuadrantes; cards de elementos con porcentaje, barra y palabras clave.

**Tab 6 · Patrones** — Planeta rector, secta (diurna/nocturna), esteliones, configuraciones especiales (Gran Trígono, Cruz en T, Cruz Mayor, Yod), dignidades planetarias, énfasis hemisférico, puntos especiales.

### Hero-cards Sol / Luna / Ascendente

Tres cards prominentes siempre visibles sobre los tabs: signo, elemento, modalidad, planeta rector y texto interpretativo de la IA. Glow de color por elemento (fuego = naranja, agua = índigo, aire = celeste, tierra = lima).

---

## 4. Dashboard Cósmico en el Home — "✦ Tu cielo ahora"

Sección visual unificada bajo el header principal con tres componentes en tiempo real:

### Luna en Tiempo Real

- Fase lunar actual calculada via `kerykeion` (ángulo Luna−Sol)
- Muestra: emoji de fase, nombre de fase, signo lunar, % de iluminación (barra), próxima fase en días
- Gold shimmer para Luna Llena y Luna Nueva
- Enlace a `/tirada/lunar`
- Cache 1 hora en localStorage

### Retrato Numerológico

- **Número de Vida** calculado desde la fecha de nacimiento (método pitagórico, preserva números maestros 11/22/33)
- **Número de Destino** (todas las letras del nombre)
- **Número de Alma** (solo vocales)
- Badge del número con glow dorado para números maestros
- Título y keyword del arquetipo (ej. "El Sabio · Espiritualidad")
- Descripción del número + Destino y Alma como datos secundarios
- Enlace a `/anyo-personal`
- Solo visible si el usuario tiene fecha de nacimiento guardada

### Planetas Retrógrados Activos

- Detecta planetas retrógrados usando `pyswisseph` directamente (`swe.calc_ut` con `FLG_SPEED`)
- Para cada planeta retrógrado: símbolo astrológico con glow de color único por planeta, nombre, badge "Retrógrado", fecha "hasta el X", significado (ej. "comunicación, contratos y tecnología bajo revisión"), consejo práctico en itálica
- Búsqueda binaria para encontrar fecha de estación directa (max 300 días)
- Colores únicos: Mercurio=slate, Venus=rose, Marte=red, Júpiter=amber, Saturno=yellow, Urano=cyan, Neptuno=blue, Plutón=violet
- Estado vacío: card verde "Cielo directo — energía favorable"
- Skeleton mientras carga; `null` en caso de error de red
- Cache 12 horas en localStorage
- Enlace a `/transitos`

### Layout del dashboard

- Grid 2 columnas: Luna (izq) + Numerología (der) — cards de altura igual
- Si no hay fecha de nacimiento: solo Luna a ancho completo
- Planetas retrógrados en ancho completo debajo
- 1 retrógrado → card full-width; 2+ → grid 2 columnas

---

## 5. Perfil de usuario persistente

- Guardado en `localStorage` bajo clave `pitonisa_profile`
- Campos: nombre, fecha_nacimiento, hora_nacimiento, ciudad, nombre_pareja, fecha_nacimiento_pareja, signo_sol, signo_luna, signo_ascendente
- Los signos Sol/Luna/Ascendente se guardan automáticamente al calcular la carta astral
- Todos los formularios de la app pre-rellenan sus campos desde el perfil

### Perfil de signos en el Home

- Si el usuario tiene signos guardados: muestra "Hola, {nombre}" + pills ☀️ Sol · 🌙 Luna · ↑ Ascendente
- Si no: muestra el conteo de tiradas y módulos disponibles

---

## 6. Onboarding

- Modal de bienvenida en la primera visita (flag `pitonisa_onboarding_done` en localStorage)
- 2 pasos: nombre (requerido) → fecha de nacimiento (opcional, con botón "Saltar")
- Barra de progreso (50% → 100%), puntos de paso, animación de fade-out al cerrar
- Título: "El oráculo te espera" (neutro, sin género)
- Guarda directamente en el perfil del usuario vía `updateProfile`

---

## 7. SEO y Open Graph

- Cada página usa `<SeoHead>` (react-helmet-async) con título, descripción y tags OG dinámicos
- Formato de título: `{Página} — Pitonisa GPT`
- Tags estáticos en `index.html` para WhatsApp/Facebook (no requieren JS)
- `react-helmet-async` para Telegram y Google con tags dinámicos por página
- OG image referenciada: `/og-image.png` (1200×630px)
- Var de entorno `VITE_APP_URL` para URL base

---

## 8. Experiencia de usuario

- **Streaming en tiempo real** — el texto de la Pitonisa aparece palabra por palabra
- **Efecto typewriter** — suavizado de los chunks SSE a ~250 chars/seg, snap al final
- **Fondo de estrellas animado** — StarField dinámico en toda la app (configurable)
- **Fases del oráculo** — mensajes místicos rotativos + waveform animado mientras carga
- **Cartas animadas** — flip animation con stagger de 400ms por carta
- **Diseño oscuro-místico** — paleta azul noche / dorado / púrpura con glow, shimmer y float
- **Responsive** — grid adaptativo mobile/desktop (1 → 2 → 3 columnas)
- **Guardrails de seguridad** — validación de inputs, protección anti-prompt-injection, el modelo nunca se revela

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python) + Uvicorn |
| IA — Tarot | Claude Haiku 4.5 (streaming SSE) |
| IA — Carta Astral | Claude Sonnet 4.6 (stream) + Claude Haiku 4.5 (insights paralelos) |
| Astrología | kerykeion + pyswisseph (Swiss Ephemeris / JPL DE431) |
| Geocodificación | OpenStreetMap Nominatim + TimezoneFinder |
| Streaming | Server-Sent Events (SSE) |
| Concurrencia | asyncio — 1 llamada JSON a Haiku corre en paralelo al stream de Sonnet |
| SEO | react-helmet-async + OG tags estáticos en index.html |
| Persistencia | localStorage (perfil, streak, caché lunar, caché retrógrados) |
| Routing | React Router v6 |

---

## API Endpoints

| Endpoint | Método | Módulo |
|---|---|---|
| `/api/interpret` | POST | Tiradas de Tarot (genérico) |
| `/api/carta-astral` | POST | Carta Astral completa |
| `/api/tarot-diario` | POST | Tarot del Día |
| `/api/volvera-ex` | POST | ¿Volverá mi ex? |
| `/api/compatibilidad` | POST | Compatibilidad Amorosa |
| `/api/transitos` | POST | Tránsitos Planetarios |
| `/api/anyo-personal` | POST | Predicción del Año Personal |
| `/api/moon-phase` | GET | Fase lunar actual (cacheable) |
| `/api/retrograde-planets` | GET | Planetas retrógrados (cacheable) |

---

## Lo que NO tiene aún (posibles next steps)

- Autenticación / cuentas de usuario (sin servidor)
- Historial de lecturas guardadas
- Pagos o acceso premium
- Sinastría completa (comparación visual de dos ruedas)
- Notificaciones push (recordatorio de tarot diario)
- Versión en otros idiomas (solo español)
- OG image real (`/og-image.png` está referenciada pero no generada)
- Deploy de `/api/moon-phase` y `/api/retrograde-planets` en producción
