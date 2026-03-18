"""
Synastry calculator — inter-chart aspects between two natal charts.
Uses kerykeion (Swiss Ephemeris) to compute planetary positions.
Returns full chart data for biwheel visualization.
"""

from kerykeion import AstrologicalSubject
from .natal_chart import geocode_city, _get_abs_longitude, ASPECT_DEFS, PLANET_NAMES_ES

# ── Planet lists ───────────────────────────────────────────────────────────────

ALL_PLANETS = [
    ("sol",      "sun"),
    ("luna",     "moon"),
    ("mercurio", "mercury"),
    ("venus",    "venus"),
    ("marte",    "mars"),
    ("jupiter",  "jupiter"),
    ("saturno",  "saturn"),
    ("urano",    "uranus"),
    ("neptuno",  "neptune"),
    ("pluton",   "pluto"),
]

EXTRA_POINTS = [
    ("chiron",      "chiron"),
    ("north_node",  "mean_node"),
]

# Weight per planet — personal planets dominate the compatibility score
PLANET_WEIGHT = {
    "sol":      3.0,
    "luna":     3.0,
    "venus":    2.5,
    "marte":    2.0,
    "mercurio": 1.5,
    "jupiter":  1.0,
    "saturno":  0.5,
    "urano":    0.3,
    "neptuno":  0.3,
    "pluton":   0.3,
}

HOUSE_MEANING = [
    "identidad y energía vital",
    "dinero y valores propios",
    "comunicación y mente",
    "hogar y familia",
    "creatividad y romance",
    "salud y rutinas",
    "pareja y relaciones íntimas",
    "transformación y sexualidad",
    "filosofía y expansión",
    "carrera y vocación",
    "amistades y proyectos colectivos",
    "inconsciente y vida espiritual",
]

SIGNS_ES = [
    "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
    "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
]

# ── Helpers ────────────────────────────────────────────────────────────────────

def _lon_to_sign_es(lon: float) -> str:
    return SIGNS_ES[int((lon % 360) / 30)]


def _build_subject(
    name: str, year: int, month: int, day: int, city: str,
    hour: int = 12, minute: int = 0,
) -> AstrologicalSubject:
    if city and city.strip():
        geo = geocode_city(city)
    else:
        geo = {"lat": 40.4168, "lon": -3.7038, "timezone": "Europe/Madrid"}
    return AstrologicalSubject(
        name=name, year=year, month=month, day=day,
        hour=hour, minute=minute,
        lng=geo["lon"], lat=geo["lat"], tz_str=geo["timezone"],
        online=False,
    )


def _planet_data(subject) -> dict:
    """Returns {key: {abs_longitude, sign, retrograde}} for all 10 planets."""
    data = {}
    for key, attr in ALL_PLANETS:
        obj = getattr(subject, attr, None)
        if obj is None:
            continue
        sign_raw = getattr(obj, "sign", "") or ""
        pos = float(getattr(obj, "position", None) or getattr(obj, "pos", 0) or 0)
        abs_lon = _get_abs_longitude(obj, sign_raw, pos)
        data[key] = {
            "abs_longitude": round(abs_lon, 2),
            "sign":          _lon_to_sign_es(abs_lon),
            "retrograde":    bool(getattr(obj, "retrograde", False)),
        }
    return data


def _extra_data(subject) -> dict:
    data = {}
    for key, attr in EXTRA_POINTS:
        obj = getattr(subject, attr, None)
        if obj is None:
            continue
        sign_raw = getattr(obj, "sign", "") or ""
        pos = float(getattr(obj, "position", None) or getattr(obj, "pos", 0) or 0)
        abs_lon = _get_abs_longitude(obj, sign_raw, pos)
        data[key] = {
            "abs_longitude": round(abs_lon, 2),
            "sign":          _lon_to_sign_es(abs_lon),
        }
    return data


def _house_lon(subject, attr: str) -> float:
    h = getattr(subject, attr, None)
    if h is None:
        return 0.0
    sign_raw = getattr(h, "sign", "") or ""
    pos = float(getattr(h, "position", None) or getattr(h, "pos", 0) or 0)
    return round(_get_abs_longitude(h, sign_raw, pos), 2)


def _house_cusps(subject) -> list:
    attrs = [
        "first_house", "second_house", "third_house", "fourth_house",
        "fifth_house", "sixth_house", "seventh_house", "eighth_house",
        "ninth_house", "tenth_house", "eleventh_house", "twelfth_house",
    ]
    return [_house_lon(subject, a) for a in attrs]


def _which_house(planet_lon: float, cusps: list) -> int:
    """Return 1-based house number for a longitude given a 12-element cusp list."""
    for i in range(12):
        start = cusps[i]
        end   = cusps[(i + 1) % 12]
        # Handle zodiac wrap-around (e.g. cusp at 350° and next at 20°)
        if end < start:
            if planet_lon >= start or planet_lon < end:
                return i + 1
        else:
            if start <= planet_lon < end:
                return i + 1
    return 1  # fallback


# ── Main function ──────────────────────────────────────────────────────────────

def calculate_synastry(
    name_a: str, year_a: int, month_a: int, day_a: int, city_a: str,
    name_b: str, year_b: int, month_b: int, day_b: int, city_b: str,
    hour_a: int = 12, minute_a: int = 0,
    hour_b: int = 12, minute_b: int = 0,
) -> dict:
    subj_a = _build_subject(name_a, year_a, month_a, day_a, city_a, hour_a, minute_a)
    subj_b = _build_subject(name_b, year_b, month_b, day_b, city_b, hour_b, minute_b)

    planets_a = _planet_data(subj_a)
    planets_b = _planet_data(subj_b)
    extra_a   = _extra_data(subj_a)
    extra_b   = _extra_data(subj_b)

    asc_lon_a = _house_lon(subj_a, "first_house")
    mc_lon_a  = _house_lon(subj_a, "tenth_house")
    asc_lon_b = _house_lon(subj_b, "first_house")
    mc_lon_b  = _house_lon(subj_b, "tenth_house")
    cusps_a   = _house_cusps(subj_a)

    # ── Inter-chart aspects ────────────────────────────────────────────────────
    aspects = []
    for key_a, da in planets_a.items():
        for key_b, db in planets_b.items():
            diff = abs(da["abs_longitude"] - db["abs_longitude"]) % 360
            if diff > 180:
                diff = 360 - diff

            best, best_orb = None, 999.0
            for asp in ASPECT_DEFS:
                orb = abs(diff - asp["angle"])
                if orb <= asp["orb"] and orb < best_orb:
                    best, best_orb = asp, orb

            if best:
                peso = PLANET_WEIGHT.get(key_a, 0.5) * PLANET_WEIGHT.get(key_b, 0.5)
                aspects.append({
                    "key_a":     key_a,
                    "key_b":     key_b,
                    "planeta_a": PLANET_NAMES_ES.get(key_a, key_a),
                    "planeta_b": PLANET_NAMES_ES.get(key_b, key_b),
                    "aspecto":   best["name"],
                    "symbol":    best.get("symbol", ""),
                    "tipo":      best["type"],
                    "orb":       round(best_orb, 1),
                    "peso":      peso,
                })

    aspects.sort(key=lambda x: x["orb"])

    # ── Score ──────────────────────────────────────────────────────────────────
    total_w    = sum(a["peso"] for a in aspects) or 1
    harmonic_w = sum(a["peso"] for a in aspects if a["tipo"] == "harmonious")
    neutral_w  = sum(a["peso"] for a in aspects if a["tipo"] == "neutral") * 0.65
    score = min(100, max(10, int(((harmonic_w + neutral_w) / total_w) * 100)))

    # ── Overlays: B's planets in A's houses ───────────────────────────────────
    overlays = []
    if len(cusps_a) == 12:
        for key_b, db in {**planets_b, **extra_b}.items():
            house_num = _which_house(db["abs_longitude"], cusps_a)
            overlays.append({
                "key":     key_b,
                "planet":  PLANET_NAMES_ES.get(key_b, key_b),
                "sign":    db["sign"],
                "house":   house_num,
                "meaning": HOUSE_MEANING[house_num - 1],
            })
        overlays.sort(key=lambda x: x["house"])

    return {
        "score":    score,
        "aspects":  aspects,                                          # all aspects
        "harmony":  [a for a in aspects if a["tipo"] == "harmonious"][:5],
        "tension":  [a for a in aspects if a["tipo"] == "tense"][:3],
        "dominant": aspects[0] if aspects else None,

        # Full chart data for biwheel
        "chart_a": {
            "name":          name_a,
            "ascendant_lon": asc_lon_a,
            "midheaven_lon": mc_lon_a,
            "planets":       planets_a,
            "extra_points":  extra_a,
            "house_cusps":   cusps_a,
        },
        "chart_b": {
            "name":          name_b,
            "ascendant_lon": asc_lon_b,
            "midheaven_lon": mc_lon_b,
            "planets":       planets_b,
            "extra_points":  extra_b,
        },

        # Where B's planets fall in A's houses
        "overlays": overlays,
    }
