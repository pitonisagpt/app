/**
 * Numerology calculations from birth date and name.
 * All logic is pure JS — no backend needed.
 */

// Pythagorean letter values
const LETTER_VALUES = {
  a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
  j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
  s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8,
  // Spanish accented vowels
  á:1, é:5, í:9, ó:6, ú:3, ü:3, ñ:5,
}
const VOWELS = new Set(['a','e','i','o','u','á','é','í','ó','ú','ü'])

function reduceToSingle(n) {
  // Master numbers are not reduced
  if (n === 11 || n === 22 || n === 33) return n
  while (n > 9) {
    n = String(n).split('').reduce((s, d) => s + Number(d), 0)
    if (n === 11 || n === 22 || n === 33) return n
  }
  return n
}

/** Life Path Number from YYYY-MM-DD */
export function lifePathNumber(fechaNacimiento) {
  if (!fechaNacimiento) return null
  const digits = fechaNacimiento.replace(/-/g, '').split('').map(Number)
  const sum = digits.reduce((a, b) => a + b, 0)
  return reduceToSingle(sum)
}

/** Destiny Number (Expression) from full name */
export function destinyNumber(nombre) {
  if (!nombre) return null
  const sum = nombre.toLowerCase().split('').reduce((s, c) => s + (LETTER_VALUES[c] || 0), 0)
  return reduceToSingle(sum)
}

/** Soul Urge Number (vowels only) */
export function soulNumber(nombre) {
  if (!nombre) return null
  const sum = nombre.toLowerCase().split('').reduce((s, c) => s + (VOWELS.has(c) ? (LETTER_VALUES[c] || 0) : 0), 0)
  return reduceToSingle(sum)
}

// ── Descriptions ──────────────────────────────────────────────────────────────

export const LIFE_PATH_INFO = {
  1:  { title: 'El Líder',           keyword: 'Independencia',  color: 'text-red-300',    desc: 'Naciste para abrir caminos. Tu energía es pionera, directa y creativa.' },
  2:  { title: 'El Diplomático',     keyword: 'Cooperación',    color: 'text-rose-300',   desc: 'Tu don es la empatía y la armonía. Encuentras equilibrio donde otros ven conflicto.' },
  3:  { title: 'El Creador',         keyword: 'Expresión',      color: 'text-yellow-300', desc: 'La alegría y la creatividad son tu esencia. Tienes el don de inspirar a otros.' },
  4:  { title: 'El Constructor',     keyword: 'Estabilidad',    color: 'text-amber-300',  desc: 'Tu fortaleza es la disciplina y la constancia. Construyes lo que perdura.' },
  5:  { title: 'El Aventurero',      keyword: 'Libertad',       color: 'text-emerald-300',desc: 'La curiosidad y el cambio son tu alimento. Eres un espíritu libre y adaptable.' },
  6:  { title: 'El Armonizador',     keyword: 'Amor',           color: 'text-teal-300',   desc: 'Tu misión es cuidar y nutrir. La belleza, el hogar y el amor te definen.' },
  7:  { title: 'El Sabio',           keyword: 'Espiritualidad', color: 'text-blue-300',   desc: 'Eres un buscador de verdades profundas. La introspección es tu camino al conocimiento.' },
  8:  { title: 'El Manifestador',    keyword: 'Abundancia',     color: 'text-violet-300', desc: 'Posees el poder de materializar grandes proyectos. Tu energía atrae el éxito.' },
  9:  { title: 'El Humanista',       keyword: 'Compasión',      color: 'text-purple-300', desc: 'Eres un alma antigua con una misión universal. Tu corazón pertenece al mundo.' },
  11: { title: 'El Iluminado',       keyword: 'Intuición',      color: 'text-sky-200',    desc: 'Número maestro. Posees una intuición excepcional y una sensibilidad espiritual elevada.' },
  22: { title: 'El Constructor Maestro', keyword: 'Visión',    color: 'text-amber-200',  desc: 'Número maestro. Tienes el poder de hacer realidad sueños que parecen imposibles.' },
  33: { title: 'El Maestro Espiritual', keyword: 'Servicio',   color: 'text-rose-200',   desc: 'Número maestro. Tu vibración más alta se expresa en el amor incondicional y la enseñanza.' },
}

/**
 * Returns full numerology portrait from profile.
 */
export function useNumerology(profile) {
  const lifePath = lifePathNumber(profile?.fecha_nacimiento)
  const destiny  = destinyNumber(profile?.nombre)
  const soul     = soulNumber(profile?.nombre)

  return {
    lifePath,
    destiny,
    soul,
    lifePathInfo: lifePath ? LIFE_PATH_INFO[lifePath] : null,
  }
}
