import { Fragment, useEffect, useRef } from 'react'
import { TW } from '../components/typewriter'
import { asset } from '../asset'
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
  { n: '02', label: 'Acabado', value: 'Dorado, plateado, envejecido\nY esmaltado.' },
  { n: '03', label: 'Personalización', value: 'Relieve, grabado, color y\ncinta institucional.' },
  { n: '04', label: 'Presentación', value: 'Estuche individual o caja de\nReconocimiento.' },
]

/*
 * Fichas de las 9 medallas (pantalla 7 del XD, "Medalla seleccionada"), textos
 * tal cual el XD. `size`: tamaño de los valores. `finish` en varias líneas =
 * textos separados 23px en el XD; entonces la columna "Acabado" se corre a la
 * izquierda (`finishX`). Las fichas 3, 6 y 8 usan en el XD la imagen de la 1.ª.
 */
type Detail = {
  name: string
  nameSize?: number
  detail: string
  material: string
  finish: string | string[]
  size: number
  diameter: string
  price: string
  before: string
}

const QUEMADAS = ['-Quemadas bombeadas']
const DETAILS: Detail[] = [
  { name: 'Medalla del Asesor Presidencial', detail: asset('medalla-detalle.webp'), material: 'Bronce de 1/16', finish: 'Bombeadas bañadas\nEn oro', size: 16, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Arquitecto Poder Político', detail: asset('ficha-2.webp'), material: 'Bronce de 1/16', finish: ['-Bombeadas bañadas en níquel', '-Cinta azul y blanco'], size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Maestro de Estrategias Globales', detail: asset('medalla-detalle.webp'), material: 'Brondce de 1/16', finish: ['-Quemadas bombeadas', '-Cinta azul y blanco'], size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Asesor Estratégico en Criminología', detail: asset('ficha-4.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Consultor Político Internacional', detail: asset('ficha-5.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Orador Político', detail: asset('medalla-detalle.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Asesor Especializándolasdo en Osint y Socmint', nameSize: 38, detail: asset('ficha-7.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Asesor Estratégico PSYOPS', detail: asset('medalla-detalle.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Analista de Inteligencia', detail: asset('ficha-9.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
]

/*
 * Pantalla 2: 9 medallas en orden de lectura. `dx`: desfase del título
 * respecto al centro de la tarjeta, tal cual el XD. Cada medalla abre su
 * ficha (pantallas 3 y 7 del XD).
 */
type Piece = { name: string; img: string; dx: number }
const MEDALS: Piece[] = [
  { name: 'Medalla del Medalla del\nAsesor Presidencial', img: asset('medalla-1.webp'), dx: -17 },
  { name: 'Medalla del Arquitecto de\nPoder Político', img: asset('medalla-2.webp'), dx: -1 },
  { name: 'Medalla del Maestro de\nEstrategias Globales', img: asset('medalla-3.webp'), dx: -1 },
  { name: 'Medalla del Asesor Estratégico\nen Criminología', img: asset('medalla-4.webp'), dx: -1 },
  { name: 'Medalla del Consultor Político\nInternacional', img: asset('medalla-5.webp'), dx: 0 },
  { name: 'Medalla del\nOrador Político', img: asset('medalla-6.webp'), dx: -1 },
  { name: 'Medalla del Asesor Especializado\nen OSINT y SOCMINT', img: asset('medalla-7.webp'), dx: -1 },
  { name: 'Medalla del\nAsesor Presidencial', img: asset('medalla-8.webp'), dx: -1 },
  { name: 'Medalla del\nAsesor Presidencial', img: asset('medalla-9.webp'), dx: -1 },
]

/* "Placas de Distinción": pedestal, máscara 427×406 e imagen 534×421 (x absolutas del XD) */
const PLACAS = [
  { name: 'Placa consultor de inteligencia\ny contra inteligencia avanzada', img: asset('placa-1.webp'), base: 221, mask: 245, x: 188, cx: 459 },
  { name: 'Placa placa del director\nde seguridad', img: asset('placa-2.webp'), base: 722, mask: 747, x: 690, cx: 960 },
  { name: 'Placa placa de\ncriminólogo', img: asset('placa-3.webp'), base: 1235, mask: 1260, x: 1203, cx: 1473 },
]

/* Columnas del grid: x del pedestal (476px de ancho) */
const COLS = [222, 723, 1236]
const ROWS = 3

/* Tarjeta: caja de 494×526 desde la imagen del producto (x - 10). */
function MedalCard({ m, x, selected, onSelect }: { m: Piece; x: number; selected: boolean; onSelect?: () => void }) {
  const content = (
    <>
      <img className="abs" src={asset('card-base.webp')} alt="" loading="lazy" style={{ left: 10, top: 49, width: 476, height: 477 }} />
      <img className="abs medal__img" src={m.img} alt="" loading="lazy" style={{ left: 0, top: 0, width: 494, height: 390 }} />
      <Txt x={248 + m.dx} y={485} w={600} s={17} lh={20} ls={140} up align="c" as="span" className="medal__name">
        {m.name}
      </Txt>
      <GoldDash cx={248 + m.dx} y={523} />
    </>
  )
  if (!onSelect) return <div className="medal" style={{ left: x - 10 }}>{content}</div>
  return (
    <button
      type="button"
      className={`medal is-link ${selected ? 'is-selected' : ''}`}
      style={{ left: x - 10 }}
      onClick={onSelect}
      aria-expanded={selected}
    >
      {content}
    </button>
  )
}

function MedalPanel({ m }: { m: Detail }) {
  const laptop = useLaptop()
  // Acabado en varias líneas: la columna empieza más a la izquierda (x 731.5)
  const lines = Array.isArray(m.finish)
  const fx = lines ? 731.5 : 765
  return (
    <div className="medal-panel">
      <Txt x={80} y={65} s={16} lh={19} ls={140} up c="var(--gold)">Medalla seleccionada</Txt>
      <img className="abs" src={m.detail} alt="" style={{ left: 42, top: 94, width: 313, height: 373, objectFit: 'contain' }} />
      <Txt x={429} y={138} f="p" w={600} s={m.nameSize ?? 44} lh={71} as="h3">{m.name}</Txt>
      <HLine x={429} y={171} w={64} h={2} c="#9f7d48" />

      <Icon svg={icoMaterial} box={[429, 255, 55.8, 22.9]} className="medal-panel__ico" />
      <Icon svg={icoAcabado} box={[fx - 40, 255, 28.9, 35.1]} className="medal-panel__ico" />
      <Icon svg={icoDiametro} box={[1045, 252.8, 20, 20]} className="medal-panel__ico" />
      <Icon svg={icoInversion} box={[1263, 256.2, 20, 13.8]} className="medal-panel__ico" />

      <Txt x={495} y={268} w={600} s={16} lh={19} ls={140} up>Materiales</Txt>
      <Txt x={fx} y={269} w={600} s={16} lh={19} ls={140} up>Acabado</Txt>
      <Txt x={1075} y={269} w={600} s={16} lh={19} ls={140} up>Diámetro</Txt>
      <Txt x={1293} y={269} w={600} s={16} lh={19} ls={140} up>Inversión</Txt>

      <Txt x={495} y={305} s={m.size} lh={32} ls={32} c="var(--ink)">{m.material}</Txt>
      {lines ? (
        (m.finish as string[]).map((t, i) => (
          <Txt key={t} x={fx} y={306 + 23 * i} s={m.size} lh={32} ls={32} c="var(--ink)">{t}</Txt>
        ))
      ) : (
        <Txt x={fx} y={306} s={m.size} lh={32} ls={32} c="var(--ink)">{m.finish}</Txt>
      )}
      <Txt x={1075} y={306} s={m.size} lh={32} ls={32} c="var(--ink)">{m.diameter}</Txt>
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

/**
 * `selected`: n.º de medalla abierta, viene de la ruta #/medallas/n (pantallas
 * 3 y 7 del XD). Abrir/cerrar cambia la ruta.
 */
export function Medallas({ selected }: { selected?: number }) {
  const valid = selected && selected >= 1 && selected <= DETAILS.length ? selected : undefined
  const open = valid ? `${Math.floor((valid - 1) / COLS.length)}-${(valid - 1) % COLS.length}` : null
  const toggle = (n: number) => {
    location.hash = valid === n ? '#/medallas' : `#/medallas/${n}`
  }

  // Al entrar directo con #/medallas/n, llevar la medalla y su panel a la vista
  const grid = useRef<HTMLElement>(null)
  const entry = useRef(valid)
  useEffect(() => {
    if (!entry.current) return
    const row = grid.current?.querySelectorAll('.medal-row')[Math.floor((entry.current - 1) / COLS.length)]
    row?.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, [])

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 700 }}>
        {/* Sin parallax: el zoom recortaba las medallas del borde izquierdo */}
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 700, backgroundImage: `url(${asset('banner-medallas-cat.webp')})` }} />
        <Txt x={1720} y={310} f="p" w={500} s={65} lh={70} up align="r" c="var(--ivory)" as="h1" className="tw-title">
          <TW text={'Medallas, placas y\nreconocimientos\nde cristal'} />
        </Txt>
      </section>

      {/* ── Categoría ────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1023, background: 'var(--ivory)' }}>
        <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Categoría - Medallas</Txt>
        <Txt x={200} y={263} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2" className="tw-title">
          <span className="it gold"><TW text="Reconocer" /></span>
          <TW text={' es dar \nvalor a lo construido.'} />
        </Txt>
        <Masked mask={[200, 407, 719, 473]} img={[200, 407, 1009, 473]} src={asset('fondo-medalla.webp')} alt="Medalla Goberna en estuche" />
        <Txt x={200} y={919} s={16} lh={19} ls={140} up c="var(--navy)">Trayectoria · Mérito · Distinción</Txt>

        {/* Cortes de línea del XD: con 653px de caja el navegador partía la 1.ª línea */}
        <Txt x={1067} y={211} s={17} lh={32} ls={32} c="var(--ink)" width={670}>
          {'Cada logro representa tiempo, conocimiento, compromiso y trayectoria.\nLa colección Goberna reúne piezas concebidas para materializar ese\nreconocimiento y acompañar los momentos que merecen ser\nrecordados.'}
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
      <section ref={grid} className="sec medal-grid" style={{ background: 'var(--ivory)' }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 675, backgroundImage: `url(${asset('fondo-textura.webp')})`, opacity: 0.65 }} />
        <div className="medal-grid__head">
          <Txt x={638} y={169} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2" className="tw-title">
            <TW text="Colección de " />
            <span className="it gold"><TW text="medallas" /></span>
          </Txt>
          <HLine x={941} y={206.5} w={40} c="#a07c48" />
        </div>

        {Array.from({ length: ROWS }, (_, r) => {
          const openCol = COLS.findIndex((_, c) => open === `${r}-${c}`)
          return (
            <Fragment key={r}>
              <div className={`medal-row ${openCol >= 0 ? 'has-panel' : ''}`}>
                {COLS.map((x, c) => {
                  const n = r * COLS.length + c + 1
                  return (
                    <MedalCard
                      key={n}
                      m={MEDALS[n - 1]}
                      x={x}
                      selected={openCol === c}
                      onSelect={() => toggle(n)}
                    />
                  )
                })}
                <VLine x={709} y={137} h={214} />
                <VLine x={1217} y={137} h={214} />
              </div>
              {openCol >= 0 && valid && <MedalPanel key={open} m={DETAILS[valid - 1]} />}
            </Fragment>
          )
        })}

        {/* ── Placas de Distinción (y desde el fin de la 3.ª fila) ── */}
        <div className="placas">
          <Txt x={674} y={166} f="p" w={500} s={64} lh={71} c="var(--navy)" as="h2" className="tw-title">
            <TW text="Placas de " />
            <span className="it gold"><TW text="Distinción" /></span>
          </Txt>
          <HLine x={941} y={203.5} w={40} c="var(--line)" />
          {PLACAS.map((p) => (
            <Fragment key={p.img}>
              <img className="abs" src={asset('card-base.webp')} alt="" loading="lazy" style={{ left: p.base, top: 352, width: 476, height: 477 }} />
              <Masked mask={[p.mask, 294, 427, 406]} img={[p.x, 279, 534, 421]} src={p.img} />
              <Txt x={p.cx} y={788} w={600} s={17} lh={20} ls={140} up align="c" as="span" c="var(--navy)">{p.name}</Txt>
              <GoldDash cx={p.cx + 0.5} y={826} />
            </Fragment>
          ))}
          <VLine x={709} y={440} h={214} />
          <VLine x={1217} y={440} h={214} />
        </div>
      </section>

      {/* ── Excelencia en Cristal ─────────────────────────────── */}
      <section className="sec cristal" style={{ height: 1000 }}>
        <div className="bg" style={{ inset: 0, backgroundImage: `url(${asset('cristal-fondo.webp')})` }} />
        <div className="bg" style={{ inset: 0, backgroundImage: `url(${asset('cristal-fondo-2.webp')})` }} />
        <div className="cristal__shade" />
        <img className="abs" src={asset('cristal-2.webp')} alt="Reconocimiento de cristal Goberna" loading="lazy" style={{ left: 1033, top: 111, width: 410, height: 764 }} />
        <img className="abs" src={asset('cristal-3.webp')} alt="" loading="lazy" style={{ left: 1443, top: 294, width: 277, height: 481 }} />
        {/* Indicador de piezas (estático en el XD) */}
        <span className="cristal__dot" style={{ left: 1204, top: 929 }} />
        <span className="cristal__pill" style={{ left: 1216, top: 929 }} />
        <span className="cristal__dot" style={{ left: 1259, top: 929 }} />
        <img className="abs" src={asset('cristal-logo.webp')} alt="" loading="lazy" style={{ left: 1165, top: 372, width: 147, height: 138 }} />
        <img className="abs" src={asset('cristal-1.webp')} alt="" loading="lazy" style={{ left: 631, top: 168, width: 469, height: 704 }} />
        <Txt x={200} y={349} f="p" w={500} s={75} lh={80} c="var(--cream)" as="h2" className="tw-title">
          <TW text={'Excelencia en \n'} />
          <span className="it gold"><TW text="Cristal" /></span>
        </Txt>
        <HLine x={200} y={460} w={40} c="#a07c48" />
        <Txt x={200} y={516} s={17} lh={32} ls={32} c="var(--cream)">Una expresión de honor, mérito y trayectoria.</Txt>
      </section>

      <OtherPieces height={478} titleY={134} />
      <FinalCta />
    </main>
  )
}
