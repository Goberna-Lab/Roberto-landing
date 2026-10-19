import { useState } from 'react'
import { asset } from '../asset'
import circleArrow from '../assets/icons/circle-arrow.svg?raw'
import { TW } from '../components/typewriter'
import { CtaLink, FinalCta, Kicker, Rule, Shine, Svg, Title } from './ui'
import { Sheet } from './Sheet'
import './home.css'

/** Separa un texto en palabras que se entintan con el scroll (`data-words`). */
function Words({ text }: { text: string }) {
  return text.split(' ').map((w, i, all) => (
    <span key={i}>
      <span className="m-w">{w}</span>
      {i < all.length - 1 ? ' ' : ''}
    </span>
  ))
}

/* Los cuatro universos de la colección. `pos`: encuadre de la foto (los
   banners del XD tienen el producto a la izquierda y el texto a la derecha). */
const UNIVERSES = [
  { id: 'medallas', n: '01', img: 'banner-medallas.webp', pos: '6% 50%', title: 'Piezas de honor', sub: 'Medallas, placas y reconocimientos de cristal', href: '#/medallas' },
  { id: 'pines', n: '02', img: 'banner-pines.webp', pos: '14% 50%', title: 'Símbolos de prestigio', sub: 'Pines y piezas de identidad', href: '#/pines' },
  // Foto del evento (XD 19/10): el escenario con sus dos pantallas queda centrado
  { id: 'diplomas', n: '03', img: 'banner-distincion.webp', pos: '85% 50%', title: 'Presentación de distinción', sub: 'Portadiplomas y elementos ceremoniales', href: '#/medallas' },
  { id: 'libros', n: '04', img: 'banner-biblioteca.webp', pos: '13% 50%', title: 'Biblioteca del poder', sub: 'Libros, packs y ediciones premium', href: '#/biblioteca' },
]

/*
 * Materia & oficio: las 6 fotos de la grilla del XD en orden de lectura. Cuatro
 * son recortes de materia.webp (1750×1162 en el XD; caja x, y, ancho, alto) y
 * dos son fotos propias.
 */
type Tile = { alt: string; src: string; crop?: [x: number, y: number, w: number, h: number] }
const MATERIA = asset('materia.webp')
const TILES: Tile[] = [
  { alt: 'Detalle del relieve de una medalla', src: MATERIA, crop: [0, 0, 580.8, 578.8] },
  { alt: 'Detalle del grabado de una medalla', src: MATERIA, crop: [586.6, 0, 577.8, 578.8] },
  { alt: 'Detalle de un reconocimiento de cristal', src: MATERIA, crop: [1168.3, 0, 581.7, 578.8] },
  { alt: 'Diplomas Goberna', src: asset('materia-diplomas.webp') },
  { alt: 'Sello de lacre Goberna', src: asset('materia-sello.webp') },
  { alt: 'Detalle de un estuche', src: MATERIA, crop: [1168.3, 581.7, 581.7, 580.3] },
]

/** Foto de la grilla; los recortes se posicionan en % para cualquier tamaño. */
function TileImg({ t, eager }: { t: Tile; eager?: boolean }) {
  if (!t.crop) return <img src={t.src} alt={t.alt} loading={eager ? undefined : 'lazy'} decoding="async" />
  const [x, y, w, h] = t.crop
  return (
    <img
      src={t.src} alt={t.alt} loading={eager ? undefined : 'lazy'} decoding="async" className="is-crop"
      style={{ left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%`, width: `${(1750 / w) * 100}%`, height: `${(1162 / h) * 100}%` }}
    />
  )
}

/**
 * Composiciones de Esenciales: fondo del XD y productos encima, en % de la
 * caja del fondo (760 px de ancho). `crop` = parte izquierda que se muestra.
 */
const ESSENTIALS = [
  {
    title: 'Edición Dúo Estratégico', tags: ['Pisco', 'Café exclusivo'], label: 'Consultar Edición Dúo Estratégico',
    bg: { src: 'esenciales-duo.webp', w: 760, h: 382 }, crop: 0.64,
    items: [
      { src: 'esenciales-cafe.webp', alt: 'Café exclusivo Goberna', box: [96, 97, 151, 229] },
      { src: 'esenciales-pisco.webp', alt: 'Pisco Goberna', box: [215, 36, 195, 290] },
    ],
  },
  {
    title: 'Esenciales Ejecutivos', tags: ['Agenda', 'Vaso térmico'], label: 'Consultar Esenciales Ejecutivos',
    bg: { src: 'esenciales-ejecutivos.webp', w: 760, h: 350 }, crop: 0.64,
    items: [
      { src: 'sombra.webp', alt: '', box: [214, 267, 233, 32] },
      { src: 'esenciales-agenda.webp', alt: 'Agenda Goberna', box: [225, 25, 219, 266] },
      { src: 'sombra.webp', alt: '', box: [115, 260, 164, 39] },
      { src: 'esenciales-vaso.webp', alt: 'Vaso térmico Goberna', box: [124, 119, 156, 179] },
    ],
  },
] as const

function CircleArrow({ label }: { label: string }) {
  return (
    <a href="#contacto" className="m-circle" aria-label={label}>
      <Svg svg={circleArrow} />
    </a>
  )
}

export function Home() {
  const [zoom, setZoom] = useState<number | null>(null)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="m-hero">
        <div className="m-hero__bg" aria-hidden>
          <div className="m-px" data-parallax="24">
            <img src={asset('fondo-azul.webp')} alt="" decoding="async" />
          </div>
        </div>
        <div className="m-wrap m-hero__copy">
          <p className="m-kicker is-gold m-hero__kicker">Colección institucional · 2026</p>
          <h1 className="m-hero__title">
            Lo que se construye merece permanecer.
          </h1>
          <p className="m-hero__lead">Piezas de prestigio, excelencia académica y poder destinado a perdurar.</p>
        </div>
        <div className="m-hero__stage" data-live>
          <span className="m-hero__glow" aria-hidden />
          <div className="m-hero__piece m-float">
            <img src={asset('hero-piezas.webp')} alt="Medalla y trofeo de cristal Goberna" width={1254} height={1254} fetchPriority="high" decoding="async" />
            <Shine src={asset('hero-piezas.webp')} delay={1.2} />
          </div>
        </div>
        <div className="m-wrap m-hero__cta">
          <CtaLink href="#universos" down light />
        </div>
      </section>

      {/* ── El propósito ─────────────────────────────────────── */}
      <section id="proposito" className="m-prop">
        <div className="m-prop__col" aria-hidden>
          <div className="m-px" data-parallax="20">
            <img src={asset('proposito.webp')} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="m-wrap m-prop__body">
          <Kicker>El propósito</Kicker>
          <h2 className="m-prop__title" data-words>
            <span className="m-gold">
              <Words text="Goberna reúne piezas para representar" />
            </span>{' '}
            <Words text="prestigio, distinción académica y un legado que trasciende el tiempo." />
          </h2>
          <p className="m-text" data-reveal>
            GOBERNA reúne piezas creadas para representar los logros, identidad y conocimiento, convirtiendo los momentos
            significativos en objetos con valor institucional.
          </p>
          <span className="m-line" data-line aria-hidden />
          <ul className="m-prop__tags">
            {['Reconocimiento', 'Identidad', 'Conocimiento'].map((t) => (
              <li key={t} data-reveal>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Universos de la colección ────────────────────────── */}
      <div id="universos">
        {UNIVERSES.map((u) => (
          <section key={u.id} id={u.id} className="m-uni">
            <a href={u.href} className="m-uni__media" tabIndex={-1} aria-hidden>
              <div className="m-px" data-parallax="22">
                <img src={asset(u.img)} alt="" loading="lazy" decoding="async" style={{ objectPosition: u.pos }} />
              </div>
            </a>
            <div className="m-wrap m-uni__body">
              <p className="m-uni__n" data-reveal>{u.n} / 04</p>
              <h2 className="m-display tw-title">
                <TW text={u.title} />
              </h2>
              <p className="m-uni__sub" data-reveal>{u.sub}</p>
              <CtaLink href={u.href} light />
            </div>
          </section>
        ))}
      </div>

      {/* ── Esenciales Goberna ───────────────────────────────── */}
      <section id="esenciales" className="m-ess">
        <div className="m-wrap">
          <Kicker gold>Colección institucional</Kicker>
          <Title before="Esenciales Goberna" className="is-upper is-light" />
          <p className="m-text is-light" data-reveal>Identidad y distinción en cada detalle.</p>
        </div>
        <div className="m-wrap m-ess__list">
          <article className="m-ess__item">
            <div className="m-ess__media is-portrait" data-unveil>
              <img src={asset('esenciales-chaleco.webp')} alt="Chaleco y gorra Goberna" loading="lazy" decoding="async" width={1177} height={1337} />
            </div>
            <div className="m-ess__caption" data-reveal>
              <div>
                <h3>Chaleco y gorra</h3>
                <p>Prendas Goberna</p>
              </div>
              <CircleArrow label="Consultar prendas Goberna" />
            </div>
          </article>
          {ESSENTIALS.map((e) => (
            <article key={e.title} className="m-ess__item">
              <div className="m-ess__media" style={{ aspectRatio: `${e.bg.w * e.crop} / ${e.bg.h}` }} data-unveil>
                <div className="m-ess__scene" style={{ width: `${100 / e.crop}%` }}>
                  <img src={asset(e.bg.src)} alt="" loading="lazy" decoding="async" />
                  {e.items.map(({ src, alt, box: [x, y, w, h] }, i) => (
                    <img
                      key={i} src={asset(src)} alt={alt} loading="lazy" decoding="async" className="m-ess__obj"
                      style={{ left: `${(x / e.bg.w) * 100}%`, top: `${(y / e.bg.h) * 100}%`, width: `${(w / e.bg.w) * 100}%`, height: `${(h / e.bg.h) * 100}%` }}
                    />
                  ))}
                </div>
              </div>
              <div className="m-ess__caption" data-reveal>
                <div>
                  <h3>{e.title}</h3>
                  <p>{e.tags.join(' · ')}</p>
                </div>
                <CircleArrow label={e.label} />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Materia & oficio ─────────────────────────────────── */}
      <section id="materia" className="m-materia">
        <div className="m-wrap">
          <Kicker>Materia &amp; oficio</Kicker>
          <Title before="El valor también está en los detalles." className="is-upper" />
          <Rule />
        </div>
        <ul className="m-materia__grid m-wrap">
          {TILES.map((t, i) => (
            <li key={i} data-reveal>
              <button type="button" className="m-tile" onClick={() => setZoom(i)} aria-label={`Ampliar foto: ${t.alt}`} aria-haspopup="dialog">
                <TileImg t={t} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <FinalCta />

      {zoom !== null && (
        <Sheet label={TILES[zoom].alt} onClose={() => setZoom(null)}>
          <p className="m-kicker">Materia &amp; oficio · {zoom + 1} / {TILES.length}</p>
          <div className="m-tile is-large">
            <TileImg t={TILES[zoom]} eager />
          </div>
          <p className="m-sheet__caption">{TILES[zoom].alt}</p>
        </Sheet>
      )}
    </>
  )
}
