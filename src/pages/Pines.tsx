import { Fragment } from 'react'
import { TW } from '../components/typewriter'
import { asset } from '../asset'
import { HLine, Masked, Txt, VLine } from '../components/ui'
import { FinalCta, GoldDash, OtherPieces } from '../components/sections'
import './Medallas.css'

const SPECS = [
  { n: '01', label: 'Materiales', value: 'Bronce y acabados\nmetálicos.' },
  { n: '02', label: 'Acabado', value: 'Dorado, plateado, envejecido\nY esmaltado.' },
  { n: '03', label: 'Personalización', value: 'Relieve, grabado, color\ninstitucional.' },
  { n: '04', label: 'Presentación', value: 'Estuche individual o caja de\nReconocimiento.' },
]

/*
 * Pantalla CATALOGO – 5. Textos tal cual el XD (incluidas sus mayúsculas).
 * `dx`: desfase del título respecto al centro de la
 * tarjeta, tal cual el XD. La 6.ª pieza no tiene imagen en el XD (solo pedestal).
 */
const PINS: { name: string; img?: string; dx?: number }[] = [
  { name: 'Pin del 1 Foro de Estado\nGobernador Lima 2026', img: asset('pin-1.webp'), dx: -17 },
  { name: 'Pin de Escuela de Inteligencia &\nEstrategia', img: asset('pin-2.webp') },
  { name: 'Pin institucional\nde Goberna', img: asset('pin-3.webp'), dx: -1 },
  { name: 'Pin de Director\nde Seguridad', img: asset('pin-4.webp'), dx: -1 },
  { name: 'Pin de\nCriminología', img: asset('pin-5.webp') },
  { name: 'Medalla del\nOrador Político', dx: -1 },
]

/* Columnas del grid: x del pedestal (476px de ancho), igual que Medallas */
const COLS = [222, 723, 1236]

/* Tarjeta: caja de 494×526 desde la imagen del producto (x - 10). Al pasar el mouse, igual que Medallas. */
function PinCard({ p, x }: { p: (typeof PINS)[number]; x: number }) {
  return (
    <article className="medal" style={{ left: x - 10 }}>
      <img className="abs" src={asset('card-base.webp')} alt="" loading="lazy" style={{ left: 10, top: 49, width: 476, height: 477 }} />
      {p.img && <img className="abs medal__img" src={p.img} alt="" loading="lazy" style={{ left: 0, top: 0, width: 494, height: 390 }} />}
      <Txt x={248 + (p.dx ?? 0)} y={485} w={600} s={17} lh={20} ls={140} up align="c" as="h3" className="medal__name">
        {p.name}
      </Txt>
      <GoldDash cx={248 + (p.dx ?? 0)} y={523} />
    </article>
  )
}

export function Pines() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 700 }}>
        {/* Sin parallax: el zoom recortaba el pin del borde izquierdo */}
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 700, backgroundImage: `url(${asset('banner-pines-cat.webp')})` }} />
        <Txt x={1720} y={342} f="p" w={500} s={65} lh={70} up align="r" c="var(--ivory)" as="h1" className="tw-title">
          <TW text={'Símbolos de\nprestigio'} />
        </Txt>
      </section>

      {/* ── Categoría ────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1023, background: 'var(--ivory)' }}>
        <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Categoría - Pines</Txt>
        <Txt x={200} y={263} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2" className="tw-title">
          <TW text={'Representar una identidad\ntambién es '} />
          <span className="it gold"><TW text="pertenecer." /></span>
        </Txt>
        <Masked mask={[200, 407, 719, 473]} img={[200, 407, 840, 473]} src={asset('fondo-pin.webp')} alt="Pin Goberna en estuche" />
        <Txt x={200} y={919} s={16} lh={19} ls={140} up c="var(--navy)">Trayectoria · Mérito · Distinción</Txt>

        <Txt x={1060} y={220} s={17} lh={32} ls={32} c="var(--ink)" width={660}>
          Piezas creadas que acompañan la trayectoria y convierten la pertenencia en una expresión visible de identidad institucional, proyectada con sobriedad, carácter y permanencia.
        </Txt>
        {[408, 526, 644, 762, 880].map((y) => (
          <HLine key={y} x={1060} y={y + 0.5} w={660} c="var(--line)" />
        ))}
        {SPECS.map((s, k) => (
          <Fragment key={s.n}>
            <Txt x={1067} y={460 + 118 * k} w={600} s={18} lh={22} ls={140} c="var(--gold)">{s.n}</Txt>
            <Txt x={1132} y={460 + 118 * k} w={600} s={16} lh={19} ls={140} up c="var(--navy)">{s.label}</Txt>
            <Txt x={1366} y={456 + 118 * k} s={18} lh={32} ls={32} c="var(--ink)">{s.value}</Txt>
          </Fragment>
        ))}
      </section>

      {/* ── Colección de pines ───────────────────────────────── */}
      <section className="sec medal-grid" style={{ background: 'var(--ivory)', padding: '286px 0 120px' }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 675, backgroundImage: `url(${asset('fondo-textura.webp')})`, opacity: 0.65 }} />
        <div className="medal-grid__head">
          <Txt x={693} y={169} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2" className="tw-title">
            <TW text="Colección de " />
            <span className="it gold"><TW text="pines" /></span>
          </Txt>
          <HLine x={941} y={206.5} w={40} c="#a07c48" />
        </div>

        {[0, 1].map((r) => (
          <div key={r} className="medal-row">
            {COLS.map((x, c) => (
              <PinCard key={c} p={PINS[r * COLS.length + c]} x={x} />
            ))}
            <VLine x={709} y={137} h={214} />
            <VLine x={1217} y={137} h={214} />
          </div>
        ))}
      </section>

      <OtherPieces height={434} titleY={114} titleSize={50} />
      <FinalCta filledTop />
    </main>
  )
}
