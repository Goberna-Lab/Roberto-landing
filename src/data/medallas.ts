import { asset } from '../asset'

export const SPECS = [
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
export type Detail = {
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
export const DETAILS: Detail[] = [
  { name: 'Medalla del Asesor Presidencial', detail: asset('medalla-detalle.webp'), material: 'Bronce de 1/16', finish: 'Bombeados bañados\nen oro', size: 16, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Arquitecto de Poder Político', detail: asset('ficha-2.webp'), material: 'Bronce de 1/16', finish: ['-Bombeados bañados en níquel', '-Cinta azul y blanco'], size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Maestro de Estrategias Globales', detail: asset('medalla-detalle.webp'), material: 'Bronce de 1/16', finish: ['-Quemadas bombeadas', '-Cinta azul y blanco'], size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Asesor Estratégico en Criminología', detail: asset('ficha-4.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Consultor Político Internacional', detail: asset('ficha-5.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Orador Político', detail: asset('medalla-detalle.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Asesor Especializado en OSINT y SOCMINT', nameSize: 38, detail: asset('ficha-7.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Asesor Estratégico PSYOPS', detail: asset('medalla-detalle.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
  { name: 'Medalla del Analista de Inteligencia', detail: asset('ficha-9.webp'), material: 'Bronce de 1/16', finish: QUEMADAS, size: 15, diameter: '8 CM', price: '180', before: 'S/250' },
]

/*
 * Pantalla 2: 9 medallas en orden de lectura. `dx`: desfase del título
 * respecto al centro de la tarjeta, tal cual el XD. Cada medalla abre su
 * ficha (pantallas 3 y 7 del XD).
 */
export type Piece = { name: string; openName?: string; img: string; dx: number; dashDx?: number }
export const MEDALS: Piece[] = [
  { name: 'Medalla del\nAsesor Presidencial', img: asset('medalla-1.webp'), dx: -17, dashDx: -0.5 },
  { name: 'Medalla del Arquitecto de\nPoder Político', openName: 'Medalla del\nArquitecto de Poder Político', img: asset('medalla-2.webp'), dx: -1 },
  { name: 'Medalla del Maestro\nde Estrategias Globales', img: asset('medalla-3.webp'), dx: -1 },
  { name: 'Medalla del Asesor Estratégico\nen Criminología', img: asset('medalla-4.webp'), dx: -1 },
  { name: 'Medalla del Consultor Político\nInternacional', img: asset('medalla-5.webp'), dx: 0 },
  { name: 'Medalla del\nOrador Político', img: asset('medalla-6.webp'), dx: -1 },
  { name: 'Medalla del Asesor Especializado\nen OSINT y SOCMINT', img: asset('medalla-7.webp'), dx: -1 },
  { name: 'Medalla del Asesor Estratégico\nPSYOPS', img: asset('medalla-8.webp'), dx: -1 },
  { name: 'Medalla del Analista\nde Inteligencia', img: asset('medalla-9.webp'), dx: -1 },
]

/* "Placas de Distinción": pedestal, máscara 427×406 e imagen 534×421 (x absolutas del XD) */
export const PLACAS = [
  { name: 'Placa consultor de inteligencia\ny contra inteligencia avanzada', img: asset('placa-1.webp'), base: 221, mask: 245, x: 188, cx: 459 },
  { name: 'Placa del director\nde seguridad', img: asset('placa-2.webp'), base: 722, mask: 747, x: 690, cx: 960 },
  { name: 'Placa de\ncriminólogo', img: asset('placa-3.webp'), base: 1235, mask: 1260, x: 1203, cx: 1473 },
]

/* "Excelencia en Cristal": los tres reconocimientos, con sus cajas del XD */
export const CRISTALES = [
  { name: 'Reconocimiento de cristal de la Escuela de Inteligencia y Estrategia', img: asset('cristal-inteligencia.webp'), box: [750, 177, 310, 609] },
  { name: 'Reconocimiento de cristal del II Foro de Estado Goberna Lima 2026', img: asset('cristal-foro.webp'), box: [1041, 189, 389, 585] },
  { name: 'Reconocimiento de cristal Goberna', img: asset('cristal-goberna.webp'), box: [1382, 255, 354, 531] },
] as const
