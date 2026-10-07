import logo from '../assets/icons/logo.svg'
import { Txt } from './ui'
import './Header.css'

/* Centros X y anchos de las zonas de clic ("Hor Nav") del XD */
const NAV = [
  { label: 'Reconocer', href: '#/medallas', cx: 754, hit: [664, 180] },
  { label: 'Pertenecer', href: '#/inicio/pines', cx: 946, hit: [852, 188] },
  { label: 'Conocer', href: '#/biblioteca', cx: 1124, hit: [1047, 154] },
  { label: 'Ediciones de colección', href: '#/biblioteca/ediciones', cx: 1377, hit: [1213, 328] },
  { label: 'Contacto', href: '#contacto', cx: 1635, hit: [1554, 162] },
] as const

export function Header({ opacity, active }: { opacity: number; active?: string }) {
  return (
    <header className="header" style={{ ['--bg-op' as string]: opacity }}>
      <div className="header__inner">
        <a href="#/" className="header__logo" aria-label="Goberna — inicio">
          <img src={logo} alt="Goberna" width={186} height={46.76} />
        </a>
        <nav>
          {NAV.map((n) => (
            <a
              key={n.label}
              href={n.href}
              className={`header__link ${active === n.href ? 'is-active' : ''}`}
              style={{ left: n.hit[0], width: n.hit[1] }}
            >
              <Txt x={n.cx - n.hit[0]} y={31} w={500} s={15} lh={19} ls={200} up align="c" as="span">
                {n.label}
              </Txt>
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
