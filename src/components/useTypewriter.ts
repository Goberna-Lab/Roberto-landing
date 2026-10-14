import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Activa el efecto máquina de escribir en los `.tw-title` dentro de `scope`:
 * cada título se escribe una sola vez al entrar en pantalla. Con movimiento
 * reducido los títulos se muestran completos.
 */
export function useTypewriter(scope: RefObject<HTMLElement | null>, deps: unknown[]) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.tw-title', scope.current).forEach((title) => {
          const chars = title.querySelectorAll('.tw-c')
          gsap.set(chars, { opacity: 0 })
          gsap.to(chars, {
            opacity: 1,
            duration: 0.3, // cada letra entra con un fundido que se solapa con las siguientes
            // ~25 caracteres por segundo, pero los títulos largos se aceleran
            // para que ninguno tarde más de ~1,6 s en total
            stagger: Math.min(0.04, 1.3 / Math.max(chars.length - 1, 1)),
            ease: 'none',
            scrollTrigger: { trigger: title, start: 'top 85%', once: true },
          })
        })
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
