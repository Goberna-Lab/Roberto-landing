import { useRef, useState } from 'react'
import { asset } from '../asset'
import icoMaterial from '../assets/icons/ico-material.svg?raw'
import icoAcabado from '../assets/icons/ico-acabado.svg?raw'
import icoDiametro from '../assets/icons/ico-diametro.svg?raw'
import icoInversion from '../assets/icons/ico-inversion.svg?raw'
import { CRISTALES, DETAILS, MEDALS, PLACAS, SPECS } from '../data/medallas'
import { TW } from '../components/typewriter'
import { Card, Category, CollectionHead, Gallery, SheetCta } from './catalog'
import { Sheet } from './Sheet'
import { CategoryHero, FinalCta, OtherPieces, Piece, Rule, Svg, Title } from './ui'
import { flat } from './text'

/* Escena de cristales: caja que envuelve las tres piezas en el XD */
const SCENE = { x: 750, y: 177, w: 986, h: 609 }

type Extra = { kind: 'placa' | 'cristal'; i: number }

/**
 * `selected`: n.º de medalla abierta (ruta #/medallas/n, como en escritorio).
 * Abrir una ficha agrega la ruta al historial: el botón "atrás" la cierra.
 */
export function Medallas({ selected }: { selected?: number }) {
  const valid = selected && selected >= 1 && selected <= DETAILS.length ? selected : undefined
  const pushed = useRef(false)
  const openMedal = (n: number) => {
    pushed.current = true
    location.hash = `#/medallas/${n}`
  }
  const closeMedal = () => {
    if (pushed.current) history.back()
    else location.replace('#/medallas')
    pushed.current = false
  }
  // Placas y cristales no tienen ruta propia en el sitio: ficha local
  const [extra, setExtra] = useState<Extra | null>(null)

  return (
    <>
      <CategoryHero img={asset('banner-medallas-cat.webp')} pos="12% 50%" title="Medallas, placas y reconocimientos de cristal" />

      <Category
        kicker="Categoría - Medallas"
        title={<Title gold="Reconocer" after=" es dar valor a lo construido." />}
        text="Cada logro representa tiempo, conocimiento, compromiso y trayectoria. La colección Goberna reúne piezas concebidas para materializar ese reconocimiento y acompañar los momentos que merecen ser recordados."
        photo={{ src: asset('fondo-medalla.webp'), alt: 'Medalla Goberna en estuche', zoom: 1009 / 719 }}
        specs={SPECS}
      />

      <section className="m-coll">
        <div className="m-coll__tex" style={{ backgroundImage: `url(${asset('fondo-textura.webp')})` }} aria-hidden />
        <CollectionHead before="Colección de " gold="medallas" />
        <ul className="m-grid m-wrap">
          {MEDALS.map((m, i) => (
            <Card key={m.img} img={m.img} name={DETAILS[i].name} meta={`S/ ${DETAILS[i].price}`} delay={(i % 3) * 2.1} onOpen={() => openMedal(i + 1)} />
          ))}
        </ul>

        <CollectionHead before="Placas de " gold="Distinción" />
        <ul className="m-grid m-wrap">
          {PLACAS.map((p, i) => (
            <Card key={p.img} img={p.img} name={p.name} delay={i * 2.1} onOpen={() => setExtra({ kind: 'placa', i })} />
          ))}
        </ul>
      </section>

      {/* ── Excelencia en Cristal ─────────────────────────────── */}
      <section className="m-cristal">
        <div className="m-cristal__bg" aria-hidden>
          <div className="m-px" data-parallax="18">
            <img src={asset('cristal-fondo-v2.webp')} alt="" loading="lazy" decoding="async" />
          </div>
        </div>
        <div className="m-wrap m-cristal__copy">
          <h2 className="m-title is-light tw-title">
            <TW text="Excelencia en " />
            <span className="m-gold-it"><TW text="Cristal" /></span>
          </h2>
          <Rule />
          <p className="m-text is-light" data-reveal>Una expresión de honor, mérito y trayectoria.</p>
        </div>
        <div className="m-cristal__scene" style={{ aspectRatio: `${SCENE.w} / ${SCENE.h}` }}>
          {CRISTALES.map((c, i) => {
            const [x, y, w, h] = c.box
            return (
              <button
                key={c.img} type="button" className="m-cristal__piece" aria-haspopup="dialog" aria-label={`Ver ficha: ${c.name}`}
                onClick={() => setExtra({ kind: 'cristal', i })}
                style={{ left: `${((x - SCENE.x) / SCENE.w) * 100}%`, top: `${((y - SCENE.y) / SCENE.h) * 100}%`, width: `${(w / SCENE.w) * 100}%`, height: `${(h / SCENE.h) * 100}%` }}
              >
                <Piece img={c.img} pedestal={false} delay={0.8 + i * 1.6} className="is-crystal" />
              </button>
            )
          })}
        </div>
      </section>

      <OtherPieces title />
      <FinalCta />

      {valid && <MedalSheet n={valid} onClose={closeMedal} />}
      {extra && (
        <Sheet label={flat(extra.kind === 'placa' ? PLACAS[extra.i].name : CRISTALES[extra.i].name)} onClose={() => setExtra(null)} footer={<SheetCta name={flat(extra.kind === 'placa' ? PLACAS[extra.i].name : CRISTALES[extra.i].name)} />}>
          <p className="m-kicker is-gold">{extra.kind === 'placa' ? 'Placas de distinción' : 'Excelencia en cristal'}</p>
          <Gallery
            label="Foto de la pieza"
            slides={[<Piece key="p" img={extra.kind === 'placa' ? PLACAS[extra.i].img : CRISTALES[extra.i].img} pedestal={false} className={`is-live is-hero ${extra.kind === 'cristal' ? 'is-crystal' : ''}`} />]}
          />
          <h3 className="m-sheet__title">{flat(extra.kind === 'placa' ? PLACAS[extra.i].name : CRISTALES[extra.i].name)}</h3>
          <span className="m-rule" aria-hidden />
        </Sheet>
      )}
    </>
  )
}

/* Ficha de medalla: fotos (pieza y estuche), nombre y los datos del XD */
function MedalSheet({ n, onClose }: { n: number; onClose: () => void }) {
  const d = DETAILS[n - 1]
  const finish = (Array.isArray(d.finish) ? d.finish : [flat(d.finish)]).map((f) => f.replace(/^-/, ''))
  return (
    <Sheet label={d.name} onClose={onClose} footer={<SheetCta name={d.name} />}>
      <p className="m-kicker is-gold">Medalla seleccionada · {String(n).padStart(2, '0')} / {String(DETAILS.length).padStart(2, '0')}</p>
      <Gallery
        label={`Fotos de la ${d.name}`}
        slides={[
          <Piece key="medal" img={MEDALS[n - 1].img} pedestal={false} className="is-live is-hero" />,
          <img key="case" className="m-gallery__photo" src={d.detail} alt={`${d.name} en su estuche`} decoding="async" />,
        ]}
      />
      <h3 className="m-sheet__title">{d.name}</h3>
      <span className="m-rule" aria-hidden />
      <dl className="m-facts">
        <div>
          <dt><Svg svg={icoMaterial} className="m-facts__ico is-wide" />Materiales</dt>
          <dd>{d.material}</dd>
        </div>
        <div>
          <dt><Svg svg={icoAcabado} className="m-facts__ico" />Acabado</dt>
          <dd>{finish.map((f) => <span key={f}>{f}</span>)}</dd>
        </div>
        <div>
          <dt><Svg svg={icoDiametro} className="m-facts__ico" />Diámetro</dt>
          <dd>{d.diameter}</dd>
        </div>
        <div className="is-price">
          <dt><Svg svg={icoInversion} className="m-facts__ico" />Inversión</dt>
          <dd aria-label={`S/ ${d.price}, antes ${d.before}`}>
            <strong aria-hidden><small>S/</small> {d.price}</strong>
            <span className="m-facts__before" aria-hidden>
              Antes <s>{d.before}</s>
            </span>
          </dd>
        </div>
      </dl>
    </Sheet>
  )
}
