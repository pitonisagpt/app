# Card Swipe UX — TikTok-style reveal

## Objetivo

Reemplazar los botones "Revelar carta" / "Siguiente carta →" por una experiencia de gestos inmersiva: deslizar hacia arriba y abajo para navegar entre cartas, tocar para voltearlas.

---

## Gestos

| Gesto | Acción |
|---|---|
| **Tap** sobre la carta | Voltea la carta (flip 3D) |
| **Swipe up** | Avanza a la siguiente carta (solo si la actual ya está volteada) |
| **Swipe down** | Retrocede a la carta anterior (ya revelada) |
| **Tecla ↑ / ↓** | Mismo comportamiento en desktop |
| **Espacio / Enter** | Voltea la carta en desktop |

---

## Layout — pantalla completa inmersiva

```
┌─────────────────────────────┐
│  ●●○○○        Carta 2 de 5 │  ← barra superior fija
│  "Lo que realmente          │
│   siente ahora"             │  ← posición de la carta
├─────────────────────────────┤
│                             │
│      ┌───────────────┐      │
│      │               │      │
│      │    [CARTA]    │      │  ← ~65vh, centrada, touch target
│      │               │      │
│      └───────────────┘      │
│                             │
│   ↑ desliza para siguiente  │  ← hint que desaparece tras 1er swipe
│                             │
├─────────────────────────────┤
│  [Texto de la carta         │  ← aparece tras voltear, streaming
│   streameando aquí…]        │
│                             │
│  [🔄 Carta invertida]       │  ← solo si aplica
└─────────────────────────────┘
```

---

## Animaciones

| Evento | Animación |
|---|---|
| Carta nueva (swipe up) | Entra desde abajo (`slideInFromBottom`) |
| Carta anterior (swipe down) | Entra desde arriba (`slideInFromTop`) |
| Carta sale (swipe up) | Sale hacia arriba (`slideOutToTop`) |
| Carta sale (swipe down) | Sale hacia abajo (`slideOutToBottom`) |
| Tap para voltear | Flip 3D existente |
| Carta invertida | Shake + glow rojo tras el flip |
| Hint "desliza" | Fade out tras el primer swipe |
| Texto de la carta | `fadeInUp` con delay de 400ms tras el flip |

Duración base de transición: `380ms cubic-bezier(0.22, 1, 0.36, 1)` (igual que TikTok).

---

## Reglas de comportamiento

- **No se puede swipe up** antes de voltear la carta actual — la carta tiembla ligeramente como feedback
- **Swipe down** disponible desde la carta 2 en adelante
- Al retroceder, la carta ya aparece volteada y con su texto visible (no hay que volver a tocar)
- El texto de cada carta se guarda en estado — no se pierde al navegar atrás
- Tras voltear la carta 5, el texto de cierre aparece en la zona de caption
- Swipe up en la carta 5 (tras ver el cierre) → transición a la lectura completa

---

## Reglas de touch

```
touchstart  → guardar Y inicial + timestamp
touchmove   → opcional: mover carta sutilmente con el dedo (parallax leve)
touchend    → calcular deltaY y velocidad

si |deltaY| < 10px           → tap → flip
si deltaY > 50px ó vel > 0.3 → swipe up → siguiente
si deltaY < -50px ó vel > 0.3→ swipe down → anterior
```

Umbral de velocidad: `velocidad = |deltaY| / deltaTimeMs > 0.3` cuenta como swipe aunque no supere los 50px.

---

## Archivos a modificar

### `frontend/src/pages/VolveraEx.jsx`
- Reemplazar layout actual del step `cards` por layout full-screen
- Añadir hook `useSwipe` con lógica de touchstart/touchend
- Añadir listeners de teclado (`useEffect` con keydown)
- Gestionar dirección de animación con estado `slideDirection` (`up` | `down`)
- Al avanzar desde carta 5 → `setStep('reading')`

### `frontend/tailwind.config.js`
Añadir 4 keyframes:
```js
slideInFromBottom: { '0%': { opacity: '0', transform: 'translateY(60px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
slideOutToTop:     { '0%': { opacity: '1', transform: 'translateY(0)' }, '100%': { opacity: '0', transform: 'translateY(-60px)' } },
slideInFromTop:    { '0%': { opacity: '0', transform: 'translateY(-60px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
slideOutToBottom:  { '0%': { opacity: '1', transform: 'translateY(0)' }, '100%': { opacity: '0', transform: 'translateY(60px)' } },
```

### `frontend/src/components/oracle/CardDisplay.jsx`
- Añadir prop `fill?: boolean` — cuando `true`, la carta ocupa el 100% del contenedor padre en lugar de tener dimensiones fijas
- El contenedor padre en VolveraEx controla el tamaño real

---

## Estado nuevo en VolveraEx

```js
const [slideDirection, setSlideDirection] = useState('up') // 'up' | 'down'
const [isAnimating, setIsAnimating]       = useState(false) // bloquea gestos durante transición
const [hintVisible, setHintVisible]       = useState(true)  // hint "desliza"
```

`flippedCards` y `cardTexts` ya existen — no necesitan cambios.

---

## Feedback táctil (nice to have)

- Si el usuario intenta swipe up antes de voltear → carta hace un micro-shake horizontal
- Vibración en mobile: `navigator.vibrate(10)` en el flip (si está disponible)
- Al llegar a la última carta → vibración corta doble: `navigator.vibrate([10, 50, 10])`

---

## Fallback desktop

- **Click** sobre la carta → flip
- **↑ flecha** → siguiente (si ya volteada)
- **↓ flecha** → anterior
- **Espacio** → flip
- Botones de navegación pequeños y sutiles como alternativa visual

---

## Lectura completa (step `reading`) — sin cambios

El step `reading` existente no cambia. La transición hacia él ocurre como ahora, tras el swipe up en la carta 5.
