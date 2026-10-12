import { useState } from 'react'
import { TW } from '../components/typewriter'
import { asset } from '../asset'
import prevSvg from '../assets/icons/carousel-prev.svg?raw'
import nextSvg from '../assets/icons/carousel-next.svg?raw'
import whatsapp from '../assets/icons/whatsapp.svg?raw'
import { Btn, HLine, Icon, MiniLink, Txt } from '../components/ui'
import type { Box } from '../components/ui'
import { FinalCta, OtherPieces } from '../components/sections'
import './Biblioteca.css'

/*
 * Pantalla CATALOGO – 4. Textos tal cual el XD (incluidos sus errores de tipeo).
 * Libros: x de la portada dentro del carrusel ("Grupo de desplazamiento",
 * viewport 1396px desde x 266). Portadas 360×499 con sombra incluida.
 * `tx`: x de los textos respecto a la portada (12 salvo donde el XD los corre).
 */
const BOOKS: { title: string; img: string; x: number; w: number; tx?: number }[] = [
  { title: 'EL PODER DE LA ORATORIA E\nIMAGEN POLÍTICA', img: asset('libro-01.webp'), x: 1, w: 360 },
  { title: 'LAWFARE GUERRA JURÍDICA EN LA\nPOLÍTICA', img: asset('libro-02.webp'), x: 519, w: 360 },
  { title: 'GUERRA ELECTORAL-EL PODER EN\nLAS SOMBRAS', img: asset('libro-03.webp'), x: 1021, w: 360 },
  { title: 'MANUEL DEL CONSULTOR\nPOLÍTICO', img: asset('libro-04.webp'), x: 1523, w: 360 },
  { title: 'MÁQUINA\nELECTORAL', img: asset('libro-05.webp'), x: 2041, w: 360, tx: 13 },
  { title: 'MANUAL DE OPERACIONES\nPSICOLÓGICAS Y PSICOSOCIALES', img: asset('libro-06.webp'), x: 2543, w: 360, tx: 15 },
  { title: 'WAR ROOM EN CAMPAÑAS\nELECTORALES', img: asset('libro-07.webp'), x: 3045, w: 359.7, tx: 19 },
  { title: 'MANUAL DE INTELIGENCIA Y\nCONTRA INTELIGENCIA', img: asset('libro-08.webp'), x: 3548, w: 359.7, tx: 18 },
]
const VISIBLE = 3

/* Packs (coordenadas relativas a la sección, top 1938 en XD) */
const PACKS = [
  { n: '01', title: 'Edición\nindividual', y: 169.6 },
  { n: '02', title: 'Edición dúo\nestratégico', y: 519.6 },
  { n: '03', title: 'Edición dúo\npremium', y: 844.6 },
]

/* Portadas de los packs, en el orden de apilado del XD (la última queda encima) */
const PACK_BOOKS: { src: string; box: Box }[] = [
  { src: asset('libro-08.webp'), box: [1209.5, 73.5, 193.4, 268.2] },
  { src: asset('libro-07.webp'), box: [1312.2, 403.4, 198.6, 275.4] },
  { src: asset('libro-02.webp'), box: [1209.5, 403.4, 198.9, 275.9] },
  { src: asset('libro-01.webp'), box: [1312, 734, 199, 276] },
  { src: asset('libro-08.webp'), box: [1209.5, 733.3, 193.4, 268.2] },
]

/* Puntos de la línea de tiempo: el primero (pack seleccionado) relleno con aro */
const DOTS = [149, 505, 830]

export function Biblioteca() {
  const [start, setStart] = useState(0)
  const max = BOOKS.length - VISIBLE
  const go = (d: number) => setStart((s) => Math.min(max, Math.max(0, s + d)))

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 700 }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 700, backgroundImage: `url(${asset('biblioteca-hero.webp')})` }} />
        <Txt x={1720} y={318} f="p" w={500} s={72} lh={80} up align="r" c="var(--ivory)" as="h1" className="tw-title">
          <TW text={'Ideas que aplian\nla mirada'} />
        </Txt>
      </section>

      {/* ── 6 títulos ────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1238, background: 'var(--ivory)' }}>
        <Txt x={200} y={119} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Biblioeca Goberna</Txt>
        <Txt x={200} y={265} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2" className="tw-title">
          <span className="it gold"><TW text={'6 Títulos.\n'} /></span>
          <TW text="Distintas perspectivas" />
        </Txt>
        <Txt x={1206} y={213} s={17} lh={32} ls={32} c="var(--ink)" width={514}>
          Cada publicación aborda, desde una mirada rigurosa y práctica, los desafíos contemporáneos del poder, la
          política y la toma decisiones.
        </Txt>

        <div className="books" style={{ left: 266, top: 463 }}>
          <div className="books__track" style={{ translate: `${-(BOOKS[start].x - BOOKS[0].x)}px 0` }}>
            {BOOKS.map((b, i) => (
              <article key={b.img} className="book" style={{ left: b.x }}>
                <img className="abs" src={b.img} alt={b.title.replace('\n', ' ')} loading="lazy" style={{ left: 0, top: 0, width: b.w, height: 499 }} />
                <Txt x={b.tx ?? 12} y={556} w={600} s={18} lh={22} ls={140} c="var(--gold)">{String(i + 1).padStart(2, '0')}</Txt>
                <Txt x={b.tx ?? 12} y={580} w={600} s={17} lh={28} ls={140} c="var(--navy)" width={392} as="h3">{b.title}</Txt>
                <MiniLink x={b.tx ?? 12} y={668} big href="#contacto">Ver edición</MiniLink>
              </article>
            ))}
          </div>
        </div>
        <button type="button" className="books__nav" style={{ left: 198.5, top: 719.5 }} onClick={() => go(-1)} disabled={start === 0} aria-label="Anterior" dangerouslySetInnerHTML={{ __html: prevSvg }} />
        <button type="button" className="books__nav is-next" style={{ left: 1664, top: 721 }} onClick={() => go(1)} disabled={start === max} aria-label="Siguiente" dangerouslySetInnerHTML={{ __html: nextSvg }} />
      </section>

      {/* ── Construye tu biblioteca (packs) ──────────────────── */}
      <section id="ediciones" className="sec packs" style={{ height: 1062 }}>
        <div className="bg px-bg" style={{ left: 0, top: 0, width: 1920, height: 1200, backgroundImage: `url(${asset('fondo-azul.webp')})` }} />
        <Txt x={200} y={169} f="p" w={500} s={60} lh={71} c="var(--cream)" as="h2" className="tw-title">
          <span className="it"><TW text="Construye " /></span>
          <TW text={'tu\nBiblioteca Goberna'} />
        </Txt>
        <Txt x={200} y={296} s={18} lh={32} ls={32} c="var(--cream)" width={514}>
          Elige una publicación o combina títulos para ampliar tu recorrido de lectura.
        </Txt>

        {/* Pack seleccionado */}
        <Txt x={201} y={450} s={14} lh={18} ls={60} up c="var(--gold)">Pack seleccionado</Txt>
        <Txt x={201} y={502} f="p" w={600} s={39} lh={52} ls={-40} c="var(--gold)">02</Txt>
        <Txt x={253} y={503} f="p" w={600} s={27} lh={25} ls={60} c="var(--cream)" as="h3">Dúo Estratégico</Txt>
        <Btn
          x={200} y={542} variant="solid" href="#contacto" label="Consultar este pack"
          size={{ w: 286, h: 56, textX: 32, baseY: 33, ico: [235, 19.9, 18.7, 15.7] }}
        />
        <Icon svg={whatsapp} box={[201, 616, 24, 24]} className="packs__wa" />
        <Txt x={232} y={632} s={13} lh={16} ls={60} up c="var(--cream)">Hablar con un asesor</Txt>
        <Btn
          x={200} y={701} variant="outline" href="#contacto"
          size={{ w: 350, h: 64, textX: 40, baseY: 37.9, ico: [285, 26.6, 13.2, 13.2] }}
        />

        {/* Línea de tiempo */}
        <span className="packs__timeline" style={{ left: 865, top: 82, width: 2, height: 951 }} />
        <span className="packs__ring" style={{ left: 853, top: DOTS[0], width: 26, height: 26 }} />
        {DOTS.map((y, i) => (
          <span key={y} className={`packs__dot ${i === 0 ? 'is-on' : ''}`} style={{ left: 858, top: y + (i === 0 ? 5 : 0), width: 16, height: 16 }} />
        ))}

        {PACK_BOOKS.map((b, i) => {
          const [x, y, w, h] = b.box
          return <img key={i} className="abs" src={b.src} alt="" loading="lazy" style={{ left: x, top: y, width: w, height: h }} />
        })}
        {PACKS.map((p) => (
          <article key={p.n}>
            <Txt x={928.2} y={p.y} w={600} s={25} lh={30} ls={140} c="var(--gold)">{p.n}</Txt>
            <Txt x={928.2} y={p.y + 39} s={18} lh={24} ls={140} up c="var(--cream)" as="h3">{p.title}</Txt>
          </article>
        ))}
        <HLine x={928.2} y={376.5} w={792.3} c="var(--line-dark)" />
        <HLine x={928.2} y={708.5} w={792.3} c="var(--line-dark)" />
      </section>

      <OtherPieces height={456} titleY={136} titleSize={50} />
      <FinalCta filledTop />
    </main>
  )
}
