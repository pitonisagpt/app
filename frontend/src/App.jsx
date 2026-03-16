import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SessionProvider } from './context/SessionContext'
import Home from './pages/Home'
import Reading from './pages/Reading'
import CartaAstral from './pages/CartaAstral'
import VolveraEx from './pages/VolveraEx'
import TarotDiario from './pages/TarotDiario'
import AnyoPersonal from './pages/AnyoPersonal'
import Compatibilidad from './pages/Compatibilidad'
import Transitos from './pages/Transitos'

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tirada/:spreadId" element={<Reading />} />
          <Route path="/carta-astral" element={<CartaAstral />} />
          <Route path="/volvera-ex" element={<VolveraEx />} />
          <Route path="/tarot-diario" element={<TarotDiario />} />
          <Route path="/anyo-personal" element={<AnyoPersonal />} />
          <Route path="/compatibilidad" element={<Compatibilidad />} />
          <Route path="/transitos" element={<Transitos />} />
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}
