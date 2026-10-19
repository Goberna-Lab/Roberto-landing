import { Fragment, useEffect, useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TW } from '../components/typewriter'
import { asset } from '../asset'
import icoMaterial from '../assets/icons/ico-material.svg?raw'
import icoAcabado from '../assets/icons/ico-acabado.svg?raw'
import icoDiametro from '../assets/icons/ico-diametro.svg?raw'
import icoInversion from '../assets/icons/ico-inversion.svg?raw'
import { Btn, HLine, Icon, Masked, Txt, VLine } from '../components/ui'
import { FinalCta, GoldDash, OtherPieces } from '../components/sections'
import { useLaptop } from '../viewport'
import { CRISTALES, DETAILS, MEDALS, PLACAS, SPECS } from '../data/medallas'
import type { Detail, Piece } from '../data/medallas'
import './Medallas.css'

/* Columnas del grid: x del pedestal (476px de ancho) */
const COLS = [222, 723, 1236]
const ROWS = 3

/* Tarjeta: caja de 494×526 desde la imagen del producto (x - 10). */
function MedalCard({ m, x, selected, expanded, onSelect }: { m: Piece; x: number; selected: boolean; expanded: boolean; onSelect?: () => void }) {
  const content = (
    <>
      <img className="abs" src={asset('card-base.webp')} alt="" loading="lazy" style={{ left: 10, top: 49, width: 476, height: 477 }} />
      <img className="abs medal__img" src={m.img} alt="" loading="lazy" style={{ left: 0, top: 0, width: 494, height: 390 }} />
      <Txt x={248 + m.dx} y={485.5} w={600} s={17} lh={20} ls={140} up align="c" as="span" className="medal__name">
        {expanded ? (m.openName ?? m.name) : m.name}
      </Txt>
      <GoldDash cx={248 + m.dx + (m.dashDx ?? 0.5)} y={522.5} />
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
  const firstRowOpen = Boolean(valid && valid <= COLS.length)
  const toggle = (n: number) => {
    location.hash = valid === n ? '#/medallas' : `#/medallas/${n}`
  }

  // Al entrar directo con #/medallas/n, llevar la medalla y su panel a la vista
  const grid = useRef<HTMLElement>(null)
  const entry = useRef(valid)
  // Abrir/cerrar una ficha cambia el alto de la página: recalcular las animaciones
  // de scroll de lo que queda debajo (máquina de escribir, zoom de Cristal)
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [valid])

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
        <Txt x={1720} y={310} f="p" w={500} s={72} lh={80} up align="r" c="var(--ivory)" as="h1" className="tw-title">
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

        {Array.from({ length: ROWS }, (_, rowIndex) => {
          const openCol = COLS.findIndex((_, columnIndex) => open === `${rowIndex}-${columnIndex}`)
          return (
            <Fragment key={rowIndex}>
              <div className={`medal-row ${openCol >= 0 ? 'has-panel' : ''}`} style={{ left: firstRowOpen && rowIndex === 1 ? -6 : 0 }}>
                {COLS.map((x, c) => {
                  const n = rowIndex * COLS.length + c + 1
                  return (
                    <MedalCard
                      key={n}
                      m={MEDALS[n - 1]}
                      x={x}
                      selected={openCol === c}
                      expanded={firstRowOpen}
                      onSelect={() => toggle(n)}
                    />
                  )
                })}
                <VLine x={708.5} y={136.5} h={214} />
                <VLine x={1217.5} y={136.5} h={214} />
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
      <section className="sec cristal" style={{ height: 900 }}>
        {/* Escena con zoom al entrar (fondos y cristales juntos) */}
        <div className="abs zoom-bg" style={{ inset: 0 }}>
          <div className="bg" style={{ inset: 0, backgroundImage: `url(${asset('cristal-fondo-v2.webp')})` }} />
          {CRISTALES.map(({ name, img, box: [left, top, width, height] }) => (
            <img key={img} className="abs" src={img} alt={name} loading="lazy" style={{ left, top, width, height }} />
          ))}
        </div>
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
