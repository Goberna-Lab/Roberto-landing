import type { CSSProperties, ReactNode } from 'react'
import arrowDown from '../assets/icons/arrow-down.svg?raw'
import arrowSm from '../assets/icons/arrow-right-sm.svg?raw'
import btnArrow from '../assets/icons/btn-arrow.svg?raw'
import btnDownload from '../assets/icons/btn-download.svg?raw'
import './ui.css'

/* Métricas verticales (hhea) de las fuentes, en fracción del tamaño. */
const METRICS = {
  m: { a: 0.968, d: 0.251 }, // Montserrat
  p: { a: 1.082, d: 0.251 }, // Playfair Display
}

type Font = keyof typeof METRICS
export type Box = [x: number, y: number, w: number, h: number]

/**
 * En XD la coordenada Y de un texto es la línea base de la primera línea.
 * Devuelve el `top` CSS equivalente para un line-height dado.
 */
function baselineTop(y: number, size: number, lh: number, f: Font) {
  const { a, d } = METRICS[f]
  return y - ((lh - (a + d) * size) / 2 + a * size)
}

type TxtProps = {
  x: number
  y: number
  f?: Font
  w?: 400 | 500 | 600 | 700
  s: number
  lh: number
  /** charSpacing de XD (milésimas de em) */
  ls?: number
  c?: string
  up?: boolean
  it?: boolean
  align?: 'l' | 'c' | 'r'
  /** ancho de caja (autoHeight en XD); entonces `y` es el borde superior */
  width?: number
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span' | 'div'
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export function Txt({
  x, y, f = 'm', w = 400, s, lh, ls = 0, c, up, it, align = 'l', width,
  as: Tag = 'p', className = '', style, children,
}: TxtProps) {
  // Texto de área (autoHeight): XD guarda el borde superior de la caja y la
  // primera línea base cae en top + ascendente.
  const base = width ? y + Math.round(METRICS[f].a * s) : y
  // En laptop (--fsmin > 0) los textos pequeños crecen hasta un mínimo legible;
  // el `top` se calcula en CSS para que la línea base no se mueva.
  const small = s <= 20
  const S = small ? `max(${s}px, var(--fsmin, 0px))` : `${s}px`
  const LH = small ? `max(${lh}px, var(--fsmin, 0px) * 1.25)` : `${lh}px`
  const { a, d } = METRICS[f]
  const st: CSSProperties = {
    top: small ? `calc(${base}px - ((${LH} - ${a + d} * ${S}) / 2 + ${a} * ${S}))` : baselineTop(base, s, lh, f),
    fontFamily: f === 'm' ? 'var(--mont)' : 'var(--play)',
    fontWeight: w,
    fontSize: S,
    lineHeight: LH,
    letterSpacing: ls ? `${ls / 1000}em` : undefined,
    color: c,
    textTransform: up ? 'uppercase' : undefined,
    fontStyle: it ? 'italic' : undefined,
    width,
    ...style,
  }
  if (align === 'l') st.left = x
  else if (align === 'r') { st.right = 1920 - x; st.textAlign = 'right' }
  else { st.left = x; st.transform = 'translateX(-50%)'; st.textAlign = 'center' }
  return (
    <Tag className={`t ${width ? 'wrap' : ''} ${className}`} style={st} data-bl={import.meta.env.DEV ? base : undefined}>
      {children}
    </Tag>
  )
}

/**
 * Icono SVG colocado por su caja visual (x, y, w, h) en XD.
 * `rot` = -90 para las flechas que XD rota (el SVG base apunta hacia abajo).
 */
export function Icon({ svg, box, rot, className = '' }: { svg: string; box: Box; rot?: boolean; className?: string }) {
  const [x, y, w, h] = box
  const style: CSSProperties = rot
    ? { left: x + w / 2 - h / 2, top: y + h / 2 - w / 2, width: h, height: w, rotate: '-90deg' }
    : { left: x, top: y, width: w, height: h }
  return <span className={`ico ${className}`} style={style} aria-hidden dangerouslySetInnerHTML={{ __html: svg }} />
}

export function HLine({ x, y, w, c = 'var(--gold)', h = 1 }: { x: number; y: number; w: number; c?: string; h?: number }) {
  return <span className="hline" style={{ left: x, top: y - h / 2, width: w, height: h, background: c }} />
}

export function VLine({ x, y, h, c }: { x: number; y: number; h: number; c?: string }) {
  return <span className="vline" style={{ left: x - 0.5, top: y, height: h, background: c }} />
}

/** Imagen recortada por una máscara (coordenadas de la sección). */
export function Masked({
  mask, img, src, alt = '', radius, opacity, className = '',
}: {
  mask: Box
  img: Box
  src: string
  alt?: string
  radius?: string
  opacity?: number
  className?: string
}) {
  const [mx, my, mw, mh] = mask
  const [ix, iy, iw, ih] = img
  return (
    <div className={`abs masked ${className}`} style={{ left: mx, top: my, width: mw, height: mh, borderRadius: radius, opacity }}>
      <img src={src} alt={alt} className="abs" loading="lazy" decoding="async" style={{ left: ix - mx, top: iy - my, width: iw, height: ih }} />
    </div>
  )
}

/**
 * "Descubrir la colección" (Componente 88). (x, y) = origen del componente.
 * Texto 18px con base en +17, línea dorada en +47 (361px) y flecha.
 * Hover (estado XD): línea 378px, flecha +16px.
 */
export function CtaLink({
  x, y, href, dark, down, lineW = 361, children = 'Descubrir la colección',
}: { x: number; y: number; href: string; dark?: boolean; down?: boolean; lineW?: number; children?: ReactNode }) {
  return (
    <a
      href={href}
      className={`cta-link ${dark ? 'is-dark' : ''} ${down ? 'is-down' : ''}`}
      style={{ left: x, top: y, width: lineW, ['--line-w' as string]: `${lineW}px` }}
    >
      <Txt x={0} y={17} w={600} s={18} lh={22} ls={140} up as="span">{children}</Txt>
      <span className="cta-link__line" />
      <Icon svg={arrowDown} box={down ? [341, -2, 20, 24] : [338, 0.2, 24, 20]} rot={!down} className="cta-link__arrow" />
    </a>
  )
}

/**
 * Icono en línea con el texto: (x, y) de la caja visual en XD → el texto ocupa
 * al menos `x - textX` y el icono queda justo después. Así en 1920 cae en la
 * posición exacta del XD y, si el texto crece (laptop), el icono se desplaza
 * en vez de encimarse.
 */
function TextIcon({
  text, minW, svg, w, h, rot, dy, className,
}: { text: ReactNode; minW: number; svg: string; w: number; h: number; rot?: boolean; dy: number; className: string }) {
  // El contenedor del icono mide 0px de alto y se apoya en la línea base: no
  // altera la altura de la línea. `dy` = borde superior del icono respecto a ella.
  return (
    <>
      {/* separación mínima de 8px: en 1920 el texto es más corto y manda minW */}
      <span className="txt-ico__text" style={{ minWidth: minW - 8, marginRight: 8 }}>{text}</span>
      <span className={`txt-ico__ico ${className}`} style={{ width: w }}>
        <Icon svg={svg} box={[0, dy, w, h]} rot={rot} />
      </span>
    </>
  )
}

/**
 * Enlace dorado pequeño (Componente 87). Hover: flecha +16px.
 * Variante 9px ("Descubrir la colección") y 15px ("Ver edición").
 */
export function MiniLink({ x, y, big, href, children }: { x: number; y: number; big?: boolean; href: string; children: ReactNode }) {
  const arrow = <TextIcon text={children} minW={163.2} svg={arrowSm} w={15} h={12.5} rot dy={-10} className="mini-link__arrow" />
  return (
    <a href={href} className="mini-link" style={{ left: x, top: y }}>
      {big ? (
        <Txt x={0} y={15} w={600} s={15} lh={19} ls={140} up as="span">{arrow}</Txt>
      ) : (
        <Txt x={0} y={10} w={600} s={9} lh={11} ls={140} up as="span">{arrow}</Txt>
      )}
    </a>
  )
}

type BtnProps = {
  x: number
  y: number
  variant: 'solid' | 'outline'
  href: string
  small?: boolean
  /** texto oscuro en el botón de borde (panel de detalle) */
  darkText?: boolean
}

/**
 * Botones "Solicitar información" (sólido) y "Descargar catálogo PDF" (borde).
 * Normal 350×72 / pequeño 235×48 (panel de producto).
 */
export function Btn({ x, y, variant, href, small, darkText }: BtnProps) {
  const solid = variant === 'solid'
  const label = solid ? 'Solicitar información' : 'Descargar catálogo PDF'
  const w = small ? 235 : 350
  const h = small ? 48 : 72
  const textX = small ? (solid ? 39 : 27) : solid ? 58 : 40
  const baseY = small ? 28 : 42
  // caja visual del icono en XD (relativa al botón)
  const [ix, iy, iw, ih]: Box = small
    ? solid ? [183.3, 18.8, 12.5, 10.5] : [190.9, 20.6, 8.9, 8.9]
    : solid ? [273.3, 28, 18.7, 15.6] : [285, 30.8, 13.2, 13.2]
  const content = (
    <TextIcon
      text={label} minW={ix - textX} svg={solid ? btnArrow : btnDownload}
      w={iw} h={ih} rot={solid} dy={iy - baseY} className="btn__ico"
    />
  )
  return (
    <a
      href={href}
      className={`btn btn--${variant} ${darkText ? 'btn--dark-text' : ''}`}
      style={{ left: x, top: y, width: w, height: h }}
      download={!solid && href.endsWith('.pdf') ? true : undefined}
    >
      {small ? (
        <Txt x={textX} y={baseY} w={600} s={9} lh={11} ls={60} up as="span">{content}</Txt>
      ) : (
        <Txt x={textX} y={baseY} w={600} s={14} lh={18} ls={60} up as="span">{content}</Txt>
      )}
    </a>
  )
}
