import type { CSSProperties, ReactNode } from 'react'
import { asset } from '../asset'
import logo from '../assets/icons/logo.svg'
import arrowDown from '../assets/icons/arrow-down.svg?raw'
import btnArrow from '../assets/icons/btn-arrow.svg?raw'
import btnDownload from '../assets/icons/btn-download.svg?raw'
import toTopArrow from '../assets/icons/to-top-arrow.svg?raw'
import { TW } from '../components/typewriter'
import { OTHERS } from '../data/colecciones'
import { mailto } from '../data/contacto'
import type { EditorialPrice } from '../data/biblioteca'
import { flat } from './text'
import { PieceShine } from '../components/PieceShine'

/** Icono SVG en línea (hereda el color del texto). */
export function Svg({ svg, className = '' }: { svg: string; className?: string }) {
  return <span className={`m-svg ${className}`} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />
}

/** Etiqueta pequeña en mayúsculas sobre los títulos. */
export function Kicker({ children, gold, className = '' }: { children: ReactNode; gold?: boolean; className?: string }) {
  return <p className={`m-kicker ${gold ? 'is-gold' : ''} ${className}`} data-reveal>{children}</p>
}

/** Título de sección con efecto máquina de escribir (`gold` = tramo en dorado cursiva). */
export function Title({
  before = '', gold, after = '', as: Tag = 'h2', className = '',
}: { before?: string; gold?: string; after?: string; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <Tag className={`m-title tw-title ${className}`}>
      {before && <TW text={before} />}
      {gold && <span className="m-gold-it"><TW text={gold} /></span>}
      {after && <TW text={after} />}
    </Tag>
  )
}

/** Raya dorada corta bajo los títulos. */
export function Rule({ className = '' }: { className?: string }) {
  return <span className={`m-rule ${className}`} data-line aria-hidden />
}

/** "Descubrir la colección": texto, línea dorada y flecha (Componente 88 del XD). */
export function CtaLink({ href, children = 'Descubrir la colección', down, light }: { href: string; children?: ReactNode; down?: boolean; light?: boolean }) {
  return (
    <a href={href} className={`m-cta ${light ? 'is-light' : ''} ${down ? 'is-down' : ''}`} data-reveal>
      <span>{children}</span>
      <Svg svg={arrowDown} className="m-cta__arrow" />
    </a>
  )
}

/** Botón sólido (dorado) o de borde, a todo el ancho en mobile. */
export function Button({
  href, children, outline, dark, download, onClick, className = '',
}: { href: string; children: ReactNode; outline?: boolean; dark?: boolean; download?: boolean; onClick?: () => void; className?: string }) {
  return (
    <a href={href} onClick={onClick} className={`m-btn ${outline ? 'm-btn--outline' : 'm-btn--solid'} ${dark ? 'is-dark' : ''} ${className}`}>
      <span>{children}</span>
      <Svg svg={download ? btnDownload : btnArrow} className={download ? 'm-btn__dl' : 'm-btn__arrow'} />
    </a>
  )
}

/** Precio promocional y precio anterior (o "Consultar precio" si no hay). */
export function Price({ price, label, dark, className = '' }: { price?: EditorialPrice; label?: string; dark?: boolean; className?: string }) {
  if (!price) return <p className={`m-price is-pending ${dark ? 'is-dark' : ''} ${className}`}>Consultar precio</p>
  return (
    <p className={`m-price ${dark ? 'is-dark' : ''} ${className}`} aria-label={`${label ? `${label}: ` : ''}precio promocional S/${price.promo}. Precio normal S/${price.normal}.`}>
      {label && <span className="m-price__label" aria-hidden>{label}</span>}
      <strong aria-hidden>S/{price.promo}</strong>
      <span className="m-price__before" aria-hidden>
        <span>Antes</span>
        <s>S/{price.normal}</s>
      </span>
    </p>
  )
}

/**
 * Pieza sobre el pedestal de mármol (como las tarjetas del XD: imagen 494×390
 * y pedestal 476×477 desde x 10, y 49) con un reflejo dorado que la recorre de
 * vez en cuando. El reflejo usa la propia imagen como máscara: solo ilumina
 * el metal o el cristal, nunca el fondo.
 */
export function Piece({ img, pedestal = true, delay = 0, className = '', style }: { img: string; pedestal?: boolean; delay?: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={`m-piece ${pedestal ? 'has-base' : ''} ${className}`} style={style} data-live aria-hidden>
      {pedestal && <img className="m-piece__base" src={asset('card-base.webp')} alt="" loading="lazy" decoding="async" width={476} height={477} />}
      <span className="m-piece__img">
        <img src={img} alt="" loading="lazy" decoding="async" width={494} height={390} />
        <Shine src={img} delay={delay} />
      </span>
    </span>
  )
}

/** Reflejo de luz que recorre la silueta de `src` (ver Piece). */
export function Shine({ src, delay = 0 }: { src: string; delay?: number }) {
  return <PieceShine src={src} delay={delay} observe={false} className="m-shine" />
}

/** Portada de categoría: foto protagonista y título institucional. */
export function CategoryHero({ img, pos, title, className = '' }: { img: string; pos: string; title: string; className?: string }) {
  return (
    <section className={`m-cat-hero ${className}`}>
      <div className="m-cat-hero__media">
        <div className="m-px" data-parallax="16">
          <img src={img} alt="" fetchPriority="high" decoding="async" style={{ objectPosition: pos }} />
        </div>
      </div>
      <div className="m-wrap m-cat-hero__copy">
        <h1 className="m-display tw-title">
          <TW text={title} />
        </h1>
        <Rule />
      </div>
    </section>
  )
}

/** Lista numerada de especificaciones de la categoría (01–04). */
export function Specs({ specs }: { specs: { n: string; label: string; value: string }[] }) {
  return (
    <dl className="m-specs">
      {specs.map((s) => (
        <div key={s.n} className="m-specs__row" data-reveal>
          <dt>
            <span className="m-specs__n">{s.n}</span>
            {s.label}
          </dt>
          <dd>{flat(s.value)}</dd>
        </div>
      ))}
    </dl>
  )
}

/** "Otras piezas de colección": tarjetas horizontales hacia las demás colecciones. */
export function OtherPieces({ title }: { title?: boolean }) {
  return (
    <section className="m-others m-wrap">
      {title && <Title before="Otras piezas de " gold="colección" />}
      <div className="m-others__list">
        {OTHERS.map((o) => (
          <a key={o.href} href={o.href} className="m-other" data-reveal>
            <span className="m-other__img">
              <img src={o.img.src} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="m-other__text">
              <span className="m-other__title">{flat(o.title)}</span>
              <span className="m-other__desc">{flat(o.desc)}</span>
              <span className="m-other__more">Descubrir la colección</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

/**
 * Cierre común "Encuentra una pieza para reconocer lo construido." con los
 * botones de contacto del XD y el pie con "volver arriba".
 */
export function FinalCta() {
  return (
    <>
      <section id="contacto" className="m-final">
        <div className="m-final__media">
          <div className="m-px" data-parallax="14">
            <img src={asset('banner-footer.webp')} alt="Medalla Goberna en su estuche" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="m-wrap m-final__body">
          <h2 className="m-display tw-title">
            <TW text="Encuentra una pieza para reconocer lo construido." />
          </h2>
          <div className="m-final__btns" data-reveal>
            <Button href={mailto()}>Solicitar información</Button>
            <Button href="#contacto" outline download>Descargar catálogo PDF</Button>
          </div>
        </div>
      </section>
      <footer className="m-footer">
        <a href="#/" aria-label="Goberna — inicio">
          <img src={logo} alt="Goberna" width={120} height={30} />
        </a>
        <button type="button" className="m-totop" aria-label="Volver arriba" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Svg svg={toTopArrow} />
        </button>
      </footer>
    </>
  )
}
