import { useEffect, useRef, useState } from 'react'
import logo from '../assets/icons/logo.svg'
import { MAIL, mailto } from '../data/contacto'
import type { Page } from '../routes'
import { useScrollLock } from './motion'
import './header.css'

/* Destinos reales del sitio; la etiqueta pequeña es la del menú de escritorio */
const MENU: { href: string; kicker: string; label: string; page?: Page }[] = [
  { href: '#/', kicker: 'Colección 2026', label: 'Inicio', page: 'inicio' },
  { href: '#/medallas', kicker: 'Reconocer', label: 'Medallas y reconocimientos', page: 'medallas' },
  { href: '#/pines', kicker: 'Pertenecer', label: 'Pines institucionales', page: 'pines' },
  { href: '#/inicio/diplomas', kicker: 'Distinción', label: 'Portadiplomas' },
  { href: '#/biblioteca', kicker: 'Conocer', label: 'Biblioteca Goberna', page: 'biblioteca' },
  { href: '#/biblioteca/ediciones', kicker: 'Ediciones de colección', label: 'Packs y ediciones' },
  { href: '#contacto', kicker: 'Contacto', label: 'Solicitar información' },
]

/**
 * Cabecera fija de 64px con el logo y el botón de menú. El menú ocupa la
 * pantalla con la navegación vertical; se cierra al elegir un destino, al
 * tocar el fondo o con Escape, y mientras está abierto la página no se mueve.
 */
export function Header({ page }: { page: Page }) {
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  // Elegir la ruta en la que ya se está no cambia el hash: se lleva a su sección
  const pick = (href: string) => {
    setOpen(false)
    if (href !== location.hash && !(href === '#/' && location.hash === '')) return
    const section = href.split('/')[2]
    if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className={`m-header ${open ? 'is-open' : ''}`}>
      <div className="m-header__bar">
        <a href="#/" className="m-header__logo" aria-label="Goberna — inicio" onClick={() => pick('#/')}>
          <img src={logo} alt="Goberna" width={132} height={33} />
        </a>
        <button
          ref={toggle}
          type="button"
          className="m-burger"
          aria-expanded={open}
          aria-controls="m-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="m-menu" id="m-menu" inert={!open} onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
        <nav aria-label="Principal">
          <ol>
            {MENU.map((m, i) => (
              <li key={m.href} style={{ ['--i' as string]: i }}>
                <a href={m.href} onClick={() => pick(m.href)} aria-current={m.page === page ? 'page' : undefined}>
                  <span className="m-menu__kicker">{m.kicker}</span>
                  <span className="m-menu__label">{m.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <a className="m-menu__mail" href={mailto()} style={{ ['--i' as string]: MENU.length }}>
          {MAIL}
        </a>
      </div>
    </header>
  )
}
