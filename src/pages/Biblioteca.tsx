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
import './Biblioteca.css'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/*
 * Pantalla CATALOGO – 4. Textos tal cual el XD (incluidos sus errores de tipeo).
 * Libros: x de la portada dentro del carrusel ("Grupo de desplazamiento 4",
 * viewport 1256px desde x 331). Portadas 317×439 con sombra incluida.
 * `tx`: x de los textos respecto a la portada.
 */
const BOOKS: { title: string; img: string; x: number; w: number; tx: number }[] = [
  { title: 'EL PODER DE LA ORATORIA E\nIMAGEN POLÍTICA', img: asset('libro-01.webp'), x: 1, w: 317, tx: 12 },
  { title: 'LAWFARE GUERRA JURÍDICA EN LA POLÍTICA', img: asset('libro-02.webp'), x: 457, w: 316, tx: 13 },
  { title: 'GUERRA ELECTORAL-EL PODER EN LAS SOMBRAS', img: asset('libro-03.webp'), x: 899, w: 316, tx: 13 },
  { title: 'MANUEL DEL CONSULTOR\nPOLÍTICO', img: asset('libro-04.webp'), x: 1341, w: 315, tx: 13 },
  { title: 'MÁQUINA\nELECTORAL', img: asset('libro-05.webp'), x: 1797, w: 316, tx: 15 },
  { title: 'MANUAL DE OPERACIONES\nPSICOLÓGICAS Y PSICOSOCIALES', img: asset('libro-06.webp'), x: 2239, w: 315, tx: 17 },
  { title: 'WAR ROOM EN CAMPAÑAS\nELECTORALES', img: asset('libro-07.webp'), x: 2679.6, w: 316.5, tx: 22.4 },
  { title: 'MANUAL DE INTELIGENCIA Y\nCONTRA INTELIGENCIA', img: asset('libro-08.webp'), x: 3122.2, w: 316.5, tx: 21.8 },
]
const VISIBLE = 3

/*
 * Packs (coordenadas relativas a la sección, top 1852 en XD).
 * `y` = línea base del número; `band` = franja del pack entre sus líneas
 * divisorias (el tramo dorado de la línea de tiempo marca la del activo).
 * `name`: el que se muestra en "Pack seleccionado" (el XD solo da el del 02).
 */
const PACKS = [
  { n: '01', title: 'Edición\nIndividual', name: 'Edición Individual', y: 157, band: [134, 397.5] },
  { n: '02', title: 'Edición Dúo\nEstratégico', name: 'Dúo Estratégico', y: 475.4, band: [397.5, 725.9] },
  { n: '03', title: 'Edición Dúo\nPremium', name: 'Dúo Premium', y: 811.9, band: [725.9, 1041.9] },
  { n: '04', title: 'Trilogía\nEstratégica', name: 'Trilogía Estratégica', y: 1119.9, band: [1041.9, 1370.9] },
  { n: '05', title: 'Edición Alta\nDirección', name: 'Alta Dirección', y: 1458.9, band: [1370.9, 1698.9] },
  { n: '06', title: 'Edición Goberna\nExclusiva', name: 'Goberna Exclusiva', y: 1800.9, band: [1698.9, 2030] },
]
/** Líneas divisorias entre packs */
const PACK_LINES = [397.5, 725.9, 1041.9, 1370.9, 1698.9]

/* Portadas de cada pack, en el orden de apilado del XD (la última queda encima) */
const PACK_BOOKS: { src: string; box: Box }[] = [
  { src: asset('pack-inteligencia.webp'), box: [1185, 121, 166.4, 230.8] },
  { src: asset('pack-waroom.webp'), box: [1296.3, 443.3, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1185, 443.3, 166.4, 237.4] },
  { src: asset('pack-oratoria.webp'), box: [1282.2, 770.9, 162.3, 225.1] },
  { src: asset('pack-inteligencia.webp'), box: [1185, 770.9, 171.7, 238.1] },
  { src: asset('pack-waroom.webp'), box: [1395.3, 1087, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1284, 1087, 166.4, 237.4] },
  { src: asset('pack-guerra.webp'), box: [1185, 1087, 173.4, 247.4] },
  { src: asset('pack-consultor.webp'), box: [1480.3, 1416, 170.8, 237] },
  { src: asset('pack-waroom.webp'), box: [1395.3, 1416, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1284, 1416, 166.4, 237.4] },
  { src: asset('pack-guerra.webp'), box: [1185, 1416, 173.4, 247.4] },
  { src: asset('pack-oratoria.webp'), box: [1549.2, 1762, 170.8, 237] },
  { src: asset('pack-inteligencia.webp'), box: [1491.2, 1762, 170.8, 237] },
  { src: asset('pack-consultor.webp'), box: [1425.3, 1762, 170.8, 237] },
  { src: asset('pack-waroom.webp'), box: [1350.3, 1762, 170.8, 237] },
  { src: asset('pack-lawfare.webp'), box: [1259, 1762, 166.4, 237.4] },
  { src: asset('pack-guerra.webp'), box: [1185, 1762, 173.4, 247.4] },
]

/*
 * Packs con scroll: la sección completa mide lo que en el XD (2047px, los 6
 * packs uno debajo del otro). Al hacer scroll, una ventana del alto del fondo
 * azul (1104px) queda fija con la columna izquierda y la línea de tiempo, y la
 * lista de packs sube dentro de ella: no se pasa a la sección siguiente sin
 * recorrer los 6. Con movimiento reducido no se fija y queda como el XD.
 */
const PACKS_H = 2047
const WINDOW_H = 1104
/** Borde inferior de las portadas del pack 06 (relativo a la sección) */
const LIST_BOTTOM = 2010
/** Límite superior para fijar la ventana: el título queda bajo la cabecera */
const MAX_LIFT = 50

const TIMELINE: Box = [817, 134, 1, 946]

/** Tramo dorado: la franja del pack activo (con la lista subida `shift` px), recortada a la línea de tiempo */
function segment(i: number, shift: number) {
  const [, top, , h] = TIMELINE
  const a = Math.max(top, PACKS[i].band[0] + 1 - shift)
  const b = Math.min(top + h, PACKS[i].band[1] - 3.4 - shift)
  return { top: a, h: Math.max(0, b - a), mid: (a + b) / 2 }
}

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
        // Lo que tiene que subir la lista para ver completo el pack 06
        const maxShift = () => {
          const visible = Math.min(WINDOW_H, innerHeight / zoom() + lift()) - 24
          return Math.max(0, LIST_BOTTOM - visible)
        }
        // Variables CSS (no estado de React): se actualizan en cada frame de scroll
        const update = (p: number) => {
          // Pantallas bajas (laptop): el bloque "disponible en Amazon" sube para no quedar cortado
          wrap.style.setProperty('--store-up', `${Math.min(130, Math.max(0, 1000 - innerHeight / zoom()))}px`)
          const s = Math.min(1, p * 1.1) * maxShift()
          const i = Math.min(PACKS.length - 1, Math.floor(p * PACKS.length))
          const seg = segment(i, s)
          wrap.style.setProperty('--packs-top', `${-lift()}px`)
          wrap.style.setProperty('--packs-shift', `${-s}px`)
          wrap.style.setProperty('--seg-top', `${seg.top}px`)
          wrap.style.setProperty('--seg-h', `${seg.h}px`)
          wrap.style.setProperty('--seg-mid', `${seg.mid}px`)
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
          for (const v of ['--packs-top', '--packs-shift', '--seg-top', '--seg-h', '--seg-mid', '--store-up']) wrap.style.removeProperty(v)
        }
      })
    },
    { scope: packsWrap },
  )
  // Clic en un pack: con scroll, lleva la página a su tramo; si no, lo elige directo
  const pickPack = (i: number) => {
    const st = packsST.current
    if (!st) return setPack(i)
    window.scrollTo({ top: st.start + ((i + 0.5) / PACKS.length) * (st.end - st.start), behavior: 'smooth' })
  }

  // Sin scroll (movimiento reducido) el tramo sigue al pack elegido con clic
  const seg = segment(pack, 0)

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 700 }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 700, backgroundImage: `url(${asset('biblioteca-hero.webp')})` }} />
        <Txt x={1720} y={338} f="p" w={500} s={72} lh={80} up align="r" c="var(--ivory)" as="h1" className="tw-title">
          <TW text={'Ideas que aplian\nla mirada'} />
        </Txt>
      </section>

      {/* ── 6 títulos ────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1152, background: 'var(--ivory)' }}>
        <Txt x={200} y={119} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Biblioeca Goberna</Txt>
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
                <MiniLink x={b.tx} y={581} big href="#contacto">Ver edición</MiniLink>
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

          {/* Línea de tiempo: puntos de inicio y fin, y el tramo dorado del pack activo */}
          <span className="packs__timeline" style={{ left: TIMELINE[0], top: TIMELINE[1], width: TIMELINE[2], height: TIMELINE[3] }} />
          <span className="packs__dot" style={{ left: 810, top: 206 }} />
          <span className="packs__dot" style={{ left: 810, top: 968 }} />
          <span className="packs__seg" style={{ left: 815, top: `var(--seg-top, ${seg.top}px)`, height: `var(--seg-h, ${seg.h}px)` }} />
          <span className="packs__dot is-on" style={{ left: 810, top: `calc(var(--seg-mid, ${seg.mid}px) - 8px)` }} />
          <span className="packs__ring" style={{ left: 805, top: `calc(var(--seg-mid, ${seg.mid}px) - 13px)` }} />

          {/* Columna izquierda: pack seleccionado */}
          <Txt x={200} y={190} f="p" w={500} s={60} lh={71} c="var(--cream)" as="h2" className="tw-title">
            <span className="it"><TW text="Construye " /></span>
            <TW text={'tu\nBiblioteca Goberna'} />
          </Txt>
          <Txt x={201} y={370.8} s={14} lh={18} ls={60} up c="var(--gold)">Pack seleccionado</Txt>
          <div aria-live="polite">
            <Txt x={201} y={438.8} f="p" w={600} s={60} lh={80} ls={-40} c="var(--gold)">{PACKS[pack].n}</Txt>
            <Txt x={200} y={482.8} f="p" w={600} s={36} lh={25} c="var(--cream)" as="h3">{PACKS[pack].name}</Txt>
          </div>
          <Txt x={200} y={501.8} s={17} lh={32} ls={32} c="var(--cream)" width={395}>
            Publicaciones de referencia en inteligencia, seguridad y estrategia.
          </Txt>
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
        <div className="bg" style={{ left: 0, top: -148, width: 1920, height: 1024, backgroundImage: `url(${asset('exclusiva-fondo.webp')})` }} />
        <img className="abs" src={asset('caja-libros.webp')} alt="Estuche de colección Goberna con las 6 obras" loading="lazy" style={{ left: 863, top: 118, width: 905, height: 589 }} />
        <Txt x={201} y={94.8} s={14} lh={18} ls={60} up c="var(--gold)">Edición exclusiva · Goberna</Txt>
        <Txt x={200} y={247} f="p" w={600} s={62} lh={83} ls={-40} up c="var(--gold)" as="h2" className="tw-title">
          <TW text="06 Obras" />
        </Txt>
        <Txt x={200} y={300} f="p" w={600} s={43} lh={45} up c="var(--cream)" as="p">Una biblioteca de poder.</Txt>
        <Txt x={199} y={321} s={16} lh={32} ls={40} c="var(--cream)" width={428}>Disponible con estuche de colección premium.</Txt>
        <Btn
          x={200} y={411.6} variant="solid" href="#contacto" label="Consultar este pack"
          size={{ w: 395, h: 56, textX: 85.6, baseY: 33, ico: [292.8, 19.9, 18.7, 15.7] }}
        />
        <Icon svg={whatsapp} box={[201, 492.2, 24, 24]} className="packs__wa" />
        <Txt x={232} y={508.2} s={13} lh={16} ls={60} up c="var(--cream)">Hablar con un asesor</Txt>
      </section>

      <OtherPieces height={378} cardsTop={80} />
      <FinalCta />
    </main>
  )
}
