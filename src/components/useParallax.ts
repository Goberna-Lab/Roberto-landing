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
 * centrada en pantalla el fondo queda en su posición del XD. Además, cada
 * `.zoom-bg` hace un zoom suave al entrar (ver abajo).
 * Con movimiento reducido no se aplica.
 */
export function useParallax(scope: RefObject<HTMLElement | null>, deps: unknown[]) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.px-bg', scope.current).forEach((bg) => {
          const drift = DRIFT
          // Escala justa para que el desplazamiento nunca deje ver los bordes
          // (900 px de alto → 1.14).
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

        // Zoom de escena: `.zoom-bg` (fondo con sus objetos) entra un 12% más
        // grande y llega a su tamaño del XD cuando la sección queda centrada.
        // Al escalar fondo y objetos juntos, nada se despega del piso.
        gsap.utils.toArray<HTMLElement>('.zoom-bg', scope.current).forEach((el) => {
          gsap.fromTo(
            el,
            { scale: 1.12 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'center center', scrub: true },
            },
          )
        })
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
