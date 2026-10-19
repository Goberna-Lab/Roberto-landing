import { useRef, useState } from 'react'
import type { KeyboardEvent, TouchEvent } from 'react'
import { asset } from '../asset'
import prevSvg from '../assets/icons/carousel-prev.svg?raw'
import nextSvg from '../assets/icons/carousel-next.svg?raw'
import whatsapp from '../assets/icons/whatsapp.svg?raw'
import download from '../assets/icons/btn-download.svg?raw'
import amazon from '../assets/icons/amazon.svg?raw'
import { BOOKS, COLLECTION_PRICE, PACKS, PACK_BOOKS } from '../data/biblioteca'
import { mailto } from '../data/contacto'
import { TW } from '../components/typewriter'
import { Button, CategoryHero, FinalCta, Kicker, OtherPieces, Price, Rule, Shine, Svg, Title } from './ui'
import { flat } from './text'
import './biblioteca.css'

/*
 * Portadas de cada pack: en el XD están apiladas en la franja de su pack. Se
 * agrupan por franja y se posicionan en % de la caja que las envuelve.
 */
const PACK_COVERS = PACKS.map((p) => {
  const books = PACK_BOOKS.filter(({ box: [, y, , h] }) => y + h / 2 >= p.band[0] && y + h / 2 < p.band[1])
  const x0 = Math.min(...books.map((b) => b.box[0]))
  const y0 = Math.min(...books.map((b) => b.box[1]))
  const w = Math.max(...books.map((b) => b.box[0] + b.box[2])) - x0
  const h = Math.max(...books.map((b) => b.box[1] + b.box[3])) - y0
  return {
    ratio: w / h,
    books: books.map(({ src, box: [x, y, bw, bh] }) => ({
      src,
      style: { left: `${((x - x0) / w) * 100}%`, top: `${((y - y0) / h) * 100}%`, width: `${(bw / w) * 100}%`, height: `${(bh / h) * 100}%` },
    })),
  }
})

/** Distancia horizontal mínima (px) para cambiar de pack deslizando. */
const SWIPE = 50

function Books() {
  const track = useRef<HTMLOListElement>(null)
  const [at, setAt] = useState(0)
  const step = () => {
    const t = track.current
    const first = t?.children[0] as HTMLElement | undefined
    const second = t?.children[1] as HTMLElement | undefined
    return first && second ? second.offsetLeft - first.offsetLeft : 1
  }
  const go = (i: number) => {
    const t = track.current
    if (!t) return
    const n = Math.max(0, Math.min(BOOKS.length - 1, i))
    t.scrollTo({ left: n * step(), behavior: 'smooth' })
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(at + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(at - 1) }
  }

  return (
    <div className="m-books">
      <ol
        ref={track}
        className="m-books__track"
        aria-label="Títulos de la Biblioteca Goberna"
        tabIndex={0}
        onKeyDown={onKey}
        onScroll={(e) => setAt(Math.round(e.currentTarget.scrollLeft / step()))}
      >
        {BOOKS.map((b, i) => {
          const title = flat(b.title)
          return (
            <li key={b.img} className={`m-book ${i === at ? 'is-active' : ''}`} aria-label={`${i + 1} de ${BOOKS.length}: ${title}`}>
              <div className={`m-book__cover ${i === at ? 'is-live' : ''}`}>
                <img src={b.img} alt={title} loading={i < 2 ? undefined : 'lazy'} decoding="async" width={720} height={999} />
                <Shine src={b.img} />
              </div>
              <p className="m-book__n">{String(i + 1).padStart(2, '0')}</p>
              <h3 className="m-book__title">{title}</h3>
              <Price price={b.price} />
              <a className="m-book__more" href={mailto(`Consulta — ${title}`)}>Consultar edición</a>
            </li>
          )
        })}
      </ol>
      <div className="m-books__nav m-wrap">
        <button type="button" onClick={() => go(at - 1)} disabled={at === 0} aria-label="Título anterior">
          <Svg svg={prevSvg} />
        </button>
        <div className="m-books__bar" aria-hidden>
          <span style={{ width: `${100 / BOOKS.length}%`, translate: `${at * 100}% 0` }} />
        </div>
        <p className="m-books__count" aria-live="polite">
          {String(at + 1).padStart(2, '0')} <span>/ {String(BOOKS.length).padStart(2, '0')}</span>
        </p>
        <button type="button" onClick={() => go(at + 1)} disabled={at === BOOKS.length - 1} aria-label="Título siguiente">
          <Svg svg={nextSvg} />
        </button>
      </div>
    </div>
  )
}

/**
 * Packs: selector horizontal de las 7 ediciones y una ficha que cambia al
 * elegir una (también deslizando la ficha). Las 7 fichas ocupan la misma
 * celda: la altura no salta al cambiar.
 */
function Packs() {
  const [pack, setPack] = useState(1)
  const tabs = useRef<HTMLDivElement>(null)
  const pick = (i: number) => {
    const n = (i + PACKS.length) % PACKS.length
    setPack(n)
    // Centrar la pestaña elegida sin mover la página
    const list = tabs.current
    const tab = list?.children[n] as HTMLElement | undefined
    if (list && tab) list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
  }
  const onTabKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const n = (pack + (e.key === 'ArrowRight' ? 1 : -1) + PACKS.length) % PACKS.length
      pick(n)
      ;(tabs.current?.children[n] as HTMLElement | undefined)?.focus()
    }
  }
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: TouchEvent) => {
    const t = touch.current
    touch.current = null
    if (!t) return
    const dx = e.changedTouches[0].clientX - t.x
    const dy = e.changedTouches[0].clientY - t.y
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy) * 1.5) pick(pack + (dx < 0 ? 1 : -1))
  }

  return (
    <section id="ediciones" className="m-packs">
      <div className="m-packs__bg" aria-hidden>
        <div className="m-px" data-parallax="20">
          <img src={asset('fondo-azul.webp')} alt="" loading="lazy" decoding="async" />
        </div>
      </div>
      <div className="m-wrap">
        <h2 className="m-title is-light tw-title">
          <span className="m-it"><TW text="Construye " /></span>
          <TW text="tu Biblioteca Goberna" />
        </h2>
        <Rule />
      </div>

      <div className="m-packs__tabs" role="tablist" aria-label="Ediciones de la Biblioteca Goberna" ref={tabs} onKeyDown={onTabKey}>
        {PACKS.map((p, i) => (
          <button
            key={p.n} type="button" role="tab" id={`m-pack-tab-${i}`} aria-controls={`m-pack-${i}`} aria-selected={i === pack}
            tabIndex={i === pack ? 0 : -1} className="m-packs__tab" onClick={() => pick(i)}
          >
            <span>{p.n}</span>
            {p.name}
          </button>
        ))}
      </div>

      <div className="m-wrap">
        <div className="m-packs__stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          {PACKS.map((p, i) => (
            <article
              key={p.n} id={`m-pack-${i}`} role="tabpanel" aria-labelledby={`m-pack-tab-${i}`}
              className={`m-pack ${i === pack ? 'is-on' : ''}`} inert={i !== pack}
            >
              {/* Mismo alto en todos los packs; los anchos crecen con la cantidad de libros */}
              <div className="m-pack__covers">
                <div className="m-pack__group" style={{ aspectRatio: `${PACK_COVERS[i].ratio}`, width: `min(100%, var(--m-cover-h) * ${PACK_COVERS[i].ratio})` }}>
                  {PACK_COVERS[i].books.map((b, k) => (
                    <img key={k} src={b.src} alt="" loading="lazy" decoding="async" style={b.style} />
                  ))}
                </div>
              </div>
              <p className="m-pack__kicker">Pack seleccionado · {p.n}</p>
              <h3 className="m-pack__name">{p.name}</h3>
              <p className="m-pack__desc">{p.description}</p>
              <Price price={p.price} label="Inversión" dark />
              <Button href={mailto(`Consulta — Pack ${p.n} ${p.name}`)} className="m-pack__btn">Consultar este pack</Button>
            </article>
          ))}
        </div>
        <div className="m-packs__dots" aria-hidden>
          {PACKS.map((p, i) => <span key={p.n} className={i === pack ? 'is-on' : ''} />)}
        </div>

        <div className="m-packs__links">
          <a href="#contacto">
            <Svg svg={whatsapp} className="m-packs__wa" />
            Hablar con un asesor
          </a>
          <a href="#contacto">
            <Svg svg={download} className="m-packs__dl" />
            Descargar catálogo PDF
          </a>
        </div>
        <div className="m-packs__store">
          <p>Nuestra colección editorial, disponible en:</p>
          <Svg svg={amazon} className="m-packs__amazon" />
        </div>
      </div>
    </section>
  )
}

export function Biblioteca() {
  return (
    <>
      <CategoryHero img={asset('biblioteca-hero.webp')} pos="20% 50%" title="Ideas que amplían la mirada" />

      <section className="m-lib m-wrap">
        <Kicker>Biblioteca Goberna</Kicker>
        <Title gold="6 Títulos." after=" Distintas perspectivas" className="is-lib" />
        <p className="m-text" data-reveal>
          Cada publicación aborda, desde una mirada rigurosa y práctica, los desafíos contemporáneos del poder, la
          política y la toma decisiones.
        </p>
      </section>
      <Books />

      <Packs />

      {/* ── Edición exclusiva ────────────────────────────────── */}
      <section className="m-excl">
        <div className="m-excl__bg" aria-hidden>
          <img src={asset('exclusiva-fondo.webp')} alt="" loading="lazy" decoding="async" />
        </div>
        <div className="m-wrap">
          <p className="m-kicker is-gold" data-reveal>Edición exclusiva · Goberna</p>
          <h2 className="m-excl__title tw-title">
            <TW text="06 Obras" />
          </h2>
          <p className="m-excl__sub" data-reveal>Una biblioteca de poder.</p>
        </div>
        <div className="m-excl__stage" data-live>
          <div className="m-excl__box" data-unveil>
            <img src={asset('caja-libros.webp')} alt="Estuche de colección Goberna con las 6 obras" loading="lazy" decoding="async" width={1573} height={1024} />
            <Shine src={asset('caja-libros.webp')} delay={0.6} />
          </div>
        </div>
        <div className="m-wrap m-excl__body">
          <p className="m-text is-light" data-reveal>Disponible con estuche de colección premium.</p>
          <Price price={COLLECTION_PRICE} label="6 obras" dark />
          <p className="m-excl__note">Precio de los libros; estuche a consultar.</p>
          <Button href={mailto('Consulta — Edición exclusiva Goberna (06 obras)')}>Consultar este pack</Button>
          <a className="m-excl__wa" href="#contacto">
            <Svg svg={whatsapp} className="m-packs__wa" />
            Hablar con un asesor
          </a>
        </div>
      </section>

      <OtherPieces />
      <FinalCta />
    </>
  )
}
