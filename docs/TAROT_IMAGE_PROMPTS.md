# Tarot Image Prompts — Nano Banana Style

Guía para generar imágenes de cartas de tarot con el estilo visual de Nano Banana, optimizada para **Nano Banana 2** (Gemini 3.1 Flash Image).

---

## Cómo usar en Nano Banana 2

**Fórmula:** `[Sujeto] + [Acción] + [Contexto/Escena] + [Composición] + [Estilo]`

Reglas clave:
- Empieza siempre con un **verbo fuerte** que describa la operación principal ("Generate", "Illustrate", "Create")
- Describe en positivo lo que quieres — no uses "no" ni "without"
- Especifica el aspect ratio en lenguaje natural: `"in a 2:3 portrait format"`
- Sin flags de Midjourney (`--ar`, `--stylize`, `--no`) — todo en prosa narrativa
- Puedes iterar conversacionalmente: genera una carta y luego pide ajustes

---

## Estilo de referencia (Nano Banana visual identity)

```
Whimsical digital illustration combining flat 2D botanical art with surreal 2D landscapes.
Dominant palette of deep forest green (#3A441C) and electric lavender blue (#5972F6).
Mossy silhouettes with intricate floral embroidery detail. Rolling hills with heavy grainy
film texture and risograph print effect. Delicate wildflower patterns in pale lavender (#BCB2F7).
Vintage storybook charm meets modern minimalist graphic design. Subtle accent pops of
vibrant red (#E03002) and soft peach (#FAB472). Soft diffused daylight, dreamy low-contrast haze.
Clean cream-white borders with thin serif typography.
```

---

## Paleta de color

| Rol | Color | Hex | % |
|---|---|---|---|
| Dominante | Azul lavanda eléctrico | `#5972F6` | 52% |
| Dominante | Verde bosque profundo | `#3A441C` | 52% |
| Secundario | Lavanda pálido | `#BCB2F7` | 26% |
| Secundario | Verde menta pálido | `#79834A` | 26% |
| Soporte | Verde crema hueso | `#F0FAE3` | 18% |
| Soporte | Blanco crema | `#F7EEE7` | 18% |
| Soporte | Negro vampiro | `#060408` | 18% |
| Acento | Rojo vibrante | `#E03002` | 4% |
| Acento | Melocotón suave | `#FAB472` | 4% |

---

## Plantilla genérica para cualquier carta

```
Generate a whimsical tarot card illustration of [NOMBRE DE LA CARTA] in a 2:3 portrait format.

[Sujeto] A [descripción del símbolo central] rendered as a mossy silhouette in deep forest
green (#3A441C) with intricate electric lavender (#5972F6) floral embroidery detail.

[Acción] [Qué está haciendo la figura o cómo se presenta el símbolo.]

[Contexto] The background shows [descripción del paisaje/escena] using a topographic
landscape style with rolling hills and soft misty gradients in muted forest greens and
pale lavender (#BCB2F7).

[Composición] The composition is centered in a collage-style arrangement with a clean
cream-white border (#F7EEE7) and the card title "[NOMBRE · NÚMERO]" in thin serif
typography at the bottom.

[Estilo] The overall aesthetic blends vintage storybook charm with modern minimalist
graphic design. Apply heavy film grain texture, a risograph print effect, and dreamy
soft diffused daylight with low-contrast haze. Add small accent details in vibrant
red (#E03002) and soft peach (#FAB472). Color priority is high — maintain the exact
palette distribution throughout.
```

---

## Prompts por arcano mayor — formato Nano Banana 2

### 0 · El Loco

```
Generate a whimsical tarot card illustration of "El Loco" in a 2:3 portrait format.

A carefree traveler silhouette mid-leap over a mossy cliff edge, rendered in deep forest
green (#3A441C) with electric lavender (#5972F6) floral embroidery across their patchwork
coat. A small dog companion appears as a delicate botanical line motif at their heels,
and a bindle on a stick features a vibrant red (#E03002) knot as the focal accent.

The traveler gazes upward with an expression of joyful abandon, one foot lifted into open air.

The background shows rolling pale green hills fading into a dreamy misty haze, with
a topographic wildflower meadow in pale lavender (#BCB2F7) line art below the cliff edge.

The composition is centered with the figure slightly off-balance to convey movement,
framed by a clean cream-white border (#F7EEE7) with "EL LOCO · 0" in thin serif
typography at the bottom.

The style blends vintage storybook charm with modern minimalist graphic design.
Apply heavy film grain, risograph print texture, and soft diffused daylight with
a dreamy low-contrast haze. Color priority is high.
```

### I · El Mago

```
Generate a whimsical tarot card illustration of "El Mago" in a 2:3 portrait format.

A standing magician silhouette in deep forest green (#3A441C), one arm raised toward
the sky and one pointing to the earth, with electric lavender (#5972F6) floral embroidery
forming an infinity symbol above their head. A wand, cup, sword, and pentacle are
arranged on a table as delicate botanical line art in pale lavender (#BCB2F7).

The figure stands with commanding presence, channeling energy between sky and ground.

The background features a topographic landscape of rolling hills in muted forest greens,
with wildflower patterns framing the scene and a soft peach (#FAB472) candle flame
glowing on the table as the warm accent detail.

The composition is centered and upright with the infinity symbol drawing the eye,
framed by a clean cream-white border (#F7EEE7) with "EL MAGO · I" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print effect, and dreamy soft diffused daylight.
Vintage storybook meets modern minimalism. Color priority is high.
```

### II · La Sacerdotisa

```
Generate a whimsical tarot card illustration of "La Sacerdotisa" in a 2:3 portrait format.

A serene seated figure between two tall mossy pillars rendered in deep forest green
(#3A441C), wearing a crown of electric lavender (#5972F6) floral embroidery in a
crescent moon shape. An unfurled scroll across her lap is illustrated as a botanical
wildflower map in pale lavender (#BCB2F7) line art.

The figure sits in stillness, her gaze forward and knowing, holding ancient wisdom.

The background shows a calm pool of water reflecting pale lavender light, with pomegranate
motifs in vibrant red (#E03002) flanking the pillars and a topographic forest horizon
fading into dreamy haze behind.

The composition places the figure symmetrically between the pillars, framed by a clean
cream-white border (#F7EEE7) with "LA SACERDOTISA · II" in thin serif typography at the bottom.

Apply heavy film grain, risograph print texture, and soft low-contrast diffused daylight.
Vintage storybook aesthetic with modern minimalist design. Color priority is high.
```

### III · La Emperatriz

```
Generate a whimsical tarot card illustration of "La Emperatriz" in a 2:3 portrait format.

A lush botanical throne of intertwined vines and wildflowers cradles a seated figure
in deep forest green (#3A441C), wearing an electric lavender (#5972F6) floral crown
embroidery. The Venus symbol floats beside her as a delicate pale lavender (#BCB2F7)
line art motif.

The figure reclines with abundant, nurturing energy, one hand resting on a pomegranate
in vibrant red (#E03002) and the other open in welcome.

The background shows a topographic wheat field landscape with rolling green gradients
and soft peach (#FAB472) harvest accents glowing at the horizon under dreamy haze.

The composition is warm and expansive with the throne filling the frame, framed by a
clean cream-white border (#F7EEE7) with "LA EMPERATRIZ · III" in thin serif typography at the bottom.

Apply heavy film grain, risograph print effect, and soft diffused daylight.
Vintage storybook meets modern botanical illustration. Color priority is high.
```

### IV · El Emperador

```
Generate a whimsical tarot card illustration of "El Emperador" in a 2:3 portrait format.

An imposing angular throne of mossy stone in deep forest green (#3A441C), with a commanding
figure seated upright, armored in electric lavender (#5972F6) floral embroidery. Ram-head
motifs appear on the throne armrests as botanical line art. An orb and a scepter rest in
the figure's hands, illustrated as stylized botanical forms in pale lavender (#BCB2F7).

The figure projects authority and order, looking directly forward with unwavering stillness.

The background features an arid topographic mountain range in muted greens and grey-greens,
with a vibrant red (#E03002) shield crest as the single focal accent.

The composition is frontal and symmetrical with the throne centered and monumental,
framed by a clean cream-white border (#F7EEE7) with "EL EMPERADOR · IV" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print texture, and soft low-contrast diffused daylight.
Vintage storybook tone with modern minimalist graphic design. Color priority is high.
```

### V · El Sumo Sacerdote

```
Generate a whimsical tarot card illustration of "El Sumo Sacerdote" in a 2:3 portrait format.

A robed figure seated between two moss-covered pillars in deep forest green (#3A441C),
wearing a triple-tiered crown rendered in electric lavender (#5972F6) floral embroidery
with a botanical cross motif on the chest. Two smaller kneeling figures appear below as
minimal botanical line art silhouettes.

The figure raises two fingers in blessing, exuding ritual authority and sacred knowledge.

The background shows a stone interior suggested by subtle topographic arch forms in pale
lavender (#BCB2F7), with a soft peach (#FAB472) sacred scroll detail as the warm accent.

The composition is symmetrical and vertical with the triple crown at the apex,
framed by a clean cream-white border (#F7EEE7) with "EL SUMO SACERDOTE · V" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print effect, and soft diffused daylight with dreamy haze.
Vintage storybook meets modern minimalism. Color priority is high.
```

### VI · Los Enamorados

```
Generate a whimsical tarot card illustration of "Los Enamorados" in a 2:3 portrait format.

Two facing silhouettes in deep forest green (#3A441C) connected by electric lavender (#5972F6)
floral embroidery vines growing between them. Above, an angelic figure is rendered as a
botanical mandala sun in electric lavender, radiating warmth. A red (#E03002) apple and
a flame tree flank the couple as accent botanical motifs.

The two figures face each other with openness, the vines suggesting both connection and choice.

The background shows a soft topographic meadow in muted greens with wildflower arch forms
in pale lavender (#BCB2F7) framing the couple, and a soft peach (#FAB472) sun disc above.

The composition places the two figures symmetrically with the angel centered above,
framed by a clean cream-white border (#F7EEE7) with "LOS ENAMORADOS · VI" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print texture, and dreamy soft diffused daylight.
Vintage storybook charm with modern minimalist design. Color priority is high.
```

### VII · El Carro

```
Generate a whimsical tarot card illustration of "El Carro" in a 2:3 portrait format.

A chariot silhouette in deep forest green (#3A441C) pulled by two sphinx-like creatures
illustrated as botanical forms — one in vampire black (#060408) and one in cream white
(#F7EEE7) — moving in opposite directions yet held in balance. The charioteer wears
a star-covered canopy rendered in electric lavender (#5972F6) embroidery.

The figure stands with confident forward momentum, holding no reins — controlling through
pure will and concentration.

The background shows a topographic river landscape in pale lavender (#BCB2F7) and muted
greens, with vibrant red (#E03002) wheel spoke accents as the focal detail.

The composition is dynamic and slightly angled to convey forward motion,
framed by a clean cream-white border (#F7EEE7) with "EL CARRO · VII" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print effect, and soft dreamy diffused daylight.
Vintage storybook meets modern minimalist graphic design. Color priority is high.
```

### VIII · La Fuerza

```
Generate a whimsical tarot card illustration of "La Fuerza" in a 2:3 portrait format.

A figure gently closing a lion's mouth, both rendered as mossy silhouettes in deep forest
green (#3A441C) with electric lavender (#5972F6) floral infinity symbol floating above
the figure's head as embroidery. A wildflower garland in pale lavender (#BCB2F7) drapes
around the lion's neck.

The gesture is tender and assured — pure calm mastery over instinct, zero force used.

The background shows rolling meadow hills in soft muted green gradients with a soft
peach (#FAB472) mane glow as the warm accent detail and wildflower patterns at ground level.

The composition frames both figures together in an intimate embrace-like pose,
framed by a clean cream-white border (#F7EEE7) with "LA FUERZA · VIII" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print texture, and soft diffused daylight with dreamy haze.
Vintage storybook aesthetic with modern minimalism. Color priority is high.
```

### IX · El Ermitaño

```
Generate a whimsical tarot card illustration of "El Ermitaño" in a 2:3 portrait format.

A lone hooded figure standing at the peak of a mossy mountain, silhouette in deep forest
green (#3A441C) holding a gnarled botanical staff. A lantern glows in soft peach (#FAB472)
with an electric lavender (#5972F6) six-pointed star shining inside it, casting the only
warm light in the scene.

The figure stands in solitary stillness, lantern raised toward the darkness ahead,
a guide to those below.

The background shows topographic snow-dusted ridges in pale lavender (#BCB2F7) and muted
grey-greens, with a deep atmospheric haze making the figure appear at the edge of the world.

The composition places the solitary figure small against the vast landscape, lantern
as the luminous focal point, framed by a clean cream-white border (#F7EEE7) with
"EL ERMITAÑO · IX" in thin serif typography at the bottom.

Apply heavy film grain, risograph print effect, and cold low-contrast diffused light.
Vintage storybook tone with modern minimalist design. Color priority is high.
```

### X · La Rueda de la Fortuna

```
Generate a whimsical tarot card illustration of "La Rueda de la Fortuna" in a 2:3 portrait format.

An ornate circular wheel mandala as the central element, rendered entirely in electric
lavender (#5972F6) botanical line art with intricate floral spokes. A sphinx silhouette
in deep forest green (#3A441C) with floral embroidery sits atop the wheel. Smaller
animal figures cling to the wheel's rim as delicate mossy botanical forms.

The wheel rotates eternally, each figure ascending or descending, none in control.

The background shows four corner creatures — an eagle, lion, bull, and angel — as mossy
silhouettes in pale lavender (#BCB2F7), with vibrant red (#E03002) and soft peach (#FAB472)
alternating spoke accent details.

The composition is centered on the wheel filling the frame dramatically,
framed by a clean cream-white border (#F7EEE7) with "LA RUEDA DE LA FORTUNA · X"
in thin serif typography at the bottom.

Apply heavy film grain, risograph print texture, and soft dreamy diffused daylight.
Vintage storybook meets modern minimalist design. Color priority is high.
```

### XI · La Justicia

```
Generate a whimsical tarot card illustration of "La Justicia" in a 2:3 portrait format.

A seated figure in deep forest green (#3A441C) with electric lavender (#5972F6) floral
robe embroidery, holding balanced scales as a delicate botanical mobile in pale lavender
(#BCB2F7) in one hand and an upright sword as a clean geometric line in the other.

The figure sits with perfect symmetry, expression neutral and absolute — neither merciful
nor cruel, only precise.

The background shows two moss-covered pillars flanking the figure with a vibrant red
(#E03002) curtain suggested between them, and a topographic stone floor in muted green gradients below.

The composition is completely symmetrical and frontal with the scales as the visual
center of gravity, framed by a clean cream-white border (#F7EEE7) with "LA JUSTICIA · XI"
in thin serif typography at the bottom.

Apply heavy film grain, risograph print effect, and soft diffused daylight with low-contrast haze.
Vintage storybook aesthetic with modern minimalist graphic design. Color priority is high.
```

### XII · El Colgado

```
Generate a whimsical tarot card illustration of "El Colgado" in a 2:3 portrait format.

A figure suspended upside-down from a living mossy T-shaped tree branch in deep forest
green (#3A441C), their expression serene and enlightened. A halo of electric lavender
(#5972F6) wildflowers forms around the figure's head like a crown of light. One leg
crosses behind the other in a relaxed figure-four shape.

The figure hangs in voluntary surrender, radiating peace — this is chosen stillness, not punishment.

The background shows a misty topographic forest in muted green gradients with pale lavender
(#BCB2F7) rope line art and soft peach (#FAB472) boot detail as the warm accent.

The composition places the inverted figure centrally with the halo as the luminous focal
point, framed by a clean cream-white border (#F7EEE7) with "EL COLGADO · XII" in thin
serif typography at the bottom.

Apply heavy film grain, risograph print texture, and dreamy soft diffused daylight.
Vintage storybook charm with modern minimalist design. Color priority is high.
```

### XIII · La Muerte

```
Generate a whimsical tarot card illustration of "La Muerte" in a 2:3 portrait format.

A skeletal figure mounted on a mossy white horse, both rendered in deep forest green
(#3A441C), wearing armor covered in electric lavender (#5972F6) floral embroidery.
A white rose is held in one hand as a delicate pale lavender (#BCB2F7) botanical motif.
Small fallen figures appear below as minimal botanical forms in the path.

The figure moves forward with inevitability — not menacing, but unstoppable and transformative.

The background shows a rising sun on a misty topographic horizon in soft peach (#FAB472)
suggesting dawn after darkness, with a river in muted greens and pale lavender in the middle ground.

The composition has the horse and rider in profile moving across the frame with the sun
at the horizon as a hopeful counterpoint, framed by a clean cream-white border (#F7EEE7)
with "LA MUERTE · XIII" in thin serif typography at the bottom.

Apply heavy film grain, risograph print effect, and soft low-contrast diffused light.
Vintage storybook tone with modern minimalist aesthetic. Color priority is high.
```

### XIV · La Templanza

```
Generate a whimsical tarot card illustration of "La Templanza" in a 2:3 portrait format.

An angelic figure in deep forest green (#3A441C) with large electric lavender (#5972F6)
botanical wing embroidery, pouring a glowing liquid between two cups in a continuous arc.
The water flow is illustrated as a pale lavender (#BCB2F7) risograph shimmer ribbon.
One foot rests on land, one in water.

The figure pours with total ease and concentration — the act of perfect balance made visible.

The background shows a topographic iris flower garden in vibrant red (#E03002) and soft
peach (#FAB472), with rolling muted green hills fading into dreamy haze and a golden
crown path leading to a distant mountain.

The composition places the figure slightly off-center with the arc of liquid as the
visual flow guiding the eye, framed by a clean cream-white border (#F7EEE7) with
"LA TEMPLANZA · XIV" in thin serif typography at the bottom.

Apply heavy film grain, risograph print texture, and soft dreamy diffused daylight.
Vintage storybook meets modern minimalist botanical design. Color priority is high.
```

### XV · El Diablo

```
Generate a whimsical tarot card illustration of "El Diablo" in a 2:3 portrait format.

An imposing winged figure perched on a mossy stone pedestal in deep forest green (#3A441C),
with large leaf-like bat wings and electric lavender (#5972F6) inverted pentagram embroidery
on its chest. Two smaller chained figures below are rendered as botanical silhouettes with
loose, decorative chains suggesting bondage by choice.

The figure sits with dark authority, the chains clearly loose — the prisoners stay by habit, not force.

The background fades from vampire black (#060408) at the top to deep forest green below,
with a vibrant red (#E03002) torch as the sole warm light source casting dramatic shadows.

The composition places the dominant figure high in frame with the two smaller figures
anchored below, framed by a clean cream-white border (#F7EEE7) with "EL DIABLO · XV"
in thin serif typography at the bottom.

Apply heavy film grain, risograph print effect, and dramatic low-key diffused lighting.
Vintage storybook tone with modern minimalist design. Color priority is high.
```

### XVI · La Torre

```
Generate a whimsical tarot card illustration of "La Torre" in a 2:3 portrait format.

A tall moss-covered stone tower in deep forest green (#3A441C) being struck by a pale
lavender (#BCB2F7) lightning bolt, the crown at the top ejecting upward in an electric
lavender (#5972F6) floral burst explosion. Two small figures fall from the tower as
delicate botanical silhouettes tumbling through the air.

The lightning strikes with sudden finality — everything built on false foundations shatters in an instant.

The background shows a stormy topographic sky in dark muted green gradients, with flames
in vibrant red (#E03002) and soft peach (#FAB472) erupting from the tower windows.

The composition is dramatic and vertical with the tower centered and the lightning bolt
as the explosive diagonal force, framed by a clean cream-white border (#F7EEE7) with
"LA TORRE · XVI" in thin serif typography at the bottom.

Apply heavy film grain, risograph print texture, and turbulent high-contrast diffused light.
Vintage storybook aesthetic with modern minimalist graphic design. Color priority is high.
```

### XVII · La Estrella

```
Generate a whimsical tarot card illustration of "La Estrella" in a 2:3 portrait format.

A kneeling figure in deep forest green (#3A441C) pouring water from two vessels onto
land and into a pool, surrounded by seven small star mandalas and one large central star —
all rendered as electric lavender (#5972F6) botanical embroidery radiating above. An ibis
bird perches on a mossy branch as a pale lavender (#BCB2F7) line art motif.

The figure pours with quiet hope and infinite generosity, completely at peace under the open sky.

The background shows a topographic nocturnal landscape in muted greens with water ripples
in soft peach (#FAB472) reflecting the starlight, and wildflower botanical patterns at the horizon.

The composition is open and expansive with the large star centered above the kneeling
figure, framed by a clean cream-white border (#F7EEE7) with "LA ESTRELLA · XVII" in
thin serif typography at the bottom.

Apply heavy film grain, risograph print effect, and soft nocturnal diffused light with dreamy haze.
Vintage storybook tone with modern minimalist botanical design. Color priority is high.
```

### XVIII · La Luna

```
Generate a whimsical tarot card illustration of "La Luna" in a 2:3 portrait format.

A large crescent moon face in pale lavender (#BCB2F7) dominates the upper sky, its
expression mysterious and ambiguous. Below, a dog and a wolf howl upward as mossy botanical
silhouettes in deep forest green (#3A441C). A crayfish emerges from a pool rendered in
electric lavender (#5972F6) floral embroidery. Two tall dark towers flank a winding path
leading into the misty distance.

The scene pulses with illusion and instinct — the path forward is real but the shadows distort everything.

The background shows a topographic nocturnal landscape in deep muted greens with vibrant
red (#E03002) drop accents falling from the moon and pale lavender wildflower patterns
along the winding path.

The composition places the moon high and dominant with the creatures below creating a
vertical tension, framed by a clean cream-white border (#F7EEE7) with "LA LUNA · XVIII"
in thin serif typography at the bottom.

Apply heavy film grain, risograph print texture, and cold low-contrast nocturnal diffused light.
Vintage storybook charm with modern minimalist design. Color priority is high.
```

### XIX · El Sol

```
Generate a whimsical tarot card illustration of "El Sol" in a 2:3 portrait format.

A radiant sun face in soft peach (#FAB472) with electric lavender (#5972F6) floral ray
embroidery filling the upper half of the card. Below, a joyful child rides a white horse
silhouette in deep forest green (#3A441C), arms outstretched, a vibrant red (#E03002)
banner trailing behind. A garden of stylized sunflowers surrounds the scene as botanical
line art in pale lavender (#BCB2F7).

The child rides with pure unbounded joy — full light, full vitality, nothing hidden.

The background shows a topographic open field in muted warm greens with a cream-white
(#F7EEE7) sky behind the sun, giving a bright airy openness unlike any other card.

The composition is bright and uplifting with the sun filling the top third and the child
centered below, framed by a clean cream-white border with "EL SOL · XIX" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print texture, and warm bright diffused daylight.
Vintage storybook joy with modern minimalist botanical design. Color priority is high.
```

### XX · El Juicio

```
Generate a whimsical tarot card illustration of "El Juicio" in a 2:3 portrait format.

An angel blowing a long trumpet descends from a cloud rendered as an electric lavender
(#5972F6) botanical mandala bursting with radiant floral detail. Below, three figures
rise from mossy coffins in deep forest green (#3A441C) with floral embroidery, arms
raised upward. A pale lavender (#BCB2F7) cross banner hangs from the trumpet.

The figures rise not in fear but in liberation — this is the call they have always awaited.

The background shows a topographic mountain range in muted greens behind the scene, with
a vibrant red (#E03002) trumpet bell as the warm focal accent and grey-green waters below.

The composition is vertical and dramatic with the angel above and the rising figures
below creating an upward movement through the full frame, framed by a clean cream-white
border (#F7EEE7) with "EL JUICIO · XX" in thin serif typography at the bottom.

Apply heavy film grain, risograph print effect, and dramatic backlit diffused daylight from above.
Vintage storybook tone with modern minimalist graphic design. Color priority is high.
```

### XXI · El Mundo

```
Generate a whimsical tarot card illustration of "El Mundo" in a 2:3 portrait format.

A dancing figure inside a large electric lavender (#5972F6) floral laurel wreath, the
silhouette in deep forest green (#3A441C) with botanical embroidery detail, holding two
wands illustrated as flowering botanical branches. Four corner creatures — eagle, lion,
bull, and angel — appear as mossy silhouettes in pale lavender (#BCB2F7).

The figure dances freely at the center of the wreath — complete, whole, the cycle fulfilled.

The background shows a soft topographic cosmos in muted greens and dark blue-greens,
with soft peach (#FAB472) and vibrant red (#E03002) ribbon accents spiraling around
the wreath edges.

The composition is perfectly centered with the wreath as the frame within the frame,
framed by a clean cream-white border (#F7EEE7) with "EL MUNDO · XXI" in thin serif
typography at the bottom.

Apply heavy film grain, risograph print texture, and luminous soft diffused daylight.
Vintage storybook triumph with modern minimalist botanical design. Color priority is high.
```

---

## Flujo de trabajo recomendado en Nano Banana 2

1. **Genera la primera carta** con el prompt completo
2. **Itera conversacionalmente** — no empieces desde cero, pide ajustes: `"Make the moon larger and increase the film grain texture"` o `"Shift the green tones slightly warmer"`
3. **Mantén consistencia** entre cartas subiendo la primera generación como imagen de referencia: `"Using this card as the style reference, generate El Mago with the same texture, border, and color palette"`
4. **Texto de la carta**: si quieres el título dentro de la imagen usa comillas: `"EL LOCO · 0"` en el prompt y especifica `"thin serif font, cream white color"`
5. **Upscale**: Nano Banana 2 soporta 2K/4K — pide `"render at 2K resolution"` para imprimir

---

## Notas

- Para arcanos menores usar la misma paleta adaptando el símbolo central al palo: **Bastos** → ramas y fuego, **Copas** → agua y flores, **Espadas** → líneas y viento, **Pentáculos** → círculos y tierra
- Todas las imágenes generadas incluyen watermark **SynthID** de Google y metadatos **C2PA** — es automático e invisible visualmente
