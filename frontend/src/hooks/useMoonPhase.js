import { useState, useEffect } from 'react'

const API_BASE   = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const CACHE_KEY  = 'pitonisa_moon_phase'
const CACHE_TTL  = 60 * 60 * 1000  // 1 hour

export function useMoonPhase() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Try cache first
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        setData(cached.data)
        setLoading(false)
        return
      }
    } catch {}

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)

    fetch(`${API_BASE}/api/moon-phase`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        setData(d)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: d, ts: Date.now() }))
      })
      .catch(() => {})
      .finally(() => { clearTimeout(timeout); setLoading(false) })
  }, [])

  return { data, loading }
}
