import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { reducedMotion, useScrollLock } from './motion'
import './sheet.css'

/** Distancia (px) que hay que arrastrar la ficha hacia abajo para cerrarla. */
const DRAG_CLOSE = 90
/** Duración de la salida (debe coincidir con `.m-sheet.is-closing` en catalog.css). */
const EXIT_MS = 280

/**
 * Ficha de producto en panel inferior (bottom sheet): se cierra con la X, al
 * tocar fuera, con Escape o arrastrándola hacia abajo. Mientras está abierta
 * la página no se desplaza y el foco no sale de la ficha; al cerrarla vuelve
 * al elemento que la abrió. `footer` queda fijo al pie (llamada a la acción).
 */
export function Sheet({ label, onClose, children, footer }: { label: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  const id = useId()
  const panel = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const [closing, setClosing] = useState(false)
  useScrollLock(true)

  const close = () => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, reducedMotion() ? 0 : EXIT_MS)
  }
  // Referencia estable para los listeners (la ficha se monta una vez)
  const closeRef = useRef(close)
  useEffect(() => {
    closeRef.current = close
  })

  // Foco: entra en la ficha y vuelve al elemento que la abrió
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    closeBtn.current?.focus({ preventScroll: true })
    return () => prev?.focus({ preventScroll: true })
  }, [])

  // Escape cierra; Tab circula dentro de la ficha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current()
      } else if (e.key === 'Tab' && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Arrastrar hacia abajo (desde el tope del contenido) para cerrar
  useEffect(() => {
    const p = panel.current
    if (!p) return
    let y0 = 0
    let dy = 0
    let dragging = false
    const start = (e: TouchEvent) => {
      if ((body.current?.scrollTop ?? 0) > 0) return
      dragging = true
      dy = 0
      y0 = e.touches[0].clientY
      p.style.transition = 'none'
    }
    const move = (e: TouchEvent) => {
      if (!dragging) return
      dy = Math.max(0, e.touches[0].clientY - y0)
      p.style.transform = `translateY(${dy}px)`
    }
    const end = () => {
      if (!dragging) return
      dragging = false
      p.style.transition = ''
      p.style.transform = ''
      if (dy > DRAG_CLOSE) closeRef.current()
    }
    p.addEventListener('touchstart', start, { passive: true })
    p.addEventListener('touchmove', move, { passive: true })
    p.addEventListener('touchend', end)
    p.addEventListener('touchcancel', end)
    return () => {
      p.removeEventListener('touchstart', start)
      p.removeEventListener('touchmove', move)
      p.removeEventListener('touchend', end)
      p.removeEventListener('touchcancel', end)
    }
  }, [])

  return (
    <div className={`m-sheet ${closing ? 'is-closing' : ''}`}>
      <div className="m-sheet__backdrop" onClick={close} aria-hidden />
      <div ref={panel} className="m-sheet__panel" role="dialog" aria-modal="true" aria-labelledby={id}>
        <span className="m-sheet__grab" aria-hidden />
        <button ref={closeBtn} type="button" className="m-sheet__close" onClick={close} aria-label="Cerrar ficha">
          <span aria-hidden />
        </button>
        <div ref={body} className="m-sheet__body">
          <span id={id} className="sr-only">{label}</span>
          {children}
        </div>
        {footer && <div className="m-sheet__foot">{footer}</div>}
      </div>
    </div>
  )
}
