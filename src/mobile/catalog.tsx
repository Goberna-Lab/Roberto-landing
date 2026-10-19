import { useState } from 'react'
import type { ReactNode } from 'react'
import { mailto } from '../data/contacto'
import { Button, Kicker, Piece, Rule, Specs, Title } from './ui'
import { flat } from './text'
import './catalog.css'

/** Tarjeta de producto: pieza sobre su pedestal, nombre y aviso de ficha. */
export function Card({ img, name, meta, delay, onOpen }: { img: string; name: string; meta?: string; delay?: number; onOpen: () => void }) {
  return (
    <li className="m-card-li" data-reveal>
      <button type="button" className="m-card" onClick={onOpen} aria-haspopup="dialog">
        <Piece img={img} delay={delay} />
        <span className="m-card__name">{flat(name)}</span>
        <span className="m-card__dash" aria-hidden />
        <span className="m-card__meta">
          {meta && <span>{meta}</span>}
          <span className="m-card__open">Ver ficha</span>
        </span>
      </button>
    </li>
  )
}

/** Título centrado de una colección ("Colección de medallas"). */
export function CollectionHead({ before, gold }: { before: string; gold: string }) {
  return (
    <div className="m-wrap m-coll__head">
      <Title before={before} gold={gold} className="is-center" />
      <Rule className="is-center" />
    </div>
  )
}

/**
 * Bloque "Categoría": título editorial, texto, foto en estuche y las cuatro
 * especificaciones de la colección.
 */
export function Category({
  kicker, title, text, photo, specs,
}: {
  kicker: string
  title: ReactNode
  text: string
  /** foto recortada como en el XD: `zoom` = ancho de la imagen / ancho visible */
  photo: { src: string; alt: string; zoom: number }
  specs: { n: string; label: string; value: string }[]
}) {
  return (
    <section className="m-cat m-wrap">
      <Kicker>{kicker}</Kicker>
      {title}
      <p className="m-text" data-reveal>{flat(text)}</p>
      <figure className="m-cat__photo" data-unveil>
        <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" style={{ width: `${photo.zoom * 100}%` }} />
      </figure>
      <p className="m-cat__motto" data-reveal>Trayectoria · Mérito · Distinción</p>
      <Specs specs={specs} />
    </section>
  )
}

/**
 * Galería de la ficha: una o varias fotos con desplazamiento horizontal y
 * puntos que indican la foto visible.
 */
export function Gallery({ slides, label }: { slides: ReactNode[]; label: string }) {
  const [at, setAt] = useState(0)
  if (slides.length === 1) {
    return (
      <div className="m-gallery">
        <div className="m-gallery__slide">{slides[0]}</div>
      </div>
    )
  }
  return (
    <div className="m-gallery">
      <div
        className="m-gallery__track"
        role="group"
        aria-roledescription="galería"
        aria-label={label}
        tabIndex={0}
        onScroll={(e) => setAt(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {slides.map((s, i) => (
          <div key={i} className="m-gallery__slide" aria-label={`Foto ${i + 1} de ${slides.length}`} role="group">
            {s}
          </div>
        ))}
      </div>
      <div className="m-gallery__dots" aria-hidden>
        {slides.map((_, i) => <span key={i} className={i === at ? 'is-on' : ''} />)}
      </div>
    </div>
  )
}

/** Llamada a la acción fija al pie de la ficha: consulta por correo con el nombre de la pieza. */
export function SheetCta({ name }: { name: string }) {
  return <Button href={mailto(`Solicitud de información — ${name}`)}>Solicitar información</Button>
}
