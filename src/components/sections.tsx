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
 * BANNER-FOOTER 1920×750 y, debajo, la barra del pie (104px) con "volver arriba".
 */
export function FinalCta() {
  return (
    <>
      <section id="contacto" className="sec final-cta" style={{ height: 750 }}>
        {/* Sin parallax: el zoom agrandaba la medalla y acercaba el logo al título */}
        <div className="bg" style={{ inset: 0, backgroundImage: `url(${asset('banner-footer.webp')})` }} />
        <Txt x={997} y={207} f="p" w={700} s={60} lh={70} up c="var(--cream)" width={723} as="h2" className="tw-title">
          <TW text="Encuentra una pieza para reconocer lo construido." />
        </Txt>
        <Btn x={996} y={472} variant="solid" href="mailto:informes@goberna.pe?subject=Solicitud%20de%20informaci%C3%B3n%20%E2%80%94%20Colecci%C3%B3n%20Goberna" />
        <Btn x={1370} y={472} variant="outline" href="#contacto" />
      </section>
      <footer className="sec site-footer" style={{ height: 104, background: 'var(--navy)' }}>
        <ToTop x={1836} y={20} filled />
      </footer>
    </>
  )
}

const OTHERS = [
  {
    title: 'Símbolos de\nprestigio',
    desc: 'Pines y piezas de identidad',
    href: '#/inicio/pines',
    // máscara 190×186 con radio izquierdo; imagen 330×186 desplazada -62px
    img: { src: asset('mini-pines.webp'), mask: [0, 0, 190, 186], box: [-62, 0, 330, 186] },
  },
  {
    title: 'Presentación de\ndistinción',
    desc: 'Portadiplomas y elementos\nceremoniales',
    href: '#/inicio/diplomas',
    img: { src: asset('mini-diploma.webp'), mask: [0, 0, 192, 186], box: [-1, -4, 194, 194] },
  },
  {
    title: 'Biblioteca del\npoder',
    desc: 'Libros, packs y colecciones premium',
    href: '#/biblioteca',
    img: { src: asset('banner-libros.webp'), mask: [0, 0, 191, 186], box: [-21, -2, 402, 188] },
  },
] as const

/* x de inicio de cada tarjeta y de su caja de texto (bordes del XD) */
const CARD_X = [
  { img: 200, box: 390, boxW: 300 },
  { img: 715, box: 906, boxW: 299 },
  { img: 1230, box: 1420, boxW: 300 },
]

/**
 * "Otras piezas de colección": 3 tarjetas horizontales (186px de alto).
 * Con título (`titleY` = su línea base) las tarjetas empiezan 78px debajo;
 * sin título (Pines, Biblioteca) empiezan en `cardsTop`.
 */
export function OtherPieces({ height, titleY, cardsTop }: { height: number; titleY?: number; cardsTop?: number }) {
  const top = titleY !== undefined ? titleY + 78 : (cardsTop ?? 0)
  return (
    <section className="sec" style={{ height, background: '#fff' }}>
      {titleY !== undefined && (
        <Txt x={200} y={titleY} f="p" w={500} s={50} lh={71} as="h2" className="tw-title">
          <TW text="Otras piezas de " />
          <span className="it gold"><TW text="colección" /></span>
        </Txt>
      )}
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
            <Txt x={tx} y={top + 49} f="p" w={700} s={23} lh={24} up as="h3">{o.title}</Txt>
            <Txt x={tx} y={top + 109.2} s={14} lh={20} ls={36} className="other-card__desc">{o.desc}</Txt>
            <MiniLink x={tx} y={top + 150} href={o.href}>Descubrir la colección</MiniLink>
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
