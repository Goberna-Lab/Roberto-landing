import { useRef } from 'react'
import type { Page } from '../routes'
import { useTypewriter } from '../components/useTypewriter'
import { useLive, useMobileMotion } from './motion'
import { Header } from './Header'
import { Home } from './Home'
import { Medallas } from './Medallas'
import { Pines } from './Pines'
import { Biblioteca } from './Biblioteca'
import './base.css'

/**
 * Versión mobile y tablet (< 1024 px): mismas rutas, datos y contenidos que
 * escritorio, con una composición vertical propia y animaciones adaptadas al
 * tacto (sin depender del mouse).
 */
export function MobileApp({ page, selected }: { page: Page; selected?: number }) {
  const root = useRef<HTMLDivElement>(null)
  // Títulos con máquina de escribir (como en escritorio), revelados, parallax y brillos
  useTypewriter(root, [page])
  useMobileMotion(root, [page])
  useLive(root, [page])

  return (
    <div ref={root} className="m-app">
      <Header page={page} />
      <main>
        {page === 'medallas' ? <Medallas selected={selected} /> : page === 'pines' ? <Pines /> : page === 'biblioteca' ? <Biblioteca /> : <Home />}
      </main>
    </div>
  )
}
