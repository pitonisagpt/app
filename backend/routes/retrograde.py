"""
Retrograde planets endpoint — uses pyswisseph directly for speed.
Creating a full AstrologicalSubject per step is too slow; swe.calc_ut is instant.
"""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import swisseph as swe

router = APIRouter()

# pyswisseph planet IDs
PLANETS = [
    (swe.MERCURY, "mercury", "Mercurio", "☿"),
    (swe.VENUS,   "venus",   "Venus",    "♀"),
    (swe.MARS,    "mars",    "Marte",    "♂"),
    (swe.JUPITER, "jupiter", "Júpiter",  "♃"),
    (swe.SATURN,  "saturn",  "Saturno",  "♄"),
    (swe.URANUS,  "uranus",  "Urano",    "♅"),
    (swe.NEPTUNE, "neptune", "Neptuno",  "♆"),
    (swe.PLUTO,   "pluto",   "Plutón",   "♇"),
]

MEANINGS = {
    "mercury": "comunicación, contratos y tecnología bajo revisión",
    "venus":   "relaciones y valores en transformación interior",
    "mars":    "energía y acción en pausa reflexiva",
    "jupiter": "expansión y abundancia siendo reconsiderada",
    "saturn":  "estructuras y responsabilidades bajo escrutinio",
    "uranus":  "cambios y rupturas en proceso interno",
    "neptune": "sueños, intuición y espiritualidad en retrospectiva",
    "pluto":   "transformación profunda y poder en revisión",
}

MONTHS_ES = ["", "ene", "feb", "mar", "abr", "may", "jun",
             "jul", "ago", "sep", "oct", "nov", "dic"]


def _dt_to_jd(dt: datetime) -> float:
    return swe.julday(dt.year, dt.month, dt.day,
                      dt.hour + dt.minute / 60.0)


def _planet_speed(jd: float, planet_id: int) -> float:
    """Returns longitudinal speed (deg/day). Negative = retrograde."""
    flags = swe.FLG_SWIEPH | swe.FLG_SPEED
    result, _ = swe.calc_ut(jd, planet_id, flags)
    return result[3]  # index 3 = speed in longitude


def _find_direct_jd(planet_id: int, jd_start: float) -> Optional[float]:
    """Binary-search forward to find when planet turns direct. Max 300 days."""
    # First find a bracket: step by 5 days until speed > 0
    jd = jd_start
    for _ in range(60):        # 60 × 5 = 300 days max
        jd += 5
        if _planet_speed(jd, planet_id) > 0:
            break
    else:
        return None            # still retrograde after 300 days

    # Binary search within the 5-day window
    lo, hi = jd - 5, jd
    for _ in range(10):        # 10 iterations → precision < 0.01 day
        mid = (lo + hi) / 2
        if _planet_speed(mid, planet_id) > 0:
            hi = mid
        else:
            lo = mid

    return hi


def _jd_to_date_str(jd: float) -> str:
    y, m, d, _ = swe.revjul(jd)
    return f"{int(d)} {MONTHS_ES[int(m)]}"


@router.get("/retrograde-planets")
def get_retrograde_planets():
    now = datetime.now(timezone.utc)
    jd_now = _dt_to_jd(now)

    retrogrades = []
    for planet_id, attr, name_es, symbol in PLANETS:
        speed = _planet_speed(jd_now, planet_id)
        if speed < 0:
            direct_jd = _find_direct_jd(planet_id, jd_now)
            retrogrades.append({
                "attr":    attr,
                "name":    name_es,
                "symbol":  symbol,
                "meaning": MEANINGS[attr],
                "until":   _jd_to_date_str(direct_jd) if direct_jd else None,
            })

    return JSONResponse({"retrogrades": retrogrades})
