import { asset } from '../asset'

/** "Otras piezas de colección": tarjetas que enlazan a las demás colecciones. */
export const OTHERS = [
  {
    title: 'Símbolos de\nprestigio',
    desc: 'Pines y piezas de identidad',
    href: '#/inicio/pines',
    // máscara 190×186 con radio izquierdo; imagen 330×186 desplazada -62px
    img: { src: asset('mini-pines.webp'), mask: [0, 0, 190, 186], box: [-62, 0, 330, 186] },
  },
  {
    title: 'Presentación de\ndistinción',
    desc: 'Portadiplomas y elementos\nceremoniales',
    href: '#/inicio/diplomas',
    img: { src: asset('mini-diploma.webp'), mask: [0, 0, 192, 186], box: [-1, -4, 194, 194] },
  },
  {
    title: 'Biblioteca del\npoder',
    desc: 'Libros, packs y colecciones premium',
    href: '#/biblioteca',
    img: { src: asset('banner-libros.webp'), mask: [0, 0, 191, 186], box: [-21, -2, 402, 188] },
  },
] as const
