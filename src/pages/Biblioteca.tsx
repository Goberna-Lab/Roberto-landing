import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { TW } from '../components/typewriter'
import { asset } from '../asset'
import prevSvg from '../assets/icons/carousel-prev.svg?raw'
import nextSvg from '../assets/icons/carousel-next.svg?raw'
import whatsapp from '../assets/icons/whatsapp.svg?raw'
import download from '../assets/icons/btn-download.svg?raw'
import amazon from '../assets/icons/amazon.svg?raw'
import { Btn, HLine, Icon, MiniLink, TextIcon, Txt } from '../components/ui'
import type { Box } from '../components/ui'
import { FinalCta, OtherPieces } from '../components/sections'
import { BOOKS, COLLECTION_PRICE, PACKS, PACK_BOOKS, VISIBLE } from '../data/biblioteca'
import type { EditorialPrice } from '../data/biblioteca'
import './Biblioteca.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function BookPrice({ price, x, y, dark = false, label }: { price?: EditorialPrice; x: number; y: number; dark?: boolean; label?: string }) {
  return (
    <div
      className={`editorial-price${dark ? ' editorial-price--dark' : ''}`}
      style={{ left: x, top: y }}
      aria-label={price ? `Precio promocional S/${price.promo}. Precio normal S/${price.normal}.` : undefined}
    >
      {price ? (
        <>
          {label && <span className="editorial-price__label">{label}</span>}
          <strong className="editorial-price__promo">S/{price.promo}</strong>
          <span className="editorial-price__normal"><span>Antes</span><s>S/{price.normal}</s></span>
        </>
      ) : <span className="editorial-price__pending">Consultar precio</span>}
    </div>
  )
}

/** Líneas divisorias entre packs */
const PACK_LINES = PACKS.slice(0, -1).map((edition) => edition.band[1])

/*
 * Packs con scroll: la sección conserva el espaciado del XD e incluye las 7
 * opciones del catálogo actualizado. Al hacer scroll, una ventana del alto del fondo
 * azul (1104px) queda fija con la columna izquierda y la línea de tiempo, y la
 * lista de packs sube dentro de ella: no se pasa a la sección siguiente sin
 * recorrer los 7. Cada pack pasa por el círculo del medio de la línea de
 * tiempo: ahí cambia el pack seleccionado y el círculo se rellena.
 * Con movimiento reducido no se fija y queda como el XD.
 */
const PACKS_H = 2376
const WINDOW_H = 1104
/** Límite superior para fijar la ventana: el título queda bajo la cabecera */
const MAX_LIFT = 50

const TIMELINE: Box = [817, 134, 1, 946]
/** Círculos de la línea de tiempo (top de cada uno, 16px); el del medio es el de selección */
const DOTS = [206, 554, 968]
/** Centro del círculo del medio: zona donde cambia el pack seleccionado */
const MID = DOTS[1] + 8
/** Distancia al centro del pack dentro de la que el círculo se ve relleno */
const FILL_ZONE = 110
/** Centro vertical de cada pack (entre sus líneas divisorias) */
const CENTERS = PACKS.map((p) => (p.band[0] + p.band[1]) / 2)
/** Recorrido de la lista: del pack 01 al 07 centrados en el círculo del medio */
const SHIFT_FROM = CENTERS[0] - MID
const SHIFT_TO = CENTERS[CENTERS.length - 1] - MID

export function Biblioteca() {
  const [start, setStart] = useState(0)
  const max = BOOKS.length - VISIBLE
  const go = (d: number) => setStart((s) => Math.min(max, Math.max(0, s + d)))

  const [pack, setPack] = useState(1)
  const packsWrap = useRef<HTMLDivElement>(null)
  const packsST = useRef<ScrollTrigger | null>(null)
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const wrap = packsWrap.current!
        const zoom = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1
        // En pantallas más bajas que la ventana se fija un poco más arriba
        // (sin esconder el título bajo la cabecera)
        const lift = () => Math.min(MAX_LIFT, Math.max(0, WINDOW_H - innerHeight / zoom()))
        // Variables CSS (no estado de React): se actualizan en cada frame de scroll
        const update = (p: number) => {
          // Pantallas bajas (laptop): el bloque "disponible en Amazon" sube para no quedar cortado
          wrap.style.setProperty('--store-up', `${Math.min(130, Math.max(0, 1000 - innerHeight / zoom()))}px`)
          const s = SHIFT_FROM + p * (SHIFT_TO - SHIFT_FROM)
          wrap.style.setProperty('--packs-top', `${-lift()}px`)
          wrap.style.setProperty('--packs-shift', `${-s}px`)
          // Pack seleccionado: el que está pasando por el círculo del medio
          const at = MID + s
          let i = 0
          CENTERS.forEach((c, k) => { if (Math.abs(c - at) < Math.abs(CENTERS[i] - at)) i = k })
          wrap.classList.toggle('is-filled', Math.abs(CENTERS[i] - at) < FILL_ZONE)
          setPack(i)
        }
        packsST.current = ScrollTrigger.create({
          trigger: wrap,
          start: () => `top ${-lift() * zoom()}px`,
          end: () => `+=${(PACKS_H - WINDOW_H) * zoom()}`,
          invalidateOnRefresh: true,
          onUpdate: (st) => update(st.progress),
          onRefresh: (st) => update(st.progress),
        })
        return () => {
          packsST.current = null
          wrap.classList.remove('is-filled')
          for (const v of ['--packs-top', '--packs-shift', '--store-up']) wrap.style.removeProperty(v)
        }
      })
    },
    { scope: packsWrap },
  )
  // Clic en un pack: con scroll, lleva la página hasta que el pack quede en el
  // círculo del medio; sin scroll (movimiento reducido), lo elige directo
  const pickPack = (i: number) => {
    const st = packsST.current
    if (!st) return setPack(i)
    const p = (CENTERS[i] - MID - SHIFT_FROM) / (SHIFT_TO - SHIFT_FROM)
    window.scrollTo({ top: st.start + p * (st.end - st.start), behavior: 'smooth' })
  }

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 700 }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 700, backgroundImage: `url(${asset('biblioteca-hero.webp')})` }} />
        <Txt x={1720} y={338} f="p" w={500} s={72} lh={80} up align="r" c="var(--ivory)" as="h1" className="tw-title">
          <TW text={'Ideas que amplían\nla mirada'} />
        </Txt>
      </section>

      {/* ── 6 títulos ────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1152, background: 'var(--ivory)' }}>
        <Txt x={200} y={119} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Biblioteca Goberna</Txt>
        <Txt x={200} y={265} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2" className="tw-title">
          <span className="it gold"><TW text={'6 Títulos.\n'} /></span>
          <TW text="Distintas perspectivas" />
        </Txt>
        <Txt x={1206} y={213} s={17} lh={32} ls={32} c="var(--ink)" width={514}>
          Cada publicación aborda, desde una mirada rigurosa y práctica, los desafíos contemporáneos del poder, la
          política y la toma decisiones.
        </Txt>

        <div className="books" style={{ left: 331, top: 452 }}>
          <div className="books__track" style={{ translate: `${-(BOOKS[start].x - BOOKS[0].x)}px 0` }}>
            {BOOKS.map((b, i) => (
              <article key={b.img} className="book" style={{ left: b.x }}>
                <img className="abs" src={b.img} alt={b.title.replace('\n', ' ')} loading="lazy" style={{ left: 0, top: 0, width: b.w, height: 439 }} />
                <Txt x={b.tx} y={484} w={600} s={i === 6 ? 15 : 16} lh={19} ls={140} c="var(--gold)">{String(i + 1).padStart(2, '0')}</Txt>
                <Txt x={b.tx} y={505} w={600} s={17} lh={28} ls={140} c="var(--navy)" width={i === 5 ? 364 : 345} as="h3">{b.title}</Txt>
                <BookPrice price={b.price} x={b.tx} y={602} />
                <MiniLink x={b.tx} y={654} big href="#contacto">Ver edición</MiniLink>
              </article>
            ))}
          </div>
        </div>
        <button type="button" className="books__nav" style={{ left: 198.5, top: 708.5 }} onClick={() => go(-1)} disabled={start === 0} aria-label="Anterior" dangerouslySetInnerHTML={{ __html: prevSvg }} />
        <button type="button" className="books__nav is-next" style={{ left: 1664, top: 710 }} onClick={() => go(1)} disabled={start === max} aria-label="Siguiente" dangerouslySetInnerHTML={{ __html: nextSvg }} />
      </section>

      {/* ── Construye tu biblioteca (packs) ──────────────────── */}
      <div ref={packsWrap} id="ediciones" className="packs-scroll" style={{ height: PACKS_H }}>
        <section className="sec packs">
          <div className="packs__bg">
            <div className="bg px-bg" style={{ left: 0, top: 0, width: 1920, height: 1200, backgroundImage: `url(${asset('fondo-azul.webp')})` }} />
          </div>

          {/* Lista de packs (sube dentro de la ventana al hacer scroll) */}
          <div className="packs__list">
            {PACK_BOOKS.map((b, i) => {
              const [x, y, w, h] = b.box
              return <img key={i} className="abs" src={b.src} alt="" loading="lazy" style={{ left: x, top: y, width: w, height: h }} />
            })}
            {PACKS.map((p, i) => (
              <article key={p.n}>
                <Txt x={928} y={p.y} f="p" w={600} s={48} lh={64} ls={-60} c="var(--gold)">{p.n}</Txt>
                <Txt x={928} y={p.y + 34.6} f="p" s={26} lh={25} ls={i === 0 ? 0 : 20} c="var(--cream)" as="h3">{p.title}</Txt>
                {/* Toda la franja del pack (números, títulos y portadas) lo selecciona */}
                <button
                  type="button" className="packs__pick" aria-pressed={i === pack} onClick={() => pickPack(i)}
                  aria-label={`Seleccionar pack ${p.n} ${p.name}`}
                  style={{ left: 928, top: p.band[0], width: 792, height: p.band[1] - p.band[0] }}
                />
              </article>
            ))}
            {PACK_LINES.map((y) => <HLine key={y} x={928} y={y} w={792} c="var(--line-dark)" />)}
          </div>

          {/* Línea de tiempo: 3 círculos vacíos; el del medio se rellena (con aro)
              cuando un pack pasa por él */}
          <span className="packs__timeline" style={{ left: TIMELINE[0], top: TIMELINE[1], width: TIMELINE[2], height: TIMELINE[3] }} />
          {DOTS.map((y) => (
            <span key={y} className={`packs__dot ${y === DOTS[1] ? 'is-mid' : ''}`} style={{ left: 810, top: y }} />
          ))}
          <span className="packs__ring" style={{ left: 805, top: DOTS[1] - 5 }} />

          {/* Columna izquierda: pack seleccionado */}
          <Txt x={200} y={190} f="p" w={500} s={60} lh={71} c="var(--cream)" as="h2" className="tw-title">
            <span className="it"><TW text="Construye " /></span>
            <TW text={'tu\nBiblioteca Goberna'} />
          </Txt>
          <div className="packs__selection" aria-live="polite" aria-atomic="true">
            <Txt x={201} y={330.8} s={14} lh={18} ls={60} up c="var(--gold)">Pack seleccionado · {PACKS[pack].n}</Txt>
            <Txt x={200} y={382.8} f="p" w={600} s={36} lh={45} c="var(--cream)" as="h3">{PACKS[pack].name}</Txt>
            <Txt x={200} y={409.8} s={17} lh={32} ls={32} c="var(--cream)" width={395}>
              {PACKS[pack].description}
            </Txt>
            <BookPrice price={PACKS[pack].price} x={200} y={520} dark label="Inversión" />
          </div>
          <Btn
            x={200} y={593.6} variant="solid" href="#contacto" label="Consultar este pack"
            size={{ w: 395, h: 56, textX: 85.6, baseY: 33, ico: [292.8, 19.9, 18.7, 15.7] }}
          />
          <Icon svg={whatsapp} box={[201, 674.2, 24, 24]} className="packs__wa" />
          <Txt x={232} y={690.2} s={13} lh={16} ls={60} up c="var(--cream)">Hablar con un asesor</Txt>
          <HLine x={200.5} y={713.8} w={395} c="var(--line-dark)" />
          {/* Icono en línea con el texto: en laptop el texto crece y el icono se corre */}
          <a href="#contacto" className="packs__pdf">
            <Txt x={200} y={747.8} s={13} lh={16} ls={60} up c="var(--cream)" as="span">
              <TextIcon text="Descargar catálogo PDF" minW={219} svg={download} w={16} h={16} dy={-14} className="packs__pdf-ico" />
            </Txt>
          </a>
          <Txt x={200} y={916.4} s={12} lh={15} ls={60} up c="var(--cream)" className="packs__store">
            {'Nuestra colección editorial,\ndisponible en:'}
          </Txt>
          <Icon svg={amazon} box={[200, 944.4, 132.2, 39.8]} className="packs__amazon" />
        </section>
      </div>

      {/* ── Edición exclusiva ────────────────────────────────── */}
      <section className="sec" style={{ height: 750 }}>
        {/* Escena con zoom al entrar (fondo y estuche juntos) */}
        <div className="abs zoom-bg" style={{ inset: 0 }}>
          {/* Fondo 55px más arriba que en el XD (top -148): así el piso queda bajo el estuche y no flota */}
          <div className="bg" style={{ left: 0, top: -203, width: 1920, height: 1024, backgroundImage: `url(${asset('exclusiva-fondo.webp')})` }} />
          <img className="abs" src={asset('caja-libros.webp')} alt="Estuche de colección Goberna con las 6 obras" loading="lazy" style={{ left: 863, top: 118, width: 905, height: 589 }} />
        </div>
        <Txt x={201} y={94.8} s={14} lh={18} ls={60} up c="var(--gold)">Edición exclusiva · Goberna</Txt>
        <Txt x={200} y={247} f="p" w={600} s={62} lh={83} ls={-40} up c="var(--gold)" as="h2" className="tw-title">
          <TW text="06 Obras" />
        </Txt>
        <Txt x={200} y={300} f="p" w={600} s={43} lh={45} up c="var(--cream)" as="p">Una biblioteca de poder.</Txt>
        <Txt x={199} y={321} s={16} lh={32} ls={40} c="var(--cream)" width={428}>Disponible con estuche de colección premium.</Txt>
        <BookPrice price={COLLECTION_PRICE} x={200} y={389} dark label="6 obras" />
        <Txt x={200} y={458} s={12} lh={16} c="var(--cream)">Precio de los libros; estuche a consultar.</Txt>
        <Btn
          x={200} y={489.6} variant="solid" href="#contacto" label="Consultar este pack"
          size={{ w: 395, h: 56, textX: 85.6, baseY: 33, ico: [292.8, 19.9, 18.7, 15.7] }}
        />
        <Icon svg={whatsapp} box={[201, 570.2, 24, 24]} className="packs__wa" />
        <Txt x={232} y={586.2} s={13} lh={16} ls={60} up c="var(--cream)">Hablar con un asesor</Txt>
      </section>

      <OtherPieces height={378} cardsTop={80} />
      <FinalCta />
    </main>
  )
}
