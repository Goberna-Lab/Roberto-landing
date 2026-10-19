import { useState } from 'react'
import { asset } from '../asset'
import { PINS, SPECS } from '../data/pines'
import { Card, Category, CollectionHead, Gallery, SheetCta } from './catalog'
import { Sheet } from './Sheet'
import { CategoryHero, FinalCta, OtherPieces, Piece, Specs, Title } from './ui'
import { flat } from './text'

export function Pines() {
  const [open, setOpen] = useState<number | null>(null)
  const pin = open === null ? null : PINS[open]

  return (
    <>
      <CategoryHero img={asset('banner-pines-cat.webp')} pos="14% 50%" title="Símbolos de prestigio" />

      <Category
        kicker="Categoría - Pines"
        title={<Title before="Representar una identidad también es " gold="pertenecer." />}
        text="Piezas creadas que acompañan la trayectoria y convierten la pertenencia en una expresión visible de identidad institucional, proyectada con sobriedad, carácter y permanencia."
        photo={{ src: asset('fondo-pin.webp'), alt: 'Pin Goberna en estuche', zoom: 840 / 719 }}
        specs={SPECS}
      />

      <section className="m-coll is-pins">
        <div className="m-coll__tex" style={{ backgroundImage: `url(${asset('fondo-textura.webp')})` }} aria-hidden />
        <CollectionHead before="Colección de " gold="pines" />
        <ul className="m-grid m-wrap">
          {PINS.map((p, i) => (
            <Card key={p.name} img={p.img!} name={p.name} delay={(i % 3) * 2.1} onOpen={() => setOpen(i)} />
          ))}
        </ul>
      </section>

      <OtherPieces />
      <FinalCta />

      {pin && open !== null && (
        <Sheet label={flat(pin.name)} onClose={() => setOpen(null)} footer={<SheetCta name={flat(pin.name)} />}>
          <p className="m-kicker is-gold">Pin seleccionado · {String(open + 1).padStart(2, '0')} / {String(PINS.length).padStart(2, '0')}</p>
          <Gallery label="Foto del pin" slides={[<Piece key="p" img={pin.img!} pedestal={false} className="is-live is-hero is-pin" />]} />
          <h3 className="m-sheet__title">{flat(pin.name)}</h3>
          <span className="m-rule" aria-hidden />
          <p className="m-sheet__sub">Especificaciones de la colección</p>
          <Specs specs={SPECS} />
        </Sheet>
      )}
    </>
  )
}
