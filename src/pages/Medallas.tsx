import { Fragment, useState } from 'react'
import icoMaterial from '../assets/icons/ico-material.svg?raw'
import icoAcabado from '../assets/icons/ico-acabado.svg?raw'
import icoDiametro from '../assets/icons/ico-diametro.svg?raw'
import icoInversion from '../assets/icons/ico-inversion.svg?raw'
import { Btn, HLine, Icon, Masked, Txt, VLine } from '../components/ui'
import { FinalCta, GoldDash, OtherPieces } from '../components/sections'
import { useLaptop } from '../viewport'
import './Medallas.css'

const SPECS = [
  { n: '01', label: 'Materiales', value: 'Bronce y acabados\nmetálicos.' },
  { n: '02', label: 'Acabado', value: 'Dorado, plateado, envejecido\ny esmaltado.' },
  { n: '03', label: 'Personalización', value: 'Relieve, grabado, color y\ncinta institucional.' },
  { n: '04', label: 'Presentación', value: 'Estuche individual o caja de\nreconocimiento.' },
]

type Medal = {
  id: string
  name: string
  img: string
  detail: string
  material: string
  finish: string
  diameter: string
  price: string
  before: string
}

/* Igual que el XD: las 9 tarjetas usan el título y la ficha de la pantalla 3. */
const BASE = {
  name: 'Medalla del\nAsesor Presidencial',
  detail: '/img/medalla-detalle.webp',
  material: 'Bronce de 1/6',
  finish: 'Bombeadas bañadas\nen oro',
  diameter: '8 cm',
  price: '180',
  before: 'S/250',
}

const MEDALS: Medal[] = [
  { id: 'oro', img: '/img/medalla-1.webp', ...BASE },
  { id: 'plata', img: '/img/medalla-2.webp', ...BASE },
  { id: 'turquesa', img: '/img/medalla-3.webp', ...BASE },
]

/* Columnas del grid: x del pedestal (476px de ancho) */
const COLS = [222, 723, 1236]
const ROWS = 3

/* Tarjeta: caja de 494×526 desde la imagen del producto (x - 10). */
function MedalCard({ m, x, selected, onSelect }: { m: Medal; x: number; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className={`medal ${selected ? 'is-selected' : ''}`}
      style={{ left: x - 10 }}
      onClick={onSelect}
      aria-expanded={selected}
    >
      <img className="abs" src="/img/card-base.webp" alt="" loading="lazy" style={{ left: 10, top: 49, width: 476, height: 477 }} />
      <img className="abs medal__img" src={m.img} alt="" loading="lazy" style={{ left: 0, top: 0, width: 494, height: 390 }} />
      <Txt x={248} y={485} w={600} s={17} lh={20} ls={140} up align="c" as="span" className="medal__name">
        {m.name}
      </Txt>
      <GoldDash cx={248} y={523} />
    </button>
  )
}

function MedalPanel({ m }: { m: Medal }) {
  const laptop = useLaptop()
  return (
    <div className="medal-panel">
      <Txt x={80} y={65} s={16} lh={19} ls={140} up c="var(--gold)">Medalla seleccionada</Txt>
      <img className="abs" src={m.detail} alt="" style={{ left: 42, top: 94, width: 313, height: 373, objectFit: 'contain' }} />
      <Txt x={429} y={138} f="p" w={600} s={44} lh={71} as="h3">{m.name.replace('\n', ' ')}</Txt>
      <HLine x={429} y={171} w={64} h={2} c="#9f7d48" />

      <Icon svg={icoMaterial} box={[429, 255, 55.8, 22.9]} className="medal-panel__ico" />
      <Icon svg={icoAcabado} box={[725, 255, 28.9, 35.1]} className="medal-panel__ico" />
      <Icon svg={icoDiametro} box={[1045, 252.8, 20, 20]} className="medal-panel__ico" />
      <Icon svg={icoInversion} box={[1263, 256.2, 20, 13.8]} className="medal-panel__ico" />

      <Txt x={495} y={268} w={600} s={16} lh={19} ls={140} up>Materiales</Txt>
      <Txt x={765} y={269} w={600} s={16} lh={19} ls={140} up>Acabado</Txt>
      <Txt x={1075} y={269} w={600} s={16} lh={19} ls={140} up>Diámetro</Txt>
      <Txt x={1293} y={269} w={600} s={16} lh={19} ls={140} up>Inversión</Txt>

      <Txt x={495} y={305} s={18} lh={32} ls={32} c="var(--ink)">{m.material}</Txt>
      <Txt x={765} y={306} s={18} lh={32} ls={32} c="var(--ink)">{m.finish}</Txt>
      <Txt x={1075} y={306} s={18} lh={32} ls={32} c="var(--ink)">{m.diameter}</Txt>
      <Txt x={1293} y={316} w={600} s={31} lh={55} ls={32} c="var(--gold-2)">
        <span style={{ fontSize: 22 }}>S/</span> {m.price}
      </Txt>
      <VLine x={1397.5} y={291} h={28} />
      <Txt x={1414} y={301} s={12} lh={44} ls={32} c="var(--ink)" style={{ opacity: 0.53 }}>Antes</Txt>
      <Txt x={1414} y={317} s={17} lh={44} ls={32} c="var(--ink)" style={{ opacity: 0.53, textDecoration: 'line-through' }}>{m.before}</Txt>

      <VLine x={675.5} y={240} h={100} />
      <VLine x={1005.5} y={240} h={100} />
      <VLine x={1223.5} y={240} h={100} />

      {/* En laptop los botones del XD (9px) serían ilegibles: se usan los de tamaño normal */}
      <Btn x={430} y={laptop ? 367 : 381} variant="solid" small={!laptop} href="#contacto" />
      <Btn x={laptop ? 804 : 681} y={laptop ? 367 : 381} variant="outline" small={!laptop} darkText href="#contacto" />
    </div>
  )
}

export function Medallas() {
  /* clave "fila-columna" de la medalla abierta */
  const [open, setOpen] = useState<string | null>(null)

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 800 }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 900, backgroundImage: 'url(/img/banner-medallas.webp)' }} />
        <Txt x={1720} y={450} f="p" w={500} s={72} lh={80} up align="r" c="var(--ivory)" as="h1">
          {'Medallas, placas y\nreconocimientos\nde cristal'}
        </Txt>
      </section>

      {/* ── Categoría ────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1037, background: 'var(--ivory)' }}>
        <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Categoría - Medallas</Txt>
        <Txt x={200} y={263} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2">
          <span className="it gold">Reconocer</span>{' es dar \nvalor a lo construido.'}
        </Txt>
        <Masked mask={[200, 407, 719, 473]} img={[200, 407, 1009, 473]} src="/img/fondo-medalla.webp" alt="Medalla Goberna en estuche" />
        <Txt x={200} y={919} s={16} lh={19} ls={140} up c="var(--navy)">Trayectoria · Mérito · Distinción</Txt>

        <Txt x={1067} y={211} s={17} lh={32} ls={32} c="var(--ink)" width={653}>
          {'Cada logro representa tiempo, conocimiento, compromiso y trayectoria.\nLa colección Goberna reúne piezas concebidas para materializar ese reconocimiento y acompañar los momentos que merecen ser recordados.'}
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

      {/* ── Colección de medallas ────────────────────────────── */}
      <section className="sec medal-grid" style={{ background: 'var(--ivory)' }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 675, backgroundImage: 'url(/img/fondo-textura.webp)', opacity: 0.65 }} />
        <div className="medal-grid__head">
          <Txt x={638} y={169} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2">
            Colección de <span className="it gold">medallas</span>
          </Txt>
          <HLine x={941} y={206.5} w={40} c="var(--line)" />
        </div>

        {Array.from({ length: ROWS }, (_, r) => {
          const openCol = MEDALS.findIndex((_, c) => open === `${r}-${c}`)
          return (
            <Fragment key={r}>
              <div className={`medal-row ${openCol >= 0 ? 'has-panel' : ''}`}>
                {MEDALS.map((m, c) => (
                  <MedalCard
                    key={m.id}
                    m={m}
                    x={COLS[c]}
                    selected={openCol === c}
                    onSelect={() => setOpen(open === `${r}-${c}` ? null : `${r}-${c}`)}
                  />
                ))}
                <VLine x={709} y={137} h={214} />
                <VLine x={1217} y={137} h={214} />
              </div>
              {openCol >= 0 && <MedalPanel key={open} m={MEDALS[openCol]} />}
            </Fragment>
          )
        })}
      </section>

      <OtherPieces height={499} titleY={109} titleSize={50} />
      <FinalCta filledTop />
    </main>
  )
}
