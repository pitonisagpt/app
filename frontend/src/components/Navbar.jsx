import { Link } from 'react-router-dom'
import HamburgerMenu from './HamburgerMenu'

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         className="w-4 h-4" aria-hidden="true">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  )
}

export default function Navbar() {
  return (
    <nav className="relative z-10 border-b border-mystic-border/40 backdrop-blur-md"
         style={{ background: 'linear-gradient(180deg, rgba(16,16,38,0.95), rgba(10,10,24,0.90))' }}>
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-mystic-gold/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="text-2xl animate-float relative" role="img" aria-label="Crystal ball">🔮</span>
          </div>
          <div>
            <h1 className="text-base font-display font-bold tracking-[0.2em] uppercase"
                style={{
                  background: 'linear-gradient(90deg, #c9a84c, #e8c97e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
              Pitonisa GPT
            </h1>
            <p className="text-[10px] text-mystic-muted/60 tracking-[0.15em] uppercase font-sans">Tu Oráculo con IA</p>
          </div>
        </Link>

        {/* Desktop: back link — Mobile: hamburger */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="hidden sm:flex items-center gap-1.5 text-mystic-muted/70 hover:text-mystic-accent cursor-pointer
                       text-xs tracking-wider uppercase transition-all duration-200 font-sans
                       hover:-translate-x-0.5 focus:outline-none focus:ring-2 focus:ring-mystic-gold/40 rounded px-1"
            aria-label="Volver al inicio"
          >
            <ArrowLeftIcon />
            Inicio
          </Link>

          <div className="sm:hidden">
            <HamburgerMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}
