import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'
import NavMenuContent from './NavMenuContent'

export default function SidebarMenu() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const overlay = (
    <>
      {open && (
        <div className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
             onClick={() => setOpen(false)} />
      )}
      <div
        className={`fixed top-0 left-0 h-full z-[9999] w-[85vw] max-w-sm flex flex-col overflow-hidden
                    transition-transform duration-300 ease-in-out
                    ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(160deg, #0d0d20 0%, #10102a 100%)', borderRight: '1px solid rgba(201,168,76,0.15)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-mystic-border/30 flex-shrink-0"
             style={{ background: 'linear-gradient(180deg, rgba(20,20,50,0.95), rgba(16,16,38,0.90))' }}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl animate-float">🔮</span>
            <div>
              <p className="text-sm font-display font-bold tracking-[0.18em] uppercase"
                 style={{ background: 'linear-gradient(90deg, #c9a84c, #e8c97e)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Pitonisa GPT
              </p>
              <p className="text-[9px] text-mystic-muted/50 tracking-widest uppercase font-sans">Tu Oráculo con IA</p>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Cerrar menú"
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-mystic-border/40
                             text-mystic-muted/60 hover:border-mystic-gold/40 hover:text-mystic-gold
                             transition-all duration-200 cursor-pointer text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto pb-8">
          <NavMenuContent onClose={() => setOpen(false)} />
        </div>

        <div className="px-4 py-3 border-t border-mystic-border/25 text-center flex-shrink-0">
          <p className="text-mystic-muted/30 text-[10px] font-sans tracking-wide">
            Sitio de entretenimiento · No sustituye consejos profesionales
          </p>
        </div>
      </div>
    </>
  )

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Abrir menú"
              className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-lg
                         border border-mystic-border/50 bg-mystic-surface/60
                         hover:border-mystic-gold/40 hover:bg-mystic-surface
                         transition-all duration-200 cursor-pointer">
        <span className="w-4 h-px bg-mystic-muted/70 rounded-full block" />
        <span className="w-4 h-px bg-mystic-muted/70 rounded-full block" />
        <span className="w-3 h-px bg-mystic-muted/70 rounded-full block self-end mr-2.5" />
      </button>
      {createPortal(overlay, document.body)}
    </>
  )
}
