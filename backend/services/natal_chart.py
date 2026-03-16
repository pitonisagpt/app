"""
Natal chart calculator using kerykeion, which wraps the Swiss Ephemeris.

Algorithm source:
  Swiss Ephemeris — Astrodienst AG, Zurich (https://www.astro.com/swisseph/)
  Based on NASA/JPL DE431 planetary ephemeris data.
  Python wrapper: kerykeion by Giacomo Battaglia (MIT license)
  Same ephemeris engine used by astro.com and most professional astrology software.
"""

import requests
from kerykeion import AstrologicalSubject
from timezonefinder import TimezoneFinder


# ── Geocoding ────────────────────────────────────────────────────────────────

def geocode_city(city: str) -> dict:
    """
    Resolves a city name to lat/lon/timezone using OpenStreetMap Nominatim.
    Returns: { lat, lon, display_name, timezone }
    """
    try:
        resp = requests.get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": city, "format": "json", "limit": 1, "addressdetails": 0},
            headers={"User-Agent": "PitonisaGPT/1.0 (tarot oracle app)"},
            timeout=5,
        )
        resp.raise_for_status()
        results = resp.json()
    except Exception:
        raise ValueError(f"No se pudo conectar con el servicio de geolocalización.")

    if not results:
        raise ValueError(
            f"Ciudad no encontrada: '{city}'. "
            "Intenta con el nombre en inglés o añade el país (ej: 'Bogotá, Colombia')."
        )

    r = results[0]
    lat = float(r["lat"])
    lon = float(r["lon"])

    tf = TimezoneFinder()
    tz = tf.timezone_at(lat=lat, lng=lon) or "UTC"

    return {
        "lat": lat,
        "lon": lon,
        "display_name": r.get("display_name", city),
        "timezone": tz,
    }


# ── Static tables ─────────────────────────────────────────────────────────────

SIGN_NAMES_ES = {
    "Ari": "Aries", "Tau": "Tauro", "Gem": "Géminis", "Can": "Cáncer",
    "Leo": "Leo",   "Vir": "Virgo", "Lib": "Libra",   "Sco": "Escorpio",
    "Sag": "Sagitario", "Cap": "Capricornio", "Aqu": "Acuario", "Pis": "Piscis",
    # full English names (kerykeion v4+)
    "Aries": "Aries", "Taurus": "Tauro", "Gemini": "Géminis", "Cancer": "Cáncer",
    "Virgo": "Virgo", "Libra": "Libra", "Scorpio": "Escorpio",
    "Sagittarius": "Sagitario", "Capricorn": "Capricornio",
    "Aquarius": "Acuario", "Pisces": "Piscis",
}

# Canonical English names in ecliptic order (index × 30° = sign start longitude)
SIGN_ORDER = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
]

PLANET_NAMES_ES = {
    "Sun": "Sol", "Moon": "Luna", "Mercury": "Mercurio", "Venus": "Venus",
    "Mars": "Marte", "Jupiter": "Júpiter", "Saturn": "Saturno",
    "Uranus": "Urano", "Neptune": "Neptuno", "Pluto": "Plutón",
    "Mean_Node": "Nodo Norte", "True_Node": "Nodo Norte",
    "Chiron": "Quirón", "Mean_Lilith": "Lilith",
    "sol": "Sol", "luna": "Luna", "mercurio": "Mercurio", "venus": "Venus",
    "marte": "Marte", "jupiter": "Júpiter", "saturno": "Saturno",
    "urano": "Urano", "neptuno": "Neptuno", "pluton": "Plutón",
    "nodo_norte": "Nodo Norte", "chiron": "Quirón", "lilith": "Lilith",
}

HOUSE_NAMES_ES = {
    "First_House": "Casa I", "Second_House": "Casa II", "Third_House": "Casa III",
    "Fourth_House": "Casa IV", "Fifth_House": "Casa V", "Sixth_House": "Casa VI",
    "Seventh_House": "Casa VII", "Eighth_House": "Casa VIII", "Ninth_House": "Casa IX",
    "Tenth_House": "Casa X", "Eleventh_House": "Casa XI", "Twelfth_House": "Casa XII",
}

# Normalize 3-letter kerykeion abbreviations → canonical English name
SIGN_ABBR = {
    "Ari": "Aries", "Tau": "Taurus", "Gem": "Gemini",  "Can": "Cancer",
    "Leo": "Leo",   "Vir": "Virgo",  "Lib": "Libra",   "Sco": "Scorpio",
    "Sag": "Sagittarius", "Cap": "Capricorn", "Aqu": "Aquarius", "Pis": "Pisces",
}

def _canonical(sign_raw: str) -> str:
    """Return canonical English sign name regardless of whether input is full or abbreviated."""
    if sign_raw in SIGN_ORDER:
        return sign_raw
    return SIGN_ABBR.get(sign_raw, sign_raw)

ELEMENT_MAP = {
    "Aries": "Fuego", "Leo": "Fuego", "Sagittarius": "Fuego",
    "Taurus": "Tierra", "Virgo": "Tierra", "Capricorn": "Tierra",
    "Gemini": "Aire", "Libra": "Aire", "Aquarius": "Aire",
    "Cancer": "Agua", "Scorpio": "Agua", "Pisces": "Agua",
}

MODALITY_MAP = {
    "Aries": "Cardinal", "Cancer": "Cardinal", "Libra": "Cardinal", "Capricorn": "Cardinal",
    "Taurus": "Fijo", "Leo": "Fijo", "Scorpio": "Fijo", "Aquarius": "Fijo",
    "Gemini": "Mutable", "Virgo": "Mutable", "Sagittarius": "Mutable", "Pisces": "Mutable",
}

POLARITY_MASCULINE = {"Aries", "Gemini", "Leo", "Libra", "Sagittarius", "Aquarius"}
POLARITY_FEMININE  = {"Taurus", "Cancer", "Virgo", "Scorpio", "Capricorn", "Pisces"}

# Major aspects: name, exact angle, orb tolerance, glyph, energy type
ASPECT_DEFS = [
    {"name": "Conjunción", "angle": 0,   "orb": 8,  "symbol": "☌", "type": "neutral"},
    {"name": "Sextil",     "angle": 60,  "orb": 5,  "symbol": "⚹", "type": "harmonious"},
    {"name": "Cuadratura", "angle": 90,  "orb": 7,  "symbol": "□", "type": "tense"},
    {"name": "Trígono",    "angle": 120, "orb": 7,  "symbol": "△", "type": "harmonious"},
    {"name": "Oposición",  "angle": 180, "orb": 8,  "symbol": "☍", "type": "tense"},
    {"name": "Quincuncio", "angle": 150, "orb": 2,  "symbol": "⚻", "type": "neutral"},
]

# ── Chart pattern tables ───────────────────────────────────────────────────────

# Ruler of each sign (modern rulerships, canonical English names)
SIGN_RULERS = {
    "Aries": "marte",   "Taurus": "venus",    "Gemini": "mercurio",
    "Cancer": "luna",   "Leo": "sol",          "Virgo": "mercurio",
    "Libra": "venus",   "Scorpio": "pluton",   "Sagittarius": "jupiter",
    "Capricorn": "saturno", "Aquarius": "urano", "Pisces": "neptuno",
}

# Dignity table — values are Spanish sign names (as returned by _sign_es)
PLANET_DIGNITY = {
    "sol":      {"domicilio": ["Leo"],             "exaltacion": ["Aries"],       "detrimento": ["Acuario"],             "caida": ["Libra"]},
    "luna":     {"domicilio": ["Cáncer"],           "exaltacion": ["Tauro"],       "detrimento": ["Capricornio"],          "caida": ["Escorpio"]},
    "mercurio": {"domicilio": ["Géminis","Virgo"],  "exaltacion": ["Virgo"],       "detrimento": ["Sagitario","Piscis"],   "caida": ["Piscis"]},
    "venus":    {"domicilio": ["Tauro","Libra"],    "exaltacion": ["Piscis"],      "detrimento": ["Escorpio","Aries"],     "caida": ["Virgo"]},
    "marte":    {"domicilio": ["Aries","Escorpio"], "exaltacion": ["Capricornio"], "detrimento": ["Tauro","Libra"],        "caida": ["Cáncer"]},
    "jupiter":  {"domicilio": ["Sagitario","Piscis"],"exaltacion": ["Cáncer"],    "detrimento": ["Géminis","Virgo"],      "caida": ["Capricornio"]},
    "saturno":  {"domicilio": ["Capricornio","Acuario"],"exaltacion": ["Libra"],  "detrimento": ["Cáncer","Leo"],         "caida": ["Aries"]},
    "urano":    {"domicilio": ["Acuario"],          "exaltacion": ["Escorpio"],    "detrimento": ["Leo"],                  "caida": ["Tauro"]},
    "neptuno":  {"domicilio": ["Piscis"],           "exaltacion": ["Leo"],         "detrimento": ["Virgo"],                "caida": ["Acuario"]},
    "pluton":   {"domicilio": ["Escorpio"],         "exaltacion": ["Aries"],       "detrimento": ["Tauro"],                "caida": ["Libra"]},
}

HOUSE_NUM = {
    "Casa I": 1,  "Casa II": 2,  "Casa III": 3,  "Casa IV": 4,
    "Casa V": 5,  "Casa VI": 6,  "Casa VII": 7,  "Casa VIII": 8,
    "Casa IX": 9, "Casa X": 10, "Casa XI": 11, "Casa XII": 12,
}


def _get_dignity(planet_key: str, sign_es: str) -> str:
    digs = PLANET_DIGNITY.get(planet_key, {})
    if sign_es in digs.get("domicilio",  []): return "domicilio"
    if sign_es in digs.get("exaltacion", []): return "exaltacion"
    if sign_es in digs.get("detrimento", []): return "detrimento"
    if sign_es in digs.get("caida",      []): return "caida"
    return "neutral"


def _find_stelliums(planets: dict) -> list:
    """Return list of {sign, planets, count} for any sign with 3+ planets."""
    groups: dict = {}
    for key, p in planets.items():
        groups.setdefault(p["sign"], []).append(key)
    result = [
        {"sign": sign, "planets": pls, "count": len(pls)}
        for sign, pls in groups.items() if len(pls) >= 3
    ]
    return sorted(result, key=lambda x: -x["count"])


def _find_aspect_patterns(aspects: list, planet_keys: list) -> list:
    """Detect Grand Trine, T-Square, Grand Cross, and Yod."""
    patterns = []
    seen: set = set()

    trines      = {frozenset([a["planet1"],a["planet2"]]) for a in aspects if a["aspect"]=="Trígono"}
    squares     = {frozenset([a["planet1"],a["planet2"]]) for a in aspects if a["aspect"]=="Cuadratura"}
    sextiles    = {frozenset([a["planet1"],a["planet2"]]) for a in aspects if a["aspect"]=="Sextil"}
    quincunxes  = {frozenset([a["planet1"],a["planet2"]]) for a in aspects if a["aspect"]=="Quincuncio"}
    oppositions = [(a["planet1"],a["planet2"]) for a in aspects if a["aspect"]=="Oposición"]

    # Grand Trine
    keys = list(planet_keys)
    for i, k1 in enumerate(keys):
        for j, k2 in enumerate(keys[i+1:], i+1):
            for k3 in keys[j+1:]:
                if (frozenset([k1,k2]) in trines and
                    frozenset([k1,k3]) in trines and
                    frozenset([k2,k3]) in trines):
                    sig = frozenset([k1,k2,k3])
                    if sig not in seen:
                        seen.add(sig)
                        patterns.append({"type":"Gran Trígono","symbol":"△","planets":[k1,k2,k3],
                            "description":"Triángulo de talentos naturales y fluidez kármica — dones que fluyen sin esfuerzo."})

    # T-Square
    for k1, k2 in oppositions:
        for k3 in keys:
            if k3 in (k1, k2): continue
            if frozenset([k1,k3]) in squares and frozenset([k2,k3]) in squares:
                sig = frozenset([k1,k2,k3])
                if sig not in seen:
                    seen.add(sig)
                    patterns.append({"type":"Cruz en T","symbol":"⊕","planets":[k1,k2,k3],
                        "description":"Tensión creativa que impulsa la transformación — el motor dinámico de tu carta."})
                break

    # Grand Cross
    opp_list = oppositions
    for i, (a1,a2) in enumerate(opp_list):
        for b1,b2 in opp_list[i+1:]:
            if len({a1,a2,b1,b2}) < 4: continue
            if (frozenset([a1,b1]) in squares and frozenset([a1,b2]) in squares and
                frozenset([a2,b1]) in squares and frozenset([a2,b2]) in squares):
                sig = frozenset([a1,a2,b1,b2])
                if sig not in seen:
                    seen.add(sig)
                    patterns.append({"type":"Cruz Mayor","symbol":"✚","planets":[a1,a2,b1,b2],
                        "description":"Cuatro fuerzas en tensión y equilibrio — un alma forjada en el fuego de las contradicciones."})

    # Yod (Finger of God)
    for a in aspects:
        if a["aspect"] != "Sextil": continue
        k1, k2 = a["planet1"], a["planet2"]
        for k3 in keys:
            if k3 in (k1, k2): continue
            if frozenset([k1,k3]) in quincunxes and frozenset([k2,k3]) in quincunxes:
                sig = frozenset([k1,k2,k3])
                if sig not in seen:
                    seen.add(sig)
                    patterns.append({"type":"Dedo del Destino","symbol":"☝","planets":[k1,k2,k3],
                        "description":"El Dedo de Dios apunta a un propósito singular — una misión de vida ineludible."})
                break

    return patterns


def _hemisphere_emphasis(planets: dict) -> dict:
    norte = sur = este = oeste = 0
    for p in planets.values():
        n = HOUSE_NUM.get(p.get("house", ""), 0)
        if not n: continue
        if 1 <= n <= 6:  norte += 1
        else:             sur   += 1
        if n in {10, 11, 12, 1, 2, 3}: este  += 1
        else:                            oeste += 1
    dominant = max(
        [("norte",norte),("sur",sur),("este",este),("oeste",oeste)],
        key=lambda x: x[1]
    )[0]
    return {"norte": norte, "sur": sur, "este": este, "oeste": oeste, "dominant": dominant}


# ── Helpers ───────────────────────────────────────────────────────────────────

def _sign_es(raw: str) -> str:
    return SIGN_NAMES_ES.get(raw, raw)

def _house_es(raw: str) -> str:
    return HOUSE_NAMES_ES.get(raw, raw.replace("_", " "))

def _deg_str(pos: float) -> str:
    pos = float(pos or 0)
    deg  = int(pos)
    mins = int((pos - deg) * 60)
    return f"{deg}°{mins:02d}'"

def _get_abs_longitude(planet_obj, sign_raw: str, pos: float) -> float:
    """Absolute ecliptic longitude 0–360°. Tries attribute first, then computes."""
    for attr in ("abs_longitude", "longitude"):
        val = getattr(planet_obj, attr, None)
        if val is not None:
            try:
                return float(val) % 360
            except (TypeError, ValueError):
                pass
    # Compute from sign index + position within sign
    try:
        idx = SIGN_ORDER.index(_canonical(sign_raw))
    except ValueError:
        idx = 0
    return (idx * 30.0 + float(pos or 0) % 30.0) % 360


def _planet_data(planet_obj) -> dict:
    """Extract standardized data (including absolute longitude) from a kerykeion object."""
    sign_raw  = getattr(planet_obj, "sign", "") or ""
    house_raw = getattr(planet_obj, "house", "") or ""
    pos       = float(getattr(planet_obj, "position", None) or getattr(planet_obj, "pos", 0.0) or 0)
    retro     = bool(getattr(planet_obj, "retrograde", False))
    abs_lon   = _get_abs_longitude(planet_obj, sign_raw, pos)

    return {
        "sign":          _sign_es(sign_raw),
        "sign_raw":      sign_raw,
        "pos":           pos,
        "deg":           _deg_str(pos),
        "house":         _house_es(house_raw),
        "retrograde":    retro,
        "abs_longitude": round(abs_lon, 4),
    }


def _calculate_aspects(all_points: dict) -> list:
    """
    Calculate major aspects between every pair of points.
    Each pair is tested once; only the closest matching aspect is recorded.
    """
    items = list(all_points.items())
    found = []

    for i, (k1, p1) in enumerate(items):
        for k2, p2 in items[i + 1:]:
            lon1 = p1.get("abs_longitude", 0)
            lon2 = p2.get("abs_longitude", 0)

            diff = abs(lon1 - lon2) % 360
            if diff > 180:
                diff = 360 - diff

            best = None
            best_orb = 999
            for asp in ASPECT_DEFS:
                orb = abs(diff - asp["angle"])
                if orb <= asp["orb"] and orb < best_orb:
                    best_orb = orb
                    best = asp

            if best:
                found.append({
                    "planet1": k1,
                    "planet2": k2,
                    "aspect":  best["name"],
                    "symbol":  best["symbol"],
                    "type":    best["type"],
                    "orb":     round(best_orb, 1),
                })

    return found


# ── Main calculation ──────────────────────────────────────────────────────────

def calculate_natal_chart(
    name: str,
    year: int,
    month: int,
    day: int,
    hour: int,
    minute: int,
    city: str,
    birth_time_known: bool = True,
) -> dict:
    """
    Computes a full natal chart using the Swiss Ephemeris via kerykeion.

    Returns a structured dict with planetary positions, angles, house cusps,
    aspects, dominant distributions, and extra celestial points — ready
    for AI interpretation and SVG chart wheel rendering.
    """
    geo = geocode_city(city)

    subject = AstrologicalSubject(
        name=name,
        year=year,
        month=month,
        day=day,
        hour=hour if birth_time_known else 12,
        minute=minute if birth_time_known else 0,
        lng=geo["lon"],
        lat=geo["lat"],
        tz_str=geo["timezone"],
        city=city,
        online=False,
    )

    # ── Main planets ──────────────────────────────────────────────────────────
    planet_keys = [
        ("sol",      subject.sun),
        ("luna",     subject.moon),
        ("mercurio", subject.mercury),
        ("venus",    subject.venus),
        ("marte",    subject.mars),
        ("jupiter",  subject.jupiter),
        ("saturno",  subject.saturn),
        ("urano",    subject.uranus),
        ("neptuno",  subject.neptune),
        ("pluton",   subject.pluto),
    ]
    planets = {key: _planet_data(obj) for key, obj in planet_keys}

    # ── Extra celestial points (optional — not all kerykeion versions expose them) ──
    extra_points = {}

    def _try_add(key, attr_names):
        for attr in attr_names:
            obj = getattr(subject, attr, None)
            if obj is not None:
                try:
                    extra_points[key] = _planet_data(obj)
                    return
                except Exception:
                    pass

    _try_add("chiron",      ["chiron"])
    _try_add("north_node",  ["mean_node", "true_node", "mean_north_lunar_node", "true_north_lunar_node"])
    _try_add("south_node",  ["mean_south_lunar_node", "true_south_lunar_node"])
    _try_add("lilith",      ["mean_lilith", "lilith"])
    _try_add("fortuna",     ["pars_fortunae"])
    _try_add("vertex",      ["vertex"])
    _try_add("ceres",       ["ceres"])
    _try_add("juno",        ["juno"])
    _try_add("vesta",       ["vesta"])
    _try_add("pallas",      ["pallas"])

    # ── House cusps (all 12) — returned as array of abs_longitude floats ────────
    house_attr_list = [
        "first_house", "second_house", "third_house", "fourth_house",
        "fifth_house", "sixth_house", "seventh_house", "eighth_house",
        "ninth_house", "tenth_house", "eleventh_house", "twelfth_house",
    ]
    house_cusps = []
    for attr in house_attr_list:
        h_obj = getattr(subject, attr, None)
        if h_obj is not None:
            try:
                sign_raw = getattr(h_obj, "sign", "") or ""
                pos = float(getattr(h_obj, "position", 0) or 0)
                house_cusps.append(round(_get_abs_longitude(h_obj, sign_raw, pos), 4))
            except Exception:
                house_cusps.append(0.0)
        else:
            house_cusps.append(0.0)

    # ── Angles (ASC / MC) ─────────────────────────────────────────────────────
    asc_obj = getattr(subject, "first_house",  None)
    mc_obj  = getattr(subject, "tenth_house",  None)

    asc_sign_raw = getattr(asc_obj, "sign", "") or "" if asc_obj else ""
    mc_sign_raw  = getattr(mc_obj,  "sign", "") or "" if mc_obj  else ""
    asc_pos      = float(getattr(asc_obj, "position", 0) or 0)
    mc_pos       = float(getattr(mc_obj,  "position", 0) or 0)
    asc_lon      = _get_abs_longitude(asc_obj, asc_sign_raw, asc_pos) if asc_obj else 0.0
    mc_lon       = _get_abs_longitude(mc_obj,  mc_sign_raw,  mc_pos)  if mc_obj  else 0.0

    # ── Distributions (all 10 planets + ASC + MC = 12 points) ─────────────────
    all_sign_raws = [p["sign_raw"] for p in planets.values()] + [asc_sign_raw, mc_sign_raw]

    element_count  = {"Fuego": 0, "Tierra": 0, "Aire": 0, "Agua": 0}
    modality_count = {"Cardinal": 0, "Fijo": 0, "Mutable": 0}
    polarity_count = {"Masculino": 0, "Femenino": 0}

    for sr in all_sign_raws:
        canon = _canonical(sr)
        elem = ELEMENT_MAP.get(canon, "")
        mod  = MODALITY_MAP.get(canon, "")
        if elem:
            element_count[elem]  += 1
        if mod:
            modality_count[mod]  += 1
        if canon in POLARITY_MASCULINE:
            polarity_count["Masculino"] += 1
        elif canon in POLARITY_FEMININE:
            polarity_count["Femenino"]  += 1

    total_dist = len(all_sign_raws)

    dominant_element  = max(element_count,  key=element_count.get)
    dominant_modality = max(modality_count, key=modality_count.get)

    # ── Retrograde list ───────────────────────────────────────────────────────
    retrograde_planets = [
        PLANET_NAMES_ES.get(k, k)
        for k, v in planets.items()
        if v["retrograde"]
    ]

    # ── Aspects (main planets + extra points, excluding auxiliary points) ─────
    ASPECT_POINTS = {"fortuna", "vertex", "ceres", "juno", "vesta", "pallas", "south_node"}
    aspects_input = dict(planets)
    aspects_input.update({k: v for k, v in extra_points.items() if k not in ASPECT_POINTS})
    aspects = _calculate_aspects(aspects_input)

    # ── New pattern data ──────────────────────────────────────────────────────
    # Chart ruler (ruler of the ascendant)
    asc_canonical  = _canonical(asc_sign_raw) if asc_sign_raw else ""
    ruler_key      = SIGN_RULERS.get(asc_canonical, "")
    chart_ruler    = {}
    if ruler_key and ruler_key in planets:
        rp = planets[ruler_key]
        chart_ruler = {
            "planet": ruler_key,
            "sign":   rp["sign"],
            "house":  rp["house"],
            "deg":    rp["deg"],
            "retrograde": rp["retrograde"],
        }

    # Stelliums
    stelliums = _find_stelliums(planets)

    # Planet dignities
    planet_dignities = {key: _get_dignity(key, p["sign"]) for key, p in planets.items()}

    # Aspect patterns
    pattern_input = dict(planets)
    pattern_input.update({k: v for k, v in extra_points.items() if k in ("north_node", "chiron", "lilith")})
    aspect_patterns = _find_aspect_patterns(aspects, list(pattern_input.keys()))

    # Hemisphere emphasis
    hemisphere_counts = _hemisphere_emphasis(planets)

    # Day/Night birth sect
    is_diurnal = getattr(subject, "is_diurnal", None)

    # ── Quadrant distribution ─────────────────────────────────────────────────
    quadrant_count = {
        "Q1 (Casas 1-3)": 0, "Q2 (Casas 4-6)": 0,
        "Q3 (Casas 7-9)": 0, "Q4 (Casas 10-12)": 0,
    }
    house_to_quadrant = {
        "Casa I": "Q1 (Casas 1-3)", "Casa II": "Q1 (Casas 1-3)", "Casa III": "Q1 (Casas 1-3)",
        "Casa IV": "Q2 (Casas 4-6)", "Casa V": "Q2 (Casas 4-6)", "Casa VI": "Q2 (Casas 4-6)",
        "Casa VII": "Q3 (Casas 7-9)", "Casa VIII": "Q3 (Casas 7-9)", "Casa IX": "Q3 (Casas 7-9)",
        "Casa X": "Q4 (Casas 10-12)", "Casa XI": "Q4 (Casas 10-12)", "Casa XII": "Q4 (Casas 10-12)",
    }
    for p in planets.values():
        q = house_to_quadrant.get(p["house"])
        if q:
            quadrant_count[q] += 1

    return {
        "name":              name,
        "birth_date":        f"{day:02d}/{month:02d}/{year}",
        "birth_time":        f"{hour:02d}:{minute:02d}" if birth_time_known else "desconocida",
        "birth_city":        geo["display_name"].split(",")[0].strip(),
        "birth_city_full":   geo["display_name"],
        "timezone":          geo["timezone"],
        "birth_time_known":  birth_time_known,
        # Planets
        "planets":           planets,
        "extra_points":      extra_points,
        # Houses
        "house_cusps":       house_cusps,
        # Angles
        "ascendant":         _sign_es(asc_sign_raw),
        "ascendant_lon":     round(asc_lon, 4),
        "ascendant_deg":     _deg_str(asc_pos),
        "midheaven":         _sign_es(mc_sign_raw),
        "midheaven_lon":     round(mc_lon, 4),
        "midheaven_deg":     _deg_str(mc_pos),
        # Distributions
        "dominant_element":  dominant_element,
        "dominant_modality": dominant_modality,
        "element_count":     element_count,
        "modality_count":    modality_count,
        "polarity_count":    polarity_count,
        "quadrant_count":    quadrant_count,
        "dist_total":        total_dist,
        # Other
        "retrograde_planets":  retrograde_planets,
        "aspects":             aspects,
        # Pattern analysis
        "chart_ruler":         chart_ruler,
        "stelliums":           stelliums,
        "planet_dignities":    planet_dignities,
        "aspect_patterns":     aspect_patterns,
        "hemisphere_counts":   hemisphere_counts,
        "is_diurnal":          is_diurnal,
    }
