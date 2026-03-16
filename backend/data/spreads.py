SPREADS = {
    # ── CONSULTAS RÁPIDAS ────────────────────────────────────────────
    "1-carta": {
        "name": "Pregúntale al Tarot",
        "card_count": 1,
        "positions": ["Tu Respuesta"],
        "requires_question": True,
    },
    "2-cartas": {
        "name": "Pregúntale 2 Cartas",
        "card_count": 2,
        "positions": ["Carta Principal", "Carta Complementaria"],
        "requires_question": True,
    },
    "si-o-no": {
        "name": "Tarot Sí o No",
        "card_count": 1,
        "positions": ["Respuesta"],
        "requires_question": True,
        "yes_no_mode": True,
    },
    "si-no-2": {
        "name": "Sí o No de 2 Cartas",
        "card_count": 2,
        "positions": ["Carta de Luz", "Carta de Sombra"],
        "requires_question": True,
        "yes_no_mode": True,
        "yes_no_dual": True,
    },
    "favor-y-contra": {
        "name": "A Favor y En Contra",
        "card_count": 2,
        "positions": ["A tu favor", "En tu contra"],
        "requires_question": True,
    },
    "encrucijada": {
        "name": "Tarot Encrucijada",
        "card_count": 5,
        "positions": ["La decisión ante ti", "Camino A", "Camino B", "Lo que debes considerar", "El resultado más probable"],
        "requires_question": True,
    },
    "verdad-oculta": {
        "name": "Tarot Verdad Oculta",
        "card_count": 4,
        "positions": ["La apariencia", "La verdad oculta", "Lo que no quieres ver", "La revelación"],
        "requires_question": True,
    },

    # ── AMOR Y RELACIONES ────────────────────────────────────────────
    "amor": {
        "name": "Tarot del Amor",
        "card_count": 3,
        "positions": ["Tú", "La otra persona", "La relación"],
        "requires_question": True,
    },
    "que-siente": {
        "name": "¿Qué siente por mí?",
        "card_count": 4,
        "positions": ["Sus sentimientos actuales", "Sus pensamientos hacia ti", "Sus intenciones", "El futuro de la relación"],
        "requires_question": True,
    },
    "encontrar-amor": {
        "name": "Encontrar el Amor",
        "card_count": 4,
        "positions": ["Tu energía amorosa", "Lo que debes soltar", "Qué tipo de amor atraes", "Consejo para abrirte al amor"],
        "requires_question": False,
    },

    # ── AUTOCONOCIMIENTO ─────────────────────────────────────────────
    "verdadero-yo": {
        "name": "Conoce tu Verdadero Yo",
        "card_count": 5,
        "positions": ["Quién eres realmente", "Tu potencial oculto", "Tu sombra", "Tu propósito de vida", "Tu camino hacia la plenitud"],
        "requires_question": False,
    },
    "espejo-alma": {
        "name": "Tarot Espejo del Alma",
        "card_count": 5,
        "positions": ["El reflejo de tu alma", "Lo que proyectas al mundo", "Lo que guardas en tu interior", "Tu herida profunda", "Tu don espiritual"],
        "requires_question": False,
    },
    "mente-cuerpo-espiritu": {
        "name": "Mente · Cuerpo · Espíritu",
        "card_count": 3,
        "positions": ["Mente", "Cuerpo", "Espíritu"],
        "requires_question": False,
    },

    # ── TIEMPO Y DESTINO ─────────────────────────────────────────────
    "3-cartas": {
        "name": "Pasado · Presente · Futuro",
        "card_count": 3,
        "positions": ["Pasado", "Presente", "Futuro"],
        "requires_question": False,
    },
    "oraculo": {
        "name": "El Oráculo",
        "card_count": 5,
        "positions": ["Presente", "Futuro cercano", "Influencia oculta", "Consejo", "Resultado"],
        "requires_question": False,
    },
    "celta": {
        "name": "Cruz Celta",
        "card_count": 6,
        "positions": ["Situación", "Desafío", "Base", "Pasado reciente", "Posibilidad", "Resultado"],
        "requires_question": True,
    },
    "lunar": {
        "name": "Tarot Lunar",
        "card_count": 4,
        "positions": ["Luna Nueva · Nuevos inicios", "Cuarto Creciente · Lo que crece", "Luna Llena · Lo que se revela", "Cuarto Menguante · Lo que soltar"],
        "requires_question": False,
    },
    "estrella": {
        "name": "Tarot Estrella",
        "card_count": 5,
        "positions": ["Tu luz interna", "Tu guía estrella", "Lo que iluminas en los demás", "Tu deseo más profundo", "La esperanza del futuro"],
        "requires_question": False,
    },
    "gitano": {
        "name": "Tarot Gitano",
        "card_count": 5,
        "positions": ["El camino recorrido", "Lo que el destino prepara", "La influencia del pasado", "El consejo ancestral", "El mensaje de los espíritus"],
        "requires_question": False,
    },
    "matriz-destino": {
        "name": "Matriz del Destino",
        "card_count": 5,
        "positions": ["Tu energía de vida", "Tu misión de alma", "Tu karma a superar", "Tus talentos y dones", "Tu destino final"],
        "requires_question": False,
    },

    # ── ESPIRITUALIDAD ───────────────────────────────────────────────
    "sanacion-emocional": {
        "name": "Sanación Emocional",
        "card_count": 4,
        "positions": ["Tu herida emocional", "Su origen", "El camino de sanación", "Tu poder curativo"],
        "requires_question": False,
    },
    "desarrollo-espiritual": {
        "name": "Desarrollo Espiritual",
        "card_count": 4,
        "positions": ["Tu nivel espiritual actual", "Tu próxima lección", "Tu guía o maestro (energía)", "Tu destino espiritual"],
        "requires_question": False,
    },
    "cabala": {
        "name": "Tarot Cábala",
        "card_count": 5,
        "positions": ["Kether · Tu propósito divino", "Chokmah · Tu sabiduría", "Binah · Tu comprensión", "Chesed · Tu abundancia", "Geburah · Tu prueba"],
        "requires_question": False,
    },

    # ── ABUNDANCIA ───────────────────────────────────────────────────
    "dinero": {
        "name": "Tarot del Dinero",
        "card_count": 3,
        "positions": ["Energía actual", "Obstáculo", "Consejo"],
        "requires_question": True,
    },
}
