import type { ReactNode } from 'react'
import { CtaLink, HLine, Txt } from '../components/ui'
import { FinalCta } from '../components/sections'

/** Banner de colección 1920×900 con título grande a la derecha. */
function Universe({
  id, img, title, titleX, titleY, sub, subX, subY, linkX, linkY, href, dark, tight, children,
}: {
  id: string
  img: string
  title: string
  titleX: number
  titleY: number
  sub: string
  subX: number
  subY: number
  linkX: number
  linkY: number
  href: string
  dark?: boolean
  tight?: boolean
  children?: ReactNode
}) {
  const color = dark ? 'var(--navy)' : 'var(--cream)'
  return (
    <section id={id} className="sec" style={{ height: 900 }}>
      <div className="bg" style={{ inset: 0, backgroundImage: `url(${img})` }} />
      {children}
      <Txt
        x={titleX} y={titleY} f="p" w={700} s={tight ? 87 : 100} lh={103} ls={tight ? -10 : 0} c={color} as="h2"
      >
        {title}
      </Txt>
      <Txt x={subX} y={subY} s={22} lh={40} ls={32} c={color}>{sub}</Txt>
      <CtaLink x={linkX} y={linkY} href={href} dark={dark} />
    </section>
  )
}

export function Home() {
  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="sec" style={{ height: 1080 }}>
        <div className="bg" style={{ left: 0, top: 0, width: 1920, height: 1200, backgroundImage: 'url(/img/fondo-azul.webp)' }} />
        <img className="abs" src="/img/hero-piezas.webp" alt="Medalla y trofeo de cristal Goberna" width={943} height={943} style={{ left: 839, top: 137 }} />
        <Txt x={200} y={289} w={500} s={32} lh={39} ls={140} up c="var(--gold)">Colección institucional · 2026</Txt>
        <Txt x={200} y={432} f="p" w={700} s={89} lh={90} ls={-30} c="var(--cream)" as="h1">
          {'Lo que se construye\nmerece permanecer.'}
        </Txt>
        <Txt x={200} y={560} s={22} lh={32} ls={32} c="#f7f3eb" width={746}>
          Piezas de prestigio, excelencia académica y poder destinado a perdurar.
        </Txt>
        <CtaLink x={200} y={747} href="#universos" down lineW={362} />
      </section>

      {/* ── El propósito ─────────────────────────────────────── */}
      <section id="proposito" className="sec" style={{ height: 900, background: 'var(--sand)' }}>
        <div className="bg" style={{ left: 321, top: 0, width: 1599, height: 900, backgroundImage: 'url(/img/proposito.webp)' }} />
        <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--navy)">El propósito</Txt>
        <Txt x={427} y={297} f="p" w={700} s={46} lh={65} up c="var(--navy)" width={1066} as="h2">
          <span className="gold">Goberna reúne piezas para representar </span>
          prestigio, distinción académica y un legado que trasciende el tiempo.
        </Txt>
        <Txt x={428} y={512} s={22} lh={32} ls={32} c="var(--ink)" width={1065}>
          GOBERNA reúne piezas creadas para representar los logros, identidad y conocimiento, convirtiendo los
          momentos significativos en objetos con valor institucional.
        </Txt>
        <HLine x={427} y={636} w={1065} />
        <Txt x={428} y={715} s={16} lh={19} ls={140} up c="var(--navy)">Reconocimiento</Txt>
        <Txt x={695} y={715} s={16} lh={19} ls={140} up c="var(--navy)">Identidad</Txt>
        <Txt x={906} y={715} s={16} lh={19} ls={140} up c="var(--navy)">Conocimiento</Txt>
      </section>

      {/* ── Universos de la colección ────────────────────────── */}
      <div id="universos">
        <Universe
          id="medallas" img="/img/banner-medallas.webp"
          title={'PIEZAS DE\nHONOR'} titleX={1027} titleY={353}
          sub="Medallas, placas y reconocimientos de cristal" subX={1035} subY={497}
          linkX={1035} linkY={590} href="#/medallas"
        >
          <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--sand)">Universos de la colección</Txt>
        </Universe>
      </div>
      <Universe
        id="pines" img="/img/banner-pines.webp"
        title={'SÍMBOLOS DE\nPRESTIGIO'} titleX={1035} titleY={267}
        sub="Pines y piezas de identidad" subX={1035} subY={432}
        linkX={1035} linkY={504} href="#/medallas"
      />
      <Universe
        id="diplomas" img="/img/banner-diploma.webp" dark tight
        title={'PRESENTACIÓN\nDE DISTINCIÓN'} titleX={1057} titleY={363}
        sub="Portadiplomas y elementos ceremoniales" subX={1063} subY={507}
        linkX={1063} linkY={599} href="#/medallas"
      />
      <Universe
        id="libros" img="/img/banner-libros.webp"
        title={'BIBLIOTECA\nDEL PODER'} titleX={1082} titleY={293}
        sub="Libros, packs y ediciones premium" subX={1088} subY={437}
        linkX={1088} linkY={531} href="#/biblioteca"
      />

      {/* ── Materia & oficio ─────────────────────────────────── */}
      <section id="materia" className="sec" style={{ height: 1806, background: 'var(--ivory)' }}>
        <Txt x={200} y={187} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Materia &amp; oficio</Txt>
        <Txt x={689} y={272} f="p" w={700} s={84} lh={85} up c="var(--navy)" as="h2">
          {'El valor también está\nen los detalles.'}
        </Txt>
        <img
          className="abs" src="/img/materia.webp" alt="Detalles de acabados: metal, cristal, cinta y estuche"
          width={1820} height={1208} loading="lazy" decoding="async" style={{ left: 50, top: 548, objectFit: 'cover' }}
        />
      </section>

      <FinalCta />
    </main>
  )
}
