import { useEffect } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Animaciones de scroll de la versión mobile, declaradas con atributos:
 * - `data-reveal`: aparece una vez (opacidad + 18px) al entrar en pantalla.
 * - `data-line`: línea dorada que se dibuja de izquierda a derecha.
 * - `data-unveil`: imagen que entra con un leve acercamiento.
 * - `data-parallax="n"`: capa que se desplaza ±n px mientras su contenedor
 *   cruza la pantalla (el CSS la agranda n px por lado: nunca deja ver bordes).
 * - `data-words`: título cuyas palabras (`.m-w`) se entintan con el scroll.
 * Los estados iniciales se aplican desde aquí: sin JavaScript o con movimiento
 * reducido, todo el contenido queda visible y quieto.
 */
export function useMobileMotion(scope: RefObject<HTMLElement | null>, deps: unknown[]) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(scope)

        const reveal = q('[data-reveal]')
        gsap.set(reveal, { autoAlpha: 0, y: 18 })
        ScrollTrigger.batch(reveal, {
          start: 'top 92%',
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.09, overwrite: true }),
        })

        const lines = q('[data-line]')
        gsap.set(lines, { scaleX: 0, transformOrigin: 'left center' })
        ScrollTrigger.batch(lines, {
          start: 'top 94%',
          once: true,
          onEnter: (els) => gsap.to(els, { scaleX: 1, duration: 1.1, ease: 'power2.inOut', stagger: 0.1 }),
        })

        const unveil = q('[data-unveil]')
        gsap.set(unveil, { autoAlpha: 0, scale: 1.06 })
        ScrollTrigger.batch(unveil, {
          start: 'top 94%',
          once: true,
          onEnter: (els) => gsap.to(els, { autoAlpha: 1, scale: 1, duration: 1.3, ease: 'power3.out', stagger: 0.12 }),
        })

        for (const el of q('[data-parallax]') as HTMLElement[]) {
          const d = Number(el.dataset.parallax) || 18
          gsap.fromTo(
            el,
            { y: -d },
            {
              y: d,
              ease: 'none',
              scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        }

        for (const el of q('[data-words]') as HTMLElement[]) {
          gsap.fromTo(
            el.querySelectorAll('.m-w'),
            { opacity: 0.22 },
            {
              opacity: 1,
              stagger: 0.08,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 50%', scrub: 0.8 },
            },
          )
        }
      })
    },
    { scope, dependencies: deps, revertOnUpdate: true },
  )
}

/**
 * Marca con `is-live` los `[data-live]` visibles: los brillos y la flotación
 * solo corren en las piezas que están en pantalla (no todas a la vez).
 */
export function useLive(scope: RefObject<HTMLElement | null>, deps: unknown[]) {
  useEffect(() => {
    const els = scope.current?.querySelectorAll<HTMLElement>('[data-live]')
    if (!els?.length) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-live', e.isIntersecting)),
      { rootMargin: '-8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/** Bloquea el scroll de la página mientras un menú o una ficha están abiertos. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return
    const de = document.documentElement
    const prev = de.style.overflow
    de.style.overflow = 'hidden'
    return () => {
      de.style.overflow = prev
    }
  }, [active])
}

/** true si el usuario pidió movimiento reducido. */
export const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches
