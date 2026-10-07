import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Desplazamiento máximo del fondo respecto a su sección (px de diseño). */
const DRIFT = 60

/**
 * Parallax de fondos: cada `.px-bg` se mueve más lento que la página mientras
 * su sección cruza la pantalla (de +60 a −60 px). Cuando la sección está
 * centrada en pantalla el fondo queda en su posición del XD.
 * `data-px-drift` reduce el recorrido en imágenes donde el zoom necesario se
 * notaría (p. ej. los libros, que llenan el encuadre).
 * Con movimiento reducido no se aplica.
 */
export function useParallax(scope: RefObject<HTMLElement | null>, deps: unknown[]) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.px-bg', scope.current).forEach((bg) => {
          const drift = Number(bg.dataset.pxDrift) || DRIFT
          // Escala justa para que el desplazamiento nunca deje ver los bordes
          // (900 px de alto: 60 px → 1.14; 18 px → 1.05).
          const scale = 1 + (2 * (drift + 4)) / bg.offsetHeight
          gsap.fromTo(
            bg,
            { y: -drift, scale },
            {
              y: drift,
              scale,
              ease: 'none',
              scrollTrigger: { trigger: bg.closest('section'), start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
