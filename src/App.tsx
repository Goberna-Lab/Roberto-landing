import { useEffect, useRef, useState } from 'react'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Medallas } from './pages/Medallas'
import { Biblioteca } from './pages/Biblioteca'

type Page = 'inicio' | 'medallas' | 'biblioteca'

const TITLES: Record<Page, string> = {
  inicio: 'Goberna · Colección Institucional 2026',
  medallas: 'Medallas, placas y reconocimientos · Goberna',
  biblioteca: 'Biblioteca Goberna · Libros y ediciones de colección',
}

/* Rutas por hash (pantallas del XD):
   #/              → 1 · inicio            (#/inicio/pines → sección)
   #/medallas      → 2 · categoría medallas
   #/medallas/3    → 3 · medalla n.º 3 seleccionada (1–9)
   #/biblioteca    → 4 · biblioteca */
function parse(hash: string): { page: Page; section?: string } {
  const [, page = 'inicio', section] = hash.replace(/^#/, '').split('/')
  const p = (['inicio', 'medallas', 'biblioteca'] as const).find((x) => x === page) ?? 'inicio'
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

  return (
    <div className="page">
      <Header opacity={route.page === 'inicio' ? 0.95 : 0.8} active={route.page === 'inicio' ? undefined : `#/${route.page}`} />
      {route.page === 'medallas' ? <Medallas selected={selected} /> : route.page === 'biblioteca' ? <Biblioteca /> : <Home />}
    </div>
  )
}

export default App
