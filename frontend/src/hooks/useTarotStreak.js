const STORAGE_KEY = 'pitonisa_tarot_streak'

function todayStr() {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function yesterdayStr() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getMilestone(streak) {
  if (streak >= 365) return { label: '¡Un año!', color: 'text-yellow-300' }
  if (streak >= 100) return { label: '100 días', color: 'text-yellow-300' }
  if (streak >=  60) return { label: '2 meses',  color: 'text-amber-300' }
  if (streak >=  30) return { label: 'Un mes',   color: 'text-amber-300' }
  if (streak >=  21) return { label: '3 semanas', color: 'text-amber-400' }
  if (streak >=  14) return { label: '2 semanas', color: 'text-amber-400' }
  if (streak >=   7) return { label: 'Una semana', color: 'text-orange-400' }
  if (streak >=   3) return { label: `${streak} días`, color: 'text-orange-400' }
  return null
}

/**
 * Returns current streak data and a function to mark today as done.
 * Call markToday() when the user successfully gets their daily reading.
 */
export function useTarotStreak() {
  const raw = load()
  const today = todayStr()
  const yesterday = yesterdayStr()

  const isAlreadyDoneToday = raw.lastDate === today
  const streak = raw.count || 0
  const bestStreak = raw.bestStreak || 0

  function markToday() {
    const current = load()
    if (current.lastDate === today) return // already counted

    let newCount
    if (current.lastDate === yesterday) {
      newCount = (current.count || 0) + 1
    } else {
      newCount = 1 // streak broken, restart
    }

    const newBest = Math.max(newCount, current.bestStreak || 0)
    save({ count: newCount, lastDate: today, bestStreak: newBest })
  }

  return { streak, bestStreak, isAlreadyDoneToday, markToday }
}
