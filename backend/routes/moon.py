"""
Moon phase endpoint — calculates current moon phase using Swiss Ephemeris via kerykeion.
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from kerykeion import AstrologicalSubject

router = APIRouter()

SIGN_NAMES = [
    "Aries", "Tauro", "Géminis", "Cáncer",
    "Leo", "Virgo", "Libra", "Escorpio",
    "Sagitario", "Capricornio", "Acuario", "Piscis",
]

# Phase definitions: (min_angle, max_angle, name_es, emoji)
PHASES = [
    (0,    22.5,  "Luna Nueva",              "🌑"),
    (22.5, 67.5,  "Luna Creciente",          "🌒"),
    (67.5, 112.5, "Cuarto Creciente",        "🌓"),
    (112.5,157.5, "Luna Gibosa Creciente",   "🌔"),
    (157.5,202.5, "Luna Llena",              "🌕"),
    (202.5,247.5, "Luna Gibosa Menguante",   "🌖"),
    (247.5,292.5, "Cuarto Menguante",        "🌗"),
    (292.5,337.5, "Luna Menguante",          "🌘"),
    (337.5,360,   "Luna Nueva",              "🌑"),
]


def _lon_to_sign(lon: float) -> str:
    return SIGN_NAMES[int(lon // 30) % 12]


def _phase_info(angle: float) -> tuple[str, str, float]:
    """Returns (name, emoji, illumination_pct)."""
    for lo, hi, name, emoji in PHASES:
        if lo <= angle < hi:
            # illumination: 0% at new, 100% at full, 0% back at new
            illum = round((1 - abs(angle - 180) / 180) * 100)
            return name, emoji, illum
    return "Luna Nueva", "🌑", 0


def _days_to_next_phase(angle: float) -> tuple[str, int]:
    """Approximate days to next notable phase (new or full)."""
    moon_speed = 13.2  # degrees per day

    # Next full moon
    if angle < 180:
        deg_to_full = 180 - angle
    else:
        deg_to_full = 360 - angle + 180

    # Next new moon
    if angle < 360:
        deg_to_new = 360 - angle

    days_full = round(deg_to_full / moon_speed)
    days_new  = round(deg_to_new  / moon_speed)

    if days_full <= days_new:
        return "Luna llena", days_full
    return "Luna nueva", days_new


@router.get("/moon-phase")
def get_moon_phase():
    now = datetime.now(timezone.utc)

    subject = AstrologicalSubject(
        name="now",
        year=now.year, month=now.month, day=now.day,
        hour=now.hour, minute=now.minute,
        lat=0.0, lng=0.0,  # location irrelevant for moon phase
        tz_str="UTC",
        online=False,
    )

    moon_lon = subject.moon.abs_pos  # ecliptic longitude 0–360
    sun_lon  = subject.sun.abs_pos

    angle = (moon_lon - sun_lon) % 360
    phase_name, emoji, illumination = _phase_info(angle)
    moon_sign = _lon_to_sign(moon_lon)
    next_phase_name, next_phase_days = _days_to_next_phase(angle)

    return JSONResponse({
        "phase":           phase_name,
        "emoji":           emoji,
        "illumination":    illumination,
        "moon_sign":       moon_sign,
        "next_phase":      next_phase_name,
        "next_phase_days": next_phase_days,
        "angle":           round(angle, 1),
    })
