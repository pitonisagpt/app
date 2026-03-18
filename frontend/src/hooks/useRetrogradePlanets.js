import { useState, useEffect } from 'react'

const API_BASE  = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const CACHE_KEY = 'pitonisa_retrogrades'
const CACHE_TTL = 12 * 60 * 60 * 1000  // 12 hours

export function useRetrogradePlanets() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY))
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        setData(cached.data)
        setLoading(false)
        return
      }
    } catch {}

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    fetch(`${API_BASE}/api/retrograde-planets`, { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => {
        setData(d)
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: d, ts: Date.now() }))
      })
      .catch(() => setData(null))
      .finally(() => { clearTimeout(timeout); setLoading(false) })
  }, [])

  return { retrogrades: data?.retrogrades ?? [], loading, error: data === null && !loading }
}
