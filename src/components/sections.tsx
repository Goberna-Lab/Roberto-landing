import toTopArrow from '../assets/icons/to-top-arrow.svg?raw'
import { TW } from './typewriter'
import { asset } from '../asset'
import { Btn, HLine, Masked, MiniLink, Txt } from './ui'
import './sections.css'

/** Botón circular "volver arriba" (componente "Let's Go!"). */
export function ToTop({ x, y, filled }: { x: number; y: number; filled?: boolean }) {
  return (
    <button
      type="button"
      className={`to-top ${filled ? 'is-filled' : ''}`}
      style={{ left: x, top: y }}
      aria-label="Volver arriba"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <span aria-hidden dangerouslySetInnerHTML={{ __html: toTopArrow }} />
    </button>
  )
}

/**
 * Cierre común: "Encuentra una pieza para reconocer lo construido."
 * Fondo-medalla 1920×900.
 */
export function FinalCta({ filledTop }: { filledTop?: boolean }) {
  return (
    <section id="contacto" className="sec final-cta" style={{ height: 900 }}>
      <div className="bg px-bg" style={{ inset: 0, backgroundImage: `url(${asset('fondo-medalla.webp')})` }} />
      <Txt x={997} y={274} f="p" w={700} s={60} lh={70} up c="var(--cream)" width={723} as="h2" className="tw-title">
        <TW text="Encuentra una pieza para reconocer lo construido." />
      </Txt>
      <Btn x={996} y={555} variant="solid" href="mailto:informes@goberna.pe?subject=Solicitud%20de%20informaci%C3%B3n%20%E2%80%94%20Colecci%C3%B3n%20Goberna" />
      <Btn x={1370} y={555} variant="outline" href="#contacto" />
      <ToTop x={1660} y={810} filled={filledTop} />
    </section>
  )
}

const OTHERS = [
  {
    title: 'Pertenecer',
    desc: 'Pines y piezas de identidad',
    href: '#/inicio/pines',
    // máscara 190×162 con radio izquierdo; imagen 288×162 desplazada -41px
    img: { src: asset('mini-pines.webp'), mask: [0, 0, 190, 162], box: [-41, 0, 288, 162] },
  },
  {
    title: 'Presentar',
    desc: 'Portadiplomas y elementos\nceremoniales',
    href: '#/inicio/diplomas',
    img: { src: asset('mini-diploma.webp'), mask: [0, 0, 192, 162], box: [-1, -13, 194, 194] },
  },
  {
    title: 'Conocer',
    desc: 'Libros, packs y colecciones premium',
    href: '#/biblioteca',
    img: { src: asset('banner-libros.webp'), mask: [0, 0, 191, 162], box: [-18, -2, 356, 166] },
  },
] as const

/* x de inicio de cada tarjeta y de su caja de texto (bordes del XD) */
const CARD_X = [
  { img: 200, box: 390, boxW: 300 },
  { img: 715, box: 906, boxW: 299 },
  { img: 1230, box: 1420, boxW: 300 },
]

/**
 * "Otras piezas de colección": 3 tarjetas horizontales.
 * `titleY` = línea base del título; las tarjetas empiezan 78px debajo.
 */
export function OtherPieces({ height, titleY, titleSize }: { height: number; titleY: number; titleSize: 50 | 64 }) {
  const top = titleY + 78
  return (
    <section className="sec" style={{ height, background: '#fff' }}>
      <Txt x={200} y={titleY} f="p" w={500} s={titleSize} lh={71} as="h2" className="tw-title">
        <TW text="Otras piezas de " />
        <span className="it gold"><TW text="colección" /></span>
      </Txt>
      {OTHERS.map((o, i) => {
        const c = CARD_X[i]
        const [mx, my, mw, mh] = o.img.mask
        const [bx, by, bw, bh] = o.img.box
        const tx = c.box + 16
        return (
          <article key={o.title} className="other-card">
            <Masked
              mask={[c.img + mx, top + my, mw, mh]}
              img={[c.img + bx, top + by, bw, bh]}
              src={o.img.src}
              radius="6px 0 0 6px"
            />
            <div className="other-card__box" style={{ left: c.box, top, width: c.boxW }} />
            <Txt x={tx} y={top + 62} f="p" w={700} s={28} lh={34} up as="h3">{o.title}</Txt>
            <Txt x={tx} y={top + 88} s={14} lh={20} ls={36} className="other-card__desc">{o.desc}</Txt>
            <MiniLink x={tx} y={top + 133} href={o.href}>Descubrir la colección</MiniLink>
          </article>
        )
      })}
    </section>
  )
}

/** Título con raya dorada corta (usado en tarjetas de producto). */
export function GoldDash({ cx, y }: { cx: number; y: number }) {
  return <HLine x={cx - 32} y={y} w={64} h={2} c="#9f7d48" />
}
