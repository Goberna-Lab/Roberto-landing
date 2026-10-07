import { useState } from 'react'
import { asset } from '../asset'
import prevSvg from '../assets/icons/carousel-prev.svg?raw'
import nextSvg from '../assets/icons/carousel-next.svg?raw'
import { Btn, HLine, Masked, MiniLink, Txt } from '../components/ui'
import type { Box } from '../components/ui'
import { FinalCta, OtherPieces } from '../components/sections'
import './Biblioteca.css'

/* Libros: posición x dentro del carrusel y recorte de la portada (XD) */
const BOOKS: { title: string; img: string; x: number; crop: Box }[] = [
  { title: 'MANUAL DE OPERACIONES\nPSICOLÓGICAS Y PSICOSOCIALES', img: asset('libro-1.webp'), x: 0, crop: [-40, -29, 418, 557] },
  { title: 'MÁQUINA ELECTORAL', img: asset('libro-2.webp'), x: 509, crop: [-54, -56, 442, 590] },
  { title: 'MANUAL DEL CONSULTOR\nPOLÍTICO', img: asset('libro-3.webp'), x: 1011, crop: [-44, -35, 431, 574] },
  { title: 'GUERRA ELECTORAL', img: asset('libro-4.webp'), x: 1519, crop: [-49, -49, 446, 595] },
  { title: 'LAWFARE: GUERRA JURÍDICA\nEN LA POLÍTICA', img: asset('libro-5.webp'), x: 2025, crop: [-45, -39, 433, 577] },
  { title: 'EL PODER DE LA ORATORIA\nE IMAGEN POLÍTICA', img: asset('libro-6.webp'), x: 2533, crop: [-48, -46, 438, 584] },
]
const VISIBLE = 3

/* Packs: coordenadas relativas a la sección (top 2038 en XD) */
const PACKS: { n: string; title: string; numY: number; imgs: { mask: Box; img: Box; src: string }[] }[] = [
  {
    n: '01', title: 'EDICIÓN\nINDIVIDUAL', numY: 247,
    imgs: [{ src: asset('pack-1.webp'), mask: [1155, 100, 276, 422], img: [1009, 100, 561, 421] }],
  },
  {
    n: '02', title: 'DÚO\nESTRATÉGICO', numY: 761,
    imgs: [
      { src: asset('pack-2a.webp'), mask: [1299, 593, 238, 394], img: [1237, 557, 355, 473] },
      { src: asset('pack-2b.webp'), mask: [1127, 602, 255, 388], img: [1077, 564, 339, 452] },
    ],
  },
  {
    n: '03', title: 'DÚO\nESTRATÉGICO', numY: 1238,
    imgs: [
      { src: asset('pack-3a.webp'), mask: [1287, 1111, 250, 399], img: [1230, 1072, 353, 471] },
      { src: asset('pack-3b.webp'), mask: [1140, 1117, 259, 388], img: [978, 1097, 569, 427] },
    ],
  },
  {
    n: '04', title: 'TRILOGÍA\nESTRATÉGICA', numY: 1750,
    imgs: [
      { src: asset('pack-4a.webp'), mask: [1470, 1605, 251, 416], img: [1404, 1568, 375, 500] },
      { src: asset('pack-4b.webp'), mask: [1295, 1615, 269, 410], img: [1242, 1575, 358, 477] },
      { src: asset('pack-4c.webp'), mask: [1083, 1575, 355, 473], img: [1083, 1575, 355, 473] },
    ],
  },
]
const PACK_LIST_X = 897

export function Biblioteca() {
  const [start, setStart] = useState(0)
  const max = BOOKS.length - VISIBLE
  const go = (d: number) => setStart((s) => Math.min(max, Math.max(0, s + d)))

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 798 }}>
        <div className="bg" style={{ left: 213, top: 0, width: 1707, height: 800, backgroundImage: `url(${asset('banner-libros.webp')})` }} />
        <div className="bg" style={{ left: 0, top: 0, width: 1707, height: 800, backgroundImage: `url(${asset('banner-libros.webp')})` }} />
        <Txt x={1720} y={390} f="p" w={500} s={72} lh={80} up align="r" c="var(--ivory)" as="h1">
          {'Ideas que amplían\nla mirada'}
        </Txt>
      </section>

      {/* ── 6 títulos ────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1240, background: 'var(--ivory)' }}>
        <Txt x={200} y={119} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Biblioteca Goberna</Txt>
        <Txt x={200} y={265} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2">
          <span className="it gold">{'6 Títulos.\n'}</span>Distintas perspectivas
        </Txt>
        <Txt x={1206} y={213} s={17} lh={32} ls={32} c="var(--ink)" width={514}>
          Cada publicación aborda, desde una mirada rigurosa y práctica, los desafíos contemporáneos del poder, la
          política y la toma de decisiones.
        </Txt>

        <div className="books" style={{ left: 271, top: 452 }}>
          <div className="books__track" style={{ translate: `${-BOOKS[start].x}px 0` }}>
            {BOOKS.map((b, i) => (
              <article key={b.title} className="book" style={{ left: b.x }}>
                <Masked
                  mask={[0, 0, 368, 500]}
                  img={b.crop}
                  src={b.img}
                  alt={b.title.replace('\n', ' ')}
                  className="book__cover"
                />
                <Txt x={35} y={557} w={600} s={18} lh={22} ls={140} c="var(--gold)">{String(i + 1).padStart(2, '0')}</Txt>
                <Txt x={35} y={581} w={600} s={17} lh={28} ls={140} c="var(--navy)" width={392} as="h3">{b.title}</Txt>
                <MiniLink x={35} y={669} big href="#contacto">Ver edición</MiniLink>
              </article>
            ))}
          </div>
        </div>
        <button type="button" className="books__nav" style={{ left: 198.5, top: 719.5 }} onClick={() => go(-1)} disabled={start === 0} aria-label="Anterior" dangerouslySetInnerHTML={{ __html: prevSvg }} />
        <button type="button" className="books__nav is-next" style={{ left: 1664, top: 721 }} onClick={() => go(1)} disabled={start === max} aria-label="Siguiente" dangerouslySetInnerHTML={{ __html: nextSvg }} />
      </section>

      {/* ── Construye tu biblioteca (packs) ──────────────────── */}
      <section id="ediciones" className="sec packs" style={{ height: 1062 }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 1200, backgroundImage: `url(${asset('fondo-azul.webp')})` }} />
        <img className="abs" src={asset('capitolio.webp')} alt="" loading="lazy" style={{ left: 0, top: 445, width: 673, height: 607, opacity: 0.915 }} />
        <Txt x={200} y={169} f="p" w={500} s={64} lh={71} c="var(--cream)" as="h2">
          <span className="it">Construye</span>{' tu\nBiblioteca Goberna'}
        </Txt>
        <Txt x={200} y={296} s={18} lh={32} ls={32} c="var(--cream)" width={514}>
          Elige una publicación o combina títulos para ampliar tu recorrido de lectura.
        </Txt>
        <Btn x={200} y={392} variant="solid" href="#contacto" />
        <Btn x={200} y={483} variant="outline" href="#contacto" />

        {/* Lista con desplazamiento propio, como el "grupo de desplazamiento" del XD */}
        <div className="packs__scroll" style={{ left: PACK_LIST_X }}>
          <div className="packs__list" style={{ left: -PACK_LIST_X }}>
            {PACKS.map((p) => (
              <article key={p.n} className="pack">
                {p.imgs.map((im) => (
                  <Masked key={im.src} mask={im.mask} img={im.img} src={im.src} />
                ))}
                <Txt x={897} y={p.numY} w={600} s={25} lh={30} ls={140} c="var(--gold)">{p.n}</Txt>
                <Txt x={897} y={p.numY + 60} w={600} s={24} lh={34} ls={140} c="var(--cream)" as="h3">{p.title}</Txt>
              </article>
            ))}
            {[558, 1048, 1578].map((y) => (
              <HLine key={y} x={947} y={y} w={774} c="var(--line-dark)" />
            ))}
          </div>
        </div>
      </section>

      <OtherPieces height={589} titleY={199} titleSize={64} />
      <FinalCta filledTop />
    </main>
  )
}
