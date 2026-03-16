"""
Transit calculator — compares today's planetary positions against a natal chart.
Uses kerykeion (Swiss Ephemeris).
"""

from datetime import date
from kerykeion import AstrologicalSubject
from .natal_chart import geocode_city, _get_abs_longitude, ASPECT_DEFS, PLANET_NAMES_ES

TRANSIT_PLANETS = [
    ("sol",      "sun"),
    ("luna",     "moon"),
    ("mercurio", "mercury"),
    ("venus",    "venus"),
    ("marte",    "mars"),
    ("jupiter",  "jupiter"),
    ("saturno",  "saturn"),
]

NATAL_PLANETS = [
    ("sol",      "sun"),
    ("luna",     "moon"),
    ("mercurio", "mercury"),
    ("venus",    "venus"),
    ("marte",    "mars"),
    ("jupiter",  "jupiter"),
    ("saturno",  "saturn"),
]

# Approximate transit durations (days) for interpretive text
TRANSIT_DURATION = {
    "sol":      "2-3 semanas",
    "luna":     "2-3 días",
    "mercurio": "1-2 semanas",
    "venus":    "2-4 semanas",
    "marte":    "4-6 semanas",
    "jupiter":  "2-4 meses",
    "saturno":  "3-6 meses",
}


def _get_lons(subject, planet_list: list) -> dict:
    lons = {}
    for key, attr in planet_list:
        obj = getattr(subject, attr, None)
        if obj is None:
            continue
        sign_raw = getattr(obj, "sign", "") or ""
        pos = float(getattr(obj, "position", None) or getattr(obj, "pos", 0) or 0)
        lons[key] = _get_abs_longitude(obj, sign_raw, pos)
    return lons


def calculate_transits(
    name: str,
    year: int, month: int, day: int,
    hour: int, minute: int,
    city: str,
    birth_time_known: bool = True,
) -> dict:
    geo = geocode_city(city)

    natal = AstrologicalSubject(
        name=name, year=year, month=month, day=day,
        hour=hour if birth_time_known else 12,
        minute=minute if birth_time_known else 0,
        lng=geo["lon"], lat=geo["lat"], tz_str=geo["timezone"],
        online=False,
    )

    today = date.today()
    transiting = AstrologicalSubject(
        name="Transits", year=today.year, month=today.month, day=today.day,
        hour=12, minute=0,
        lng=geo["lon"], lat=geo["lat"], tz_str=geo["timezone"],
        online=False,
    )

    natal_lons    = _get_lons(natal,     NATAL_PLANETS)
    transit_lons  = _get_lons(transiting, TRANSIT_PLANETS)

    aspects = []
    for t_key, t_lon in transit_lons.items():
        t_name = PLANET_NAMES_ES.get(t_key, t_key)
        for n_key, n_lon in natal_lons.items():
            n_name = PLANET_NAMES_ES.get(n_key, n_key)
            diff = abs(t_lon - n_lon) % 360
            if diff > 180:
                diff = 360 - diff

            best, best_orb = None, 999
            for asp in ASPECT_DEFS:
                orb = abs(diff - asp["angle"])
                if orb <= asp["orb"] and orb < best_orb:
                    best, best_orb = asp, orb

            if best:
                intensity = max(1, 4 - int(best_orb * 4 / max(best["orb"], 1)))
                aspects.append({
                    "transiting":    t_name,
                    "natal":         n_name,
                    "aspecto":       best["name"],
                    "tipo":          best["type"],
                    "orb":           round(best_orb, 1),
                    "intensity":     intensity,
                    "duracion":      TRANSIT_DURATION.get(t_key, "días"),
                    "description":   f"{t_name} en {best['name'].lower()} con tu {n_name} natal",
                })

    aspects.sort(key=lambda x: x["orb"])

    return {
        "aspects": aspects[:6],
        "top":     aspects[0] if aspects else None,
        "count":   len(aspects),
    }
