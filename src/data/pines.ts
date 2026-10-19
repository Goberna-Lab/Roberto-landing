import { asset } from '../asset'

export const SPECS = [
  { n: '01', label: 'Materiales', value: 'Bronce y acabados\nmetálicos.' },
  { n: '02', label: 'Acabado', value: 'Dorado, plateado, envejecido\nY esmaltado.' },
  { n: '03', label: 'Personalización', value: 'Relieve, grabado, color\ninstitucional.' },
  { n: '04', label: 'Presentación', value: 'Estuche individual o caja de\nReconocimiento.' },
]

/*
 * Pantalla CATALOGO – 5. Textos tal cual el XD (en mayúsculas por estilo).
 * `dx`: desfase del título respecto al centro de la tarjeta, tal cual el XD.
 */
export const PINS: { name: string; img?: string; dx?: number }[] = [
  { name: 'Pin del 1 Foro de Estado\nGobernador Lima 2026', img: asset('pin-1.webp'), dx: -17 },
  { name: 'Pin de Escuela de Inteligencia &\nEstrategia', img: asset('pin-2.webp') },
  { name: 'Pin institucional\nde Goberna', img: asset('pin-3.webp'), dx: -1 },
  { name: 'Pin de Director\nde Seguridad', img: asset('pin-4.webp'), dx: -1 },
  { name: 'Pin de\nCriminología', img: asset('pin-5.webp') },
  { name: 'Del Asesor Especializado\nen OSINT y SOCMINT', img: asset('pin-6.webp') },
  { name: 'Pin del\nOrador Político', img: asset('pin-7.webp'), dx: -1 },
  { name: 'Pin del Consultor Político\nInternacional', img: asset('pin-8.webp') },
  { name: 'Pin de\nOSINT & SOCMINT', img: asset('pin-9.webp') },
]
