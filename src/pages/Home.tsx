import type { ReactNode } from 'react'
import { TW } from '../components/typewriter'
import { asset } from '../asset'
import circleArrow from '../assets/icons/circle-arrow.svg?raw'
import { CtaLink, Txt } from '../components/ui'
import { FinalCta } from '../components/sections'
import { Proposito } from '../components/Proposito'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './Home.css'

/** Botón circular con flecha (Componente 8 del XD). Hover: relleno dorado, flecha crema. */
function CircleArrow({ x, y, href, label }: { x: number; y: number; href: string; label: string }) {
  return (
    <a href={href} className="circle-arrow" style={{ left: x, top: y }} aria-label={label} dangerouslySetInnerHTML={{ __html: circleArrow }} />
  )
}

/** Banner de colección 1920×900 con título grande a la derecha. */
function Universe({
  id, img, title, titleX, titleY, sub, subX, subY, subW, linkX, linkY, href, dark, tight, cover, still, children,
}: {
  id: string
  img: string
  title: string
  titleX: number
  titleY: number
  sub: string
  subX: number
  subY: number
  /** subtítulo de área (autoHeight en XD): `subY` es el borde superior */
  subW?: number
  linkX: number
  linkY: number
  href: string
  dark?: boolean
  tight?: boolean
  /** todo el banner es clicable (lleva a `href`) */
  cover?: boolean
  /** sin parallax: el fondo queda exacto al XD (sin zoom) */
  still?: boolean
  children?: ReactNode
}) {
  const color = dark ? 'var(--navy)' : 'var(--cream)'
  return (
    <section id={id} className={`sec universe ${cover ? 'has-cover' : ''}`} style={{ height: 900 }}>
      <div className={`bg universe__bg ${still ? '' : 'px-bg'}`} style={{ inset: 0, backgroundImage: `url(${img})` }} />
      {cover && <a href={href} className="universe__cover" aria-label={title.replace('\n', ' ')} />}
      {children}
      <Txt
        x={titleX} y={titleY} f="p" w={700} s={tight ? 87 : 100} lh={103} ls={tight ? -10 : 0} c={color} as="h2" className="tw-title"
      >
        <TW text={title} />
      </Txt>
      <Txt x={subX} y={subY} s={22} lh={40} ls={32} c={color} width={subW}>{sub}</Txt>
      <CtaLink x={linkX} y={linkY} href={href} dark={dark} />
    </section>
  )
}

export function Home() {
  useGSAP(() => {
    const img = document.querySelector<HTMLImageElement>('.hero__img')
    const shine = document.querySelector<HTMLDivElement>('.hero__shine')
    const wrapper = document.querySelector<HTMLDivElement>('.hero__img-wrap')
    if (!img || !shine || !wrapper) return

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Brillo sutil que sigue al mouse
      const handleMouse = (e: MouseEvent) => {
        const rect = wrapper.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1 to 1
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2

        // Brillo se mueve con el mouse
        gsap.to(shine, {
          left: `${x * 30 + 20}%`,
          top: `${y * 20 + 20}%`,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: true,
        })

        // Rotación 3D sutil siguiendo el mouse
        gsap.to(wrapper, {
          rotateY: x * 5,
          rotateX: -y * 5,
          duration: 1,
          ease: 'power2.out',
          overwrite: true,
        })
      }

      wrapper.addEventListener('mousemove', handleMouse)

      // Al salir, vuelve al centro suavemente
      wrapper.addEventListener('mouseleave', () => {
        gsap.to(shine, {
          left: '20%',
          top: '20%',
          duration: 1.5,
          ease: 'power2.out',
        })
        gsap.to(wrapper, {
          rotateY: 0,
          rotateX: 0,
          duration: 1.5,
          ease: 'power2.out',
        })
      })

      // Brillo ambiental muy sutil que se mueve solo lentamente
      gsap.to(shine, {
        left: '45%',
        top: '35%',
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 2,
      })
    })

    return () => mm.revert()
  }, { scope: '.hero' })

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      {/* En pantallas bajas (laptop) el hero toma el alto de la ventana: ver Home.css */}
      <section className="sec hero">
        <div className="bg px-bg" style={{ left: 0, top: 0, width: 1920, height: 1200, backgroundImage: `url(${asset('fondo-azul.webp')})` }} />
        <div className="abs hero__img-wrap">
          <img className="hero__img" src={asset('hero-piezas.webp')} alt="Medalla y trofeo de cristal Goberna" width={943} height={943} />
          <div className="hero__shine" />
        </div>
        <div className="hero__copy">
          <Txt x={200} y={289} w={500} s={32} lh={39} ls={140} up c="var(--gold)">Colección institucional · 2026</Txt>
          <Txt x={200} y={432} f="p" w={700} s={89} lh={90} ls={-30} c="var(--cream)" as="h1">
            {'Lo que se construye\nmerece permanecer.'}
          </Txt>
          <Txt x={200} y={560} s={22} lh={32} ls={32} c="#f7f3eb" width={746}>
            Piezas de prestigio, excelencia académica y poder destinado a perdurar.
          </Txt>
          <CtaLink x={200} y={747} href="#universos" down lineW={362} />
        </div>
      </section>

      {/* ── El propósito (animado al hacer scroll) ──────────── */}
      <Proposito />

      {/* ── Universos de la colección ────────────────────────── */}
      <div id="universos">
        <Universe
          id="medallas" img={asset('banner-medallas.webp')}
          title={'PIEZAS DE\nHONOR'} titleX={1028} titleY={353.2}
          sub="Medallas, placas y reconocimientos de cristal" subX={1028} subY={518.2}
          linkX={1028} linkY={590.2} href="#/medallas" cover still
        />
      </div>
      <Universe
        id="pines" img={asset('banner-pines.webp')} still
        title={'SÍMBOLOS DE\nPRESTIGIO'} titleX={1028} titleY={267.2}
        sub="Pines y piezas de identidad" subX={1028} subY={432.2}
        linkX={1028} linkY={504.2} href="#/pines"
      />
      <Universe
        id="diplomas" img={asset('banner-diploma.webp')} dark tight still
        title={'PRESENTACIÓN\nDE DISTINCIÓN'} titleX={1028} titleY={362.9}
        sub="Portadiplomas y elementos ceremoniales" subX={1028} subY={506.9} subW={638}
        linkX={1028} linkY={598.6} href="#/medallas"
      />
      <Universe
        id="libros" img={asset('banner-biblioteca.webp')} still
        title={'BIBLIOTECA\nDEL PODER'} titleX={1028} titleY={292.8}
        sub="Libros, packs y ediciones premium" subX={1028} subY={436.8} subW={638}
        linkX={1028} linkY={530.5} href="#/biblioteca" cover
      />

      {/* ── Esenciales Goberna ───────────────────────────────── */}
      <section id="esenciales" className="sec esenciales" style={{ height: 1308, background: 'var(--navy)' }}>
        <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--gold)">Colección institucional</Txt>
        <Txt x={200} y={278} f="p" w={700} s={70} lh={103} up c="var(--cream)" as="h2" className="tw-title">
          <TW text="Esenciales goberna" />
        </Txt>
        <Txt x={200} y={331} s={20} lh={40} ls={32} c="var(--cream)">Identidad y distinción en cada detalle.</Txt>

        <article className="esencial">
          <img className="abs" src={asset('esenciales-chaleco.webp')} alt="Chaleco y gorra Goberna" loading="lazy" style={{ left: 200, top: 415, width: 698, height: 793 }} />
          <CircleArrow x={833} y={1130} href="#contacto" label="Consultar prendas Goberna" />
        </article>

        <article className="esencial">
          <img className="abs" src={asset('esenciales-duo.webp')} alt="" loading="lazy" style={{ left: 960, top: 415, width: 760, height: 382 }} />
          <img className="abs" src={asset('esenciales-cafe.webp')} alt="Café exclusivo Goberna" loading="lazy" style={{ left: 1056, top: 512, width: 151, height: 229 }} />
          <img className="abs" src={asset('esenciales-pisco.webp')} alt="Pisco Goberna" loading="lazy" style={{ left: 1175, top: 451, width: 195, height: 290 }} />
          <Txt x={1431} y={559} f="p" s={29} lh={32} ls={20} c="var(--cream)" as="h3">{'Edición Dúo\nEstratégico'}</Txt>
          <Txt x={1432} y={622} s={11} lh={31} ls={32} up c="var(--gold)">Pisco</Txt>
          <span className="esencial__dot" style={{ left: 1489, top: 617, width: 4, height: 4 }} />
          <Txt x={1507} y={621} s={10} lh={28} ls={32} up c="var(--gold)">Café exclusivo</Txt>
          <CircleArrow x={1637} y={706} href="#contacto" label="Consultar Edición Dúo Estratégico" />
        </article>

        <article className="esencial">
          <img className="abs" src={asset('esenciales-ejecutivos.webp')} alt="" loading="lazy" style={{ left: 960, top: 858, width: 760, height: 350 }} />
          <img className="abs" src={asset('sombra.webp')} alt="" loading="lazy" style={{ left: 1174, top: 1125, width: 233, height: 32 }} />
          <img className="abs" src={asset('esenciales-agenda.webp')} alt="Agenda Goberna" loading="lazy" style={{ left: 1185, top: 883, width: 219, height: 266 }} />
          <img className="abs" src={asset('sombra.webp')} alt="" loading="lazy" style={{ left: 1075, top: 1118, width: 164, height: 39 }} />
          <img className="abs" src={asset('esenciales-vaso.webp')} alt="Vaso térmico Goberna" loading="lazy" style={{ left: 1084, top: 977, width: 156, height: 179 }} />
          <Txt x={1431} y={979} f="p" s={29} lh={32} ls={20} c="var(--cream)" as="h3">{'Esenciales\nEjecutivos'}</Txt>
          <Txt x={1432} y={1041} s={10} lh={28} ls={32} up c="var(--gold)">Agenda</Txt>
          <span className="esencial__dot" style={{ left: 1504, top: 1037, width: 3, height: 3 }} />
          <Txt x={1523} y={1041} s={10} lh={28} ls={32} up c="var(--gold)">Vaso térmico</Txt>
          <CircleArrow x={1637} y={1115.7} href="#contacto" label="Consultar Esenciales Ejecutivos" />
        </article>
      </section>

      {/* ── Materia & oficio ─────────────────────────────────── */}
      <section id="materia" className="sec" style={{ height: 1667, background: 'var(--ivory)' }}>
        <Txt x={200} y={117} w={600} s={18} lh={22} ls={140} up c="var(--navy)">Materia &amp; oficio</Txt>
        <Txt x={689} y={191} f="p" w={700} s={84} lh={85} up c="var(--navy)" as="h2" className="tw-title">
          <TW text={'El valor también está\nen los detalles.'} />
        </Txt>
        <img
          className="abs" src={asset('materia.webp')} alt="Detalles de acabados: metal, cristal, cinta y estuche"
          width={1750} height={1162} loading="lazy" decoding="async" style={{ left: 85, top: 420, objectFit: 'cover' }}
        />
        {/* Fotos nuevas del XD sobre la grilla; al pasar el mouse, zoom (estado del XD) */}
        <div className="abs materia__tile" style={{ left: 86, top: 1004, width: 578, height: 578 }}>
          <img src={asset('materia-diplomas.webp')} alt="Diplomas Goberna" loading="lazy" />
        </div>
        <div className="abs materia__tile" style={{ left: 672, top: 1004, width: 578, height: 578 }}>
          <img src={asset('materia-sello.webp')} alt="Sello de lacre Goberna" loading="lazy" />
        </div>
      </section>

      <FinalCta />
    </main>
  )
}
