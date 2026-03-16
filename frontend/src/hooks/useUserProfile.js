/**
 * useUserProfile — persists user birth data in localStorage.
 *
 * Stored profile (canonical format):
 *   nombre, fecha_nacimiento (YYYY-MM-DD), hora_nacimiento (HH:MM), ciudad
 *   nombre_b, fecha_b, ciudad_b   ← partner, for Compatibilidad
 *   birthTimeKnown                ← CartaAstral preference
 */
import { useCallback } from 'react'

const KEY = 'pitonisa_profile'

function loadRaw() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') }
  catch { return {} }
}

function saveRaw(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) }
  catch {}
}

/** Merge patches into the stored profile. */
export function updateProfile(patches) {
  saveRaw({ ...loadRaw(), ...patches })
}

/**
 * Returns the stored profile and a stable `updateProfile` callback.
 * Call this once per component; the returned `profile` is the snapshot
 * at mount time (enough for pre-filling forms).
 */
export function useUserProfile() {
  const profile = loadRaw()

  const update = useCallback((patches) => {
    updateProfile(patches)
  }, [])

  return { profile, updateProfile: update }
}

// ── CartaAstral helpers ───────────────────────────────────────────────────────
/** Convert profile → CartaAstral form fields */
export function profileToCartaAstral(profile) {
  const out = {
    name:           profile.nombre || '',
    day:            '',
    month:          '',
    year:           '',
    hour:           '',
    minute:         '',
    city:           profile.ciudad || '',
    birthTimeKnown: profile.birthTimeKnown !== false,
  }

  if (profile.fecha_nacimiento) {
    const [y, m, d] = profile.fecha_nacimiento.split('-')
    if (y) out.year  = y
    if (m) out.month = String(parseInt(m, 10))  // remove leading zero
    if (d) out.day   = String(parseInt(d, 10))
  }

  if (profile.hora_nacimiento) {
    const [h, min] = profile.hora_nacimiento.split(':')
    if (h   !== undefined) out.hour   = h
    if (min !== undefined) out.minute = min
  }

  return out
}

/** Convert CartaAstral form fields → profile patches */
export function cartaAstralToProfile(form) {
  const patches = {
    nombre:        form.name,
    ciudad:        form.city,
    birthTimeKnown: form.birthTimeKnown,
  }

  if (form.day && form.month && form.year) {
    const y  = String(form.year).padStart(4, '0')
    const mo = String(form.month).padStart(2, '0')
    const d  = String(form.day).padStart(2, '0')
    patches.fecha_nacimiento = `${y}-${mo}-${d}`
  }

  if (form.birthTimeKnown && form.hour !== '' && form.minute !== '') {
    const h   = String(form.hour).padStart(2, '0')
    const min = String(form.minute).padStart(2, '0')
    patches.hora_nacimiento = `${h}:${min}`
  }

  return patches
}
