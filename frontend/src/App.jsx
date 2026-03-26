import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { SessionProvider } from './context/SessionContext'
import Home from './pages/Home'
import Reading from './pages/Reading'
import CartaAstral from './pages/CartaAstral'
import VolveraEx from './pages/VolveraEx'
import TarotDiario from './pages/TarotDiario'
import AnyoPersonal from './pages/AnyoPersonal'
import Compatibilidad from './pages/Compatibilidad'
import Transitos from './pages/Transitos'
import Suenos from './pages/Suenos'
import OnboardingModal, { useShowOnboarding } from './components/OnboardingModal'

function AppRoutes() {
  const [showOnboarding, closeOnboarding] = useShowOnboarding()

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tirada/:spreadId" element={<Reading />} />
        <Route path="/carta-astral" element={<CartaAstral />} />
        <Route path="/volvera-ex" element={<VolveraEx />} />
        <Route path="/tarot-diario" element={<TarotDiario />} />
        <Route path="/anyo-personal" element={<AnyoPersonal />} />
        <Route path="/compatibilidad" element={<Compatibilidad />} />
        <Route path="/transitos" element={<Transitos />} />
        <Route path="/suenos" element={<Suenos />} />
      </Routes>
      {showOnboarding && <OnboardingModal onClose={closeOnboarding} />}
    </>
  )
}

function useCopyAttribution() {
  useEffect(() => {
    function handleCopy(e) {
      const active = document.activeElement
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) return
      const selected = window.getSelection()?.toString()
      if (!selected?.trim()) return
      e.clipboardData.setData('text/plain', `Pitonisa GPT dice:\n"${selected}"\n\nhttps://pitonisa-gpt.vercel.app/`)
      e.preventDefault()
    }
    document.addEventListener('copy', handleCopy)
    return () => document.removeEventListener('copy', handleCopy)
  }, [])
}

export default function App() {
  useCopyAttribution()
  return (
    <HelmetProvider>
      <BrowserRouter>
        <SessionProvider>
          <AppRoutes />
        </SessionProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
