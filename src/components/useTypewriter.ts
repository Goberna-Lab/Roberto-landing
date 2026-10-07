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
            duration: 0.22, // cada letra entra con un fundido corto, no de golpe
            stagger: 0.07, // ~14 caracteres por segundo
            ease: 'none',
            scrollTrigger: { trigger: title, start: 'top 85%', once: true },
          })
        })
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}
