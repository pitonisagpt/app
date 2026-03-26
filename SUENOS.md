# Módulo: Interpretación de Sueños

> Ruta: `/suenos` · Endpoint: `POST /api/suenos`

---

## Metodología

### Técnica de la Continuidad (Domhoff / Hall)

Los sueños no son mensajes cifrados del cosmos ni predicciones — son el lenguaje del inconsciente sobre las **preocupaciones actuales** del soñador. El sueño es un espejo del estado emocional y mental de *hoy*.

Implicación práctica: la interpretación siempre conecta los símbolos del sueño con algo que la persona probablemente está viviendo, postergando o evitando en su vida real. No se inventan significados universales — se construyen a partir del contexto específico de cada persona.

### Diccionario Arquetípico de IA (dinámico)

En lugar de un diccionario estático de símbolos ("agua = emociones"), Claude actúa como un **diccionario arquetípico dinámico**: extrae los 3 símbolos más significativos del sueño y les asigna significado arquetípico *en el contexto concreto de esa persona* — considerando su emoción al despertar, si el sueño es recurrente y su signo solar (si está disponible en el perfil).

El marco de referencia es **junguiano**: La Sombra, El Ánima/Ánimus, El Sí-Mismo, El Héroe, El Mentor, La Gran Madre, El Embaucador, El Niño Interior, El Umbral, etc.

### Continuación Consciente (variante simulada)

La Técnica de la Continuidad en su forma terapéutica pura es iterativa (el terapeuta guía al paciente a "continuar" el sueño conscientemente). En este módulo se implementa en **modo simulado de una sola pasada**: la Pitonisa propone al final de la lectura cómo el soñador podría terminar el sueño si lo imaginara despierto — qué acción simbólica resolvería la tensión emocional del sueño.

---

## Inputs del usuario

| Campo | Tipo | Validación | Notas |
|---|---|---|---|
| `nombre` | string | 1–60 chars | Se pre-rellena desde el perfil |
| `sueno` | string | 15–1500 chars | Textarea libre |
| `emocion` | enum | requerido | Miedo / Angustia / Confusión / Paz / Alegría / Amor / Tristeza / Extrañeza |
| `recurrente` | bool | default false | Toggle — activa párrafo de ciclo sin resolver |
| `signo_sol` | string opcional | — | Se toma del perfil si existe |

La emoción es **obligatoria** porque es el puente de la Técnica de la Continuidad: sin ella la interpretación pierde su anclaje al estado emocional actual del soñador y se vuelve genérica.

---

## Flujo técnico

```
Usuario → POST /api/suenos
                │
                ▼
    Llamada 1: Haiku (no-streaming)
    Extrae 3 símbolos + arquetipo central → JSON
                │
                ▼
    SSE meta-event: { __simbolos__: { simbolos: [...], arquetipo_central: "..." } }
    → Frontend revela los símbolos y el arquetipo visualmente
                │
                ▼
    Llamada 2: Haiku (streaming)
    Interpretación completa 420–520 palabras
                │
                ▼
    SSE text chunks → typewriter effect
                │
                ▼
    SSE: [DONE]
```

Ambas llamadas usan **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`). El costo es bajo; si se quisiera profundidad mayor en la interpretación, la llamada 2 podría subirse a Sonnet.

---

## Prompts actuales

### System prompt — Llamada 1 (extracción de símbolos)

```
Eres un intérprete experto del lenguaje simbólico de los sueños.
Analizas sueños usando la técnica de la continuidad (los sueños reflejan las preocupaciones actuales)
y un diccionario arquetípico dinámico basado en Jung.
Respondes SOLO con JSON válido, sin texto adicional, sin markdown.
```

### User prompt — Llamada 1 (plantilla)

```
Sueño de {nombre}: "{sueno}"

Emoción predominante: {emocion}. [Es un sueño recurrente.] [Signo solar: {signo_sol}.]

Identifica los 3 símbolos más significativos de este sueño y el arquetipo central que lo rige.
Para cada símbolo asigna su significado arquetípico específico para esta persona (técnica de la continuidad).

Responde EXACTAMENTE con este JSON (sin markdown, sin texto extra):
{"simbolos":[{"simbolo":"...","arquetipo":"...","significado":"qué revela sobre su vida actual en máx 8 palabras"},...],"arquetipo_central":"..."}
```

**Output esperado (JSON):**
```json
{
  "simbolos": [
    { "simbolo": "agua oscura", "arquetipo": "La Sombra", "significado": "emociones que evitas procesar" },
    { "simbolo": "puerta cerrada", "arquetipo": "El Umbral", "significado": "decisión que pospones tomar" },
    { "simbolo": "figura persecutora", "arquetipo": "El Ánimus", "significado": "parte de ti que no aceptas" }
  ],
  "arquetipo_central": "La Sombra"
}
```

---

### System prompt — Llamada 2 (interpretación)

```
Eres Pitonisa, intérprete de los mensajes del inconsciente profundo. Hablas en español con tono íntimo,
directo y sin misticismo vacío. Tu lectura conecta lo que el sueño muestra con lo que la persona vive ahora.
Usas el método de la continuidad: los sueños son el lenguaje del inconsciente sobre preocupaciones reales actuales.
Hablas de emociones concretas, no de 'energías cósmicas'. Responde siempre en español.
```

### User prompt — Llamada 2 (plantilla)

```
Eres Pitonisa. {nombre} te cuenta este sueño: "{sueno}"

Emoción predominante al despertar: {emocion}. [Es un sueño recurrente — el inconsciente insiste en algo sin resolver.]
[Su signo solar es {signo_sol}.]
Símbolos identificados:
- {simbolo} → {arquetipo}: {significado}
- ...

Arquetipo central: {arquetipo_central}

Interpreta este sueño usando la técnica de la continuidad: conecta cada símbolo con algo que {nombre}
probablemente está viviendo, postergando o evitando ahora mismo. No inventes detalles pero sé directa
sobre lo que el inconsciente parece señalar.

Estructura (sin títulos, párrafos corridos):
1. Párrafo de entrada: qué le está diciendo este sueño a {nombre} sobre su momento actual
2. Un párrafo por cada símbolo: qué representa en el contexto de su vida
3. Párrafo de continuación consciente: cómo {nombre} podría terminar este sueño de forma sana
   si lo imaginara despierto/a — qué acción simbólica resolvería la tensión
4. Cierra con una sola pregunta reflexiva concreta dirigida a {nombre}

Habla directo a {nombre} usando "tú". Sin frases como "las energías te invitan" o "el universo prepara".
Habla de situaciones y emociones reales. Sin encabezados, sin listas. Extensión: 420-520 palabras.
```

---

## Posibles refinamientos

### Calidad de la interpretación

- **Subir llamada 2 a Sonnet** si las interpretaciones resultan superficiales o genéricas. Haiku es suficiente para iteraciones rápidas.
- **Añadir fecha de nacimiento al contexto** para cruzar con número de vida o año personal del usuario (ya disponibles en el perfil).
- **Añadir tránsitos activos** como contexto opcional — si Mercurio retrógrado está activo, mencionarlo como capa adicional de la continuidad.
- **Incluir los signos Luna y Ascendente** además del Sol para usuarios con carta astral calculada.

### Estructura del output

- Actualmente la estructura tiene 4 bloques fijos. Se podría probar una versión más libre donde la IA determine la estructura según el tipo de sueño (pesadilla vs. sueño lúcido vs. sueño de ansiedad).
- Considerar un **5.º bloque opcional**: "Símbolo para llevar al día" — un objeto, color o imagen del sueño que el soñador puede usar como ancla consciente durante el día.

### Extracción de símbolos

- Actualmente se extraen siempre exactamente 3. Probar con 2–4 dinámicos según la riqueza del sueño.
- El `arquetipo_central` podría incluir una breve descripción junguiana en lugar de solo el nombre.
- Si el sueño es muy corto o vago (< 50 chars), la calidad de los símbolos baja mucho — considerar un aviso en UI o un mínimo mayor.

### UX

- Sueños recurrentes podrían tener un flujo especial: pedir cuántas veces ha ocurrido y cuándo empezó.
- Añadir un campo opcional "¿Qué estás viviendo ahora?" para que el usuario entregue contexto explícito a la técnica de la continuidad, en lugar de que la IA lo infiera.
- Compartir resultado: el párrafo de continuación consciente es el más personal — podría tener su propio botón de copia.

### Arquetipos utilizables

Los arquetipos junguianos más relevantes para sueños (referencia para evaluar si el modelo los usa bien):

| Arquetipo | Aparece cuando |
|---|---|
| La Sombra | Persecuciones, figuras amenazantes, lugares oscuros |
| El Ánima (♀ en hombre) | Figura femenina misteriosa, agua, luna |
| El Ánimus (♂ en mujer) | Figura masculina dominante, fuego, decisiones |
| El Sí-Mismo | Mandala, círculo, unión de opuestos, iluminación |
| El Héroe | Viaje, obstáculo que superar, prueba |
| El Mentor / Viejo Sabio | Figura anciana que guía, voz interior |
| La Gran Madre | Naturaleza, hogar, nutrir o devorar |
| El Embaucador | Caos, humor negro, reglas rotas |
| El Niño Interior | Infancia, juego, vulnerabilidad, inicio |
| El Umbral | Puerta, frontera, decisión inminente |

---

## Archivos relevantes

- Backend: `backend/routes/suenos.py`
- Frontend: `frontend/src/pages/Suenos.jsx`
- Registro en router: `backend/main.py`
- Registro en React Router: `frontend/src/App.jsx`
- Card en home: `frontend/src/data/modules.js`
