# Pitonisa GPT — MVP

> Oráculo de tarot e astrología con Inteligencia Artificial. Interpretaciones personales, streaming en tiempo real y cálculo astronómico de precisión.

---

## Lo que hace la app

Pitonisa GPT tiene dos módulos principales: **Tiradas de Tarot** y **Carta Astral**. Ambos usan Claude (Anthropic) para generar interpretaciones únicas, personalizadas y en español, con una experiencia visual inmersiva.

---

## 1. Tiradas de Tarot

### Cómo funciona

1. El usuario elige una tirada desde el home
2. Ingresa su pregunta (si la tirada la requiere)
3. Las cartas se revelan animadamente una a una
4. La Pitonisa interpreta en tiempo real vía streaming — el texto aparece palabra por palabra

### Mazo

22 Arcanos Mayores (El Loco → El Mundo), con posibilidad de salir en posición invertida (~33% de probabilidad). Cada carta tiene su nombre, símbolo y posición dentro de la tirada.

### Tiradas disponibles — 22 en total

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

## 2. Carta Astral

Cálculo astronómico real del cielo en el momento exacto del nacimiento, seguido de una interpretación personalizada con IA.

### Datos que el usuario ingresa

- Nombre
- Fecha de nacimiento (día, mes, año)
- Hora de nacimiento (opcional — si no la sabe, se usa mediodía solar)
- Ciudad de nacimiento

### Cálculo astronómico

- **Motor:** Swiss Ephemeris (JPL/NASA DE431) vía la librería Python `kerykeion`
- **Geocodificación:** OpenStreetMap Nominatim → latitud, longitud y zona horaria exacta
- **10 planetas principales:** Sol, Luna, Mercurio, Venus, Marte, Júpiter, Saturno, Urano, Neptuno, Plutón
- **Puntos extra:** Quirón, Nodo Norte, Nodo Sur, Lilith, Parte de Fortuna, Vértice, Ceres, Juno, Vesta, Palas
- **12 casas astrológicas** (sistema Placidus)
- **Aspectos mayores:** Conjunción, Sextil, Cuadratura, Trígono, Oposición, Quincuncio

### Interpretación con IA (dos modelos en paralelo)

| Tarea | Modelo | Descripción |
|---|---|---|
| Interpretación tarot | Claude Haiku 4.5 | 400–600 palabras en streaming |
| Interpretación carta astral | Claude Sonnet 4.6 | 700–900 palabras en streaming, requiere mayor profundidad |
| Insights de tabs | Claude Haiku 4.5 | 12 textos cortos en JSON, generados en paralelo |

Los 12 insights cubren: rueda, planetas, aspectos, casas, energía, Sol, Luna, Ascendente, Venus+Marte, Júpiter+Saturno, patrones y tema de vida.

### Visualizaciones — 6 tabs

**Tab 1 · Rueda**
- SVG interactivo de la carta natal (400×400px)
- Anillo zodiacal con los 12 signos en colores
- Líneas de casas (ángulos ASC/IC/DSC/MC destacados)
- Números de casas en el interior
- Gliphs de planetas con colores únicos por planeta
- Líneas de aspectos (verde = armoniosos, rojo = tensos, ámbar = neutros)
- Etiquetas ASC, DSC, MC, IC
- Leyenda de aspectos

**Tab 2 · Planetas**
- Cards de interpretación personal para Sol, Luna, Venus+Marte, Júpiter+Saturno (con texto de la IA)
- Grid con los 10 planetas: signo, grados, casa, indicador de retrógrado
- Grid de puntos adicionales: Quirón, Lilith, Nodo Norte

**Tab 3 · Aspectos**
- Tabla completa de todos los aspectos detectados
- Ícono y nombre del aspecto, tipo (armónico / tenso / neutro), orbe en grados

**Tab 4 · Casas**
- Tabla de las 12 casas con cúspide (grados + signo) y significado de vida
- Casas angulares (ASC, IC, DSC, MC) destacadas en dorado

**Tab 5 · Energía**
- Donuts SVG con distribución de Elementos, Modalidades, Polaridad y Cuadrantes
- Cards de elementos con porcentaje, barra de progreso y palabras clave (ej. Fuego → Pasión, Impulso, Liderazgo)

**Tab 6 · Patrones**
- **Planeta Rector** — el planeta que gobierna el Ascendente, con su posición y casa
- **Secta** — si la carta es Diurna (Sol, Júpiter, Saturno fuertes) o Nocturna (Luna, Venus, Marte fuertes)
- **Esteliones** — grupos de 3+ planetas en el mismo signo
- **Configuraciones especiales** — Gran Trígono, Cruz en T, Cruz Mayor, Dedo del Destino (Yod)
- **Dignidades planetarias** — domicilio ✨, exaltación ⬆️, detrimento ⬇️, caída 📉 para cada planeta
- **Énfasis hemisférico** — distribución Norte/Sur/Este/Oeste con descripciones
- **Puntos especiales** — Parte de Fortuna, Vértice, asteroides principales, Nodo Sur

### Cards de Sol / Luna / Ascendente (siempre visibles sobre los tabs)

Tres hero-cards prominentes mostrando los tres pilares de la personalidad:
- Símbolo del signo, elemento, modalidad y planeta rector de cada uno
- Glow de color según el elemento (fuego = naranja, agua = índigo, aire = celeste, tierra = lima)
- Texto interpretativo corto generado por la IA

### Tema de Vida

Al final de la interpretación principal, una card especial con el resumen del propósito de alma según la síntesis total de la carta.

---

## Experiencia de usuario

- **Streaming en tiempo real** — el texto de la Pitonisa aparece palabra por palabra
- **Fondo de estrellas animado** — campo estelar dinámico en toda la app
- **Animaciones de carga** — fases de consulta con íconos rotativos y puntos pulsantes
- **Diseño oscuro-místico** — paleta azul noche / dorado / púrpura con efectos glow
- **Responsive** — funciona en móvil y desktop
- **Guardrails de seguridad** — validación de inputs, protección contra prompt injection, nunca revela el sistema ni el modelo de IA

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | FastAPI (Python) + Uvicorn |
| IA | Claude Haiku 4.5 (tarot) + Claude Sonnet 4.6 (carta astral) + Claude Haiku 4.5 (insights) |
| Astrología | kerykeion (Swiss Ephemeris / JPL DE431) |
| Geocodificación | OpenStreetMap Nominatim + TimezoneFinder |
| Streaming | Server-Sent Events (SSE) |
| Concurrencia | asyncio — Haiku corre en paralelo al stream de Sonnet |

---

## Lo que NO tiene el MVP (next steps)

- Autenticación / cuentas de usuario
- Guardado de lecturas o historial
- Pagos o acceso premium
- Cartas menores del Tarot (solo Arcanos Mayores)
- Sinastría (comparación de dos cartas astrales)
- Tránsitos y predicciones futuras
- Versión en otros idiomas
