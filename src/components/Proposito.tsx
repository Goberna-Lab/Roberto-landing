import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { asset } from '../asset'
import { HLine, Txt } from './ui'
import './Proposito.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Separa un texto en palabras animables, conservando los espacios (mismo ajuste de línea). */
function Words({ text }: { text: string }) {
  return text.split(' ').map((w, i, all) => (
    <span key={i}>
      <span className="pw">{w}</span>
      {i < all.length - 1 ? ' ' : ''}
    </span>
  ))
}

/**
 * "El propósito" con revelado elegante al hacer scroll (sin fijar la sección):
 * la columna flota con un parallax mínimo y el contenido aparece en secuencia
 * — etiqueta → título que se "entinta" palabra por palabra → párrafo → línea
 * dorada → tres conceptos — con curvas suaves y desplazamientos cortos.
 */
export function Proposito() {
  const wrap = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root)

        // Columna: deriva lenta de ±25px mientras la sección cruza la pantalla.
        // La escala 1.06 cubre ese margen sin dejar ver los bordes.
        gsap.fromTo(
          q('.prop-bg'),
          { y: -25, scale: 1.06 },
          {
            y: 25,
            scale: 1.06,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )

        // Estados iniciales explícitos: en un timeline con scrub, los tweens con
        // stagger solo aplican el estado inicial al primer elemento.
        gsap.set(q('.prop-kicker'), { autoAlpha: 0, x: -12 })
        gsap.set(q('.pw'), { opacity: 0.25 })
        gsap.set(q('.prop-text'), { autoAlpha: 0, y: 12 })
        gsap.set(q('.prop-line'), { scaleX: 0 })
        gsap.set(q('.prop-tag'), { autoAlpha: 0, y: 10 })

        gsap
          .timeline({
            defaults: { ease: 'sine.out' },
            // scrub 1.5: la animación alcanza al scroll con suavidad ("flota")
            scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 10%', scrub: 1.5 },
          })
          .to(q('.prop-kicker'), { autoAlpha: 1, x: 0, duration: 0.6 }, 0)
          .to(q('.pw'), { opacity: 1, duration: 0.5, stagger: 0.08, ease: 'none' }, 0.15)
          .to(q('.prop-text'), { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.4')
          .to(q('.prop-line'), { scaleX: 1, duration: 1, ease: 'sine.inOut' }, '-=0.5')
          .to(q('.prop-tag'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.12 }, '-=0.6')
      })
    },
    { scope: wrap },
  )

  return (
    <div ref={wrap} className="prop-wrap">
    <section ref={root} id="proposito" className="sec" style={{ height: 900, background: 'var(--sand)' }}>
      <div
        className="bg prop-bg"
        style={{ left: 321, top: 0, width: 1599, height: 900, backgroundImage: `url(${asset('proposito.webp')})` }}
      />
      <div className="prop-content">
        <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--navy)" className="prop-kicker">
          El propósito
        </Txt>
        <Txt x={427} y={297} f="p" w={700} s={46} lh={65} up c="var(--navy)" width={1066} as="h2">
          <span className="gold">
            <Words text="Goberna reúne piezas para representar" />
          </span>{' '}
          <Words text="prestigio, distinción académica y un legado que trasciende el tiempo." />
        </Txt>
        <Txt x={428} y={512} s={22} lh={32} ls={32} c="var(--ink)" width={1065} className="prop-text">
          GOBERNA reúne piezas creadas para representar los logros, identidad y conocimiento, convirtiendo los
          momentos significativos en objetos con valor institucional.
        </Txt>
        <HLine x={427} y={636} w={1065} className="prop-line" />
        <Txt x={428} y={715} s={16} lh={19} ls={140} up c="var(--navy)" className="prop-tag">Reconocimiento</Txt>
        <Txt x={695} y={715} s={16} lh={19} ls={140} up c="var(--navy)" className="prop-tag">Identidad</Txt>
        <Txt x={906} y={715} s={16} lh={19} ls={140} up c="var(--navy)" className="prop-tag">Conocimiento</Txt>
      </div>
    </section>
    </div>
  )
}
