"""
Synastry calculator — inter-chart aspects between two natal charts.
Uses kerykeion (Swiss Ephemeris) to compute planetary positions.
"""

from kerykeion import AstrologicalSubject
from .natal_chart import geocode_city, _get_abs_longitude, ASPECT_DEFS, PLANET_NAMES_ES

SYNASTRY_PLANETS = [
    ("sol",      "sun"),
    ("luna",     "moon"),
    ("mercurio", "mercury"),
    ("venus",    "venus"),
    ("marte",    "mars"),
    ("jupiter",  "jupiter"),
    ("saturno",  "saturn"),
]

# Weight multiplier per planet pair — more personal planets matter more
PLANET_WEIGHT = {
    "sol": 3, "luna": 3, "venus": 2, "marte": 2,
    "mercurio": 1, "jupiter": 1, "saturno": 0.5,
}


def _build_subject(name: str, year: int, month: int, day: int, city: str):
    if city and city.strip():
        geo = geocode_city(city)
    else:
        geo = {"lat": 40.4168, "lon": -3.7038, "timezone": "Europe/Madrid"}
    subject = AstrologicalSubject(
        name=name, year=year, month=month, day=day,
        hour=12, minute=0,
        lng=geo["lon"], lat=geo["lat"], tz_str=geo["timezone"],
        online=False,
    )
    return subject


def _get_planet_longitudes(subject) -> dict:
    lons = {}
    for key, attr in SYNASTRY_PLANETS:
        obj = getattr(subject, attr, None)
        if obj is None:
            continue
        sign_raw = getattr(obj, "sign", "") or ""
        pos = float(getattr(obj, "position", None) or getattr(obj, "pos", 0) or 0)
        lons[key] = _get_abs_longitude(obj, sign_raw, pos)
    return lons


def calculate_synastry(
    name_a: str, year_a: int, month_a: int, day_a: int, city_a: str,
    name_b: str, year_b: int, month_b: int, day_b: int, city_b: str,
) -> dict:
    subj_a = _build_subject(name_a, year_a, month_a, day_a, city_a)
    subj_b = _build_subject(name_b, year_b, month_b, day_b, city_b)

    lons_a = _get_planet_longitudes(subj_a)
    lons_b = _get_planet_longitudes(subj_b)

    aspects = []
    for key_a, lon_a in lons_a.items():
        name_a_es = PLANET_NAMES_ES.get(key_a, key_a)
        for key_b, lon_b in lons_b.items():
            name_b_es = PLANET_NAMES_ES.get(key_b, key_b)
            diff = abs(lon_a - lon_b) % 360
            if diff > 180:
                diff = 360 - diff

            best, best_orb = None, 999
            for asp in ASPECT_DEFS:
                orb = abs(diff - asp["angle"])
                if orb <= asp["orb"] and orb < best_orb:
                    best, best_orb = asp, orb

            if best:
                peso = PLANET_WEIGHT.get(key_a, 1) * PLANET_WEIGHT.get(key_b, 1)
                aspects.append({
                    "planeta_a":  name_a_es,
                    "planeta_b":  name_b_es,
                    "aspecto":    best["name"],
                    "tipo":       best["type"],
                    "orb":        round(best_orb, 1),
                    "peso":       peso,
                })

    aspects.sort(key=lambda x: x["orb"])

    # Weighted compatibility score
    total_w = sum(a["peso"] for a in aspects) or 1
    harmonic_w = sum(a["peso"] for a in aspects if a["tipo"] == "harmonious")
    neutral_w  = sum(a["peso"] for a in aspects if a["tipo"] == "neutral") * 0.65
    score = min(100, max(10, int(((harmonic_w + neutral_w) / total_w) * 100)))

    return {
        "score":    score,
        "aspects":  aspects[:8],
        "harmony":  [a for a in aspects if a["tipo"] == "harmonious"][:3],
        "tension":  [a for a in aspects if a["tipo"] == "tense"][:2],
        "dominant": aspects[0] if aspects else None,
    }
