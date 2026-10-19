import { useEffect, useRef, useState } from 'react'
import { Header } from './components/Header'
import { useTypewriter } from './components/useTypewriter'
import { useParallax } from './components/useParallax'
import { Home } from './pages/Home'
import { Medallas } from './pages/Medallas'
import { Biblioteca } from './pages/Biblioteca'
import { Pines } from './pages/Pines'
import { MobileApp } from './mobile/MobileApp'
import { useMobile } from './viewport'
import type { Page } from './routes'

const TITLES: Record<Page, string> = {
  inicio: 'Goberna · Colección Institucional 2026',
  medallas: 'Medallas, placas y reconocimientos · Goberna',
  pines: 'Pines y piezas de identidad · Goberna',
  biblioteca: 'Biblioteca Goberna · Libros y ediciones de colección',
}

/* Rutas por hash (pantallas del XD):
   #/              → 1 · inicio            (#/inicio/pines → sección)
   #/medallas      → 2 · categoría medallas
   #/medallas/1    → 3 · medalla seleccionada (solo la 1.ª, como el XD)
   #/pines         → 5 · categoría pines
   #/biblioteca    → 4 · biblioteca */
function parse(hash: string): { page: Page; section?: string } {
  const [, page = 'inicio', section] = hash.replace(/^#/, '').split('/')
  const p = (['inicio', 'medallas', 'pines', 'biblioteca'] as const).find((x) => x === page) ?? 'inicio'
  return { page: p, section }
}

function App() {
  const [route, setRoute] = useState(() => parse(location.hash))

  useEffect(() => {
    const onHash = () => {
      // "#contacto" y similares son anclas de la página actual, no rutas
      if (!location.hash.startsWith('#/') && location.hash !== '') return
      setRoute(parse(location.hash))
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Anclas internas: desplazamiento suave sin cambiar de ruta
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a')
      const href = a?.getAttribute('href')
      if (!href || !href.startsWith('#') || href.startsWith('#/')) return
      e.preventDefault()
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  // Cambio de página: saltar sin animación (el scroll suave es solo para anclas).
  // Abrir/cerrar una medalla dentro de #/medallas no mueve la página.
  const prevPage = useRef<Page | null>(null)
  useEffect(() => {
    document.title = TITLES[route.page]
    const samePage = prevPage.current === route.page
    prevPage.current = route.page
    const medal = route.page === 'medallas' && /^\d+$/.test(route.section ?? '')
    if (samePage && (route.page === 'medallas' || medal)) return
    if (route.section && !medal) document.getElementById(route.section)?.scrollIntoView({ behavior: 'instant' })
    else if (!medal) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  const selected = route.page === 'medallas' && route.section ? Number(route.section) || undefined : undefined

  // < 1024 px: composición mobile propia; desde 1024 px, el diseño del XD
  const mobile = useMobile()
  return mobile ? <MobileApp page={route.page} selected={selected} /> : <DesktopApp page={route.page} selected={selected} />
}

/** Versión de escritorio: lienzo de 1920 px del XD, escalado en laptop (viewport.ts). */
function DesktopApp({ page, selected }: { page: Page; selected?: number }) {
  // Títulos con efecto máquina de escribir al entrar en pantalla
  const pageRef = useRef<HTMLDivElement>(null)
  useTypewriter(pageRef, [page])
  // Fondos de los banners con parallax (se mueven más lento que la página)
  useParallax(pageRef, [page])

  return (
    <div ref={pageRef} className="page">
      <Header opacity={page === 'inicio' ? 0.95 : 0.8} active={page === 'inicio' ? undefined : `#/${page}`} />
      {page === 'medallas' ? <Medallas selected={selected} /> : page === 'pines' ? <Pines /> : page === 'biblioteca' ? <Biblioteca /> : <Home />}
    </div>
  )
}

export default App
